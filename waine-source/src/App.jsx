import { useState, useRef, useEffect } from "react";

const G = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const C = { bg:"#F7F3EE", card:"#FFFFFF", border:"rgba(0,0,0,0.07)", text:"#1A1410", sub:"#6B5F54", muted:"#A89B8E", red:"#8B1F2A", redL:"rgba(139,31,42,0.08)", gold:"#9A6B2E", goldL:"rgba(154,107,46,0.1)", green:"#2A6040", greenL:"rgba(42,96,64,0.08)", sepia:"#7A5C3A", sepiaL:"rgba(122,92,58,0.08)" };

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
const sAccent = s => s==="Branco"?C.gold:s==="Rose"?"#B05070":s==="Espumante"?"#2A7060":C.red;
const sLabel  = s => s==="Branco"?C.goldL:s==="Rose"?"rgba(176,80,112,0.1)":s==="Espumante"?"rgba(42,112,96,0.1)":C.redL;

const getCastaFiltro = (grapes) => {
  if (!grapes) return null;
  const lista = grapes.split(",").map(g=>g.trim()).filter(Boolean);
  if (lista.length > 1) return "Blend";
  return lista[0] || null;
};

// ── Lightbox ───────────────────────────────────────────────────────────────────
const Lightbox = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:"#fff",fontSize:32,cursor:"pointer",lineHeight:1}}>×</button>
      <img src={url} onClick={e=>e.stopPropagation()} style={{maxWidth:"95vw",maxHeight:"90vh",objectFit:"contain",borderRadius:8}} />
    </div>
  );
};

// Coordenadas países no mapa
const PAIS_COORDS = {
  "África do Sul": { x: 530, y: 375 },
  "Argentina": { x: 265, y: 385 },
  "Austrália": { x: 820, y: 385 },
  "Áustria": { x: 515, y: 170 },
  "Brasil": { x: 295, y: 335 },
  "Chile": { x: 250, y: 390 },
  "Espanha": { x: 458, y: 192 },
  "Estados Unidos": { x: 170, y: 195 },
  "França": { x: 473, y: 182 },
  "Grécia": { x: 535, y: 198 },
  "Hungria": { x: 522, y: 172 },
  "Itália": { x: 508, y: 192 },
  "Nova Zelândia": { x: 878, y: 425 },
  "Portugal": { x: 448, y: 198 },
  "Alemanha": { x: 488, y: 168 },
  "Uruguai": { x: 282, y: 388 },
};

// ── Mapa ───────────────────────────────────────────────────────────────────────
const TabMapa = ({ wines }) => {
  const [tooltip, setTooltip] = useState(null);
  const winesAtivos = wines.filter(w => w.bottles > 0);

  const porPais = winesAtivos.reduce((acc, w) => {
    if (!w.country) return acc;
    if (!acc[w.country]) acc[w.country] = { rotulos:0, garrafas:0 };
    acc[w.country].rotulos += 1;
    acc[w.country].garrafas += w.bottles;
    return acc;
  }, {});

  const maxGarrafas = Math.max(...Object.values(porPais).map(p=>p.garrafas), 1);
  const getR = (g) => 18 + ((g/maxGarrafas) * 22);

  const paisesComCoords = Object.entries(porPais).map(([pais,dados])=>({
    pais, ...dados, coords: PAIS_COORDS[pais]||null
  })).filter(p=>p.coords);

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"24px 20px 16px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>MAPA DA ADEGA</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1}}>
          {Object.keys(porPais).length} <span style={{fontWeight:300,fontSize:20,color:C.sub}}>países</span>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginTop:2}}>{winesAtivos.reduce((a,b)=>a+b.bottles,0)} garrafas em estoque</div>
      </div>

      <div style={{padding:"0 12px",marginBottom:20}}>
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

            {paisesComCoords.map(({ pais, garrafas, rotulos, coords }) => {
              const r = getR(garrafas);
              const isSelected = tooltip?.pais === pais;
              return (
                <g key={pais} style={{cursor:"pointer"}} onClick={()=>setTooltip(isSelected?null:{pais,garrafas,rotulos,coords})}>
                  <circle cx={coords.x} cy={coords.y} r={r} fill={isSelected?"#6B1A22":C.red} fillOpacity={0.85} stroke="#fff" strokeWidth="2"/>
                  <text x={coords.x} y={coords.y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={r>28?14:11} fontFamily="'Cormorant Garamond',serif" fontWeight="600">{garrafas}</text>
                </g>
              );
            })}

            {tooltip&&(
              <g>
                <rect x={Math.min(tooltip.coords.x+10,820)} y={tooltip.coords.y-42} width="165" height="54" rx="6" fill="#1A1410" fillOpacity="0.88"/>
                <text x={Math.min(tooltip.coords.x+92,902)} y={tooltip.coords.y-22} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1">{tooltip.pais.toUpperCase()}</text>
                <text x={Math.min(tooltip.coords.x+92,902)} y={tooltip.coords.y-4} textAnchor="middle" fill="#A89B8E" fontSize="10" fontFamily="'DM Sans',sans-serif">{tooltip.rotulos} rótulo{tooltip.rotulos!==1?"s":""} · {tooltip.garrafas} garrafa{tooltip.garrafas!==1?"s":""}</text>
              </g>
            )}
          </svg>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,textAlign:"center",marginTop:8,letterSpacing:"0.06em"}}>Toque num país para ver detalhes</div>
      </div>

      <div style={{padding:"0 20px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>POR PAÍS</div>
        {Object.entries(porPais).sort((a,b)=>b[1].garrafas-a[1].garrafas).map(([pais,dados])=>(
          <div key={pais} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 18px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:2}}>{pais}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted}}>{dados.rotulos} rótulo{dados.rotulos!==1?"s":""}</div>
            </div>
            <div style={{width:38,height:38,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:"#fff"}}>{dados.garrafas}</span>
            </div>
          </div>
        ))}
        {Object.keys(porPais).length===0&&(
          <div style={{textAlign:"center",padding:"40px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Adiciona vinhos para ver o mapa</div>
        )}
      </div>
    </div>
  );
};

