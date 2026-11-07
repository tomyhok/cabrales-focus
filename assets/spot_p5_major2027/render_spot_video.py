import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import imageio

BASE_DIR = r"c:\Projects\Cabrales Focus\assets\spot_p5_major2027"
OUTPUT_VIDEO = os.path.join(BASE_DIR, "spot_cabrales_focus_major_2027.mp4")

WIDTH = 1080
HEIGHT = 1920
FPS = 30
TOTAL_DURATION = 20.0  # 20 seconds
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)  # 600 frames

# Tiempos de las 5 escenas (según message.txt):
# E1: 0 a 4s (frames 0 a 120)
# E2: 4 a 8s (frames 120 a 240)
# E3: 8 a 12s (frames 240 a 360)
# E4: 12 a 17s (frames 360 a 510)
# E5: 17 a 20s (frames 510 a 600)
SCENE_TIMINGS = [
    (0, 120),    # Escena 1 (4s)
    (120, 240),  # Escena 2 (4s)
    (240, 360),  # Escena 3 (4s)
    (360, 510),  # Escena 4 (5s)
    (510, 600),  # Escena 5 (3s)
]

SCENE_NAMES = [
    "scene_1_producto_experiencia.png",
    "scene_2_escaneo_qr.png",
    "scene_3_acumula_puntos.png",
    "scene_4_canje_participaciones.png",
    "scene_5_cierre_marca.png"
]

print("Cargando imágenes de alta resolución...")
scene_images = []
for name in SCENE_NAMES:
    p = os.path.join(BASE_DIR, name)
    img = Image.open(p).convert("RGBA")
    if img.size != (WIDTH, HEIGHT):
        img = img.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    scene_images.append(img)

def get_cinematic_zoom(img, zoom):
    """Aplica zoom suave recortando desde el centro."""
    if zoom <= 1.0:
        return img
    new_w = int(WIDTH / zoom)
    new_h = int(HEIGHT / zoom)
    x1 = (WIDTH - new_w) // 2
    y1 = (HEIGHT - new_h) // 2
    cropped = img.crop((x1, y1, x1 + new_w, y1 + new_h))
    return cropped.resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)

def render_scene_1_frame(base_img, local_t):
    """Escena 1: Travelling suave de aproximación (1.00x a 1.05x) y glow sutil."""
    zoom = 1.0 + 0.05 * local_t
    return get_cinematic_zoom(base_img, zoom)

