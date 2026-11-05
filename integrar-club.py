from pathlib import Path
import re
r=Path(__file__).resolve().parent
p=r/'index.html'
s=p.read_text(encoding='utf8')
assert 'id="club-app"' not in s
s=s.replace('<a href="#cierre">Cierre</a>','<a href="#club-app">App</a><a href="#cierre">Cierre</a>')
s=s.replace('<section id="cierre">',(r/'club-focus.html').read_text(encoding='utf8')+'<section id="cierre">')
p.write_text(s,encoding='utf8')
scripts=re.findall(r'<script>(.*?)</script>',(r/'club-focus.html').read_text(encoding='utf8'),re.S)
(r/'club-check.js').write_text(scripts[0],encoding='utf8')
print('Sección Club Focus incorporada.')
