"""Regenera el HTML portátil y el ZIP después de actualizar contenido o medios."""
from pathlib import Path
import base64, re, zipfile
ROOT=Path(__file__).resolve().parent
page=(ROOT/'index.html').read_text(encoding='utf8')
page=page.replace('<link rel="stylesheet" href="styles.css">','<style>'+(ROOT/'styles.css').read_text(encoding='utf8')+'</style>')
page=page.replace('<link rel="stylesheet" href="motion.css">','<style>'+(ROOT/'motion.css').read_text(encoding='utf8')+'</style>')
for file in ['media-manifest.js','app.js','motion.js']:
    page=page.replace(f'<script src="{file}"></script>','<script>'+(ROOT/file).read_text(encoding='utf8').replace('</script','<\\/script')+'</script>')
def embed(match):
    path=ROOT/match.group(1)
    ext=path.suffix.lower();mime='image/jpeg' if ext in ['.jpg','.jpeg'] else 'image/png'
    return 'src="data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()+'"'
page=re.sub(r'src="(assets/[^"<>]+)"',embed,page)
(ROOT/'Cabrales_Focus_Presentacion_UnicoArchivo.html').write_text(page,encoding='utf8')
with zipfile.ZipFile(ROOT/'Cabrales_Focus_Web_Deploy.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in ['index.html','styles.css','app.js','motion.css','motion.js','media-manifest.js','PRESENTACION.md','actualizar-portatil.py','Cabrales_Focus_Presentacion_UnicoArchivo.html']:
        z.write(ROOT/name,name)
    used=set(re.findall(r'src="(assets/[^"<>]+)"',(ROOT/'index.html').read_text(encoding='utf8')))
    for name in sorted(used):z.write(ROOT/name,name)
    for f in (ROOT/'media').rglob('*'):
        if f.is_file():z.write(f,f.relative_to(ROOT))
print('HTML portátil y ZIP actualizados.')