def render_scene_2_frame(base_img, local_t):
    """Escena 2: Acercamiento suave y rayo láser de escaneo animado sobre el QR."""
    zoom = 1.0 + 0.03 * local_t
    zoomed = get_cinematic_zoom(base_img, zoom)
    
    # Overlay del rayo láser animado que recorre el QR
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # El QR está en el sector de la lata y el visor del smartphone (aprox y: 520 a 760)
    sweep_progress = (local_t * 2.5) % 1.0
    laser_y = int(520 + 240 * sweep_progress)
    
    # Haz de luz horizontal
    draw.line([(180, laser_y), (480, laser_y)], fill=(4, 189, 251, 230), width=3)
    draw.line([(190, laser_y), (470, laser_y)], fill=(255, 255, 255, 255), width=1)
    
    # Resplandor difuso del escaneo
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.rectangle([180, laser_y - 6, 480, laser_y + 6], fill=(4, 189, 251, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(4))
    
    combined = Image.alpha_composite(zoomed, glow)
    combined = Image.alpha_composite(combined, overlay)
    return combined

# Generar posiciones fijas para partículas de la Escena 3
np.random.seed(42)
PARTICLES_N = 35
p_xs = np.random.uniform(220, 860, PARTICLES_N)
p_ys = np.random.uniform(400, 1200, PARTICLES_N)
p_speeds = np.random.uniform(80, 220, PARTICLES_N)
p_sizes = np.random.uniform(4, 12, PARTICLES_N)

def render_scene_3_frame(base_img, local_t):
    """Escena 3: Partículas luminosas ascendiendo hacia la tarjeta de puntos."""
    zoom = 1.0 + 0.02 * math.sin(local_t * math.pi)
    zoomed = get_cinematic_zoom(base_img, zoom)
    
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    for i in range(PARTICLES_N):
        curr_y = (p_ys[i] - p_speeds[i] * (local_t * 4.0)) % 800 + 400
        curr_x = p_xs[i] + 15 * math.sin(local_t * 6 + i)
        sz = p_sizes[i]
        
        # Color cian luminoso y blanco
        alpha = int(180 + 75 * math.sin(local_t * 8 + i))
        draw.ellipse([curr_x - sz, curr_y - sz, curr_x + sz, curr_y + sz], fill=(4, 189, 251, alpha))
        draw.ellipse([curr_x - sz*0.4, curr_y - sz*0.4, curr_x + sz*0.4, curr_y + sz*0.4], fill=(255, 255, 255, 255))
        
    overlay = overlay.filter(ImageFilter.GaussianBlur(1.5))
    return Image.alpha_composite(zoomed, overlay)

def render_scene_4_frame(base_img, local_t):
    """Escena 4: Luces de estadio y reflejo iridiscente en el bono de sorteo."""
    zoom = 1.0 + 0.04 * local_t
    zoomed = get_cinematic_zoom(base_img, zoom)
    
    # Destello de reflector oscilante sutil
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    spotlight_x = int(540 + 120 * math.sin(local_t * math.pi * 1.5))
    draw.ellipse([spotlight_x - 180, 260, spotlight_x + 180, 580], fill=(4, 189, 251, int(25 + 15 * math.sin(local_t * 4))))
    overlay = overlay.filter(ImageFilter.GaussianBlur(40))
    
    return Image.alpha_composite(zoomed, overlay)

def render_scene_5_frame(base_img, local_t):
    """Escena 5: Packshot heroico final con pulsación de halo y revelación limpia."""
    zoom = 1.0 + 0.03 * local_t
    zoomed = get_cinematic_zoom(base_img, zoom)
    
    # Resplandor dorado/cian sutil sobre la lata
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    pulse_alpha = int(35 + 20 * math.sin(local_t * math.pi * 2))
    draw.ellipse([340, 480, 740, 1020], fill=(4, 189, 251, pulse_alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(50))
    
    return Image.alpha_composite(zoomed, overlay)

RENDER_FUNCS = [
    render_scene_1_frame,
    render_scene_2_frame,
    render_scene_3_frame,
    render_scene_4_frame,
    render_scene_5_frame
]

print(f"Iniciando renderizado de video MP4 ({WIDTH}x{HEIGHT} a {FPS} fps, {TOTAL_FRAMES} frames)...")

# Configuración del escritor de video con imageio-ffmpeg
writer = imageio.get_writer(
    OUTPUT_VIDEO,
    fps=FPS,
    codec="libx264",
    pixelformat="yuv420p",
    ffmpeg_params=["-crf", "18", "-preset", "fast"]
)

DISSOLVE_FRAMES = 12

for f in range(TOTAL_FRAMES):
    # Determinar qué escena está activa
    curr_scene = 0
    for idx, (s_start, s_end) in enumerate(SCENE_TIMINGS):
        if s_start <= f < s_end:
            curr_scene = idx
            break
            
    s_start, s_end = SCENE_TIMINGS[curr_scene]
    local_t = (f - s_start) / float(s_end - s_start)
    
    frame_img = RENDER_FUNCS[curr_scene](scene_images[curr_scene], local_t)
    
    # Transición de disolvencia cruzada (Cross-Dissolve) al final de la escena
    frames_from_end = s_end - f
    if frames_from_end <= DISSOLVE_FRAMES and curr_scene < 4:
        next_scene = curr_scene + 1
        next_start, next_end = SCENE_TIMINGS[next_scene]
        next_local_t = 0.0
        next_img = RENDER_FUNCS[next_scene](scene_images[next_scene], next_local_t)
        
        blend_alpha = 1.0 - (frames_from_end / float(DISSOLVE_FRAMES))
        frame_img = Image.blend(frame_img.convert("RGB"), next_img.convert("RGB"), blend_alpha)
    else:
        frame_img = frame_img.convert("RGB")
        
    writer.append_data(np.array(frame_img))
    
    if (f + 1) % 60 == 0 or f == TOTAL_FRAMES - 1:
        sec = (f + 1) / FPS
        print(f"Progreso: Frame {f+1}/{TOTAL_FRAMES} ({sec:.1f}s / {TOTAL_DURATION}s) — Escena {curr_scene + 1}")

writer.close()
print("Renderizado de video completado exitosamente.")
size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
print(f"Archivo generado: {OUTPUT_VIDEO} ({size_mb:.2f} MB)")