// ── Memórias — Top 20 experiências ────────────────────────────────────────────
const TabMemorias = ({ wines }) => {
  const [detail, setDetail] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const top20 = [...wines]
    .filter(w => w.memory && w.rating > 0)
    .sort((a,b) => (b.rating||0) - (a.rating||0))
    .slice(0, 20);

  if (detail) {
    const w = detail;
    return (
      <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
        <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
        <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",zIndex:10}}>
          <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:12,letterSpacing:"0.08em",color:C.sub,cursor:"pointer",padding:0}}>← MEMÓRIAS</button>
        </div>
        <div style={{padding:"28px 20px 80px"}}>
          {w.photos?.[0]&&(
            <img src={w.photos[0]} onClick={()=>setLightbox(w.photos[0])}
              style={{width:"100%",height:200,objectFit:"cover",borderRadius:10,marginBottom:24,border:`1px solid ${C.border}`,cursor:"zoom-in"}} />
          )}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <span style={{fontSize:22}}>❤️</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:C.red,lineHeight:1}}>{w.rating}</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:C.text,marginBottom:4}}>{w.name}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,marginBottom:20}}>{w.producer} · {w.vintage}</div>
          {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginBottom:20}}>📍 {w.location} · {w.date}</div>}
          <div style={{background:C.card,borderRadius:10,padding:"20px",border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>MINHA MEMÓRIA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>"{w.memory}"</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"24px 20px 0",marginBottom:20}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>MEMÓRIAS</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1}}>
          Top <span style={{fontWeight:300,fontSize:20,color:C.sub}}>experiências</span>
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginTop:2}}>As {top20.length} maiores emoções da adega</div>
      </div>

      <div style={{padding:"0 20px"}}>
        {top20.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 0"}}>
            <div style={{fontSize:36,marginBottom:16}}>❤️</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>As tuas memórias vinícolas aparecerão aqui</div>
            <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginTop:8}}>Adiciona uma memória ao registar ou editar um vinho</div>
          </div>
        ) : top20.map((w, i) => (
          <div key={w.id} onClick={()=>setDetail(w)}
            style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",display:"flex",alignItems:"stretch"}}>
            <div style={{width:52,background:i===0?C.red:i===1?"#B8860B":i===2?C.sepia:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,color:i<3?"#fff":C.muted,fontWeight:600}}>#{i+1}</span>
              <span style={{fontSize:14}}>❤️</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:i<3?"#fff":C.red}}>{w.rating}</span>
            </div>
            <div style={{flex:1,padding:"14px 16px",minWidth:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.text,lineHeight:1.2,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.name}</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:8}}>{w.producer} · {w.vintage}</div>
              {w.memory&&(
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.sub,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>"{w.memory}"</div>
              )}
              {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,marginTop:6}}>📍 {w.location}</div>}
            </div>
            {w.photos?.[0]&&(
              <img src={w.photos[0]} style={{width:64,objectFit:"cover",flexShrink:0}} />
            )}
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
  const [err, setErr] = useState("");
  const handle = async e => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true); setErr("");
    try { onChange([...photos, await uploadToCloudinary(file)].slice(0,max)); }
    catch { setErr("Erro ao fazer upload."); }
    setBusy(false); e.target.value="";
  };
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>FOTOS DO RÓTULO (até {max})</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {photos.map((url,i)=>(
          <div key={i} style={{position:"relative"}}>
            <img src={url} style={{width:90,height:120,objectFit:"cover",borderRadius:6,border:`1px solid ${C.border}`,display:"block"}} />
            <button onClick={()=>onChange(photos.filter((_,j)=>j!==i))} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:C.red,border:"2px solid #fff",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
          </div>
        ))}
        {photos.length<max&&(
          <div onClick={()=>!busy&&ref.current.click()} style={{width:90,height:120,border:`2px dashed ${busy?C.gold:C.border}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:busy?"wait":"pointer",gap:6,background:busy?C.goldL:"transparent"}}>
            <span style={{fontSize:24}}>{busy?"...":"📷"}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted}}>{busy?"ENVIANDO":"FOTO"}</span>
          </div>
        )}
      </div>
      {err&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.red,marginTop:6}}>{err}</div>}
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}} />
    </div>
  );
};

const Qty = ({ value, onChange, accent }) => (
  <div style={{display:"flex",alignItems:"center",background:C.bg,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden"}}>
    <button onClick={e=>{e.stopPropagation();onChange(Math.max(0,value-1));}} style={{width:34,height:34,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:accent,minWidth:28,textAlign:"center"}}>{value}</span>
    <button onClick={e=>{e.stopPropagation();onChange(value+1);}} style={{width:34,height:34,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
  </div>
);

const NotasTopicos = ({ notas }) => {
  if (!notas) return null;
  let topicos = null;
  try { topicos = typeof notas === "object" ? notas : JSON.parse(notas); } catch {}
  const labels = { aromas:"🌸 Aromas", paladar:"👄 Paladar", estrutura:"⚖️ Estrutura", guarda:"⏳ Guarda", harmonizacao:"🍽️ Harmonização" };
  if (topicos && typeof topicos === "object") {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {Object.entries(topicos).map(([k,v])=> v ? (
          <div key={k} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontFamily:"'DM Sans'",fontSize:10,color:C.gold,letterSpacing:"0.06em",minWidth:90,paddingTop:2,flexShrink:0}}>{labels[k]||k}</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.6,flex:1}}>{v}</span>
          </div>
        ) : null)}
      </div>
    );
  }
  return <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{notas}</div>;
};

const VoiceButton = ({ onResult }) => {
  const [ouvindo, setOuvindo] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Seu browser não suporta reconhecimento de voz."); return; }
    if (ouvindo) { recRef.current?.stop(); setOuvindo(false); return; }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = e => { onResult(e.results[0][0].transcript); setOuvindo(false); };
    rec.onerror = () => setOuvindo(false);
    rec.onend = () => setOuvindo(false);
    recRef.current = rec;
    rec.start();
    setOuvindo(true);
  };
  return (
    <button onClick={toggle} title={ouvindo?"Parar":"Falar em português"}
      style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${ouvindo?C.red:C.border}`,background:ouvindo?C.redL:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:16}}>{ouvindo?"⏹":"🎙️"}</span>
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
  const isDegustado = w.bottles === 0;
  const accentColor = isDegustado ? C.sepia : (w.accent||C.red);

  const corrigirComIA = async () => {
    if (!aiPrompt.trim()) return;
    setAiBusy(true); setAiMsg("Corrigindo com IA...");
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{ role:"user", content:`Você é um sommelier especialista. Tenho uma ficha de vinho:
Nome: ${f.name} | Produtor: ${f.producer} | Safra: ${f.vintage}
Região: ${f.region} | País: ${f.country} | Uvas: ${f.grapes} | Estilo: ${f.style}
História: ${typeof f.historia === "string" ? f.historia : ""}
Notas: ${typeof f.notas === "object" ? JSON.stringify(f.notas) : f.notas || ""}

O usuário quer corrigir: "${aiPrompt}"

Retorne APENAS JSON válido sem markdown com os campos que mudaram:
{
  "region":"...","country":"...","grapes":"...","style":"...",
  "historia":"...",
  "notas":{"aromas":"...","paladar":"...","estrutura":"...","guarda":"...","harmonizacao":"..."}
}` }]
        })
      });
      const d = await res.json();
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed}));
      setAiMsg("✓ Ficha corrigida! Revise e salve.");
    } catch(e) { setAiMsg("Erro: " + e.message); }
    setAiBusy(false);
  };

  const notasObj = (typeof f.notas === "object" && f.notas) ? f.notas : { aromas:"", paladar:"", estrutura:"", guarda:"", harmonizacao:"" };
  const labelsNotas = { aromas:"🌸 Aromas", paladar:"👄 Paladar", estrutura:"⚖️ Estrutura", guarda:"⏳ Guarda", harmonizacao:"🍽️ Harmonização" };

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
      <Lightbox url={lightbox} onClose={()=>setLightbox(null)} />
      <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:12,letterSpacing:"0.08em",color:C.sub,cursor:"pointer",padding:0}}>← ADEGA</button>
        <button onClick={()=>editing?save():setEditing(true)} style={{background:editing?C.red:"none",border:`1px solid ${editing?C.red:C.border}`,borderRadius:4,padding:"7px 18px",fontFamily:"'DM Sans'",fontSize:11,color:editing?"#fff":C.sub,cursor:"pointer"}}>
          {editing?"SALVAR":"EDITAR"}
        </button>
        {!editing&&<button onClick={()=>{if(window.confirm("Apagar este vinho?"))onDelete(w.id);}} style={{background:"none",border:"1px solid rgba(139,31,42,0.3)",borderRadius:4,padding:"7px 14px",fontFamily:"'DM Sans'",fontSize:11,color:C.red,cursor:"pointer"}}>🗑</button>}
      </div>
      <div style={{padding:"28px 20px 100px"}}>
        {isDegustado&&(
          <div style={{background:C.sepiaL,border:`1px solid ${C.sepia}30`,borderRadius:8,padding:"10px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🍷</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:11,color:C.sepia,letterSpacing:"0.08em"}}>DEGUSTADO · Memória preservada</span>
          </div>
        )}
        {editing
          ? <PhotoUploader photos={f.photos||[]} onChange={v=>set("photos",v)} />
          : f.photos?.length>0&&(
            <div style={{display:"flex",gap:12,marginBottom:28}}>
              {f.photos.map((url,i)=>(
                <img key={i} src={url} onClick={()=>setLightbox(url)}
                  style={{width:130,height:170,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",filter:isDegustado?"sepia(30%)":"none",cursor:"zoom-in"}} />
              ))}
            </div>
          )
        }
        <div style={{width:28,height:3,background:accentColor,marginBottom:20,borderRadius:1}} />
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>{w.style} · {w.country}</div>
        {editing
          ? <input value={f.name} onChange={e=>set("name",e.target.value)} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",marginBottom:8,boxSizing:"border-box"}} />
          : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:600,color:C.text,lineHeight:1.1,marginBottom:6}}>{w.name}</div>
        }
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.sub,marginBottom:28}}>{w.producer}, {w.vintage}</div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:28}}>❤️</span>
            {editing
              ? <input type="number" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:72,fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:300,color:accentColor,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none"}} />
              : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:60,color:accentColor,fontWeight:300,lineHeight:1}}>{w.rating}</div>
            }
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>GARRAFAS</div>
            <Qty value={editing?f.bottles:w.bottles} onChange={v=>{set("bottles",v);if(!editing)onUpdate({...w,bottles:v});}} accent={accentColor} />
          </div>
        </div>

        {editing&&(
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>❤️ EMOÇÃO — {f.rating}</div>
            <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.red}} />
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:32,borderRadius:4,overflow:"hidden"}}>
          {[["REGIÃO","region"],["PAÍS","country"],["UVAS","grapes"],["ADQUIRIDO","date"]].map(([l,k])=>(
            <div key={k} style={{background:C.card,padding:"14px 16px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
              {editing
                ? <input value={f[k]||""} onChange={e=>set(k,e.target.value)} style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box"}} />
                : <div style={{fontFamily:"'DM Sans'",fontSize:13,color:C.sub}}>{w[k]}</div>
              }
            </div>
          ))}
        </div>

        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>MINHA MEMÓRIA</div>
        {editing
          ? <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
              <textarea value={f.memory||""} onChange={e=>set("memory",e.target.value)} rows={4}
                placeholder="Onde estava, com quem, o que sentiu..."
                style={{flex:1,fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card,outline:"none",padding:14,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
              <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
            </div>
          : w.memory&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontStyle:"italic",color:C.sub,lineHeight:1.85,marginBottom:12}}>"{w.memory}"</div>
        }
        {w.location&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:8,marginBottom:32}}>📍 {w.location}</div>}

        {(editing?f.historia:w.historia)&&(
          <div style={{marginBottom:20,padding:"18px",background:"#F9F6F2",borderRadius:8,border:"1px solid rgba(154,107,46,0.15)"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>O PRODUTOR</div>
            {editing
              ? <textarea value={f.historia||""} onChange={e=>set("historia",e.target.value)} rows={4} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,border:`1px solid ${C.border}`,borderRadius:4,background:"#F9F6F2",outline:"none",padding:10,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
              : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{w.historia}</div>
            }
          </div>
        )}
        {(editing?f.notas:w.notas)&&(
          <div style={{marginBottom:20,padding:"18px",background:"#F9F6F2",borderRadius:8,border:"1px solid rgba(139,31,42,0.12)"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.red,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>O VINHO</div>
            {editing
              ? <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {Object.keys(labelsNotas).map(k=>(
                    <div key={k}>
                      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{labelsNotas[k]}</div>
                      <input value={notasObj[k]||""} onChange={e=>set("notas",{...notasObj,[k]:e.target.value})} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box",paddingBottom:4}} />
                    </div>
                  ))}
                </div>
              : <NotasTopicos notas={w.notas} />
            }
          </div>
        )}
        {editing&&(
          <div style={{marginBottom:20,padding:"16px",background:C.redL,borderRadius:8,border:`1px solid rgba(139,31,42,0.15)`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.red,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>✦ CORRIGIR COM IA</div>
            <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} rows={2}
              placeholder='ex: "Este vinho é da África do Sul, não da França."'
              style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:`1px solid rgba(139,31,42,0.2)`,borderRadius:4,background:"#fff",outline:"none",padding:"10px 12px",resize:"none",boxSizing:"border-box",marginBottom:10}} />
            <button onClick={corrigirComIA} disabled={aibusy||!aiPrompt.trim()} style={{width:"100%",padding:"10px",background:C.red,border:"none",borderRadius:4,color:"#fff",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",opacity:!aiPrompt.trim()?0.5:1}}>
              {aibusy?"Corrigindo...":"Corrigir com IA"}
            </button>
            {aiMsg&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:aiMsg.startsWith("✓")?C.green:C.red,marginTop:8}}>{aiMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Add Wine ───────────────────────────────────────────────────────────────────
const AddWine = ({ onClose, onSave }) => {
  const [f, setF] = useState({ name:"", producer:"", vintage:2024, region:"", country:"Africa do Sul", grapes:"", style:"Tinto", bottles:1, rating:50, memory:"", location:"", accent:C.red, special:false, photos:[], historia:"", notas:null });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ msg:"", ok:false });
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const enrich = async () => {
    if(!f.name||!f.producer) return;
    setBusy(true); setStatus({msg:"Pesquisando vinho e produtor...",ok:false});
    try {
      const res = await fetch("/api/claude",{ method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{ role:"user", content:`Você é um sommelier especialista. Para o vinho "${f.name}" do produtor "${f.producer}" safra ${f.vintage}, retorne APENAS JSON válido sem markdown:
{
  "region": "região vinícola",
  "country": "país em português",
  "grapes": "uvas separadas por vírgula — se for varietal coloque apenas uma uva, se for blend coloque todas separadas por vírgula",
  "style": "Tinto|Branco|Rose|Espumante|Sobremesa",
  "accent": "#hexcolor escuro da cor real do vinho",
  "historia": "Parágrafo rico de 3-4 frases sobre história e filosofia do produtor. Português, tom sofisticado.",
  "notas": {
    "aromas": "Descrição curta dos aromas principais (1-2 linhas)",
    "paladar": "Sensações na boca, textura, sabores (1-2 linhas)",
    "estrutura": "Taninos, acidez, corpo, álcool (1 linha)",
    "guarda": "Potencial de guarda e quando beber (1 linha)",
    "harmonizacao": "Sugestão de harmonização gastronômica (1 linha)"
  }
}` }]
        })
      });
      const d = await res.json();
      if(d.error) { setStatus({msg:"API: "+d.error.message,ok:false}); setBusy(false); return; }
      const parsed = JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
      setF(p=>({...p,...parsed}));
      setStatus({msg:"Ficha completa! Adiciona a tua memória emocional.",ok:true});
    } catch(e) { setStatus({msg:"Erro: "+(e.message||String(e)),ok:false}); }
    setBusy(false);
  };

  const inp = (label,k,type="text",ph="") => (
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <input type={type} value={f[k]} placeholder={ph} onChange={e=>set(k,type==="number"?+e.target.value:e.target.value)}
        style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.4)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:"24px 20px 48px",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{width:36,height:3,background:C.border,borderRadius:2,margin:"0 auto 24px"}} />
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.text,marginBottom:4}}>Novo Vinho</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginBottom:24}}>Foto do rótulo + nome + produtor — IA gera a ficha completa.</div>
        <PhotoUploader photos={f.photos} onChange={v=>set("photos",v)} />
        {inp("Nome do Vinho","name","text","ex: Paul Sauer")}
        {inp("Produtor","producer","text","ex: Kanonkop")}
        {inp("Safra (opcional)","vintage","number")}
        <button onClick={enrich} disabled={busy||!f.name||!f.producer}
          style={{width:"100%",padding:14,marginBottom:16,background:status.ok?C.greenL:C.redL,border:`1px solid ${status.ok?C.green:C.red}`,borderRadius:6,color:status.ok?C.green:C.red,fontFamily:"'DM Sans'",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",opacity:(!f.name||!f.producer)?0.4:1}}>
          {busy?"✦ Pesquisando...":status.ok?"✓ Ficha gerada":"✦ Gerar ficha com IA"}
        </button>
        {status.msg&&<div style={{fontFamily:"'DM Sans'",fontSize:12,color:busy?C.gold:status.ok?C.green:C.red,background:busy?C.goldL:status.ok?C.greenL:C.redL,padding:"10px 14px",borderRadius:6,marginBottom:16}}>{status.msg}</div>}
        {f.historia&&(
          <div style={{marginBottom:16,padding:"16px",background:"#F9F6F2",borderRadius:8,border:`1px solid rgba(154,107,46,0.15)`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>O PRODUTOR</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.historia}</div>
          </div>
        )}
        {f.notas&&(
          <div style={{marginBottom:16,padding:"16px",background:"#F9F6F2",borderRadius:8,border:`1px solid rgba(139,31,42,0.12)`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.red,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>O VINHO</div>
            <NotasTopicos notas={f.notas} />
          </div>
        )}
        {status.ok&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:16,borderRadius:4,overflow:"hidden"}}>
            {[["REGIÃO",f.region],["PAÍS",f.country],["UVAS",f.grapes],["ESTILO",f.style]].map(([l,v])=>(
              <div key={l} style={{background:C.card,padding:"12px 14px"}}>
                <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>GARRAFAS NA ADEGA</div>
          <Qty value={f.bottles} onChange={v=>set("bottles",v)} accent={C.red} />
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>❤️ EMOÇÃO — {f.rating}</div>
          <input type="range" min={0} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.red}} />
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>MINHA MEMÓRIA</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <textarea value={f.memory} onChange={e=>set("memory",e.target.value)} rows={3} placeholder="Onde estava, com quem, o que sentiu..."
              style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box"}} />
            <VoiceButton onResult={txt=>set("memory",(f.memory?f.memory+" ":"")+txt)} />
          </div>
        </div>
        {inp("Local / Vinícola","location")}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,cursor:"pointer"}} onClick={()=>set("special",!f.special)}>
          <div style={{width:20,height:20,border:`1.5px solid ${f.special?C.gold:C.border}`,borderRadius:4,background:f.special?C.goldL:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {f.special&&<span style={{color:C.gold,fontSize:14}}>★</span>}
          </div>
          <span style={{fontFamily:"'DM Sans'",fontSize:13,color:C.sub}}>Marcar como especial</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:13,background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.sub,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer"}}>CANCELAR</button>
          <button onClick={()=>{if(!f.name)return;onSave({...f,id:Date.now(),date:new Date().toLocaleDateString("pt-BR",{month:"short",year:"numeric"})});}}
            style={{flex:2,padding:13,background:C.red,border:"none",borderRadius:6,color:"#fff",fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer"}}>
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
  const update = u => setWines(ws=>ws.map(w=>w.id===u.id?u:w));

  const tipos = ["Tinto","Branco","Rose","Espumante","Sobremesa"];
  const winesAtivos = wines.filter(w => w.bottles > 0);
  const winesDegustados = wines.filter(w => w.bottles === 0);

  const filtroCasta = winesAtivos.reduce((acc, w) => {
    const cf = getCastaFiltro(w.grapes);
    if (cf && !acc.includes(cf)) acc.push(cf);
    return acc;
  }, []).sort((a,b) => a==="Blend"?-1:b==="Blend"?1:a.localeCompare(b));

  const filtrosPais = [...new Set(winesAtivos.map(w=>w.country).filter(Boolean))].sort();

  const winesFiltrados = (() => {
    if (!filtroAtivo) return [];
    if (filtroAtivo==="Degustados") return winesDegustados.filter(w=>{
      const q=search.toLowerCase();
      return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);
    });
    const base = filtroAtivo==="Todos" ? winesAtivos
      : filtroAtivo==="Especiais" ? winesAtivos.filter(w=>w.special)
      : tipos.includes(filtroAtivo) ? winesAtivos.filter(w=>w.style===filtroAtivo)
      : filtroCasta.includes(filtroAtivo) ? winesAtivos.filter(w=>getCastaFiltro(w.grapes)===filtroAtivo)
      : filtrosPais.includes(filtroAtivo) ? winesAtivos.filter(w=>w.country===filtroAtivo)
      : winesAtivos;
    return base.filter(w=>{
      const q=search.toLowerCase();
      return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q);
    });
  })();

  const total = winesAtivos.reduce((a,b)=>a+b.bottles,0);
  const contaTipo = t => t==="Especiais"?winesAtivos.filter(w=>w.special).length:winesAtivos.filter(w=>w.style===t).length;
  const contaCasta = c => winesAtivos.filter(w=>getCastaFiltro(w.grapes)===c).length;
  const contaPais = p => winesAtivos.filter(w=>w.country===p).length;

  if(detail){ const live=wines.find(w=>w.id===detail.id)||detail;
    return <WineDetail w={live} onBack={()=>setDetail(null)} onUpdate={update} onDelete={id=>{setWines(ws=>ws.filter(w=>w.id!==id));setDetail(null);}} />; }

  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      {adding&&<AddWine onClose={()=>setAdding(false)} onSave={w=>{setWines(p=>[...p,w]);setAdding(false);}} />}
      <div style={{padding:"24px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>ADEGA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1}}>
              {winesAtivos.length} <span style={{fontWeight:300,fontSize:20,color:C.sub}}>rótulos</span>
            </div>
            <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginTop:2}}>{total} garrafas · {winesDegustados.length} degustados</div>
          </div>
          <button onClick={()=>setAdding(true)} style={{background:C.red,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:24,boxShadow:"0 2px 12px rgba(139,31,42,0.3)"}}>+</button>
        </div>
      </div>

      {filtroAtivo ? (
        <div>
          <div style={{padding:"0 20px",marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              <button onClick={()=>{setFiltroAtivo(null);setSearch("");}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 14px",fontFamily:"'DM Sans'",fontSize:11,color:C.sub,cursor:"pointer"}}>← Filtros</button>
              <span style={{fontFamily:"'DM Sans'",fontSize:11,color:filtroAtivo==="Degustados"?C.sepia:C.red,background:filtroAtivo==="Degustados"?C.sepiaL:C.redL,padding:"6px 14px",borderRadius:20,letterSpacing:"0.06em"}}>
                {filtroAtivo} · {winesFiltrados.length}
              </span>
            </div>
            <div style={{position:"relative"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar na seleção..."
                style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px 10px 36px",color:C.text,fontFamily:"'DM Sans'",fontSize:13,outline:"none",boxSizing:"border-box"}} />
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>🔍</span>
            </div>
          </div>
          <div style={{padding:"0 20px"}}>
            {winesFiltrados.length===0
              ? <div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Nenhum vinho encontrado</div>
              : winesFiltrados.map(w=>{
                const isDeg = w.bottles===0;
                return (
                  <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${isDeg?C.sepia+"30":C.border}`,borderRadius:8,marginBottom:10,cursor:"pointer",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                    {w.photos?.[0]&&(
                      <div style={{position:"relative",height:160,overflow:"hidden"}}>
                        <img src={w.photos[0]} style={{width:"100%",height:"100%",objectFit:"cover",filter:isDeg?"sepia(40%)":"none"}} />
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6) 100%)"}} />
                        <div style={{position:"absolute",bottom:12,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                          <div>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#fff",lineHeight:1.2}}>{w.name}</div>
                            <div style={{fontFamily:"'DM Sans'",fontSize:11,color:"rgba(255,255,255,0.75)"}}>{w.producer} · {w.vintage}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{fontSize:14}}>❤️</span>
                            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#fff",fontWeight:300}}>{w.rating}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{padding:"14px 16px"}}>
                      {!w.photos?.[0]&&(
                        <>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.text,flex:1,paddingRight:8}}>{w.name}</div>
                            <div style={{display:"flex",alignItems:"center",gap:4}}>
                              <span style={{fontSize:12}}>❤️</span>
                              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:isDeg?C.sepia:(w.accent||C.red),fontWeight:400}}>{w.rating}</span>
                            </div>
                          </div>
                          <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:10}}>{w.producer} · {w.vintage}</div>
                        </>
                      )}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <div style={{width:3,height:14,background:isDeg?C.sepia:(w.accent||C.red),borderRadius:1,opacity:0.7}} />
                          <span style={{fontFamily:"'DM Sans'",fontSize:10,color:isDeg?C.sepia:sAccent(w.style),background:isDeg?C.sepiaL:sLabel(w.style),padding:"3px 9px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase"}}>{isDeg?"Degustado":w.style}</span>
                          {w.special&&<span style={{color:C.gold,fontSize:12}}>★</span>}
                        </div>
                        {!isDeg&&<Qty value={w.bottles} onChange={v=>update({...w,bottles:v})} accent={w.accent||C.red} />}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      ) : (
        <div style={{padding:"0 20px"}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>POR TIPO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
            {[
              {label:"Tinto",cor:C.red},
              {label:"Branco",cor:C.gold},
              {label:"Rose",cor:"#B05070"},
              {label:"Espumante",cor:"#2A7060"},
              {label:"Especiais",cor:C.gold},
              {label:"Todos",cor:C.sub},
            ].map(({label,cor})=>{
              const count = label==="Todos"?winesAtivos.length:contaTipo(label);
              return (
                <button key={label} onClick={()=>setFiltroAtivo(label)}
                  style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:4}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:cor}}>{label}</div>
                  <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{count} rótulo{count!==1?"s":""}</div>
                </button>
              );
            })}
            <button onClick={()=>setFiltroAtivo("Degustados")}
              style={{background:C.sepiaL,border:`1px solid ${C.sepia}25`,borderRadius:10,padding:"16px 18px",display:"flex",flexDirection:"column",cursor:"pointer",textAlign:"left",gap:4}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:C.sepia}}>Degustados</div>
              <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted}}>{winesDegustados.length} rótulo{winesDegustados.length!==1?"s":""}</div>
            </button>
          </div>

          {filtroCasta.length>0&&(
            <>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>POR CASTA</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
                {filtroCasta.map(c=>(
                  <button key={c} onClick={()=>setFiltroAtivo(c)}
                    style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,fontStyle:c==="Blend"?"italic":"normal"}}>{c}</span>
                    <span style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted}}>{contaCasta(c)} rótulo{contaCasta(c)!==1?"s":""}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {filtrosPais.length>0&&(
            <>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>POR PAÍS</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {filtrosPais.map(p=>(
                  <button key={p} onClick={()=>setFiltroAtivo(p)}
                    style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text}}>{p}</span>
                    <span style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted}}>{contaPais(p)} rótulo{contaPais(p)!==1?"s":""}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("adega");
  const [wines, setWines] = useState([]);
  const [vineyard, setVineyard] = useState(VINHO0);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromServer().then(data => {
      if (data) {
        setWines(data.wines || []);
        if (data.vineyard?.length) setVineyard(data.vineyard);
        if (data.memories?.length) setMemories(data.memories);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    saveToServer({wines, vineyard, memories});
  }, [wines, vineyard, memories, loading]);

  const tabs = [
    {id:"adega", icon:"🍷", label:"Adega"},
    {id:"mapa", icon:"🌍", label:"Mapa"},
    {id:"memorias", icon:"❤️", label:"Memórias"},
  ];

  if (loading) return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <style>{G}</style>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,letterSpacing:"0.16em",color:C.text}}>W.AI.NE</div>
      <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,letterSpacing:"0.1em"}}>carregando adega...</div>
    </div>
  );

  return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}input,textarea,select{-webkit-appearance:none}::placeholder{color:#B0A090}body{background:#F7F3EE}`}</style>
      <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${C.border}`,background:C.card,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:"0.16em",color:C.text}}>W.AI.NE</span>
          <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em"}}>ADEGA INTELIGENTE</span>
        </div>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.red}} />
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="adega"&&<TabAdega wines={wines} setWines={setWines} />}
        {tab==="mapa"&&<TabMapa wines={wines} />}
        {tab==="memorias"&&<TabMemorias wines={wines} setWines={setWines} />}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.card,borderTop:`1px solid ${C.border}`,paddingTop:"10px",paddingBottom:"calc(14px + env(safe-area-inset-bottom))",display:"flex",justifyContent:"space-around",zIndex:40,boxShadow:"0 -4px 20px rgba(0,0,0,0.06)"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
            <span style={{fontSize:20,color:tab===t.id?C.red:C.muted}}>{t.icon}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:tab===t.id?C.red:C.muted,fontWeight:tab===t.id?600:400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
