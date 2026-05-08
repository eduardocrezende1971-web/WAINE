import { useState, useRef, useEffect } from "react";

const G = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`;

// ── Paleta interior (claro, elegante) ─────────────────────────────────────────
const C = {
  bg:     "#F7F3EE",
  card:   "#FFFFFF",
  card2:  "#F2EDE2",
  border: "rgba(0,0,0,0.07)",
  text:   "#1A1410",
  sub:    "#6B5F54",
  muted:  "#A89B8E",
  gold:   "#C9A46E",
  goldD:  "#9A7A4A",
  goldL:  "rgba(201,164,110,0.12)",
  wine:   "#5B0F1A",
  wineL:  "rgba(91,15,26,0.08)",
  sepia:  "#7A5C3A",
  sepiaL: "rgba(122,92,58,0.08)",
  green:  "#2A6040",
  greenL: "rgba(42,96,64,0.08)",
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "waine_uploads");
  const res = await fetch("https://api.cloudinary.com/v1_1/dfuqx38mo/image/upload", { method:"POST", body:formData });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload falhou");
  return data.secure_url;
};

const loadFromServer = async () => {
  try { const res = await fetch("/api/save"); if (!res.ok) return null; return await res.json(); }
  catch { return null; }
};
const saveToServer = async (data) => {
  try { await fetch("/api/save", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ wines:data.wines, vineyard:data.vineyard, memories:data.memories }) }); }
  catch {}
};

const VINHO0 = [];
const sAccent = s => s==="Branco"?C.gold:s==="Rose"?"#B05070":s==="Espumante"?"#2A7060":C.wine;
const sLabel  = s => s==="Branco"?C.goldL:s==="Rose"?"rgba(176,80,112,0.08)":s==="Espumante"?"rgba(42,112,96,0.08)":C.wineL;
const getCastaFiltro = (grapes) => {
  if (!grapes) return null;
  const lista = grapes.split(",").map(g=>g.trim()).filter(Boolean);
  if (lista.length > 1) return "Blend";
  return lista[0] || null;
};

// ── Símbolo MEMORAVIN em SVG ───────────────────────────────────────────────────
const SimboloMemoravin = ({ size=80, color="#C9A46E", strokeWidth=2 }) => (
  <svg width={size} height={size*1.2} viewBox="0 0 100 120">
    {/* Coração = topo do cacho */}
    <path d="M 50,38 C 50,38 50,18 35,18 C 20,18 20,32 20,32 C 20,46 35,54 50,66 C 65,54 80,46 80,32 C 80,32 80,18 65,18 C 50,18 50,38 50,38 Z"
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    {/* Caule */}
    <line x1="50" y1="16" x2="50" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    {/* Uvas - linha 1 */}
    <circle cx="34" cy="74" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
    <circle cx="50" cy="74" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
    <circle cx="66" cy="74" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
    {/* Uvas - linha 2 */}
    <circle cx="42" cy="90" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
    <circle cx="58" cy="90" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
    {/* Uva - base */}
    <circle cx="50" cy="106" r="9" fill="none" stroke={color} strokeWidth={strokeWidth}/>
  </svg>
);

// ── Tela de Capa ───────────────────────────────────────────────────────────────
const Capa = ({ onEntrar }) => (
  <div style={{
    position:"fixed", inset:0, zIndex:999,
    background:"#0D0D0F",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between",
    padding:"0 0 calc(48px + env(safe-area-inset-bottom))",
    overflow:"hidden",
  }}>
    {/* Imagem de fundo */}
    <div style={{
      position:"absolute", inset:0,
      backgroundImage:"url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80')",
      backgroundSize:"cover", backgroundPosition:"center",
      opacity:0.35,
    }}/>
    {/* Gradiente escuro */}
    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(13,13,15,0.3) 0%, rgba(13,13,15,0.5) 40%, rgba(13,13,15,0.85) 100%)"}}/>

    {/* Conteúdo */}
    <div style={{position:"relative",flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0,width:"100%",padding:"0 40px"}}>

      {/* Símbolo */}
      <SimboloMemoravin size={72} color="#C9A46E" strokeWidth={2.5} />

      {/* Linha decorativa */}
      <div style={{width:1,height:24,background:"rgba(201,164,110,0.4)",marginBottom:20}} />

      {/* Nome */}
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,letterSpacing:"0.3em",color:"#F2EDE2",marginBottom:6,textAlign:"center"}}>
        MEMORAVIN
      </div>

      {/* Linha com ponto */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <div style={{width:40,height:0.5,background:"rgba(201,164,110,0.6)"}}/>
        <div style={{width:4,height:4,borderRadius:"50%",background:"#C9A46E"}}/>
        <div style={{width:40,height:0.5,background:"rgba(201,164,110,0.6)"}}/>
      </div>

      {/* Subtítulo */}
      <div style={{fontFamily:"'DM Sans'",fontSize:10,color:"rgba(201,164,110,0.8)",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:48}}>
        Adega & Memórias
      </div>

      {/* Tagline */}
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",fontWeight:300,color:"rgba(242,237,226,0.75)",lineHeight:1.7}}>
          Sua adega organizada.
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",fontWeight:300,color:"rgba(242,237,226,0.75)",lineHeight:1.7}}>
          Suas memórias eternizadas.
        </div>
      </div>
    </div>

    {/* Botão ENTRAR */}
    <div style={{position:"relative",width:"100%",padding:"0 32px"}}>
      <button onClick={onEntrar} style={{
        width:"100%", padding:"18px",
        background:"#C9A46E", border:"none", borderRadius:50,
        fontFamily:"'DM Sans'",fontSize:12,fontWeight:500,letterSpacing:"0.2em",
        color:"#0D0D0F", textTransform:"uppercase", cursor:"pointer",
      }}>
        ENTRAR
      </button>
    </div>
  </div>
);

// ── Lightbox ───────────────────────────────────────────────────────────────────
const Lightbox = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:"#F2EDE2",fontSize:32,cursor:"pointer"}}>×</button>
      <img src={url} onClick={e=>e.stopPropagation()} style={{maxWidth:"95vw",maxHeight:"90vh",objectFit:"contain",borderRadius:4}} />
    </div>
  );
};

// ── Enriquecer vinho com IA ────────────────────────────────────────────────────
const enriquecerVinho = async (w) => {
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:2000,
      messages:[{ role:"user", content:`Você é um sommelier especialista. Para o vinho "${w.name}" do produtor "${w.producer}", região "${w.region}", país "${w.country}", uvas "${w.grapes}", safra ${w.vintage}:
