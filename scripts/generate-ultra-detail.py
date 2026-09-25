import subprocess, os, time
from concurrent.futures import ThreadPoolExecutor

os.makedirs('public/video/ceremony-v2/desktop/detail', exist_ok=True)

# 4 chunks of 60 frames each
ranges = [(0, 60), (60, 60), (120, 60), (180, 60)]

vf = 'libplacebo=w=3840:h=2160:upscaler=ewa_lanczos:custom_shader_path=scripts/FSR_sharp.glsl'

def run_chunk(start_frame, num_frames):
    ss = start_frame / 24.0
    cmd = [
        'ffmpeg', '-y', '-v', 'error',
        '-ss', f'{ss:.4f}',
        '-i', 'public/video/a1.mp4',
        '-vf', vf,
        '-frames:v', str(num_frames),
        '-c:v', 'libwebp',
        '-quality', '95',
        '-compression_level', '2',
        '-start_number', str(start_frame),
        f'public/video/ceremony-v2/desktop/detail/%03d.webp'
    ]
    t0 = time.time()
    subprocess.run(cmd, check=True)
    print(f'Chunk {start_frame}-{start_frame+num_frames-1} finished in {time.time()-t0:.1f}s')

t_start = time.time()
with ThreadPoolExecutor(max_workers=2) as ex:
    list(ex.map(lambda r: run_chunk(r[0], r[1]), ranges))

print(f'All 240 ultra-sharp 4K detail frames generated in {time.time()-t_start:.1f}s')

# Generate ultra-sharp poster (frame 0) and ending (frame 239)
subprocess.run([
    'ffmpeg', '-y', '-v', 'error',
    '-ss', '0', '-i', 'public/video/a1.mp4',
    '-vf', vf,
    '-vframes', '1',
    '-c:v', 'libwebp', '-quality', '96',
    'public/video/ceremony-v2/desktop/poster.webp'
], check=True)

subprocess.run([
    'ffmpeg', '-y', '-v', 'error',
    '-ss', f'{239/24:.4f}', '-i', 'public/video/a1.mp4',
    '-vf', vf,
    '-vframes', '1',
    '-c:v', 'libwebp', '-quality', '96',
    'public/video/ceremony-v2/desktop/ending.webp'
], check=True)
print('Poster and ending generated successfully')
