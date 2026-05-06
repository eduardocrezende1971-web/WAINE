import { useState, useRef, useEffect } from "react";

const G = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const C = { bg:"#F7F3EE", card:"#FFFFFF", border:"rgba(0,0,0,0.07)", text:"#1A1410", sub:"#6B5F54", muted:"#A89B8E", red:"#8B1F2A", redL:"rgba(139,31,42,0.08)", gold:"#9A6B2E", goldL:"rgba(154,107,46,0.1)", green:"#2A6040", greenL:"rgba(42,96,64,0.08)" };

// ── Storage via Netlify Blobs ──────────────────────────────────────────────────
const loadFromServer = async () => {
  try {
    const res = await fetch("/api/save");
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
};

const saveToServer = async (data) => {
  try {
    // Save without photos to keep payload small
    const payload = {
      wines: data.wines?.map(w => ({...w, photos:[]})),
      vineyard: data.vineyard,
      memories: data.memories,
    };
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {}
};

// Photos stay in localStorage (base64 too large for server)
const LS_PHOTOS = "waine_photos_v1";
const loadPhotos = () => { try { return JSON.parse(localStorage.getItem(LS_PHOTOS)) || {}; } catch { return {}; } };
const savePhotos = (p) => { try { localStorage.setItem(LS_PHOTOS, JSON.stringify(p)); } catch {} };

const WINES0 = [];
const VINHO0 = [];
const MEM0 = [];

const sAccent = s => s==="Branco"?C.gold:s==="Rose"?"#B05070":s==="Espumante"?"#2A7060":C.red;
const sLabel  = s => s==="Branco"?C.goldL:s==="Rose"?"rgba(176,80,112,0.1)":s==="Espumante"?"rgba(42,112,96,0.1)":C.redL;
const mColor  = m => m==="Epico"?C.red:m==="Familia"?"#B05070":m==="Contemplativo"?C.gold:m==="Inesperado"?C.green:C.sub;

const readPhoto = file => new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsDataURL(file); });

// ── Photo Uploader ─────────────────────────────────────────────────────────────
const PhotoUploader = ({ photos, onChange, max=2 }) => {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const handle = async e => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true); setErr("");
    try { onChange([...photos, await readPhoto(file)].slice(0,max)); }
    catch { setErr("Erro ao carregar foto."); }
    setBusy(false); e.target.value="";
  };
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>FOTOS DO ROTULO (ate {max})</div>
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
            <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted}}>{busy?"CARREGANDO":"FOTO"}</span>
          </div>
        )}
      </div>
      {err&&<div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.red,marginTop:6}}>{err}</div>}
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}} />
    </div>
  );
};

