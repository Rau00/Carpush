// src/App.jsx
import { useState, useEffect, useCallback } from 'react'
import './App.css'

const API = 'http://localhost:3000/api'

function getImageUrl(imagen_url) {
  if (!imagen_url) return null
  if (imagen_url.includes('/')) return imagen_url
  return `/img/${imagen_url}`
}
 
function ImagenCoche({ imagen_url, alt = '', height = 155, fontSize = '3.5rem' }) {
  const [error, setError] = useState(false)
  const src = getImageUrl(imagen_url)
 
  if (!src || error) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize, background: 'var(--color-primario)',
        borderRadius: 'inherit' }}>
      </div>
    )
  }
 
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{ width: '100%', height, objectFit: 'contain', display: 'block', backgroundColor: 'white'}}
    />
  )
}


function apiFetch(path, options = {}) {
  const token = localStorage.getItem('cp_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(`${API}${path}`, { headers, ...options })
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
      return data
    })
}

// ═══════════════════════════════════════════════════════════════
// TEXTOS ESP y ENG
// ═══════════════════════════════════════════════════════════════
const T = {
  espanol: {
    inicio:'Inicio', coches:'Coches', sobreNosotros:'Sobre Nosotros',
    favoritos:'Favoritos', carrito:'Carrito', misPedidos:'Mis Pedidos',
    admin:'Administración', login:'Login', logout:'Cerrar sesión', registro:'Registrarse',
    ajustes:'Ajustes', idioma:'Selecciona el Idioma:', tema:'Selecciona el Tema:',
    aplicar:'Aplicar', resetear:'Resetear Cambios', claro:'Claro', oscuro:'Oscuro',
    espanol:'Español', ingles:'Inglés',
    busquedaRapida:'Búsqueda rápida', filtra:'Filtra según necesidad',
    selecciona:'Selecciona tu coche', marcaLabel:'Buscar por marca',
    todasMarcasDesc:'Todas las marcas disponibles en stock',
    modeloLabel:'Buscar por modelo', modeloDesc:'Encuentra exactamente lo que buscas',
    precioLabel:'Buscar por precio', precioDesc:'Desde económicos hasta los que no',
    ver:'Ver', destacados:'Destacados', cochesVenta:'Coches en venta ahora',
    vehiculosListos:'Vehículos listos para llevarse hoy mismo',
    comprar:'Comprar', ventajas:'Ventajas', porQue:'Por qué elegir esta empresa',
    copyright:'Copyright 2026 - CARPUSH. Todos los derechos reservados',
    hechoPor:'Página realizada por', politicaCookie:'Política de cookie',
    avisoLegal:'Aviso legal', politicaPriv:'Política de privacidad',
    filtrarMarca:'Todas las marcas', filtrarTipo:'Todos los tipos',
    precioMax:'Precio máx. €', limpiar:'Limpiar filtros',
    encontrados:'coches encontrados', km:'km',
    addFav:'Añadir a favoritos', addCarrito:'Añadir al carrito',
    quitar:'Quitar', noFavs:'No tienes coches en favoritos.',
    noCarrito:'Tu carrito está vacío.', explorar:'Explorar coches',
    email:'Email', password:'Contraseña', entrar:'Entrar',
    nombre:'Nombre completo', confirmar:'Confirmar contraseña',
    crearCuenta:'Crear cuenta', yaTienes:'¿Ya tienes cuenta?',
    noTienes:'¿No tienes cuenta?', hola:'Hola', buscar:'Buscar',
    cargando:'Cargando...', errorApi:'No se pudo conectar con el servidor.',
    procederPago:'Proceder al pago', cancelarPago: 'Cancelar compra',
    checkout:'Datos de compra', telefono:'Teléfono',
    direccion:'Dirección de entrega', confirmarCompra:'Confirmar compra', cancelar:'Cancelar',
    facturaTitle:'¡Compra realizada!', facturaSubtitle:'Factura de compra',
    facturaId:'Nº Factura', facturaCoche:'Vehículo', facturaComprador:'Comprador',
    facturaEmail:'Email', facturaTelefono:'Teléfono', facturaDireccion:'Dirección',
    facturaFecha:'Fecha', facturaTotal:'Total', cerrarFactura:'Cerrar',
    noPedidos:'No tienes compras realizadas.',
    iniciaSesion:'Inicia sesión para usar esta función',
    // Admin
    panelAdmin:'Panel de Administración', gestionCoches:'Gestión de Coches',
    añadirCoche:'Añadir nuevo coche', modeloLabel2:'Modelo', tipoLabel:'Tipo',
    anioLabel:'Año', precioLabel2:'Precio (€)', kmLabel:'Kilómetros',
    colorLabel:'Color', descripcionLabel:'Descripción', imagenLabel:'URL imagen',
    guardar:'Guardar coche', eliminar:'Eliminar', confirmarEliminar:'¿Eliminar este coche? Esta acción no se puede deshacer.',
    totalCoches:'coches en total', accesoDenegado:'Acceso denegado',
    soloAdmin:'Esta sección es solo para administradores.',
    // Admin tabla
    colMarca:'Marca', colModelo:'Modelo', colTipo:'Tipo', colAnio:'Año',
    colPrecio:'Precio', colKm:'Km', colImagen:'Imagen',
    // Ventajas
    ventaja1Tit:'Inspección garantizada', ventaja1Desc:'150 puntos de revisión en cada vehículo.',
    ventaja2Tit:'Documentación completa',   ventaja2Desc:'Trámites gestionados sin sorpresas.',
    ventaja3Tit:'Entrega en todas las islas', ventaja3Desc:'Llegamos a cualquier isla del archipiélago.',
    // Newsletter
    subscribeTit:'Mantente al tanto',
    subscribeDesc:'Recibe las mejores ofertas y novedades directamente en tu bandeja de entrada cada semana',
    subscribePlaceholder:'Tu correo aquí', subscriberBtn:'Suscribir',
    subscribeTerms:'Al suscribirte aceptas nuestros términos y condiciones de privacidad',
    // FAQs
    faqsTit:'Preguntas',
    faqsDesc:'Respuestas claras sobre cómo comprar y vender en nuestro mercado de Canarias',
    faq1Q:'¿Cuánto tiempo tarda vender?',
    faq1A:'La mayoría de vehículos se venden en dos o tres semanas. Todo depende del precio y la demanda de tu isla. Nosotros nos encargamos de la publicidad y los trámites.',
    faq2Q:'¿Qué documentos necesito?',
    faq2A:'Requiere el permiso de circulación, el certificado de propiedad y el informe de tráfico. Si hay financiación pendiente, necesitamos este documento también. Te asesoramos en cada paso.',
    faq3Q:'¿Hay gastos ocultos?',
    faq3A:'No. Somos directos con los precios desde el primer momento. Cada gasto está claro antes de firmar nada. Eso es lo que nos diferencia en las islas.',
    faq4Q:'¿Puedo cambiar de isla?',
    faq4A:'Sí. Trabajamos en todas las islas Canarias. Si tu coche está en Tenerife y quieres comprarlo desde Gran Canaria, lo gestionamos nosotros. Sin complicaciones.',
    faq5Q:'¿Cómo es el pago?',
    faq5A:'Transferencia bancaria o efectivo en mano. Ambas opciones son seguras y rápidas. Firmamos todo en la notaría cuando ambas partes están de acuerdo.',
    faqsAyudaTit:'¿Necesitas más ayuda?',
    faqsAyudaDesc:'Nuestro equipo está listo para responder cualquier duda sobre tu compra o venta',
    contactar:'Contactar',
    // Sobre nosotros
    sobreDesc1:'En CarPush trabajamos para ofrecer vehículos de calidad, revisados y listos para conducir desde el primer día.',
    sobreDesc2:'Nuestro objetivo es hacer que encontrar tu próximo coche sea una experiencia rápida, segura y transparente. Contamos con una amplia selección de vehículos y un equipo preparado para ayudarte en cada paso.',
    vehiculosVendidos:'Vehículos vendidos', anosExperiencia:'Años de experiencia', soporteCliente:'Soporte al cliente',
    // Coches
    iniciaSesionFav:'Inicia sesión para guardar favoritos',
    iniciaSesionCart:'Inicia sesión para usar el carrito',
    anadidoFav:'añadido a favoritos', anadidoCart:'añadido al carrito',
    // Destacados
    nuevo:'NUEVO',
    verTodos:'Ver todos',
  },
  ingles: {
    inicio:'Home', coches:'Cars', sobreNosotros:'About Us',
    favoritos:'Wishlist', carrito:'Cart', misPedidos:'My Orders',
    admin:'Administration', login:'Login', logout:'Log out', registro:'Sign up',
    ajustes:'Settings', idioma:'Select language:', tema:'Select theme:',
    aplicar:'Apply', resetear:'Reset changes', claro:'Light', oscuro:'Dark',
    espanol:'Spanish', ingles:'English',
    busquedaRapida:'Quick search', filtra:'Filter by need',
    selecciona:'Select your car', marcaLabel:'Search by brand',
    todasMarcasDesc:'All brands available in stock',
    modeloLabel:'Search by model', modeloDesc:'Find exactly what you are looking for',
    precioLabel:'Search by price', precioDesc:'From affordable to premium',
    ver:'View', destacados:'Featured', cochesVenta:'Cars for sale now',
    vehiculosListos:'Vehicles ready to take home today',
    comprar:'Buy', ventajas:'Advantages', porQue:'Why choose us',
    copyright:'Copyright 2026 - CARPUSH. All rights reserved',
    hechoPor:'Website made by', politicaCookie:'Cookie policy',
    avisoLegal:'Legal notice', politicaPriv:'Privacy policy',
    filtrarMarca:'All brands', filtrarTipo:'All types',
    precioMax:'Max price €', limpiar:'Clear filters',
    encontrados:'cars found', km:'km',
    addFav:'Add to wishlist', addCarrito:'Add to cart',
    quitar:'Remove', noFavs:'No cars in your wishlist.',
    noCarrito:'Your cart is empty.', explorar:'Explore cars',
    email:'Email', password:'Password', entrar:'Sign in',
    nombre:'Full name', confirmar:'Confirm password',
    crearCuenta:'Create account', yaTienes:'Already have an account?',
    noTienes:"Don't have an account?", hola:'Hello', buscar:'Search',
    cargando:'Loading...', errorApi:'Could not connect to the server.',
    procederPago:'Proceed to payment', cancelarPago: 'Cancel Purchase',
    checkout:'Purchase details', telefono:'Phone',
    direccion:'Delivery address', confirmarCompra:'Confirm purchase', cancelar:'Cancel',
    facturaTitle:'Purchase complete!', facturaSubtitle:'Purchase invoice',
    facturaId:'Invoice #', facturaCoche:'Vehicle', facturaComprador:'Buyer',
    facturaEmail:'Email', facturaTelefono:'Phone', facturaDireccion:'Address',
    facturaFecha:'Date', facturaTotal:'Total', cerrarFactura:'Close',
    noPedidos:'No purchases yet.',
    iniciaSesion:'Sign in to use this feature',
    panelAdmin:'Administration Panel', gestionCoches:'Car Management',
    añadirCoche:'Add new car', modeloLabel2:'Model', tipoLabel:'Type',
    anioLabel:'Year', precioLabel2:'Price (€)', kmLabel:'Kilometers',
    colorLabel:'Color', descripcionLabel:'Description', imagenLabel:'Image URL',
    guardar:'Save car', eliminar:'Delete', confirmarEliminar:'Delete this car? This cannot be undone.',
    totalCoches:'cars total', accesoDenegado:'Access denied',
    soloAdmin:'This section is for administrators only.',
    // Admin tabla
    colMarca:'Brand', colModelo:'Model', colTipo:'Type', colAnio:'Year',
    colPrecio:'Price', colKm:'Km', colImagen:'Image',
    // Ventajas
    ventaja1Tit:'Guaranteed inspection', ventaja1Desc:'150-point review on every vehicle.',
    ventaja2Tit:'Complete documentation',   ventaja2Desc:'All paperwork handled with no surprises.',
    ventaja3Tit:'Delivery to all islands', ventaja3Desc:'We reach any island in the archipelago.',
    // Newsletter
    subscribeTit:'Stay in the loop',
    subscribeDesc:'Get the best deals and news delivered directly to your inbox every week',
    subscribePlaceholder:'Your email here', subscriberBtn:'Subscribe',
    subscribeTerms:'By subscribing you accept our privacy terms and conditions',
    // FAQs
    faqsTit:'Questions',
    faqsDesc:'Clear answers about how to buy and sell in our Canary Islands marketplace',
    faq1Q:'How long does it take to sell?',
    faq1A:'Most vehicles sell within two or three weeks. It depends on the price and demand on your island. We handle the advertising and paperwork.',
    faq2Q:'What documents do I need?',
    faq2A:'You need the vehicle registration, proof of ownership and the traffic report. If there is pending financing, we need that document too. We guide you every step of the way.',
    faq3Q:'Are there hidden fees?',
    faq3A:'No. We are upfront about prices from the start. Every cost is clear before you sign anything. That is what sets us apart on the islands.',
    faq4Q:'Can I buy from another island?',
    faq4A:'Yes. We operate across all the Canary Islands. If your car is in Tenerife and you want to buy it from Gran Canaria, we handle it. No hassle.',
    faq5Q:'How does payment work?',
    faq5A:'Bank transfer or cash in hand. Both options are safe and fast. We sign everything at the notary when both parties agree.',
    faqsAyudaTit:'Need more help?',
    faqsAyudaDesc:'Our team is ready to answer any questions about your purchase or sale',
    contactar:'Contact us',
    // Sobre nosotros
    sobreDesc1:'At CarPush we work to offer quality vehicles, inspected and ready to drive from day one.',
    sobreDesc2:'Our goal is to make finding your next car a fast, safe and transparent experience. We have a wide selection of vehicles and a team prepared to help you every step of the way.',
    vehiculosVendidos:'Vehicles sold', anosExperiencia:'Years of experience', soporteCliente:'Customer support',
    // Coches
    iniciaSesionFav:'Sign in to save favourites',
    iniciaSesionCart:'Sign in to use the cart',
    anadidoFav:'added to wishlist', anadidoCart:'added to cart',
    // Destacados
    nuevo:'NEW',
    verTodos:'View all',
  },
}

