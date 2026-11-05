from pathlib import Path
import base64, html, re
r=Path(__file__).resolve().parent
out=r/'media'/'P2';out.mkdir(parents=True,exist_ok=True)
can='data:image/png;base64,'+base64.b64encode((r/'assets/can_front.png').read_bytes()).decode()
def text(x,y,lines,size=48,color='#f5f3ee',weight=400):
    return ''.join(f'<text x="{x}" y="{y+i*size*1.3}" fill="{color}" font-size="{size}" font-weight="{weight}">{html.escape(line)}</text>' for i,line in enumerate(lines))
slides=[
('CONOCÉ CABRALES FOCUS',['Tu café.','En otro','formato.'],['Cold brew listo para tomar.','240 ml para acompañar tu rutina.'],'hero'),
('01 / EL CAFÉ',['Empieza con','un buen café.'],['Café 100 % arábica de Brasil.','Una base inspirada en la variedad','Brasil que ya trabaja Cabrales.'],'coffee'),
('02 / COLD BREW',['El tiempo','también importa.'],['El café se extrae en agua fría.','Después se filtra y se envasa.','No es café caliente con hielo.'],'brew'),
('03 / QUÉ CONTIENE',['Café + azúcar','+ L-teanina.'],['Sin leche ni crema añadidas.','Sin cafeína añadida:','la cafeína proviene del café.'],'ingredients'),
('04 / TU MOMENTO',['Enfriá.','Abrí.','Disfrutá.'],['Listo para tomar.','Sin preparar ni diluir.','Para tu próxima pausa.'],'drink'),
('05 / CLUB FOCUS',['Tu lata abre','más posibilidades.'],['Descubrí puntos de venta, comprá','online y registrá tus latas.','Conocé la app gratuita Club Focus.'],'club')]
for i,(kicker,title,body,kind) in enumerate(slides):
    s='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350"><defs><radialGradient id="g"><stop stop-color="#154454"/><stop offset="1" stop-color="#101618"/></radialGradient></defs><rect width="1080" height="1350" fill="#101618"/><circle cx="950" cy="650" r="650" fill="url(#g)"/><g font-family="Arial, Helvetica, sans-serif">'
    s+=text(72,88,['CABRALES'],26,weight=700)+text(235,88,['FOCUS'],26,'#49d3ff',700)+text(900,88,[f'{i+1:02d} / 06'],23)
    s+='<path d="M72 122H1008" stroke="#3a4a50"/>'+text(72,187,[kicker],22,'#49d3ff',700)
    s+=text(72,310,title,90,weight=700)
    if kind in ('hero','drink'):
        s+=f'<image href="{can}" x="520" y="500" width="480" height="650" preserveAspectRatio="xMidYMid meet"/>'
        s+=text(72,850,body,34)
    elif kind=='ingredients':
        for x,n,l in [(72,'240','ml por lata'),(395,'6 g','azúcar añadida'),(718,'100 mg','L-teanina')]:
            s+=f'<rect x="{x}" y="530" width="290" height="190" rx="20" fill="#1d3039"/>'+text(x+22,615,[n],49,'#49d3ff',700)+text(x+22,668,[l],23)
        s+=text(72,820,body,36)+text(72,1050,['Cantidades objetivo de la formulación académica.','No constituyen una fórmula industrial validada.'],25,'#a8b7bd')
    elif kind=='club':
        s+='<rect x="590" y="510" width="370" height="570" rx="45" fill="#26343b" stroke="#63818d" stroke-width="3"/><rect x="610" y="535" width="330" height="520" rx="30" fill="#101618"/>'
        s+=text(638,600,['CLUB FOCUS'],27,'#49d3ff',700)+text(638,690,['+100'],65,weight=700)+text(638,735,['puntos por lata'],23)
        s+=text(638,815,['Registrá tu lata.','Elegí tu recompensa.'],23)
        s+=text(72,640,['100 puntos','por cada lata','registrada.'],39,'#49d3ff',700)+text(72,960,body,28)
    elif kind=='brew':
        for x,n,l in [(72,'01','AGUA FRÍA'),(395,'02','EXTRACCIÓN'),(718,'03','FILTRADO')]:
            s+=f'<rect x="{x}" y="550" width="290" height="210" rx="20" fill="#1d3039"/>'+text(x+25,650,[n],65,'#49d3ff',700)+text(x+25,715,[l],24)
        s+=text(72,890,body,38)
    else:
        s+='<ellipse cx="760" cy="690" rx="150" ry="200" fill="#79513b" transform="rotate(35 760 690)"/><path d="M820 530Q650 690 700 860" stroke="#201b18" stroke-width="16" fill="none"/>'
        s+=text(72,880,body,38)
    s+='<path d="M72 1170H1008" stroke="#3a4a50"/>'+text(72,1220,['PRECISIÓN QUE SE TOMA.'],25,'#49d3ff',700)+text(72,1275,['Concepto académico · Producto y app propuestos'],20,'#9bacb5')+text(890,1220,['DESLIZÁ →' if i<5 else 'CONOCÉ →'],19)+'</g></svg>'
    (out/f'P2-{i+1:02d}.svg').write_text(s,encoding='utf8')
