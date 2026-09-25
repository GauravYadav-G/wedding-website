export type FrameController = { draw(index: number): void; setActive(value: boolean): void; dispose(): void };

/** Decode independently seekable 12-frame groups directly into canvas-ready frames, with 4K still detail when paused. */
export function createDesktopCeremony(canvas: HTMLCanvasElement, onPaint: (frame: number) => void, imageFallback: () => FrameController): FrameController {
  const context = canvas.getContext("2d", { alpha: false });
  const frames = new Map<number, VideoFrame>(), packets = new Map<number, ArrayBuffer>();
  const downloads = new Map<number, AbortController>();
  const detailCache = new Map<number, ImageBitmap>();
  let requested = 0, painted = -1, direction = 1, active = true, disposed = false, busy = false, ready = false;
  let fallback: FrameController | undefined;
  let decoder: VideoDecoder | undefined;
  let detailTimer: ReturnType<typeof setTimeout> | undefined;
  let detailController: AbortController | undefined;

  const renderWidth = 2560, renderHeight = 1440;
  canvas.width = renderWidth; canvas.height = renderHeight;
  canvas.dataset.variant = "desktop"; canvas.dataset.quality = "1440p-motion"; canvas.dataset.ready = "false";
  if (context) {
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
  }

  const cancelDetail = () => {
    clearTimeout(detailTimer);
    detailController?.abort();
    detailController = undefined;
  };

  const showDetail = async () => {
    if (!active || disposed || !context) return;
    const index = requested;
    if (detailCache.has(index)) {
      const bitmap = detailCache.get(index)!;
      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth; canvas.height = renderHeight;
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, 0, 0, renderWidth, renderHeight);
      painted = index;
      canvas.dataset.frame = String(index);
      canvas.dataset.quality = "4k-still";
      canvas.dataset.ready = "true";
      onPaint(index);
      return;
    }
    const controller = new AbortController();
    detailController = controller;
    try {
      const response = await fetch(`/video/ceremony-v2/desktop/detail/${String(index).padStart(3, "0")}.webp`, {
        signal: controller.signal,
        cache: "force-cache"
      });
      if (!response.ok) return;
      const blob = await response.blob();
      if (controller.signal.aborted || disposed) return;
      const bitmap = await createImageBitmap(blob);
      if (controller.signal.aborted || disposed) { bitmap.close(); return; }
      detailCache.set(index, bitmap);
      if (detailCache.size > 16) {
        const oldest = detailCache.keys().next().value;
        if (oldest !== undefined) {
          detailCache.get(oldest)?.close();
          detailCache.delete(oldest);
        }
      }
      if (active && !disposed && requested === index) {
        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
          canvas.width = renderWidth; canvas.height = renderHeight;
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0, renderWidth, renderHeight);
        painted = index;
        canvas.dataset.frame = String(index);
        canvas.dataset.quality = "4k-still";
        canvas.dataset.ready = "true";
        onPaint(index);
      }
    } catch { /* Retain motion frame if interrupted */ }
  };

  const fail = () => {
    if (disposed || fallback) return;
    ready = false;
    cancelDetail();
    downloads.forEach(c => c.abort());
    if (decoder?.state !== "closed") decoder?.close();
    frames.forEach(frame => frame.close()); frames.clear();
    detailCache.forEach(b => b.close()); detailCache.clear();
    fallback = imageFallback(); fallback.setActive(active); fallback.draw(requested);
  };

  const paint = () => {
    if (!active || disposed || !context || !frames.size) return;
    if (canvas.dataset.quality === "4k-still" && canvas.dataset.frame === String(requested)) return;
    const index = [...frames.keys()].sort((a,b)=>Math.abs(a-requested)-Math.abs(b-requested))[0];
    if (index === painted || (painted >= 0 && Math.abs(index-requested) >= Math.abs(painted-requested))) return;
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth; canvas.height = renderHeight;
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(frames.get(index)!, 0, 0, renderWidth, renderHeight);
    painted = index;
    canvas.dataset.frame = String(index);
    canvas.dataset.ready = "true";
    canvas.dataset.quality = "1440p-motion";
    onPaint(index);
    clearTimeout(detailTimer);
    detailTimer = setTimeout(() => void showDetail(), 50);
  };

  const decode = () => {
    if (!active || disposed || !ready || busy || !decoder || fallback) return;
    const current = Math.floor(requested / 12), next = Math.max(0,Math.min(19,current+direction));
    const chunk = [current,next].find(c=>packets.has(c)&&Array.from({length:12},(_,i)=>c*12+i).some(i=>!frames.has(i)));
    if (chunk === undefined) return;
    busy = true;
    const data = packets.get(chunk)!, view = new DataView(data);
    try {
      for(let i=0;i<12;i++) decoder.decode(new EncodedVideoChunk({ type:i===0?"key":"delta",timestamp:Math.round((chunk*12+i)*1e6/24),data:new Uint8Array(data,view.getUint32(4+i*4,true),view.getUint32(8+i*4,true)-view.getUint32(4+i*4,true)) }));
      void decoder.flush().then(()=>{busy=false;decode();}).catch(fail);
    } catch { fail(); }
  };

  const download = () => {
    if (!active || disposed || !ready || fallback) return;
    const current = Math.floor(requested/12);
    for(const chunk of [current,current+direction,current-direction,...Array.from({length:20},(_,i)=>i)]) {
      if(downloads.size>=2) break;
      if(chunk<0||chunk>19||packets.has(chunk)||downloads.has(chunk))continue;
      const controller=new AbortController();downloads.set(chunk,controller);
      void fetch(`/video/ceremony-v2/desktop/avc/${String(chunk).padStart(2,"0")}.bin`,{signal:controller.signal,cache:"force-cache"}).then(r=>{if(!r.ok)throw Error("Frame batch unavailable");return r.arrayBuffer();}).then(data=>{if(disposed||fallback)return;packets.set(chunk,data);decode();}).catch(()=>{if(!controller.signal.aborted)fail();}).finally(()=>{downloads.delete(chunk);download();});
    }
  };

  const config: VideoDecoderConfig = { codec:"avc1.640033",codedWidth:2560,codedHeight:1440,optimizeForLatency:true };
  void VideoDecoder.isConfigSupported(config).then(support=>{
    if(disposed)return;if(!support.supported){fail();return;}
    decoder=new VideoDecoder({error:fail,output:frame=>{
      if(disposed||fallback){frame.close();return;}
      const index=Math.round(frame.timestamp*24/1e6);frames.get(index)?.close();frames.set(index,frame);
      const current=Math.floor(requested/12),next=Math.max(0,Math.min(19,current+direction));
      while(frames.size>24){const score=(i:number)=>(Math.floor(i/12)===current||Math.floor(i/12)===next?0:1000)+Math.abs(i-requested);const oldest=[...frames.keys()].sort((a,b)=>score(b)-score(a))[0];frames.get(oldest)?.close();frames.delete(oldest);}
      paint();
    }});
    decoder.configure(config);ready=true;download();
    // Immediately preload and paint 4K detail for the initial frame
    void showDetail();
  }).catch(fail);

  return {
    draw(index){
      const next=Math.max(0,Math.min(239,Math.round(index)));
      if(next!==requested) {
        direction=next>requested?1:-1;
        requested=next;
        clearTimeout(detailTimer);
        detailTimer = setTimeout(() => void showDetail(), 60);
      }
      if(fallback){fallback.draw(next);return;}
      paint();decode();download();
    },
    setActive(value){
      active=value;
      if(fallback){fallback.setActive(value);return;}
      if(active){
        paint();decode();download();
        if(painted===requested) {
          clearTimeout(detailTimer);
          detailTimer = setTimeout(() => void showDetail(), 50);
        }
      } else {
        cancelDetail();
        downloads.forEach(c=>c.abort());
      }
    },
    dispose(){
      disposed=true;
      fallback?.dispose();
      cancelDetail();
      downloads.forEach(c=>c.abort());
      if(decoder?.state!=="closed")decoder?.close();
      frames.forEach(f=>f.close());frames.clear();
      detailCache.forEach(b=>b.close());detailCache.clear();
      packets.clear();
    },
  };
}