// ── Qty Control ────────────────────────────────────────────────────────────────
const Qty = ({ value, onChange, accent }) => (
  <div style={{display:"flex",alignItems:"center",background:C.bg,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden"}}>
    <button onClick={e=>{e.stopPropagation();onChange(Math.max(0,value-1));}} style={{width:34,height:34,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:accent,minWidth:28,textAlign:"center"}}>{value}</span>
    <button onClick={e=>{e.stopPropagation();onChange(value+1);}} style={{width:34,height:34,border:"none",background:"none",cursor:"pointer",fontSize:18,color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
  </div>
);

// ── Field — defined OUTSIDE components to prevent remount ─────────────────────
const Field = ({ label, value, onChange, type="text", placeholder="" }) => (
  <div style={{marginBottom:16}}>
    <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
    <input type={type} value={value} placeholder={placeholder}
      onChange={e=>onChange(type==="number"?+e.target.value:e.target.value)}
      style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
  </div>
);

// ── Wine Detail ────────────────────────────────────────────────────────────────
const WineDetail = ({ w, onBack, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({...w});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { onUpdate(f); setEditing(false); };
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:50,overflowY:"auto"}}>
      <div style={{position:"sticky",top:0,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:12,letterSpacing:"0.08em",color:C.sub,cursor:"pointer",padding:0}}>ADEGA</button>
        <button onClick={()=>editing?save():setEditing(true)} style={{background:editing?C.red:"none",border:`1px solid ${editing?C.red:C.border}`,borderRadius:4,padding:"7px 18px",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.08em",color:editing?"#fff":C.sub,cursor:"pointer"}}>
          {editing?"SALVAR":"EDITAR"}
        </button>
        {!editing&&<button onClick={()=>{if(window.confirm("Apagar este vinho da adega?"))onDelete(w.id);}} style={{background:"none",border:"1px solid rgba(139,31,42,0.3)",borderRadius:4,padding:"7px 14px",fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.08em",color:C.red,cursor:"pointer"}}>🗑</button>}
      </div>
      <div style={{padding:"28px 20px 100px"}}>
        {editing
          ? <PhotoUploader photos={f.photos||[]} onChange={v=>set("photos",v)} />
          : f.photos?.length>0&&<div style={{display:"flex",gap:12,marginBottom:28}}>{f.photos.map((url,i)=><img key={i} src={url} style={{width:130,height:170,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`,boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}} />)}</div>
        }
        <div style={{width:28,height:3,background:w.accent,marginBottom:20,borderRadius:1}} />
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>{w.style} - {w.country}</div>
        {editing
          ? <input value={f.name} onChange={e=>set("name",e.target.value)} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",marginBottom:8,boxSizing:"border-box"}} />
          : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:600,color:C.text,lineHeight:1.1,marginBottom:6}}>{w.name}</div>
        }
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.sub,marginBottom:28}}>{w.producer}, {w.vintage}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            {editing
              ? <input type="number" min={80} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:72,fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:300,color:w.accent,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none"}} />
              : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:60,color:w.accent,fontWeight:300,lineHeight:1}}>{w.rating}</div>
            }
            <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted}}>/100</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>GARRAFAS</div>
            <Qty value={editing?f.bottles:w.bottles} onChange={v=>{set("bottles",v);if(!editing)onUpdate({...w,bottles:v});}} accent={w.accent} />
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:32,borderRadius:4,overflow:"hidden"}}>
          {[["REGIAO","region"],["PAIS","country"],["UVAS","grapes"],["ADQUIRIDO","date"]].map(([l,k])=>(
            <div key={k} style={{background:C.card,padding:"14px 16px"}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
              {editing
                ? <input value={f[k]} onChange={e=>set(k,e.target.value)} style={{width:"100%",fontFamily:"'DM Sans'",fontSize:13,color:C.text,border:"none",borderBottom:`1px solid ${C.border}`,background:"none",outline:"none",boxSizing:"border-box"}} />
                : <div style={{fontFamily:"'DM Sans'",fontSize:13,color:C.sub}}>{w[k]}</div>
              }
            </div>
          ))}
        </div>
        <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>MINHA MEMORIA</div>
        {editing
          ? <textarea value={f.memory} onChange={e=>set("memory",e.target.value)} rows={4} style={{width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.text,border:`1px solid ${C.border}`,borderRadius:4,background:C.card,outline:"none",padding:14,resize:"none",lineHeight:1.8,boxSizing:"border-box"}} />
          : <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontStyle:"italic",color:C.sub,lineHeight:1.85,marginBottom:24}}>"{w.memory}"</div>
        }
        <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginTop:20,marginBottom:32}}>📍 {w.location}</div>

        {w.historia&&(
          <div style={{marginBottom:16,padding:"18px",background:"#F9F6F2",borderRadius:8,border:"1px solid rgba(154,107,46,0.15)"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>O PRODUTOR</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{w.historia}</div>
          </div>
        )}
        {w.notas&&(
          <div style={{marginBottom:16,padding:"18px",background:"#F9F6F2",borderRadius:8,border:"1px solid rgba(139,31,42,0.12)"}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.red,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>O VINHO</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.sub,lineHeight:1.85}}>{w.notas}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Add Wine ───────────────────────────────────────────────────────────────────
const AddWine = ({ onClose, onSave }) => {
  const [f, setF] = useState({ name:"", producer:"", vintage:2024, region:"", country:"Africa do Sul", grapes:"", style:"Tinto", bottles:1, rating:90, memory:"", location:"", accent:C.red, special:false, photos:[], historia:"", notas:"" });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ msg:"", ok:false });
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const enrich = async () => {
    if(!f.name||!f.producer) return;
    setBusy(true); setStatus({msg:"Pesquisando vinho e produtor...",ok:false});
    try {
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1200,
          messages:[{ role:"user", content:`Voce e um sommelier e especialista em vinhos. Para o vinho "${f.name}" do produtor "${f.producer}" safra ${f.vintage}, retorne APENAS JSON valido sem markdown com estes campos:
{
  "region": "regiao vinicola",
  "country": "pais em portugues",
  "grapes": "uvas separadas por virgula",
  "style": "Tinto|Branco|Rose|Espumante|Sobremesa",
  "accent": "#hexcolor escuro da cor real do vinho",
  "historia": "Paragrafo rico de 3-4 frases sobre a historia e filosofia do produtor/vinicola, o terroir, o que os torna especiais. Escreva em portugues, tom sofisticado mas pessoal.",
  "notas": "Paragrafo de 3-4 frases descrevendo especificamente este vinho: perfil aromatico, paladar, estrutura, potencial de guarda e sugestao de harmonizacao. Portugues, tom de sommelier apaixonado."
}` }]
        })
      });
      const d = await res.json(); if(d.error) { setStatus({msg:"API: "+d.error.message,ok:false}); setBusy(false); return; }
      const parsed = JSON.parse(d.content[0].text.replace(/\`\`\`json|\`\`\`/g,"").trim());
      setF(p=>({...p,...parsed}));
      setStatus({msg:"Ficha completa! Confira e adicione sua memoria.",ok:true});
    } catch(e) { setStatus({msg:"Erro: " + (e.message||String(e)),ok:false}); }
    setBusy(false);
  };

  const handlePhotos = photos => set("photos", photos);

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
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginBottom:24}}>Foto do rotulo + nome + produtor — IA gera a ficha completa.</div>

        <PhotoUploader photos={f.photos} onChange={handlePhotos} />

        {inp("Nome do Vinho","name","text","ex: Paul Sauer")}
        {inp("Produtor","producer","text","ex: Kanonkop")}
        {inp("Safra (opcional)","vintage","number")}

        <button onClick={enrich} disabled={busy||!f.name||!f.producer}
          style={{width:"100%",padding:14,marginBottom:16,background:status.ok?C.greenL:C.redL,border:`1px solid ${status.ok?C.green:C.red}`,borderRadius:6,color:status.ok?C.green:C.red,fontFamily:"'DM Sans'",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",opacity:(!f.name||!f.producer)?0.4:1}}>
          {busy?"✦ Pesquisando...":status.ok?"✓ Ficha gerada":"✦ Gerar ficha com IA"}
        </button>

        {status.msg&&(
          <div style={{fontFamily:"'DM Sans'",fontSize:12,color:busy?C.gold:status.ok?C.green:C.red,background:busy?C.goldL:status.ok?C.greenL:C.redL,padding:"10px 14px",borderRadius:6,marginBottom:16}}>
            {status.msg}
          </div>
        )}

        {f.historia&&(
          <div style={{marginBottom:16,padding:"16px",background:"#F9F6F2",borderRadius:8,border:`1px solid rgba(154,107,46,0.15)`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>O PRODUTOR</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.historia}</div>
          </div>
        )}

        {f.notas&&(
          <div style={{marginBottom:16,padding:"16px",background:"#F9F6F2",borderRadius:8,border:`1px solid rgba(139,31,42,0.12)`}}>
            <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.red,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>O VINHO</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8}}>{f.notas}</div>
          </div>
        )}

        {status.ok&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:16,borderRadius:4,overflow:"hidden"}}>
              {[["REGIAO",f.region],["PAIS",f.country],["UVAS",f.grapes],["ESTILO",f.style]].map(([l,v])=>(
                <div key={l} style={{background:C.card,padding:"12px 14px"}}>
                  <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub}}>{v}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>GARRAFAS NA ADEGA</div>
          <Qty value={f.bottles} onChange={v=>set("bottles",v)} accent={C.red} />
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>AVALIACAO — {f.rating} pts</div>
          <input type="range" min={80} max={100} value={f.rating} onChange={e=>set("rating",+e.target.value)} style={{width:"100%",accentColor:C.red}} />
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>MINHA MEMORIA</div>
          <textarea value={f.memory} onChange={e=>set("memory",e.target.value)} rows={3} placeholder="Onde estava, com quem, o que sentiu..."
            style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box"}} />
        </div>

        {inp("Local / Vinicola","location")}

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
            ADICIONAR A ADEGA
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
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const update = u => setWines(ws=>ws.map(w=>w.id===u.id?u:w));
  const shown = wines.filter(w=>{
    if(filter==="Especiais") return w.special;
    if(filter!=="Todos"&&w.style!==filter) return false;
    const q=search.toLowerCase();
    return !q||w.name.toLowerCase().includes(q)||w.producer.toLowerCase().includes(q)||w.region.toLowerCase().includes(q);
  });
  const total = wines.reduce((a,b)=>a+b.bottles,0);
  if(detail){ const live=wines.find(w=>w.id===detail.id)||detail; const handleDelete = id => { setWines(ws=>ws.filter(w=>w.id!==id)); setDetail(null); };
  return <WineDetail w={live} onBack={()=>setDetail(null)} onUpdate={update} onDelete={handleDelete} />; }
  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      {adding&&<AddWine onClose={()=>setAdding(false)} onSave={w=>{setWines(p=>[...p,w]);setAdding(false);}} />}
      <div style={{padding:"24px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>ADEGA</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1}}>
              {wines.length} <span style={{fontWeight:300,fontSize:20,color:C.sub}}>rotulos</span>
            </div>
            <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginTop:2}}>{total} garrafas</div>
          </div>
          <button onClick={()=>setAdding(true)} style={{background:C.red,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:24,boxShadow:"0 2px 12px rgba(139,31,42,0.3)"}}>+</button>
        </div>
        <div style={{position:"relative",marginBottom:14}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar vinho, produtor, regiao..."
            style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px 11px 38px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>🔍</span>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
          {["Todos","Tinto","Branco","Rose","Espumante","Especiais"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===f?C.red:C.border}`,background:filter===f?C.redL:C.card,color:filter===f?C.red:C.sub,fontFamily:"'DM Sans'",fontSize:11,letterSpacing:"0.05em",cursor:"pointer",whiteSpace:"nowrap"}}>{f==="Especiais"?"★ Especiais":f}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"0 20px"}}>
        {shown.length===0
          ? <div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted}}>Nenhum vinho encontrado</div>
          : shown.map(w=>(
            <div key={w.id} onClick={()=>setDetail(w)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:10,cursor:"pointer",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              {w.photos?.[0]&&(
                <div style={{position:"relative",height:160,overflow:"hidden"}}>
                  <img src={w.photos[0]} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.55) 100%)"}} />
                  <div style={{position:"absolute",bottom:12,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#fff",lineHeight:1.2}}>{w.name}</div>
                      <div style={{fontFamily:"'DM Sans'",fontSize:11,color:"rgba(255,255,255,0.7)"}}>{w.producer} - {w.vintage}</div>
                    </div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"#fff",fontWeight:300}}>{w.rating}</div>
                  </div>
                </div>
              )}
              <div style={{padding:"14px 16px"}}>
                {!w.photos?.[0]&&(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.text,lineHeight:1.2,flex:1,paddingRight:8}}>{w.name}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:w.accent,fontWeight:400}}>{w.rating}</div>
                    </div>
                    <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:10}}>{w.producer} - {w.vintage}</div>
                  </>
                )}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <div style={{width:3,height:14,background:w.accent,borderRadius:1,opacity:0.7}} />
                    <span style={{fontFamily:"'DM Sans'",fontSize:10,color:sAccent(w.style),background:sLabel(w.style),padding:"3px 9px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase"}}>{w.style}</span>
                    {w.special&&<span style={{color:C.gold,fontSize:12}}>★</span>}
                  </div>
                  <Qty value={w.bottles} onChange={v=>update({...w,bottles:v})} accent={w.accent} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// ── Tab Vinhedo ────────────────────────────────────────────────────────────────
const TabVinhedo = ({ vineyard, setVineyard }) => {
  const [open, setOpen] = useState(null);
  const total = vineyard.reduce((a,b)=>a+b.adega,0);
  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      <div style={{padding:"24px 20px"}}>
        <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>MEU VINHEDO</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1,marginBottom:2}}>Mendoza</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.muted,marginBottom:24}}>{vineyard.length} producoes - {total} garrafas na adega</div>
        <div style={{background:"#F9F5F0",border:"1px solid rgba(154,107,46,0.2)",borderRadius:8,padding:"16px 18px",marginBottom:20}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontStyle:"italic",color:C.sub,lineHeight:1.75}}>
            "Cada garrafa e uma decisao de tempo — quando plantar, quando colher, quando abrir."
          </div>
        </div>
        {vineyard.map(v=>(
          <div key={v.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"18px 16px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",gap:10}}>
              <div style={{width:3,background:v.accent,borderRadius:2,alignSelf:"stretch",flexShrink:0,opacity:0.8}} />
              <div style={{flex:1}}>
                <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>MENDOZA - {v.lote}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.text,marginBottom:1}}>{v.name}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:C.sub,marginBottom:12}}>{v.label}, {v.vintage}</div>
                <div style={{fontFamily:"'DM Sans'",fontSize:12,color:C.sub,marginBottom:14}}>{v.blend}</div>
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.08em"}}>ADEGA</span>
                    <span style={{fontFamily:"'DM Sans'",fontSize:11,color:C.sub,fontWeight:500}}>{v.adega} / {v.total}</span>
                  </div>
                  <div style={{background:C.bg,borderRadius:2,height:4,overflow:"hidden"}}>
                    <div style={{background:v.accent,width:`${(v.adega/v.total)*100}%`,height:"100%",borderRadius:2,opacity:0.7}} />
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <button onClick={()=>setOpen(open===v.id?null:v.id)} style={{background:"none",border:"none",fontFamily:"'DM Sans'",fontSize:11,color:C.muted,cursor:"pointer",padding:0,letterSpacing:"0.06em"}}>
                    {open===v.id?"fechar":"notas"}
                  </button>
                  <Qty value={v.adega} onChange={val=>setVineyard(vs=>vs.map(x=>x.id===v.id?{...x,adega:Math.max(0,val)}:x))} accent={v.accent} />
                </div>
                {open===v.id&&(
                  <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
                    <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>NOTAS DO PRODUTOR</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8,marginBottom:10}}>{v.notas}</div>
                    <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted}}>Envasado em {v.envase}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab Memorias ───────────────────────────────────────────────────────────────