Retorne APENAS JSON válido sem markdown:
{
  "historia": "História do produtor em 3-4 frases sofisticadas em português.",
  "regiao": "Terroir, clima, topografia, ventos, mar/montanhas, solo. 4-5 frases em português.",
  "alcohol": "grau alcoólico como número ex: 14.5",
  "notas": { "aromas":"1-2 linhas", "paladar":"1-2 linhas", "estrutura":"1 linha", "guarda":"1 linha", "harmonizacao":"1 linha" }
}` }]
    })
  });
  const d = await res.json();
  const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
  return { ...w, ...parsed };
};

const PAIS_COORDS = {
  "África do Sul":{x:530,y:375},"Argentina":{x:265,y:385},"Austrália":{x:820,y:385},
  "Áustria":{x:515,y:170},"Brasil":{x:295,y:335},"Chile":{x:250,y:390},
  "Espanha":{x:458,y:192},"Estados Unidos":{x:170,y:195},"França":{x:473,y:182},
  "Grécia":{x:535,y:198},"Hungria":{x:522,y:172},"Itália":{x:508,y:192},
  "Nova Zelândia":{x:878,y:425},"Portugal":{x:448,y:198},"Alemanha":{x:488,y:168},"Uruguai":{x:282,y:388},
};

// ── Tab Mapa ───────────────────────────────────────────────────────────────────
const TabMapa = ({ wines }) => {
  const [tooltip, setTooltip] = useState(null);
  const winesAtivos = wines.filter(w=>w.bottles>0);
  const porPais = winesAtivos.reduce((acc,w)=>{
    if(!w.country) return acc;
    if(!acc[w.country]) acc[w.country]={rotulos:0,garrafas:0};
    acc[w.country].rotulos+=1; acc[w.country].garrafas+=w.bottles; return acc;
  },{});
  const maxG = Math.max(...Object.values(porPais).map(p=>p.garrafas),1);
  const getR = g => 16+((g/maxG)*20);
  const comCoords = Object.entries(porPais).map(([pais,dados])=>({pais,...dados,coords:PAIS_COORDS[pais]||null})).filter(p=>p.coords);

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"32px 24px 20px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>MAPA DA ADEGA</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:C.text}}>{Object.keys(porPais).length} <span style={{color:C.muted,fontSize:24}}>países</span></div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:4}}>{winesAtivos.reduce((a,b)=>a+b.bottles,0)} garrafas em estoque</div>
      </div>
      <div style={{padding:"0 16px",marginBottom:24}}>
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <svg viewBox="0 0 1000 500" style={{width:"100%",display:"block"}}>
            <rect width="1000" height="500" fill="#EAE4DC"/>
            <path d="M 80,80 L 260,80 L 280,130 L 260,180 L 220,200 L 200,240 L 180,260 L 150,250 L 120,220 L 90,180 L 70,140 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 180,260 L 220,260 L 230,300 L 210,310 L 190,290 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 220,300 L 320,300 L 340,320 L 330,380 L 310,420 L 280,440 L 250,430 L 230,400 L 220,360 L 210,330 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 430,100 L 560,100 L 570,160 L 550,200 L 510,210 L 470,205 L 440,190 L 420,160 L 425,130 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 460,80 L 530,70 L 540,100 L 490,110 L 460,100 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 450,220 L 580,220 L 590,280 L 570,360 L 540,410 L 510,420 L 490,410 L 470,370 L 450,310 L 440,260 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 560,80 L 850,70 L 870,120 L 840,160 L 780,170 L 720,160 L 660,150 L 600,140 L 570,120 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 560,160 L 640,160 L 650,210 L 620,230 L 580,220 L 555,200 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 660,160 L 720,160 L 730,230 L 700,270 L 670,250 L 650,210 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 720,120 L 860,120 L 870,180 L 840,210 L 790,220 L 750,210 L 720,190 L 710,160 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 770,340 L 900,330 L 920,380 L 900,430 L 850,450 L 800,440 L 770,400 L 760,370 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            <path d="M 900,410 L 915,410 L 920,440 L 905,445 L 898,430 Z" fill="#D4C8B8" stroke="#C4B8A8" strokeWidth="1"/>
            {comCoords.map(({pais,garrafas,rotulos,coords})=>{
              const r=getR(garrafas); const isSel=tooltip?.pais===pais;
              return (
                <g key={pais} style={{cursor:"pointer"}} onClick={()=>setTooltip(isSel?null:{pais,garrafas,rotulos,coords})}>
                  <circle cx={coords.x} cy={coords.y} r={r} fill={isSel?"#9A7A4A":C.goldD} fillOpacity={0.85} stroke="#fff" strokeWidth="2"/>
                  <text x={coords.x} y={coords.y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={r>24?13:10} fontFamily="'Cormorant Garamond',serif" fontWeight="600">{garrafas}</text>
                </g>
              );
            })}
            {tooltip&&(
              <g>
                <rect x={Math.min(tooltip.coords.x+10,820)} y={tooltip.coords.y-42} width="165" height="54" rx="4" fill="#1A1410" fillOpacity="0.9"/>
                <text x={Math.min(tooltip.coords.x+92,902)} y={tooltip.coords.y-22} textAnchor="middle" fill={C.gold} fontSize="10" fontFamily="'DM Sans'" fontWeight="500" letterSpacing="2">{tooltip.pais.toUpperCase()}</text>
                <text x={Math.min(tooltip.coords.x+92,902)} y={tooltip.coords.y-4} textAnchor="middle" fill="#A89B8E" fontSize="10" fontFamily="'DM Sans'">{tooltip.rotulos} rótulo{tooltip.rotulos!==1?"s":""} · {tooltip.garrafas} garrafa{tooltip.garrafas!==1?"s":""}</text>
              </g>
            )}
          </svg>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,textAlign:"center",marginTop:8,letterSpacing:"0.08em"}}>Toque num país para ver detalhes</div>
      </div>
      <div style={{padding:"0 24px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR PAÍS</div>
        {Object.entries(porPais).sort((a,b)=>b[1].garrafas-a[1].garrafas).map(([pais,dados])=>(
          <div key={pais} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,marginBottom:2}}>{pais}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted}}>{dados.rotulos} rótulo{dados.rotulos!==1?"s":""}</div>
            </div>
            <div style={{width:38,height:38,borderRadius:"50%",background:C.goldL,border:`1px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.goldD}}>{dados.garrafas}</span>
            </div>
          </div>
        ))}
        {Object.keys(porPais).length===0&&<div style={{textAlign:"center",padding:"48px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Adicione vinhos para ver o mapa</div>}
      </div>
    </div>
  );
};

// ── Tab Memórias ───────────────────────────────────────────────────────────────
const TabMemorias = ({ wines }) => {
  const [detail, setDetail] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const top20 = [...wines].filter(w=>w.memory&&w.rating>0).sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,20);

  if (detail) {
    const w = detail;
    return (
      <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
        <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
        <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",zIndex:10}}>
          <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.12em",color:C.muted,cursor:"pointer",padding:0}}>← MEMÓRIAS</button>
        </div>
        <div style={{padding:"32px 24px 80px"}}>
          {w.photos?.[0]&&<img src={w.photos[0]} onClick={()=>setLightbox(w.photos[0])} style={{width:"100%",height:220,objectFit:"cover",borderRadius:8,marginBottom:28,border:`1px solid ${C.border}`,cursor:"zoom-in"}} />}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
            <span style={{fontSize:22}}>❤️</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:C.goldD,lineHeight:1}}>{w.rating}</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:C.text,marginBottom:4}}>{w.name}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,marginBottom:20}}>{w.producer} · {w.vintage}</div>
          {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:24}}>📍 {w.location} · {w.date}</div>}
          <div style={{background:C.card,borderRadius:8,padding:"22px",border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>MEMÓRIA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>"{w.memory}"</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"32px 24px 0",marginBottom:24}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>MEMÓRIAS</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:C.text}}>Top <span style={{color:C.muted}}>experiências</span></div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:4}}>As {top20.length} maiores emoções da adega</div>
      </div>
      <div style={{padding:"0 24px"}}>
        {top20.length===0?(
          <div style={{textAlign:"center",padding:"72px 0"}}>
            <div style={{fontSize:32,marginBottom:16,opacity:0.3}}>❤️</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.muted,lineHeight:1.6}}>Suas memórias vinícolas<br/>aparecerão aqui</div>
          </div>
        ):top20.map((w,i)=>(
          <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"stretch"}}>
            <div style={{width:54,background:i===0?C.goldD:i===1?"#7A6030":i===2?C.sepia:C.card2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0}}>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,color:i<3?"#fff":C.muted,fontWeight:500}}>#{i+1}</span>
              <span style={{fontSize:13}}>❤️</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:i<3?"#fff":C.goldD}}>{w.rating}</span>
            </div>
            <div style={{flex:1,padding:"14px 16px",minWidth:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.name}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:8}}>{w.producer} · {w.vintage}</div>
              {w.memory&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.sub,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>"{w.memory}"</div>}
              {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,marginTop:6}}>📍 {w.location}</div>}
            </div>
            {w.photos?.[0]&&<img src={w.photos[0]} style={{width:64,objectFit:"cover",flexShrink:0}} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Photo Uploader ─────────────────────────────────────────────────────────────
const PhotoUploader = ({ photos, onChange, max=2 }) => {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const handle = async e => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true);
    try { onChange([...photos, await uploadToCloudinary(file)].slice(0,max)); }
    catch {}
    setBusy(false); e.target.value="";
  };
  return (
    <div style={{marginBottom:24}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>FOTOS DO RÓTULO</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {photos.map((url,i)=>(
          <div key={i} style={{position:"relative"}}>
            <img src={url} style={{width:88,height:118,objectFit:"cover",borderRadius:4,border:`1px solid ${C.border}`}} />
            <button onClick={()=>onChange(photos.filter((_,j)=>j!==i))} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:C.wine,border:`2px solid ${C.bg}`,color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}
        {photos.length<max&&(
          <div onClick={()=>!busy&&ref.current.click()} style={{width:88,height:118,border:`1px dashed ${busy?C.gold:C.border}`,borderRadius:4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:6,background:busy?C.goldL:"transparent"}}>
            <span style={{fontSize:22,opacity:0.4}}>{busy?"...":"📷"}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted}}>{busy?"ENVIANDO":"FOTO"}</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}} />
    </div>
  );
};

