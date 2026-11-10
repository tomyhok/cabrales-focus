import os
import re
import base64
import mimetypes

def file_to_base64(filepath):
    mime_type, _ = mimetypes.guess_type(filepath)
    if not mime_type:
        if filepath.endswith('.png'):
            mime_type = 'image/png'
        elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
            mime_type = 'image/jpeg'
        elif filepath.endswith('.webp'):
            mime_type = 'image/webp'
        elif filepath.endswith('.svg'):
            mime_type = 'image/svg+xml'
        else:
            mime_type = 'application/octet-stream'
    
    with open(filepath, 'rb') as f:
        encoded = base64.b64encode(f.read()).decode('utf-8')
    return f"data:{mime_type};base64,{encoded}"

print("Reading files...")
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Collect all images in index.html and app.js
img_patterns = [
    r'src=["\'](assets/[^"\']+\.(?:png|jpg|jpeg|webp|svg))["\']',
    r'poster=["\'](assets/[^"\']+\.(?:png|jpg|jpeg|webp|svg))["\']'
]

images_to_encode = set()
for pattern in img_patterns:
    for match in re.findall(pattern, html_content):
        images_to_encode.add(match)

# Also stories & app screens from app.js
story_imgs = [
    "assets/instagram_suga_stories/story_1_final.png",
    "assets/instagram_suga_stories/story_2_final.png",
    "assets/instagram_suga_stories/story_3_final.png",
    "assets/instagram_suga_stories/story_4_final.png"
]
app_screen_imgs = [
    "assets/app_club_focus/app_homepage.jpg",
    "assets/app_club_focus/app_qr_page.jpg",
    "assets/app_club_focus/app_shop_page.jpg"
]
images_to_encode.update(story_imgs)
images_to_encode.update(app_screen_imgs)

print(f"Total images to encode to base64: {len(images_to_encode)}")

b64_map = {}
for img_path in sorted(images_to_encode):
    if os.path.exists(img_path):
        b64 = file_to_base64(img_path)
        b64_map[img_path] = b64
        print(f"  Encoded {img_path} ({len(b64):,} chars)")
    else:
        print(f"  WARNING: File not found: {img_path}")

# In index.html, replace image sources
single_html = html_content

for img_path, b64 in b64_map.items():
    # Replace in src="..." and poster="..."
    # We do exact string replacement of the path
    single_html = single_html.replace(f'src="{img_path}"', f'src="{b64}"')
    single_html = single_html.replace(f"src='{img_path}'", f"src='{b64}'")
    single_html = single_html.replace(f'poster="{img_path}"', f'poster="{b64}"')
    single_html = single_html.replace(f"poster='{img_path}'", f"poster='{b64}'")

# Replace video sources in Slide 3 to add fallbacks
slide3_video_old = '<source src="assets/cortometraje_yt/Cortometraje final - Cabrales Focus.mp4" type="video/mp4" />'
slide3_video_new = '''<source src="assets/cortometraje_yt/Cortometraje final - Cabrales Focus.mp4" type="video/mp4" />
              <source src="assets/Cortometraje final - Cabrales Focus.mp4" type="video/mp4" />
              <source src="Cortometraje final - Cabrales Focus.mp4" type="video/mp4" />
              <source src="file:///C:/Users/hok/Documents/UADE/2.%20Taller%20de%20Narrativas%20Digitales/TPO/TP%20-%20Entrega%20Final/Mock-ups/Cortometraje%20final%20-%20Cabrales%20Focus.mp4" type="video/mp4" />'''

if slide3_video_old in single_html:
    single_html = single_html.replace(slide3_video_old, slide3_video_new)
    print("Slide 3 video sources enhanced with fallback paths.")

# Replace storiesList & appScreensList in app.js
js_updated = js_content
for img_path in story_imgs + app_screen_imgs:
    if img_path in b64_map:
        js_updated = js_updated.replace(f'"{img_path}"', f'"{b64_map[img_path]}"')

print("Updated app.js storiesList and appScreensList with base64 URIs.")

# Inline CSS
css_tag = f"<style>\n/* ==========================================================================\n   CABRALES FOCUS · ESTILOS OFICIALES INLINE PARA SINGLE-FILE HTML\n   ========================================================================== */\n{css_content}\n</style>"
single_html = single_html.replace('<link rel="stylesheet" href="styles.css" />', css_tag)

# Inline JS
js_tag = f"<script>\n/* ==========================================================================\n   CABRALES FOCUS · MOTOR DE PRESENTACIÓN & INTERACTIVIDAD INLINE\n   ========================================================================== */\n{js_updated}\n</script>"
single_html = single_html.replace('<script src="app.js"></script>', js_tag)

# Write output file safely
out_path = 'Cabrales_Focus_Presentacion_UnicoArchivo.html'
tmp_path = 'Cabrales_Focus_Presentacion_UnicoArchivo.html.tmp'
with open(tmp_path, 'w', encoding='utf-8') as f:
    f.write(single_html)

os.replace(tmp_path, out_path)

out_size = os.path.getsize(out_path)
print(f"Successfully generated {out_path} ({out_size:,} bytes, {out_size/1024/1024:.2f} MB)")