// ═══════════════════════════════════════════════════════════════
// AUTH — guardo token en localStorage ya que php session 
// no funciona de la manera que está creado el proyecto 😔
// ═══════════════════════════════════════════════════════════════
function useAuth() {
  const [usuario,  setUsuario]  = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cp_token')
    if (!token) { setCargando(false); return }
    apiFetch('/auth/index.php?action=me')
      .then(d => { if (d.autenticado) setUsuario(d.usuario) })
      .catch(() => localStorage.removeItem('cp_token'))
      .finally(() => setCargando(false))
  }, [])

  const login = async (email, password) => {
    const d = await apiFetch('/auth/index.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('cp_token', d.token)
    setUsuario(d.usuario)
    return d
  }

  const register = async (nombre, email, password) => {
    const d = await apiFetch('/auth/index.php?action=register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    })
    localStorage.setItem('cp_token', d.token)
    setUsuario(d.usuario)
    return d
  }

  const logout = async () => {
    await apiFetch('/auth/index.php?action=logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('cp_token')
    setUsuario(null)
  }

  return { usuario, cargando, login, register, logout }
}

// ═══════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════
function useToast() {
  const [msg, setMsg] = useState('')
  const show = m => { setMsg(m); setTimeout(() => setMsg(''), 2800) }
  return [msg, show]
}
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{ position:'fixed', top:80, right:20, zIndex:9999,
      background:'var(--color-secundario)', color:'white', padding:'10px 20px',
      borderRadius:10, fontWeight:600, boxShadow:'0 4px 15px rgba(0,0,0,0.3)', maxWidth:320 }}>
      {msg}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [idioma, setIdioma] = useState(() => localStorage.getItem('galletaIdioma') || 'espanol')
  const [tema,   setTema]   = useState(() => localStorage.getItem('galletaTema')   || 'claro')
  const [pagina, setPagina] = useState('inicio')
  const auth = useAuth()
  const t = T[idioma]
 
  useEffect(() => {
    localStorage.setItem('galletaIdioma', idioma)
    localStorage.setItem('galletaTema',   tema)
    document.documentElement.className = tema === 'oscuro' ? 'oscuro' : ''
  }, [idioma, tema])
 
  const nav = p => { setPagina(p); window.scrollTo(0,0) }
 
  if (auth.cargando) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" style={{ color:'var(--color-secundario)' }}/>
    </div>
  )
 
  return (
    <div className="app-wrapper">
      <Header t={t} auth={auth} onNavigate={nav} />
      <main>
        {pagina==='inicio'       && <PaginaInicio      t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='coches'       && <PaginaCoches      t={t} auth={auth} onNavigate={nav}/>}
        {pagina === 'sobre'        && <PaginaSobreNosotros t={t} />}
        {pagina==='favoritos'    && <PaginaFavoritos   t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='carrito'      && <PaginaCarrito     t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='pedidos'      && <PaginaPedidos     t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='admin'        && <PaginaAdmin       t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='login'        && <PaginaLogin       t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='registro'     && <PaginaRegistro    t={t} auth={auth} onNavigate={nav}/>}
        {pagina==='preferencias' && <PaginaPreferencias t={t} idioma={idioma} tema={tema} onAplicar={(i,te)=>{setIdioma(i);setTema(te)}} onNavigate={nav}/>}
      </main>
      <Footer t={t}/>
      <div className="ajustes">
        <button className="btn-naked" onClick={()=>nav('preferencias')} title={t.ajustes}>
          <img src="./config/config.png" alt="ajustes"/>
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
function Header({ t, auth, onNavigate }) {
  const [open, setOpen] = useState(false)
  const nav = p => { onNavigate(p); setOpen(false) }
 
  return (
    <header style={{ position:'fixed', width:'100%', zIndex:100 }}>
      <nav className="menu">
        <div className="logo">
          <button className="btn-naked text-white text-uppercase fw-bold" onClick={()=>nav('inicio')}><img src="./logo/favicon.ico" alt="logo" className='logo-img'/></button>
        </div>
        <button className={`boton-menu-hamburguesa ${open?'open':''}`} onClick={()=>setOpen(!open)}>
          <span className="palito"/><span className="palito"/><span className="palito"/>
        </button>
        <div className={`capa-oscura ${open?'on':''}`} onClick={()=>setOpen(false)}/>
        <div className={`menu-desplegable ${open?'on':''}`}>
          <ul className="lista margin-burger">
            <li><button className="btn-naked" onClick={()=>nav('inicio')}>{t.inicio}</button></li>
            <li><button className="btn-naked" onClick={()=>nav('coches')}>{t.coches}</button></li>
            <li><button className="btn-naked" onClick={()=>nav('sobre')}>{t.sobreNosotros}</button></li>
            {auth.usuario?.rol === 'admin' && (
              <li><button className="btn-naked boton-admin" onClick={()=>nav('admin')}>{t.admin}</button></li>
            )}
          </ul>
          <div className="reservar d-flex gap-3 align-items-center">
            {auth.usuario ? (
              <>
                <button className="btn-naked fw-semibold" style={{ color:'var(--color-secundario)' }} onClick={()=>nav('favoritos')}>{t.favoritos}</button>
                <button className="btn-naked text-white fw-semibold" onClick={()=>nav('carrito')}>{t.carrito}</button>
                <button className="btn-naked text-white small" onClick={()=>nav('pedidos')}>{t.misPedidos}</button>
                <span className="text-white small"> {t.hola}, {auth.usuario.nombre}</span>
                <button className="boton-registro" onClick={()=>{auth.logout();nav('inicio')}}>{t.logout}</button>
              </>
            ) : (
              <>
                <button className="boton-registro" style={{ background:'transparent', border:'1px solid var(--color-secundario)', color:'var(--color-secundario)' }} onClick={()=>nav('login')}>{t.login}</button>
                <button className="boton-registro" onClick={()=>nav('registro')}>{t.registro}</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// PANEL ADMIN
// ═══════════════════════════════════════════════════════════════
function PaginaAdmin({ t, auth, onNavigate }) {
  const [coches,   setCoches]   = useState([])
  const [marcas,   setMarcas]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [toast,    showToast]   = useToast()
  const [form, setForm] = useState({
    marca_id:'', modelo:'', tipo:'SUV', anio:new Date().getFullYear(),
    precio:'', kilometros:0, color:'', descripcion:'', imagen_url:''
  })
  const [guardando, setGuardando] = useState(false)
  const [errForm,   setErrForm]   = useState('')
 
  const cargar = useCallback(() => {
    setCargando(true)
    Promise.all([
      apiFetch('/admin/index.php'),
      apiFetch('/cars/index.php?action=marcas'),
    ]).then(([c, m]) => {
      setCoches(c.data || [])
      setMarcas(m.data || [])
    }).catch(() => {}).finally(() => setCargando(false))
  }, [])
 
  useEffect(() => { if (auth.usuario?.rol==='admin') cargar(); else setCargando(false) }, [auth.usuario])
 
  if (!auth.usuario) return (
    <div className="text-center" style={{ paddingTop:140 }}>
      <h4>{t.accesoDenegado}</h4>
      <button className="boton-reservar mt-3" onClick={()=>onNavigate('login')}>{t.login}</button>
    </div>
  )
  if (auth.usuario.rol !== 'admin') return (
    <div className="text-center" style={{ paddingTop:140 }}>
      <h4>{t.accesoDenegado}</h4>
      <p className="text-muted">{t.soloAdmin}</p>
    </div>
  )
 
  const handleGuardar = async e => {
    e.preventDefault(); setErrForm(''); setGuardando(true)
    try {
      await apiFetch('/admin/index.php', { method:'POST', body:JSON.stringify(form) })
      showToast(`✅ ${form.modelo} añadido correctamente`)
      setForm({ marca_id:'', modelo:'', tipo:'SUV', anio:new Date().getFullYear(), precio:'', kilometros:0, color:'', descripcion:'', imagen_url:'' })
      cargar()
    } catch(err) { setErrForm(err.message) }
    finally { setGuardando(false) }
  }
 
  const handleBorrar = async (coche) => {
    if (!window.confirm(`${t.confirmarEliminar}\n\n${coche.marca_nombre} ${coche.modelo}`)) return
    try {
      await apiFetch(`/admin/index.php?id=${coche.id}`, { method:'DELETE' })
      showToast(`${coche.marca_nombre} ${coche.modelo} eliminado`)
      cargar()
    } catch(err) { showToast(`${err.message}`) }
  }
 
  return (
    <div style={{ paddingTop:70 }}>
      <Toast msg={toast}/>
      <section>
        {/* Cabecera */}
        <div className="mb-5">
          <h4 style={{ color:'var(--color-secundario)' }}><b>{t.panelAdmin}</b></h4>
          <h1>{t.gestionCoches}</h1>
          <p className="text-muted">{coches.length} {t.totalCoches}</p>
        </div>
 
        {/* Formulario añadir coche */}
        <div className="card shadow-sm mb-5" style={{ borderRadius:16, border:'1px solid rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4 card-oscuro" style={{borderRadius: '16px'}}>
            <h5 className="fw-bold mb-4 texto-black">{t.añadirCoche}</h5>
            {errForm && <div className="alert alert-danger py-2 mb-3">{errForm}</div>}
            <form onSubmit={handleGuardar}>
              <div className="row g-3">
                {/* Marca */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">{t.colMarca} *</label>
                  <select className="form-select" required value={form.marca_id}
                    onChange={e=>setForm(p=>({...p, marca_id:e.target.value}))}>
                    <option value="">{t.filtrarMarca}</option>
                    {marcas.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
                {/* Modelo */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">{t.modeloLabel2} *</label>
                  <input type="text" className="form-control" required value={form.modelo}
                    onChange={e=>setForm(p=>({...p, modelo:e.target.value}))}/>
                </div>
                {/* Tipo */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">{t.tipoLabel} *</label>
                  <select className="form-select" value={form.tipo}
                    onChange={e=>setForm(p=>({...p, tipo:e.target.value}))}>
                    <option value="SUV">SUV</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="4x4">4x4</option>
                  </select>
                </div>
                {/* Año */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">{t.anioLabel} *</label>
                  <input type="number" className="form-control" required min="1990" max="2030"
                    value={form.anio} onChange={e=>setForm(p=>({...p, anio:e.target.value}))}/>
                </div>
                {/* Precio */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">{t.precioLabel2} *</label>
                  <input type="number" className="form-control" required min="0" step="0.01"
                    value={form.precio} onChange={e=>setForm(p=>({...p, precio:e.target.value}))}/>
                </div>
                {/* Kilómetros */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">{t.kmLabel}</label>
                  <input type="number" className="form-control" min="0"
                    value={form.kilometros} onChange={e=>setForm(p=>({...p, kilometros:e.target.value}))}/>
                </div>
                {/* Color */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">{t.colorLabel}</label>
                  <input type="text" className="form-control" value={form.color}
                    onChange={e=>setForm(p=>({...p, color:e.target.value}))}/>
                </div>
                {/* Imagen URL */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">{t.imagenLabel}</label>
                  <input type="text" className="form-control" placeholder=""
                    value={form.imagen_url} onChange={e=>setForm(p=>({...p, imagen_url:e.target.value}))}/>
                </div>
                {/* Descripción */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">{t.descripcionLabel}</label>
                  <input type="text" className="form-control" value={form.descripcion}
                    onChange={e=>setForm(p=>({...p, descripcion:e.target.value}))}/>
                </div>
                {/* Botón */}
                <div className="col-12 pt-2">
                  <button type="submit" className="boton-reservar px-4" style={{border: '1px solid white'}} disabled={guardando}>
                    {guardando ? t.cargando : `${t.guardar}`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
 
        {/* Tabla de coches */}
        {cargando ? (
          <p className="text-center text-muted">{t.cargando}</p>
        ) : (
          <div className="card shadow-sm" style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(0,0,0,0.08)' }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background:'var(--color-primario)', color:'white' }}>
                  <tr>
                    <th style={{ padding:'14px 16px' }}>#</th>
                    <th>{t.colMarca}</th>
                    <th>{t.colModelo}</th>
                    <th>{t.colTipo}</th>
                    <th>{t.colAnio}</th>
                    <th>{t.colPrecio}</th>
                    <th>{t.colKm}</th>
                    <th>{t.colImagen}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {coches.map(c => (
                    <tr key={c.id}>
                      <td className="text-muted small" style={{ padding:'12px 16px' }}>{c.id}</td>
                      <td className="fw-semibold">{c.marca_nombre}</td>
                      <td>{c.modelo}</td>
                      <td>
                        <span className="badge" style={{ background: c.tipo==='SUV'?'#2d6a4f':c.tipo==='Deportivo'?'var(--color-secundario)':'#b5850a', fontSize:'0.7rem' }}>
                          {c.tipo}
                        </span>
                      </td>
                      <td>{c.anio}</td>
                      <td className="fw-semibold" style={{ color:'var(--color-secundario)' }}>
                        {Number(c.precio).toLocaleString('es-ES',{style:'currency',currency:'EUR'})}
                      </td>
                      <td className="text-muted small">{Number(c.kilometros).toLocaleString()}</td>
                      <td>
                        {c.imagen_url
                          ? <img src={c.imagen_url} alt={c.modelo} style={{ width:50, height:35, objectFit:'cover', borderRadius:6 }} onError={e=>e.target.style.display='none'}/>
                          : <span className="text-muted small">—</span>
                        }
                        {c.imagen_url}
                      </td>
                      <td>
                        <button className="boton-reservar"
                          style={{ background:'transparent', border:'1px solid #dc3545', color:'#dc3545', fontSize:'0.8rem', padding:'4px 10px' }}
                          onClick={()=>handleBorrar(c)}>
                          {t.eliminar}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════
function PaginaInicio({ t, auth, onNavigate }) {
  const [destacados, setDestacados] = useState([])
  const [cargando,   setCargando]   = useState(true)

  useEffect(() => {
    apiFetch('/cars/index.php')
      .then(d => setDestacados((d.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      {/* Banner */}
      <section className="banner">
        <div id="introCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {[0, 1, 2].map(i => (
              <button key={i} type="button" data-bs-target="#introCarousel"
                data-bs-slide-to={i} className={i === 0 ? 'active' : ''} />
            ))}
          </div>
          <div className="carousel-inner">
            {[0, 1, 2].map(i => (
              <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                <div className="mask d-flex align-items-center justify-content-center h-100"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>
                  <div className="text-white text-center px-3">
                    <h1 className="display-2 fw-bold mb-3">CarPush</h1>
                    <p className="lead mb-4">{t.vehiculosListos}</p>
                    <button className="boton-reservar px-4 py-2" style={{ fontSize: '1.05rem' }}
                      onClick={() => onNavigate('coches')}>{t.ver} {t.coches}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" data-bs-target="#introCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" data-bs-target="#introCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </section>


      {/* Búsqueda rápida */}
      <section className="busqueda">
        <div className="text-center text-white mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.busquedaRapida}</b></h4>
          <h1>{t.filtra}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t.selecciona}</p>
        </div>
        <div className="linea" />
        <div className="separa-50" />
        <div className="cajas-busqueda d-flex justify-content-center gap-3 flex-wrap">
          {[
            { tit: t.marcaLabel,  desc: t.todasMarcasDesc },
            { tit: t.modeloLabel, desc: t.modeloDesc },
            { tit: t.precioLabel, desc: t.precioDesc },
          ].map((c, i) => (
            <div key={i} className="card" style={{ width: '18rem', cursor: 'pointer' }}
              onClick={() => onNavigate('coches')}>
              <div className="card-body">
                <h5 className="card-title">{c.tit}</h5>
                <p className="card-text">{c.desc}</p>
                <span>{t.ver} →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className='destacados'>
        <div className="text-center mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.destacados}</b></h4>
          <h1>{t.cochesVenta}</h1>
          <p className="text-muted">{t.vehiculosListos}</p>
        </div>
        {cargando && <p className="text-center text-muted">{t.cargando}</p>}
        {destacados.map(c => (
          <div key={c.id} className="cajita d-flex shadow-lg mb-4 overflow-hidden">
            <div className="flex-shrink-0 border-end border-black cajitav2" style={{ width: 320, minHeight: 180,
              background: 'var(--color-primario)', borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
              <ImagenCoche imagen_url={c.imagen_url} alt={`${c.marca_nombre} ${c.modelo}`}
                height='100%' fontSize="4rem" />
            </div>
            <div className="datos p-4">
              <h5 style={{ color: 'var(--color-secundario)' }}>{t.nuevo}</h5>
              <h2 className="fw-bold">{c.marca_nombre} {c.modelo}</h2>
              <p className="text-muted">{c.descripcion}</p>
              <p className="fw-bold fs-5 color-texto">
                {Number(c.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              <button className="boton-reservar" onClick={() => onNavigate('coches')}>{t.comprar}</button>
            </div>
          </div>
        ))}
        <div className="text-center mt-3">
          <button className="boton-reservar px-5 py-2" onClick={() => onNavigate('coches')}>
            {t.verTodos} →
          </button>
        </div>
      </section>

      {/* Ventajas */}
      <section className='ventajas' style={{ background: 'var(--color-terciario)' }}>
        <div className="text-center mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.ventajas}</b></h4>
          <h1>{t.porQue}</h1>
        </div>
        <div className="d-flex justify-content-center gap-5 flex-wrap">
          {[
            { e: './config/file-search-corner.png', tit: t.ventaja1Tit, desc: t.ventaja1Desc },
            { e: './config/book-open-text.png', tit: t.ventaja2Tit, desc: t.ventaja2Desc },
            { e: './config/container.png', tit: t.ventaja3Tit, desc: t.ventaja3Desc },
          ].map((v, i) => (
            <div key={i} className="borde-cajitas shadow text-center p-4"
              style={{ borderRadius: 12, flex: '1 1 200px', maxWidth: 280 }}>
              <div style={{ fontSize: '2.5rem' }}>
                {v.e.includes('/') ? <img src={v.e} alt={v.tit} style={{ width: '50px' }} /> : v.e}
                </div>
              <h5 className="fw-bold mt-3">{v.tit}</h5>
              <p className="text-muted small">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <SeccionesExtra t = { t }/>
    </>
  )
}


//
// Secciones finales para inicio y sobre nosotros
//

function SeccionesExtra({ t }) {
  return (
    <section className="FAQs bg-black">
        <div className="text-center text-white">
          <h1>{t.faqsTit}</h1>
          <p>{t.faqsDesc}</p>
        </div>
        <div className="separa-10"></div>
        <div className="accordion" id="accordionPanelsStayOpenExample" style={{width: '100%'}}>

            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button className="accordion-button collapsed position-static" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                  <strong>{t.faq1Q}</strong>
                </button>
                </h2>
                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                  <div className="accordion-body">
                    <p>{t.faq1A}</p>
                    </div>
                </div>
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                  <button className="accordion-button collapsed position-static" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                    <strong>{t.faq2Q}</strong>
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                  <div className="accordion-body">
                    <p>{t.faq2A}</p>
                  </div>
                </div>
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                  <button className="accordion-button collapsed position-static" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                    <strong>{t.faq3Q}</strong>
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                  <div className="accordion-body">
                    <p>{t.faq3A}</p>
                  </div>
                </div>
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                  <button className="accordion-button collapsed position-static" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                    <strong>{t.faq4Q}</strong>
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFour">
                  <div className="accordion-body">
                    <p>{t.faq4A}</p>
                  </div>
                </div>
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="panelsStayOpen-headingFive">
                  <button className="accordion-button collapsed position-static" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive" aria-expanded="false" aria-controls="panelsStayOpen-collapseFive">
                    <strong>{t.faq5Q}</strong>
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingFive">
                  <div className="accordion-body">
                    <p>{t.faq5A}</p>
                  </div>
                </div>
            </div>
        </div>

        <div className="separa-50"></div>
        <div className="text-center text-white">
          <h1>{t.faqsAyudaTit}</h1>
          <p>{t.faqsAyudaDesc}</p>
          <div className="separa-10"></div>
          <div className="botoneh d-flex align-items-center justify-content-center">
            <a href="#" className="boton-reservar gap-2 text-ºuppercase">{t.contactar}</a>
          </div>
        </div>
    </section>
  )  
}


// ═══════════════════════════════════════════════════════════════
// Sobre Nosotros
// ═══════════════════════════════════════════════════════════════

function PaginaSobreNosotros({ t }) {
  return (
    <>
      <section className="sobre-nosotros container py-5">
        <div className='p-5'></div>
        <div className="row align-items-center g-5">

          <div className="col-lg-6">
            <img
              src="./img/toyota-gr-yaris-litchfield-1-1610714807.avif"
              alt="Sobre nosotros"
              className="img-fluid rounded-4 shadow"
            />
          </div>

          <div className="col-lg-6">
            <span className="badge mb-3 px-3 py-2" style={{backgroundColor: 'var(--color-secundario)'}}>
              CarPush
            </span>

            <h2 className="fw-bold mb-4">
              {t.sobreNosotros}
            </h2>

            <p className="lead text-secondary">
              {t.sobreDesc1}
            </p>

            <p>
              {t.sobreDesc2}
            </p>

            <div className="d-flex gap-4 mt-4 flex-wrap ">
              <div>
                <h3 className="fw-bold mb-0" style={{color: 'var(--color-secundario)'}}>+500</h3>
                <small>{t.vehiculosVendidos}</small>
              </div>

              <div>
                <h3 className="fw-bold mb-0" style={{color: 'var(--color-secundario)'}}>+1</h3>
                <small>{t.anosExperiencia}</small>
              </div>

              <div>
                <h3 className="fw-bold mb-0" style={{color: 'var(--color-secundario)'}}>24/7</h3>
                <small>{t.soporteCliente}</small>
              </div>
            </div>
          </div>

        </div>
      </section>
      <SeccionesExtra t = { t }/>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// COCHES
// ═══════════════════════════════════════════════════════════════
function PaginaCoches({ t, auth }) {
  const [coches,   setCoches]   = useState([])
  const [marcas,   setMarcas]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState('')
  const [marcaId,  setMarcaId]  = useState('')
  const [tipo,     setTipo]     = useState('')
  const [precioMax,setPrecioMax]= useState('')
  const [busqueda, setBusqueda] = useState('')
  const [toast,    setToast]    = useState('')

  useEffect(() => {
    apiFetch('/cars/index.php?action=marcas')
      .then(d => setMarcas(d.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setCargando(true); setError('')
    const p = new URLSearchParams()
    if (marcaId)   p.set('marca_id',  marcaId)
    if (tipo)      p.set('tipo',      tipo)
    if (precioMax) p.set('precio_max',precioMax)
    if (busqueda)  p.set('q',         busqueda)
    const q = p.toString() ? '?' + p : ''
    apiFetch(`/cars/index.php${q}`)
      .then(d => setCoches(d.data || []))
      .catch(() => setError(t.errorApi))
      .finally(() => setCargando(false))
  }, [marcaId, tipo, precioMax, busqueda])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleAddFav = async coche => {
    if (!auth.usuario) { showToast(t.iniciaSesionFav); return }
    try {
      await apiFetch('/favorites/index.php', { method: 'POST', body: JSON.stringify({ coche_id: coche.id }) })
      showToast(`${coche.marca_nombre} ${coche.modelo} ${t.anadidoFav}`)
    } catch (e) { showToast(e.message) }
  }

  const handleAddCart = async coche => {
    if (!auth.usuario) { showToast(t.iniciaSesionCart); return }
    try {
      await apiFetch('/cart/index.php', { method: 'POST', body: JSON.stringify({ coche_id: coche.id }) })
      showToast(`${coche.marca_nombre} ${coche.modelo} ${t.anadidoCart}`)
    } catch (e) { showToast(e.message) }
  }

  return (
    <div style={{ paddingTop: 70 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999,
          background: 'var(--color-secundario)', color: 'white', padding: '10px 20px',
          borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          {toast}
        </div>
      )}
      <section>
        <div className="text-center mb-4">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.busquedaRapida}</b></h4>
          <h1>{t.filtra}</h1>
        </div>
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <input type="text" className="form-control" style={{ maxWidth: 200 }}
            placeholder={`${t.buscar}...`} value={busqueda}
            onChange={e => setBusqueda(e.target.value)} />
          <select className="form-select" style={{ maxWidth: 180 }} value={marcaId}
            onChange={e => setMarcaId(e.target.value)}>
            <option value="">{t.filtrarMarca}</option>
            {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth: 160 }} value={tipo}
            onChange={e => setTipo(e.target.value)}>
            <option value="">{t.filtrarTipo}</option>
            <option value="SUV">SUV</option>
            <option value="Deportivo">Deportivo</option>
            <option value="4x4">4x4</option>
          </select>
          <input type="number" className="form-control" style={{ maxWidth: 150 }}
            placeholder={t.precioMax} value={precioMax}
            onChange={e => setPrecioMax(e.target.value)} />
          <button className="boton-reservar"
            onClick={() => { setMarcaId(''); setTipo(''); setPrecioMax(''); setBusqueda('') }}>
            {t.limpiar}
          </button>
        </div>
        {cargando && <p className="text-center text-muted py-4">{t.cargando}</p>}
        {error    && <p className="text-center text-danger py-4">{error}</p>}
        {!cargando && !error && <p className="text-muted mb-4">{coches.length} {t.encontrados}</p>}
        <div className="row g-4">
          {coches.map(c => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={c.id}>
              <TarjetaCoche c={c} t={t} onFav={handleAddFav} onCart={handleAddCart} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TARJETA COCHE
// ═══════════════════════════════════════════════════════════════
function TarjetaCoche({ c, t, onFav, onCart }) {
  const tipoBg = { SUV: '#2d6a4f', Deportivo: 'var(--color-secundario)', '4x4': '#b5850a' }
  return (
    <div className="coche-card shadow-sm h-100 d-flex flex-column">
      <div style={{ height: 155, overflow: 'hidden',
        background: 'var(--color-primario)', borderRadius: '12px 12px 0 0' }}>
        <ImagenCoche imagen_url={c.imagen_url} alt={`${c.marca_nombre} ${c.modelo}`} height={155} />
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h6 className="fw-bold mb-0" style={{ lineHeight: 1.2 }}>{c.marca_nombre} {c.modelo}</h6>
          <span className="badge ms-1 flex-shrink-0"
            style={{ background: tipoBg[c.tipo] || '#555', fontSize: '0.65rem' }}>{c.tipo}</span>
        </div>
        <p className="text-muted small mb-2">{c.anio} · {Number(c.kilometros).toLocaleString()} {t.km} · {c.color}</p>
        <p className="small flex-grow-1 text-muted" style={{ lineHeight: 1.4 }}>
          {c.descripcion?.substring(0, 75)}…
        </p>
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold" style={{ color: '#fffff', fontSize: '1.05rem' }}>
              {Number(c.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
            <button className="btn-naked" style={{ fontSize: '1.2rem', color: '#bbb' }}
              title={t.addFav} onClick={() => onFav(c)}>♡</button>
          </div>
          <button className="boton-reservar w-100" style={{ fontSize: '0.85rem' }}
            onClick={() => onCart(c)}>{t.addCarrito}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FAVORITOS
// ═══════════════════════════════════════════════════════════════
function PaginaFavoritos({ t, auth, onNavigate }) {
  const [items,    setItems]    = useState([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(() => {
    setCargando(true)
    apiFetch('/favorites/index.php')
      .then(d => setItems(d.data || []))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => { if (auth.usuario) cargar(); else setCargando(false) }, [auth.usuario]);

  const quitar = async favId => {
    await apiFetch(`/favorites/index.php?id=${favId}`, { method: 'DELETE' })
    cargar()
  }

  if (!auth.usuario) return (
    <div className="text-center" style={{ paddingTop: 140 }}>
      <h4>{t.noFavs}</h4><br />
      <button className="boton-reservar" onClick={() => onNavigate('login')}>{t.login}</button>
    </div>
  )

  return (
    <div style={{ paddingTop: 70 }}>
      <section>
        <div className="text-center mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.favoritos}</b></h4>
        </div>
        {cargando && <p className="text-center text-muted">{t.cargando}</p>}
        {!cargando && items.length === 0 && (
          <div className="text-center py-5">
            <p>{t.noFavs}</p>
            <button className="boton-reservar mt-2" onClick={() => onNavigate('coches')}>{t.explorar}</button>
          </div>
        )}
        <div className="row g-4">
          {items.map(c => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={c.favorito_id}>
              <div className="coche-card shadow-sm p-3 h-100 d-flex flex-column">
                <div className="text-center mb-2" style={{ fontSize: '2.5rem' }}></div>
                <h6 className="fw-bold">{c.marca_nombre} {c.modelo}</h6>
                <p className="text-muted small">{c.anio} · {c.tipo} · {c.color}</p>
                <p className="fw-bold mt-auto textWhite" style={{ color: 'var(--color-secundario)' }}>
                  {Number(c.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
                <button className="boton-reservar mt-2 w-100"
                  style={{ background: 'transparent', border: '1px solid var(--color-secundario)', color: 'var(--color-secundario)' }}
                  onClick={() => quitar(c.favorito_id)}>
                  {t.quitar}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CARRITO
// ═══════════════════════════════════════════════════════════════
function PaginaCarrito({ t, auth, onNavigate }) {
  const [items,    setItems]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [cargando, setCargando] = useState(true)
  const [checkout, setCheckout] = useState(null)  // coche seleccionado para comprar
  const [factura,  setFactura]  = useState(null)  // factura generada

  const cargar = useCallback(() => {
    setCargando(true)
    apiFetch('/cart/index.php')
      .then(d => { setItems(d.data || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => { if (auth.usuario) cargar(); else setCargando(false) }, [auth.usuario])

  const quitar = async carritoId => {
    await apiFetch(`/cart/index.php?id=${carritoId}`, { method: 'DELETE' })
    cargar()
  }

  const onCompraRealizada = (facturaData) => {
    setFactura(facturaData)
    setCheckout(null)
    cargar()
  }

  if (!auth.usuario) return (
    <div className="text-center" style={{ paddingTop: 140 }}>
      <h4>{t.noCarrito}</h4><br />
      <button className="boton-reservar" onClick={() => onNavigate('login')}>{t.login}</button>
    </div>
  )

  return (
    <div style={{ paddingTop: 70 }}>
      <section>
        <div className="text-center mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.carrito}</b></h4>
        </div>

        {/* Factura modal */}
        {factura && <ModalFactura t={t} factura={factura} onCerrar={() => setFactura(null)} />}

        {/* Checkout modal */}
        {checkout && (
          <ModalCheckout t={t} coche={checkout} usuario={auth.usuario}
            onCerrar={() => setCheckout(null)}
            onCompra={onCompraRealizada} />
        )}

        {cargando && <p className="text-center text-muted">{t.cargando}</p>}
        {!cargando && items.length === 0 && (
          <div className="text-center py-5">
            <p>{t.noCarrito}</p>
            <button className="boton-reservar mt-2" onClick={() => onNavigate('coches')}>{t.explorar}</button>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="row g-4 mb-4">
              {items.map(c => (
                <div className="col-sm-6 col-lg-4" key={c.carrito_id}>
                  <div className="coche-card shadow-sm p-3 h-100 d-flex flex-column">
                    <div className="text-center mb-2" style={{ fontSize: '2.5rem' }}></div>
                    <h6 className="fw-bold">{c.marca_nombre} {c.modelo}</h6>
                    <p className="text-muted small">{c.anio} · {c.tipo} · {c.color}</p>
                    <p className="text-muted small">{c.descripcion?.substring(0, 60)}…</p>
                    <p className="fw-bold mt-auto textWhite" style={{ color: 'var(--color-secundario)', fontSize: '1.1rem' }}>
                      {Number(c.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                    <div className="d-flex gap-2 mt-2">
                      <button className="boton-reservar flex-grow-1" style={{ fontSize: '0.85rem' }}
                        onClick={() => setCheckout(c)}>
                        {t.procederPago}
                      </button>
                      <button className="boton-reservar flex-shrink-0"
                        style={{ backgroundColor: 'white', border: '1px solid var(--color-secundario)', color: 'var(--color-secundario)', fontSize: '0.85rem' }}
                        onClick={() => quitar(c.carrito_id)}>
                        {t.cancelarPago}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MODAL CHECKOUT
// ═══════════════════════════════════════════════════════════════
function ModalCheckout({ t, coche, usuario, onCerrar, onCompra }) {
  const [form,    setForm]    = useState({ nombre: usuario.nombre, email: usuario.email, telefono: '', direccion: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const d = await apiFetch('/orders/index.php', {
        method: 'POST',
        body: JSON.stringify({ coche_id: coche.id, ...form }),
      })
      onCompra(d.factura)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 30, maxWidth: 480, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <h4 className="fw-bold mb-1 text-black">{t.checkout}</h4>
        <p className="text-muted mb-4">
          {coche.marca_nombre} {coche.modelo} —{' '}
          <span style={{ color: 'var(--color-secundario)', fontWeight: 700 }}>
            {Number(coche.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>
        </p>
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form onSubmit={submit}>
          {[
            [t.nombre,    'nombre',    'text'],
            [t.email,     'email',     'email'],
            [t.telefono,  'telefono',  'tel'],
            [t.direccion, 'direccion', 'text'],
          ].map(([label, key, type]) => (
            <div className="mb-3" key={key}>
              <label className="d-block mb-1 fw-semibold" style={{ color: '#333' }}>{label}</label>
              <input type={type} className="form-control" style={{ border: '1px solid #ccc', borderRadius: 8 }}
                
                // Validación del telefono, la dirección y el nombre

                value={form[key]}
                required={true}

                minLength={
                  key === 'telefono'
                    ? 9
                    : key === 'direccion'
                    ? 5
                    : key === 'nombre'
                    ? 3
                    : undefined
                }

                maxLength={key === 'telefono' ? 9 : undefined}

                pattern={
                  key === 'telefono'
                    ? '[0-9]{9}'
                    : undefined
                }
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />

            </div>
          ))}
          <div className="d-flex gap-3 mt-4">
            <button type="submit" className="boton-reservar flex-grow-1" disabled={loading}>
              {loading ? t.cargando : `✅ ${t.confirmarCompra}`}
            </button>
            <button type="button" className="boton-reservar flex-shrink-0"
              style={{ background: 'transparent', border: '1px solid #ccc', color: '#666' }}
              onClick={onCerrar}>{t.cancelar}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MODAL FACTURA
// ═══════════════════════════════════════════════════════════════
function ModalFactura({ t, factura, onCerrar }) {
  const fecha = new Date(factura.creado_en).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 0, maxWidth: 480, width: '100%',
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

        {/* Cabecera */}
        <div style={{ background: 'var(--color-secundario)', padding: '24px 30px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <h3 className="text-white fw-bold mt-2 mb-1">{t.facturaTitle}</h3>
          <p className="text-white" style={{ opacity: 0.85, margin: 0 }}>{t.facturaSubtitle}</p>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: '24px 30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody className='text-black'>
              {[
                [t.facturaId,        `#${String(factura.id).padStart(6, '0')}`],
                [t.facturaCoche,     `${factura.marca_nombre} ${factura.modelo}`],
                [t.facturaComprador, factura.nombre_comprador],
                [t.facturaEmail,     factura.email_comprador],
                [t.facturaTelefono,  factura.telefono || '—'],
                [t.facturaDireccion, factura.direccion || '—'],
                [t.facturaFecha,     fecha],
              ].map(([label, valor]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 0', color: '#888', fontSize: '0.9rem', width: '40%' }}>{label}</td>
                  <td style={{ padding: '10px 0', fontWeight: 600, fontSize: '0.95rem' }}>{valor}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '14px 0', fontWeight: 700, fontSize: '1rem' }}>{t.facturaTotal}</td>
                <td style={{ padding: '14px 0', fontWeight: 700, fontSize: '1.2rem',
                  color: 'var(--color-secundario)' }}>
                  {Number(factura.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pie */}
        <div style={{ padding: '0 30px 24px', textAlign: 'center' }}>
          <button className="boton-reservar px-5 py-2" onClick={onCerrar}>{t.cerrarFactura}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MIS PEDIDOS
// ═══════════════════════════════════════════════════════════════
function PaginaPedidos({ t, auth, onNavigate }) {
  const [pedidos,  setPedidos]  = useState([])
  const [cargando, setCargando] = useState(true)
  const [facturaVer, setFacturaVer] = useState(null)

  useEffect(() => {
    if (!auth.usuario) { setCargando(false); return }
    apiFetch('/orders/index.php')
      .then(d => setPedidos(d.data || []))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [auth.usuario])

  if (!auth.usuario) return (
    <div className="text-center" style={{ paddingTop: 140 }}>
      <button className="boton-reservar" onClick={() => onNavigate('login')}>{t.login}</button>
    </div>
  )

  return (
    <div style={{ paddingTop: 70 }}>
      {facturaVer && <ModalFactura t={t} factura={facturaVer} onCerrar={() => setFacturaVer(null)} />}
      <section>
        <div className="text-center mb-5">
          <h4 style={{ color: 'var(--color-secundario)' }}><b>{t.misPedidos}</b></h4>
        </div>
        {cargando && <p className="text-center text-muted">{t.cargando}</p>}
        {!cargando && pedidos.length === 0 && (
          <div className="text-center py-5">
            <p>{t.noPedidos}</p>
            <button className="boton-reservar mt-2" onClick={() => onNavigate('coches')}>{t.explorar}</button>
          </div>
        )}
        <div className="row g-4">
          {pedidos.map(p => (
            <div className="col-md-6" key={p.id}>
              <div className="coche-card shadow-sm p-4 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0">{p.marca_nombre} {p.modelo}</h6>
                  <span className="badge" style={{ background: 'var(--color-secundario)', fontSize: '0.7rem' }}>
                    #{String(p.id).padStart(6, '0')}
                  </span>
                </div>
                <p className="text-muted small mb-1">
                  {new Date(p.creado_en).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="fw-bold mt-auto" style={{ color: 'var(--color-secundario)', fontSize: '1.1rem' }}>
                  {Number(p.precio).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
                <button className="boton-reservar mt-2 w-100" style={{ fontSize: '0.85rem' }}
                  onClick={() => setFacturaVer(p)}>
                  📄 Ver factura
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREFERENCIAS
// ═══════════════════════════════════════════════════════════════
function PaginaPreferencias({ t, idioma, tema, onAplicar, onNavigate }) {
  const [idiomaL, setIdiomaL] = useState(idioma)
  const [temaL,   setTemaL]   = useState(tema)
  return (
    <div style={{ paddingTop: 70 }}>
      <div className="cajita-pref">
        <fieldset>
          <legend>{t.ajustes}</legend>
          <form onSubmit={e => { e.preventDefault(); onAplicar(idiomaL, temaL); onNavigate('inicio') }}>
            <div className="form-group mb-3">
              <label className="d-block mb-1">{t.idioma}</label>
              <select className="form-select" value={idiomaL} onChange={e => setIdiomaL(e.target.value)}>
                <option value="espanol">{t.espanol}</option>
                <option value="ingles">{t.ingles}</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label className="d-block mb-1">{t.tema}</label>
              <select className="form-select" value={temaL} onChange={e => setTemaL(e.target.value)}>
                <option value="claro">{t.claro}</option>
                <option value="oscuro">{t.oscuro}</option>
              </select>
            </div>
            <input type="submit" value={t.aplicar}
              style={{ background: 'var(--color-secundario)', color: 'white', cursor: 'pointer' }} />
          </form>
          <br />
          <form onSubmit={e => { e.preventDefault(); onAplicar('espanol', 'claro'); onNavigate('inicio') }}>
            <input className='boton-oscurito' type="submit" value={t.resetear}
              style={{ background: 'transparent', border: '1px solid var(--color-secundario)', color: 'var(--color-secundario)', cursor: 'pointer' }} />
          </form>
        </fieldset>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
function PaginaLogin({ t, auth, onNavigate }) {
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await auth.login(email, pass); onNavigate('inicio') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 70 }}>
      <div className="cajita-pref">
        <fieldset>
          <legend>{t.login}</legend>
          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="d-block mb-1">{t.email}</label>
              <input type="email" className="form-control" minLength={5} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="d-block mb-1">{t.password}</label>
              <input type="password" className="form-control" minLength={6} value={pass} onChange={e => setPass(e.target.value)} />
            </div>
            <input type="submit" value={loading ? t.cargando : t.entrar}
              style={{ background: 'var(--color-secundario)', color: 'white', cursor: 'pointer', width: '100%' }} />
          </form>
          <br />
          <p className="text-center small">
            {t.noTienes}{' '}
            <button className="btn-naked fw-semibold" style={{ color: 'var(--color-secundario)' }}
              onClick={() => onNavigate('registro')}>{t.registro}</button>
          </p>
        </fieldset>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// REGISTRO
// ═══════════════════════════════════════════════════════════════
function PaginaRegistro({ t, auth, onNavigate }) {
  const [form,    setForm]    = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 6)       { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    try { await auth.register(form.nombre, form.email, form.password); onNavigate('inicio') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 70 }}>
      <div className="cajita-pref">
        <fieldset>
          <legend>{t.registro}</legend>
          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
          <form onSubmit={submit}>
            {[
              [t.nombre,    'nombre',   'text'],
              [t.email,     'email',    'email'],
              [t.password,  'password', 'password'],
              [t.confirmar, 'confirm',  'password'],
            ].map(([label, key, type]) => (
              <div className="mb-3" key={key}>
                <label className="d-block mb-1">{label}</label>
                <input type={type} className="form-control" required minLength={key === 'nombre' ? 3 : key === 'password' || key === 'confirm' ? 6 : undefined}
                  value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <input type="submit" value={loading ? t.cargando : t.crearCuenta}
              style={{ background: 'var(--color-secundario)', color: 'white', cursor: 'pointer', width: '100%' }} />
          </form>
          <br />
          <p className="text-center small">
            {t.yaTienes}{' '}
            <button className="btn-naked fw-semibold" style={{ color: 'var(--color-secundario)' }}
              onClick={() => onNavigate('login')}>{t.login}</button>
          </p>
        </fieldset>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
function Footer({ t }) {
  return (
    <footer className="w-100 m-0">
      <div className="w-100 d-flex justify-content-center">
        <p className="m-0 p-3">
          <a href="./politicas/politicaCookies.pdf" className='text-decoration-none text-white footy'>{t.politicaCookie}</a>{' | '}
          <a href="#" className="text-decoration-none text-white footy">{t.avisoLegal}</a>{' | '}
          <a href="#" className="text-decoration-none text-white footy">{t.politicaPriv}</a>
        </p>
      </div>
      <div className="linea" />
      <div className="d-flex justify-content-center flex-wrap w-100">
        <p className="m-0 p-3 text-white">{t.copyright}</p>
        <p className="m-0 p-3 text-white">
          {t.hechoPor}{' '}
          <a href="#" className="text-decoration-none text-white footy">Rau00</a>
        </p>
      </div>
    </footer>
  )
}