copy='Tu café, en otro formato. Conocé Cabrales Focus: cold brew de café arábica, con azúcar y L-teanina, listo para acompañar tu rutina. Deslizá para descubrir qué contiene y cómo disfrutarlo. En Club Focus podés encontrar puntos de venta, comprar online y sumar puntos registrando tus latas. Conocé la app desde el perfil. Precisión que se toma. #CabralesFocus #ClubFocus\n\nProducto, formulación y app propuestos para un proyecto académico.'
(out/'copy.txt').write_text(copy,encoding='utf8')
gallery='<div class="p2-instagram"><div class="p2-account"><strong>cabrales.focus</strong><span>Concepto de publicación · Instagram</span></div><div class="p2-track" tabindex="0" aria-label="Carrusel P2: seis placas, desplazamiento horizontal">'+''.join(f'<img src="media/P2/P2-{i:02d}.svg" alt="Placa {i}: {html.escape(slides[i-1][0])}" loading="lazy">' for i in range(1,7))+'</div><p class="p2-hint">← Deslizá horizontalmente para ver las seis placas →</p><p class="p2-caption"><strong>cabrales.focus</strong> '+html.escape(copy).replace('\n','<br>')+'</p></div>'
style='<style>.p2-instagram{max-width:520px;background:#fff;color:#171717;border-radius:12px;overflow:hidden}.p2-account{padding:16px 20px;display:flex;flex-direction:column;font-size:14px}.p2-account span{font-size:11px;color:#777}.p2-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.p2-track img{width:100%;flex:0 0 100%;scroll-snap-align:start;display:block}.p2-hint{font-size:11px;text-align:center;margin:12px;color:#555}.p2-caption{padding:8px 20px 20px;font-size:13px;line-height:1.6;white-space:normal}</style>'
(out/'P2-mockup.html').write_text('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>P2 · Conocé Cabrales Focus</title>'+style+'<body style="background:#15232b;font-family:Arial;padding:24px;display:flex;justify-content:center">'+gallery.replace('media/P2/','')+'</body></html>',encoding='utf8')
p=r/'index.html';s=p.read_text(encoding='utf8')
titles=['Antes de encontrar Focus','Conocé Cabrales Focus','Entrá a Modo Focus','Una pausa con Solange','Una última bala','Tu momento Focus']
oldpanels=re.findall(r'<article class="post-panel".*?</article>',s,re.S)
assert len(oldpanels)==6
descs=[('TikTok / Reels · 25 s','Teaser: Bruno pierde el foco, cierra la notebook y se va. La lata queda visible en otro escritorio. Remite al corto de YouTube.'),('Instagram · Carrusel de 6 placas','Producto, composición propuesta, elaboración, consumo y Club Focus.'),('Instagram · Placa · AIDA','Invitación con Suga a Modo Focus y al stream patrocinado propuesto con demostración de Club Focus y del sorteo.'),('TikTok · 30 s','Encuentro casual simulado con Solange: tres preguntas sobre su café y su rutina.'),('Instagram Reels · 40 s · RTM','La última bala del Last Chance conecta la escena local con el co-branding propuesto para el FiReMAJOR Buenos Aires 2027. Demo del canje de puntos por bonos.'),('Instagram Stories · 4 historias','Encuestas y caja de respuestas sobre pausas y distracciones. Remisión a Historias Focus.')]
for i,old in enumerate(oldpanels,1):
    label,desc=descs[i-1]
    visual=gallery if i==2 else f'<div class="media-slot" data-media="P{i}"><div class="media-content"><strong>P{i} · {titles[i-1]}</strong><span>Pendiente de producción</span></div><label class="local-loader">Previsualizar archivo local<input type="file" accept="image/*,video/*" data-preview="P{i}"></label></div>'
    panel=f'<article class="post-panel" id="panel-P{i}" role="tabpanel" aria-labelledby="tab-P{i}" '+('' if i==1 else 'hidden')+f'><div><p class="eyebrow">{label}</p><h3>{titles[i-1]}</h3><p>{desc}</p>'+('<p>Seis placas listas para revisión. Formato 1080 × 1350. Composición académica, sin promesas de eficacia.</p><a href="media/P2/P2-mockup.html">Abrir mockup independiente →</a>' if i==2 else '')+'</div>'+visual+'</article>'
    s=s.replace(old,panel)
    s=re.sub(fr'(<button id="tab-P{i}"[^>]*>).*?(</button>)',fr'\g<1>P{i} · {titles[i-1]}\g<2>',s)
s=s.replace('incluidos 75 s de videos','incluidos 95 s de videos').replace('Clase 10 · P2: AIDA, de la pregunta a consultar la agenda. P4: RTM retrospectivo del 5/10/2025. P5: CGU con situación, elección y consecuencia.','Clase 10 · P3: AIDA. P5: RTM y sorteo propuesto. P4 y P6: participación de la comunidad.')
s=s.replace('</head>',style+'</head>',1)
p.write_text(s,encoding='utf8')
print('P2: seis placas SVG de 1080 × 1350, copy y mockup. Sección P1–P6 actualizada.')