const Qty = ({ value, onChange, accent }) => (
  <div style={{display:"flex",alignItems:"center",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden"}}>
    <button onClick={e=>{e.stopPropagation();onChange(Math.max(0,value-1));}} style={{width:36,height:36,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:accent||C.goldD,minWidth:30,textAlign:"center"}}>{value}</span>
    <button onClick={e=>{e.stopPropagation();onChange(value+1);}} style={{width:36,height:36,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
  </div>
);

const NotasTopicos = ({ notas }) => {
  if (!notas) return null;
  let topicos = null;
  try { topicos = typeof notas==="object"?notas:JSON.parse(notas); } catch {}
  const labels = { aromas:"🌸 Aromas", paladar:"👄 Paladar", estrutura:"⚖️ Estrutura", guarda:"⏳ Guarda", harmonizacao:"🍽️ Harmonização" };
  if (topicos && typeof topicos==="object") {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {Object.entries(topicos).map(([k,v])=>v?(
          <div key={k} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.goldD,letterSpacing:"0.06em",minWidth:90,paddingTop:2,flexShrink:0}}>{labels[k]||k}</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.65,flex:1}}>{v}</span>
          </div>
        ):null)}
      </div>
    );
  }
  return <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{notas}</div>;
};

const VoiceButton = ({ onResult }) => {
  const [ouvindo, setOuvindo] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) return;
    if (ouvindo) { recRef.current?.stop(); setOuvindo(false); return; }
    const rec = new SR();
    rec.lang="pt-BR"; rec.interimResults=false; rec.maxAlternatives=1;
    rec.onresult=e=>{onResult(e.results[0][0].transcript);setOuvindo(false);};
    rec.onerror=()=>setOuvindo(false); rec.onend=()=>setOuvindo(false);
    recRef.current=rec; rec.start(); setOuvindo(true);
  };
  return (
    <button onClick={toggle} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${ouvindo?C.goldD:C.border}`,background:ouvindo?C.goldL:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:15}}>{ouvindo?"⏹":"🎙️"}</span>
    </button>
  );
};

// ── Wine Detail ────────────────────────────────────────────────────────────────
const WineDetail = ({ w, onBack, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({...w});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aibusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { onUpdate(f); setEditing(false); setAiPrompt(""); setAiMsg(""); };
  const isDeg = w.bottles===0;
  const accent = isDeg?C.sepia:C.goldD;

  const corrigirIA = async () => {
    if (!aiPrompt.trim()) return;
    setAiBusy(true); setAiMsg("Corrigindo...");
    try {
      const res = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,
          messages:[{role:"user",content:`Sommelier especialista. Vinho: "${f.name}", produtor: "${f.producer}", safra: ${f.vintage}, região: "${f.region}", país: "${f.country}".
Corrija: "${aiPrompt}"
Retorne APENAS JSON com campos alterados: { "region","country","grapes","style","alcohol","historia","regiao","notas":{...} }`}]})});
      const d = await res.json();
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed})); setAiMsg("✓ Corrigido. Revise e salve.");
    } catch(e) { setAiMsg("Erro: "+e.message); }
    setAiBusy(false);
  };

  const notasObj = (typeof f.notas==="object"&&f.notas)?f.notas:{aromas:"",paladar:"",estrutura:"",guarda:"",harmonizacao:""};
  const labelsN = {aromas:"🌸 Aromas",paladar:"👄 Paladar",estrutura:"⚖️ Estrutura",guarda:"⏳ Guarda",harmonizacao:"🍽️ Harmonização"};

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
      <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
      <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.12em",color:C.muted,cursor:"pointer",padding:0}}>← ADEGA</button>
        <button onClick={()=>editing?save():setEditing(true)} style={{background:editing?C.goldD:"none",border:`1px solid ${editing?C.goldD:C.border}`,borderRadius:4,padding:"7px 18px",fontFamily:"'DM Sans'",fontSize:10,letterSpacing:"0.1em",color:editing?"#fff":C.muted,cursor:"pointer"}}>
          {editing?"SALVAR":"EDITAR"}
        </button>
        {!editing&&<button onClick={()=>{if(window.confirm("Remover este vinho?"))onDelete(w.id);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 14px",fontFamily:"'DM Sans'",fontSize:11,color:C.muted,cursor:"pointer"}}>🗑</button>}
      </div>
      <div style={{padding:"32px 24px 100px"}}>
        {isDeg&&(
          <div style={{background:C.sepiaL,border:`1px solid rgba(122,92,58,0.2)`,borderRadius:6,padding:"10px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🍷</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.sepia,letterSpacing:"0.1em",textTransform:"uppercase"}}>Degustado · Memória preservada</span>
          </div>
        )}
        {editing?<PhotoUploader photos={f.photos||[]} onChange={v=>set("photos",v)} />
          :f.photos?.length>0&&(
            <div style={{display:"flex",gap:12,marginBottom:32}}>
              {f.photos.map((url,i)=><img key={i} src={url} onClick={()=>setLightbox(url)} style={{width:128,height:170,objectFit:"cover",borderRadius:6,border:`1px solid ${C.border}`,filter:isDeg?"sepia(40%)":"none",cursor:"zoom-in"}} />)}
            </div>
          )
        }
        <div style={{width:24,height:1,background:C.gold,marginBottom:24,opacity:0.4}} />
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:8}}>{w.style} · {w.country}</div>
        {editing?<input value={f.name} onChange={e=>set("name",e.target.value)} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",marginBottom:8,boxSizing:"border-box"}} />
          :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:C.text,lineHeight:1.1,marginBottom:6}}>{w.name}</div>}
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.sub,marginBottom:32}}>{w.producer}, {w.vintage}</div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:26}}>❤️</span>
            {editing?<input type="number" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:72,fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:300,color:accent,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none"}} />
              :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:64,color:accent,fontWeight:300,lineHeight:1}}>{w.rating}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>GARRAFAS</div>
            <Qty value={editing?f.bottles:w.bottles} onChange={v=>{set("bottles",v);if(!editing)onUpdate({...w,bottles:v});}} accent={accent} />
          </div>
        </div>

        {editing&&<div style={{marginBottom:28}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>❤️ EMOÇÃO — {f.rating}</div>
          <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.goldD}} />
        </div>}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:32,borderRadius:4,overflow:"hidden"}}>
          {[["REGIÃO","region"],["PAÍS","country"],["UVAS","grapes"],["ADQUIRIDO","date"],["ÁLCOOL","alcohol"]].map(([l,k])=>(
            <div key={k} style={{background:C.card,padding:"14px 16px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
              {editing?<input value={f[k]||""} onChange={e=>set(k,e.target.value)} placeholder={k==="alcohol"?"ex: 14.5":""} style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box"}} />
                :<div style={{fontFamily:"'DM Sans'",fontSize:13,color:C.sub}}>{w[k]}{k==="alcohol"&&w[k]&&!String(w[k]).includes("%")?"%":""}</div>}
            </div>
          ))}
        </div>

        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:14}}>MINHA MEMÓRIA</div>
        {editing?<div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
            <textarea value={f.memory||""} onChange={e=>set("memory",e.target.value)} rows={4} placeholder="Onde estava, com quem, o que sentiu..." style={{flex:1,fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card,outline:"none",padding:14,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
          </div>
          :w.memory&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:C.sub,lineHeight:1.85,marginBottom:8}}>"{w.memory}"</div>}
        {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:8,marginBottom:32}}>📍 {w.location}</div>}

        {(editing||w.historia)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.goldD,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>O PRODUTOR</div>
          {editing?<textarea value={f.historia||""} onChange={e=>set("historia",e.target.value)} rows={4} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card2,outline:"none",padding:10,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{w.historia}</div>}
        </div>}

        {(editing||w.regiao)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.green,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>A REGIÃO</div>
          {editing?<textarea value={f.regiao||""} onChange={e=>set("regiao",e.target.value)} rows={4} placeholder="Terroir, clima, topografia..." style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card2,outline:"none",padding:10,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
            :<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{w.regiao}</div>}
        </div>}

        {(editing||w.notas)&&<div style={{marginBottom:16,padding:"20px",background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.wine,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:14}}>O VINHO</div>
          {editing?<div style={{display:"flex",flexDirection:"column",gap:14}}>
              {Object.keys(labelsN).map(k=>(
                <div key={k}>
                  <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{labelsN[k]}</div>
                  <input value={notasObj[k]||""} onChange={e=>set("notas",{...notasObj,[k]:e.target.value})} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box",paddingBottom:4}} />
                </div>
              ))}
            </div>
            :<NotasTopicos notas={w.notas} />}
        </div>}

        {editing&&<div style={{marginBottom:20,padding:"18px",background:C.card2,borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.goldD,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>✦ CORRIGIR COM IA</div>
          <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} rows={2} placeholder='ex: "Este vinho é da África do Sul, não da França."' style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card,outline:"none",padding:"10px 12px",resize:"none",boxSizing:"border-box",marginBottom:10}} />
          <button onClick={corrigirIA} disabled={aibusy||!aiPrompt.trim()} style={{width:"100%",padding:"10px",background:C.goldD,border:"none",borderRadius:4,color:"#fff",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",opacity:!aiPrompt.trim()?0.4:1}}>
            {aibusy?"Corrigindo...":"Corrigir com IA"}
          </button>
          {aiMsg&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:aiMsg.startsWith("✓")?C.green:C.goldD,marginTop:8}}>{aiMsg}</div>}
        </div>}
      </div>
    </div>
  );
};

// ── Add Wine ───────────────────────────────────────────────────────────────────
const AddWine = ({ onClose, onSave }) => {
  const [f, setF] = useState({name:"",producer:"",vintage:2024,region:"",country:"África do Sul",grapes:"",style:"Tinto",bottles:1,rating:50,memory:"",location:"",accent:C.goldD,special:false,photos:[],historia:"",regiao:"",alcohol:"",notas:null});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({msg:"",ok:false});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const enrich = async () => {
    if(!f.name||!f.producer) return;
    setBusy(true); setStatus({msg:"Pesquisando vinho e produtor...",ok:false});
    try {
      const res = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,
          messages:[{role:"user",content:`Sommelier especialista. Vinho "${f.name}", produtor "${f.producer}", safra ${f.vintage}. Retorne APENAS JSON:
{ "region":"região vinícola", "country":"país em português", "grapes":"uvas", "style":"Tinto|Branco|Rose|Espumante|Sobremesa", "alcohol":"número ex:14.5", "historia":"3-4 frases sofisticadas sobre o produtor", "regiao":"4-5 frases sobre terroir, clima, topografia, ventos, mar/montanhas", "notas":{"aromas":"","paladar":"","estrutura":"","guarda":"","harmonizacao":""} }`}]})});
      const d = await res.json();
      if(d.error){setStatus({msg:"Erro",ok:false});setBusy(false);return;}
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed}));
      setStatus({msg:"Ficha completa. Adicione sua memória.",ok:true});
    } catch(e){setStatus({msg:"Erro: "+(e.message||""),ok:false});}
    setBusy(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(26,20,16,0.6)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:"28px 24px 52px",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{width:32,height:2,background:C.border,borderRadius:1,margin:"0 auto 28px"}} />
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:C.text,marginBottom:4}}>Registrar vinho</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:28}}>Foto + nome + produtor — a IA completa a ficha.</div>
        <PhotoUploader photos={f.photos} onChange={v=>set("photos",v)} />

        {[["Nome do Vinho","name","text","ex: Paul Sauer"],["Produtor","producer","text","ex: Kanonkop"],["Safra","vintage","number",""]].map(([l,k,t,ph])=>(
          <div key={k} style={{marginBottom:18}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>{l}</div>
            <input type={t} value={f[k]} placeholder={ph} onChange={e=>set(k,t==="number"?+e.target.value:e.target.value)} style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
        ))}

        <button onClick={enrich} disabled={busy||!f.name||!f.producer} style={{width:"100%",padding:14,marginBottom:18,background:status.ok?C.greenL:C.goldL,border:`1px solid ${status.ok?C.green:C.goldD}`,borderRadius:6,color:status.ok?C.green:C.goldD,fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",opacity:(!f.name||!f.producer)?0.35:1}}>
          {busy?"✦ Pesquisando...":status.ok?"✓ Ficha gerada":"✦ Gerar ficha com IA"}
        </button>

        {status.msg&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:status.ok?C.green:C.goldD,background:status.ok?C.greenL:C.goldL,padding:"10px 14px",borderRadius:4,marginBottom:18}}>{status.msg}</div>}

        {f.historia&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.goldD,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>O PRODUTOR</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.historia}</div>
        </div>}

        {f.regiao&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.green,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>A REGIÃO</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.regiao}</div>
        </div>}

        {f.notas&&<div style={{marginBottom:16,padding:"18px",background:C.card2,borderRadius:6,border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.wine,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:12}}>O VINHO</div>
          <NotasTopicos notas={f.notas} />
        </div>}

        {status.ok&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:18,borderRadius:4,overflow:"hidden"}}>
          {[["REGIÃO",f.region],["PAÍS",f.country],["UVAS",f.grapes],["ESTILO",f.style],["ÁLCOOL",f.alcohol?f.alcohol+"%":""]].map(([l,v])=>(
            <div key={l} style={{background:C.card,padding:"12px 14px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>{v}</div>
            </div>
          ))}
        </div>}

        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10}}>GARRAFAS</div>
          <Qty value={f.bottles} onChange={v=>set("bottles",v)} accent={C.goldD} />
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>❤️ EMOÇÃO — {f.rating}</div>
          <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.goldD}} />
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>MINHA MEMÓRIA</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <textarea value={f.memory} onChange={e=>set("memory",e.target.value)} rows={3} placeholder="Onde estava, com quem, o que sentiu..." style={{flex:1,background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.7}} />
            <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>LOCAL</div>
          <input value={f.location} onChange={e=>set("location",e.target.value)} placeholder="ex: Kanonkop, Stellenbosch" style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,padding:"12px 14px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,cursor:"pointer"}} onClick={()=>set("special",!f.special)}>
          <div style={{width:20,height:20,border:`1px solid ${f.special?C.goldD:C.border}`,borderRadius:3,background:f.special?C.goldL:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {f.special&&<span style={{color:C.goldD,fontSize:13}}>★</span>}
          </div>
          <span style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>Marcar como especial</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:14,background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",cursor:"pointer"}}>CANCELAR</button>
          <button onClick={()=>{if(!f.name)return;onSave({...f,id:Date.now(),date:new Date().toLocaleDateString("pt-BR",{month:"short",year:"numeric"})});}} style={{flex:2,padding:14,background:C.goldD,border:"none",borderRadius:6,color:"#fff",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontWeight:500}}>
            ADICIONAR À ADEGA
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab Adega ──────────────────────────────────────────────────────────────────
const TabAdega = ({ wines, setWines }) => {
  const [detail, setDetail] = useState(null);
  const [adding, setAdding] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [search, setSearch] = useState("");
  const [enriquecendo, setEnriquecendo] = useState(false);
  const [progresso, setProgresso] = useState({atual:0,total:0,msg:""});
  const update = u => setWines(ws=>ws.map(w=>w.id===u.id?u:w));

  const tipos = ["Tinto","Branco","Rose","Espumante","Sobremesa"];
  const winesAtivos = wines.filter(w=>w.bottles>0);
  const winesDegustados = wines.filter(w=>w.bottles===0);

  const enriquecerAdega = async () => {
    if (!window.confirm(`Enriquecer todas as ${wines.length} fichas com IA?\n\nPode demorar alguns minutos.`)) return;
    setEnriquecendo(true);
    const total = wines.length;
    setProgresso({atual:0,total,msg:"Iniciando..."});
    const novas = [...wines];
    for (let i=0;i<wines.length;i++) {
      const w = wines[i];
      setProgresso({atual:i+1,total,msg:`${w.name}...`});
      try { novas[i]=await enriquecerVinho(w); setWines([...novas]); } catch{}
      await new Promise(r=>setTimeout(r,300));
    }
    setEnriquecendo(false);
    alert("✓ Adega enriquecida!");
  };

  const filtroCasta = winesAtivos.reduce((acc,w)=>{
    const cf=getCastaFiltro(w.grapes);
    if(cf&&!acc.includes(cf))acc.push(cf); return acc;
  },[]).sort((a,b)=>a==="Blend"?-1:b==="Blend"?1:a.localeCompare(b));

  const filtrosPais = [...new Set(winesAtivos.map(w=>w.country).filter(Boolean))].sort();

  const winesFiltrados = (()=>{
    if (!filtroAtivo) return [];
    if (filtroAtivo==="Degustados") return winesDegustados.filter(w=>{const q=search.toLowerCase();return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);});
    const base = filtroAtivo==="Todos"?winesAtivos
      :filtroAtivo==="Especiais"?winesAtivos.filter(w=>w.special)
      :tipos.includes(filtroAtivo)?winesAtivos.filter(w=>w.style===filtroAtivo)
      :filtroCasta.includes(filtroAtivo)?winesAtivos.filter(w=>getCastaFiltro(w.grapes)===filtroAtivo)
      :filtrosPais.includes(filtroAtivo)?winesAtivos.filter(w=>w.country===filtroAtivo)
      :winesAtivos;
    return base.filter(w=>{const q=search.toLowerCase();return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);});
  })();

  const total = winesAtivos.reduce((a,b)=>a+b.bottles,0);
  const contaTipo = t => t==="Especiais"?winesAtivos.filter(w=>w.special).length:winesAtivos.filter(w=>w.style===t).length;
  const contaCasta = c => winesAtivos.filter(w=>getCastaFiltro(w.grapes)===c).length;
  const contaPais = p => winesAtivos.filter(w=>w.country===p).length;

  if(detail){const live=wines.find(w=>w.id===detail.id)||detail;
    return <WineDetail w={live} onBack={()=>setDetail(null)} onUpdate={update} onDelete={id=>{setWines(ws=>ws.filter(w=>w.id!==id));setDetail(null);}}/>;
  }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      {adding&&<AddWine onClose={()=>setAdding(false)} onSave={w=>{setWines(p=>[...p,w]);setAdding(false);}} />}

      {enriquecendo&&(
        <div style={{position:"fixed",inset:0,background:"rgba(26,20,16,0.7)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:C.card,borderRadius:12,padding:"36px 32px",width:300,textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{color:C.goldD,fontSize:24,marginBottom:14}}>✦</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:C.text,marginBottom:8}}>Enriquecendo adega</div>
            <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:20}}>{progresso.atual} de {progresso.total} · {progresso.msg}</div>
            <div style={{background:C.card2,borderRadius:2,height:2,overflow:"hidden"}}>
              <div style={{background:C.goldD,height:"100%",width:`${(progresso.atual/progresso.total)*100}%`,transition:"width 0.3s"}} />
            </div>
          </div>
        </div>
      )}

      <div style={{padding:"32px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>ADEGA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:C.text,lineHeight:1}}>
              {winesAtivos.length} <span style={{color:C.muted,fontSize:24}}>rótulos</span>
            </div>
            <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:4}}>{total} garrafas · {winesDegustados.length} degustados</div>
          </div>
          <button onClick={()=>setAdding(true)} style={{background:C.goldD,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:22,boxShadow:"0 2px 16px rgba(154,122,74,0.35)"}}>+</button>
        </div>

        {wines.length>0&&!filtroAtivo&&(
          <button onClick={enriquecerAdega} disabled={enriquecendo} style={{width:"100%",padding:"12px",marginBottom:24,background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.goldD,fontFamily:"'DM Sans'",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span>✦</span><span>{enriquecendo?"Enriquecendo...":"Enriquecer adega com IA"}</span>
          </button>
        )}
      </div>

      {filtroAtivo ? (
        <div>
          <div style={{padding:"0 24px",marginBottom:14}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
              <button onClick={()=>{setFiltroAtivo(null);setSearch("");}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 14px",fontFamily:"'DM Sans'",fontSize:10,color:C.muted,cursor:"pointer",letterSpacing:"0.08em"}}>← Filtros</button>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,color:filtroAtivo==="Degustados"?C.sepia:C.goldD,background:filtroAtivo==="Degustados"?C.sepiaL:C.goldL,padding:"6px 14px",borderRadius:20,letterSpacing:"0.08em"}}>
                {filtroAtivo} · {winesFiltrados.length}
              </span>
            </div>
            <div style={{position:"relative"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 14px 10px 36px",color:C.text,fontFamily:"'DM Sans'",fontSize:13,outline:"none",boxSizing:"border-box"}} />
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>🔍</span>
            </div>
          </div>
          <div style={{padding:"0 24px"}}>
            {winesFiltrados.length===0
              ?<div style={{textAlign:"center",padding:"72px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Nenhum vinho encontrado</div>
              :winesFiltrados.map(w=>{
                const isDeg=w.bottles===0;
                return (
                  <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${isDeg?"rgba(122,92,58,0.2)":C.border}`,borderRadius:8,marginBottom:10,cursor:"pointer",overflow:"hidden"}}>
                    {w.photos?.[0]&&(
                      <div style={{position:"relative",height:160,overflow:"hidden"}}>
                        <img src={w.photos[0]} style={{width:"100%",height:"100%",objectFit:"cover",filter:isDeg?"sepia(40%)":"none"}} />
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 30%,rgba(26,20,16,0.75) 100%)"}} />
                        <div style={{position:"absolute",bottom:14,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                          <div>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:"#fff",lineHeight:1.2}}>{w.name}</div>
                            <div style={{fontFamily:"'DM Sans'",fontSize:10,color:"rgba(255,255,255,0.55)"}}>{w.producer} · {w.vintage}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{fontSize:12}}>❤️</span>
                            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.gold,fontWeight:300}}>{w.rating}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{padding:"14px 16px"}}>
                      {!w.photos?.[0]&&(
                        <>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,flex:1,paddingRight:8}}>{w.name}</div>
                            <div style={{display:"flex",alignItems:"center",gap:4}}>
                              <span style={{fontSize:11}}>❤️</span>
                              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:isDeg?C.sepia:C.goldD,fontWeight:300}}>{w.rating}</span>
                            </div>
                          </div>
                          <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:10}}>{w.producer} · {w.vintage}</div>
                        </>
                      )}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <div style={{width:2,height:12,background:isDeg?C.sepia:C.goldD,borderRadius:1,opacity:0.5}} />
                          <span style={{fontFamily:"'DM Sans'",fontSize:9,color:isDeg?C.sepia:C.goldD,background:isDeg?C.sepiaL:C.goldL,padding:"3px 9px",borderRadius:20,letterSpacing:"0.08em",textTransform:"uppercase"}}>{isDeg?"Degustado":w.style}</span>
                          {w.special&&<span style={{color:C.goldD,fontSize:11}}>★</span>}
                        </div>
                        {!isDeg&&<Qty value={w.bottles} onChange={v=>update({...w,bottles:v})} accent={C.goldD} />}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      ):(
        <div style={{padding:"0 24px"}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR TIPO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:32}}>
            {[{label:"Tinto",cor:C.wine},{label:"Branco",cor:C.goldD},{label:"Rose",cor:"#B05070"},{label:"Espumante",cor:C.green},{label:"Especiais",cor:C.goldD},{label:"Todos",cor:C.muted}].map(({label,cor})=>{
              const count=label==="Todos"?winesAtivos.length:contaTipo(label);
              return (
                <button key={label} onClick={()=>setFiltroAtivo(label)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"18px 16px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:6}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:cor}}>{label}</div>
                  <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.06em"}}>{count} rótulo{count!==1?"s":""}</div>
                </button>
              );
            })}
            <button onClick={()=>setFiltroAtivo("Degustados")} style={{background:C.card,border:`1px solid rgba(122,92,58,0.2)`,borderRadius:8,padding:"18px 16px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:6}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:C.sepia}}>Degustados</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.06em"}}>{winesDegustados.length} rótulo{winesDegustados.length!==1?"s":""}</div>
            </button>
          </div>

          {filtroCasta.length>0&&<>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR CASTA</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
              {filtroCasta.map(c=>(
                <button key={c} onClick={()=>setFiltroAtivo(c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text,fontStyle:c==="Blend"?"italic":"normal"}}>{c}</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{contaCasta(c)} rótulo{contaCasta(c)!==1?"s":""}</span>
                </button>
              ))}
            </div>
          </>}

          {filtrosPais.length>0&&<>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>POR PAÍS</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {filtrosPais.map(p=>(
                <button key={p} onClick={()=>setFiltroAtivo(p)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.text}}>{p}</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{contaPais(p)} rótulo{contaPais(p)!==1?"s":""}</span>
                </button>
              ))}
            </div>
          </>}
        </div>
      )}
    </div>
  );
};

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [capa, setCapa] = useState(true);
  const [tab, setTab] = useState("adega");
  const [wines, setWines] = useState([]);
  const [vineyard] = useState(VINHO0);
  const [memories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    loadFromServer().then(data=>{
      if(data){
        setWines(data.wines||[]);
      }
      setLoading(false);
    });
  },[]);

  useEffect(()=>{
    if(loading) return;
    saveToServer({wines,vineyard,memories});
  },[wines,loading]);

  const tabs=[{id:"adega",icon:"🍷",label:"Adega"},{id:"mapa",icon:"🌍",label:"Mapa"},{id:"memorias",icon:"❤️",label:"Memórias"}];

  if(loading) return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:"#0D0D0F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <style>{G}</style>
      <SimboloMemoravin size={48} color="#C9A46E" strokeWidth={2} />
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,letterSpacing:"0.25em",color:"#F2EDE2"}}>MEMORAVIN</div>
    </div>
  );

  if(capa) return (
    <>
      <style>{G}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0D0D0F}`}</style>
      <div style={{maxWidth:430,margin:"0 auto",height:"100vh",position:"relative"}}>
        <Capa onEntrar={()=>setCapa(false)} />
      </div>
    </>
  );

  return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}input,textarea,select{-webkit-appearance:none}::placeholder{color:#C4BAB0}body{background:#F7F3EE}`}</style>

      {/* Header */}
      <div style={{padding:"16px 24px 14px",borderBottom:`1px solid ${C.border}`,background:C.card,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <SimboloMemoravin size={28} color={C.goldD} strokeWidth={2} />
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,letterSpacing:"0.18em",color:C.text}}>MEMORAVIN</span>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:8,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase"}}>Adega & Memórias</div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="adega"&&<TabAdega wines={wines} setWines={setWines} />}
        {tab==="mapa"&&<TabMapa wines={wines} />}
        {tab==="memorias"&&<TabMemorias wines={wines} />}
      </div>

      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.card,borderTop:`1px solid ${C.border}`,paddingTop:"10px",paddingBottom:"calc(12px + env(safe-area-inset-bottom))",display:"flex",justifyContent:"space-around",zIndex:40}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}>
            <span style={{fontSize:18,color:tab===t.id?C.goldD:C.muted}}>{t.icon}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:tab===t.id?C.goldD:C.muted,fontWeight:tab===t.id?500:300}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