const MOODS = ["Epico","Familia","Contemplativo","Inesperado","Intimo"];
const MOODLABEL = { "Epico":"✦ Epico","Familia":"♡ Familia","Contemplativo":"◈ Contemplativo","Inesperado":"⚡ Inesperado","Intimo":"◇ Intimo" };

const TabMemorias = ({ memories, setMemories }) => {
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ title:"", date:"", location:"", text:"", mood:"Epico" });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => {
    if(!f.title) return;
    setMemories(p=>[{...f,id:Date.now(),wines:[]}, ...p]);
    setAdding(false);
    setF({title:"",date:"",location:"",text:"",mood:"Epico"});
  };
  return (
    <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
      {adding&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.35)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:"24px 20px 48px",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{width:36,height:3,background:C.border,borderRadius:2,margin:"0 auto 24px"}} />
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.text,marginBottom:20}}>Nova Memoria</div>
            {[["TITULO","title",""],["DATA","date","ex: Abr 2025"],["LOCAL","location","ex: Franschhoek"]].map(([l,k,ph])=>(
              <div key={k} style={{marginBottom:14}}>
                <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{l}</div>
                <input value={f[k]} placeholder={ph} onChange={e=>set(k,e.target.value)} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",boxSizing:"border-box"}} />
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>NARRATIVA</div>
              <textarea value={f.text} onChange={e=>set("text",e.target.value)} rows={4} placeholder="O que aconteceu, quem estava, o que foi bebido..."
                style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 13px",color:C.text,fontFamily:"'DM Sans'",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>MOOD</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {MOODS.map(m=>{ const mc=mColor(m); return <button key={m} onClick={()=>set("mood",m)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${f.mood===m?mc:C.border}`,background:f.mood===m?`${mc}20`:"none",color:f.mood===m?mc:C.sub,fontFamily:"'DM Sans'",fontSize:11,cursor:"pointer"}}>{MOODLABEL[m]}</button>; })}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setAdding(false)} style={{flex:1,padding:13,background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.sub,fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer"}}>CANCELAR</button>
              <button onClick={save} style={{flex:2,padding:13,background:C.red,border:"none",borderRadius:6,color:"#fff",fontFamily:"'DM Sans'",fontSize:12,cursor:"pointer"}}>SALVAR MEMORIA</button>
            </div>
          </div>
        </div>
      )}
      <div style={{padding:"24px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <div style={{fontFamily:"'DM Sans'",fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>MEMORIAS</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.text,lineHeight:1}}>{memories.length} <span style={{fontWeight:300,fontSize:20,color:C.sub}}>momentos</span></div>
          </div>
          <button onClick={()=>setAdding(true)} style={{background:C.red,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:24,boxShadow:"0 2px 12px rgba(139,31,42,0.3)"}}>+</button>
        </div>
        {memories.map(m=>{ const mc=mColor(m.mood); return (
          <div key={m.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"18px 16px",marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:C.text,lineHeight:1.2,flex:1,paddingRight:10}}>{m.title}</div>
              <span style={{fontFamily:"'DM Sans'",fontSize:10,color:mc,background:`${mc}20`,padding:"3px 10px",borderRadius:20,flexShrink:0}}>{MOODLABEL[m.mood]}</span>
            </div>
            <div style={{fontFamily:"'DM Sans'",fontSize:11,color:C.muted,marginBottom:12}}>📍 {m.location} - {m.date}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.sub,lineHeight:1.8,marginBottom:m.wines.length>0?12:0}}>{m.text}</div>
            {m.wines.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{m.wines.map(w=><span key={w} style={{fontFamily:"'DM Sans'",fontSize:10,color:C.sub,background:C.bg,padding:"3px 10px",borderRadius:20,border:`1px solid ${C.border}`}}>🍷 {w}</span>)}</div>}
          </div>
        );})}
      </div>
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
  const photosRef = useState(loadPhotos())[0];

  // Load from server on mount
  useEffect(() => {
    loadFromServer().then(data => {
      if (data) {
        // Merge server data with local photos
        const photos = loadPhotos();
        const winesWithPhotos = (data.wines||[]).map(w => ({
          ...w,
          photos: photos[w.id] || []
        }));
        setWines(winesWithPhotos);
        if (data.vineyard?.length) setVineyard(data.vineyard);
        if (data.memories?.length) setMemories(data.memories);
      }
      setLoading(false);
    });
  }, []);

  // Save to server whenever data changes
  useEffect(() => {
    if (loading) return;
    saveToServer({wines, vineyard, memories});
    // Save photos locally
    const photos = {};
    wines.forEach(w => { if (w.photos?.length) photos[w.id] = w.photos; });
    savePhotos(photos);
  }, [wines, vineyard, memories, loading]);
  const tabs = [{id:"adega",icon:"🍷",label:"Adega"},{id:"vinhedo",icon:"🌿",label:"Vinhedo"},{id:"memorias",icon:"✦",label:"Memorias"}];

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
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}input,textarea,select{-webkit-appearance:none}::placeholder{color:#B0A090}`}</style>
      <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${C.border}`,background:C.card,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:"0.16em",color:C.text}}>W.AI.NE</span>
          <span style={{fontFamily:"'DM Sans'",fontSize:9,color:C.muted,letterSpacing:"0.12em"}}>ADEGA INTELIGENTE</span>
        </div>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.red}} />
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="adega"&&<TabAdega wines={wines} setWines={setWines} />}
        {tab==="vinhedo"&&<TabVinhedo vineyard={vineyard} setVineyard={setVineyard} />}
        {tab==="memorias"&&<TabMemorias memories={memories} setMemories={setMemories} />}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.card,borderTop:`1px solid ${C.border}`,padding:"10px 0 22px",display:"flex",justifyContent:"space-around",zIndex:40,boxShadow:"0 -4px 20px rgba(0,0,0,0.06)"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
            <span style={{fontSize:t.id==="memorias"?15:20,color:tab===t.id?C.red:C.muted,fontFamily:t.id==="memorias"?"'Cormorant Garamond',serif":"inherit"}}>{t.icon}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:tab===t.id?C.red:C.muted,fontWeight:tab===t.id?600:400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
