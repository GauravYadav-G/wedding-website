import { createDesktopCeremony, type FrameController } from "./desktop-ceremony";
/** Native 24 fps motion, downloaded in twenty batches; 4K detail only while still. */
export function createCeremonyFrames(canvas: HTMLCanvasElement, variant: "desktop" | "mobile", onPaint: (frame: number) => void, forceImages = false): FrameController {
  if (variant === "desktop" && !forceImages && typeof VideoDecoder !== "undefined") return createDesktopCeremony(canvas, onPaint, () => createCeremonyFrames(canvas, variant, onPaint, true));
  const context = canvas.getContext("2d", { alpha: false });
  const mobile = variant === "mobile";
  const width = mobile ? 540 : 1920, height = mobile ? 960 : 1080;
  const cacheLimit = mobile ? 16 : 8;
  const decoded = new Map<number, ImageBitmap>();
  const compressed = new Map<number, Blob>();
  const chunks = new Set<number>(), failed = new Set<number>(), decoding = new Set<number>();
  const downloading = new Map<number, AbortController>();
  let requested = 0, painted = -1, direction = 1, active = true, disposed = false;
  let lastMove = performance.now();
  let detailTimer: ReturnType<typeof setTimeout> | undefined;
  let detailController: AbortController | undefined;
  canvas.width = width; canvas.height = height;
  canvas.dataset.variant = variant; canvas.dataset.ready = "false"; canvas.dataset.quality = "motion";
  if (context) {
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
  }

  const cancelDetail = () => { clearTimeout(detailTimer); detailController?.abort(); detailController = undefined; };
  const paint = () => {
    if (!context || !active || disposed || !decoded.size) return;
    const nearest = [...decoded.keys()].sort((a, b) => Math.abs(a - requested) - Math.abs(b - requested))[0];
    // Show available progress instead of freezing until an exact network response arrives.
    if (nearest === painted || (painted >= 0 && Math.abs(nearest - requested) >= Math.abs(painted - requested))) return;
    if (canvas.width !== width) { canvas.width = width; canvas.height = height; }
    context.drawImage(decoded.get(nearest)!, 0, 0, width, height);
    painted = nearest;
    canvas.dataset.frame = String(painted); canvas.dataset.ready = "true"; canvas.dataset.quality = "motion";
    onPaint(painted);
    if (painted === requested) {
      clearTimeout(detailTimer);
      detailTimer = setTimeout(() => void showDetail(), Math.max(100, 300 - (performance.now() - lastMove)));
    }
  };
  const showDetail = async () => {
    if (!active || disposed || !context || painted !== requested) return;
    const ratio = width / height;
    const cssWidth = mobile ? Math.min(innerWidth, innerHeight * ratio) : Math.max(innerWidth, innerHeight * ratio);
    const detailWidth = Math.min(mobile ? 2160 : 3840, Math.ceil(cssWidth * Math.min(devicePixelRatio || 1, 3)));
    if (mobile && detailWidth <= width) return;
    const index = requested, controller = new AbortController();
    detailController = controller;
    try {
      const response = await fetch(`/video/ceremony-v2/${variant}/detail/${String(index).padStart(3, "0")}.webp`, { signal: controller.signal, cache: "force-cache" });
      if (!response.ok) return;
      const blob = await response.blob();
      if (controller.signal.aborted || disposed) return;
      const bitmap = await createImageBitmap(blob, { resizeWidth: detailWidth, resizeHeight: Math.round(detailWidth / ratio) });
      if (!controller.signal.aborted && !disposed && active && requested === index) {
        canvas.width = bitmap.width; canvas.height = bitmap.height;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0);
        canvas.dataset.quality = "4k-still";
        painted = index;
        canvas.dataset.frame = String(index);
        canvas.dataset.ready = "true";
        onPaint(index);
      }
      bitmap.close();
    } catch { /* Keep the motion frame when a detail request is interrupted. */ }
  };
  const decode = () => {
    if (!active || disposed) return;
    const wanted = [requested];
    for (let d = 1; d <= 6; d++) wanted.push(requested + d * direction, requested - d * direction);
    // Also decode the nearest downloaded frame when jumping into an unloaded batch.
    const available = [...compressed.keys()].sort((a, b) => Math.abs(a - requested) - Math.abs(b - requested));
    for (const index of [...new Set([...wanted.filter(index => compressed.has(index)), ...available.slice(0, 2)])].slice(0, cacheLimit)) {
      if (decoding.size >= 2) break;
      const blob = compressed.get(index);
      if (!blob || decoded.has(index) || decoding.has(index)) continue;
      decoding.add(index);
      void createImageBitmap(blob).then(bitmap => {
        if (disposed) { bitmap.close(); return; }
        decoded.set(index, bitmap);
        if (decoded.size > cacheLimit) {
          const farthest = [...decoded.keys()].sort((a, b) => Math.abs(b - requested) - Math.abs(a - requested))[0];
          decoded.get(farthest)?.close(); decoded.delete(farthest);
        }
        paint();
      }).catch(() => compressed.delete(index)).finally(() => { decoding.delete(index); decode(); });
    }
  };
  const download = () => {
    if (!active || disposed) return;
    const current = Math.floor(requested / 12);
    const order = [current, current + direction, current - direction, ...Array.from({ length: 20 }, (_, i) => i)];
    for (const chunk of order) {
      if (downloading.size >= 2) break;
      if (chunk < 0 || chunk > 19 || chunks.has(chunk) || failed.has(chunk) || downloading.has(chunk)) continue;
      const controller = new AbortController(); downloading.set(chunk, controller);
      void (async () => {
        try {
          const response = await fetch(`/video/ceremony-v2/${variant}/motion/${String(chunk).padStart(2, "0")}.bin`, { signal: controller.signal, cache: "force-cache" });
          if (!response.ok) throw new Error("Frame batch unavailable");
          const buffer = await response.arrayBuffer();
          if (disposed || controller.signal.aborted) return;
          const header = new DataView(buffer);
          if (header.getUint32(0, true) !== 12) throw new Error("Invalid frame batch");
          for (let i = 0; i < 12; i++) compressed.set(chunk * 12 + i, new Blob([buffer.slice(header.getUint32(4 + i * 4, true), header.getUint32(8 + i * 4, true))], { type: mobile ? "image/webp" : "image/avif" }));
          chunks.add(chunk); decode();
        } catch { if (!controller.signal.aborted) failed.add(chunk); }
        finally { downloading.delete(chunk); download(); }
      })();
    }
  };
  return {
    draw(index: number) {
      const next = Math.max(0, Math.min(239, Math.round(index)));
      if (next !== requested) {
        direction = next > requested ? 1 : -1;
        requested = next; lastMove = performance.now(); cancelDetail();
        detailTimer = setTimeout(() => void showDetail(), 150);
      }
      paint(); decode(); download();
    },
    setActive(value: boolean) {
      active = value;
      if (active) { paint(); decode(); download(); }
      else { cancelDetail(); downloading.forEach(controller => controller.abort()); }
    },
    dispose() {
      disposed = true; cancelDetail(); downloading.forEach(controller => controller.abort());
      decoded.forEach(bitmap => bitmap.close()); decoded.clear(); compressed.clear();
    },
  };
}
