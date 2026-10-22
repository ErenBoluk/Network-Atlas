import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Cloud, Command, Compass, ExternalLink, Globe2, GraduationCap, Grid2X2, Layers, LayoutList, LocateFixed, Menu, Moon, Network, Route, Search, Server, ShieldCheck, Sparkles, Sun, Workflow, Wifi, X } from 'lucide-react'
import { stages, topics, resources, resourceCount, sourceRoadmap } from './data/roadmap.js'
import { filterTopics, getStats, nextTopic, normalizeSearch, parseProgress, STATUS_LABELS, STORAGE_KEY } from './lib/learning.js'
import TopicDialog from './components/TopicDialog.jsx'

const icons = { network: Network, layers: Layers, locate: LocateFixed, workflow: Workflow, route: Route, server: Server, shield: ShieldCheck, wifi: Wifi, cloud: Cloud, activity: Activity }
const views = [
  { id: 'roadmap', label: 'Yol haritası', Icon: Compass },
  { id: 'resources', label: 'Kaynak kütüphanesi', Icon: BookOpen },
  { id: 'saved', label: 'Kaydedilenler', Icon: Bookmark },
]

function loadProgress() {
  try { return parseProgress(localStorage.getItem(STORAGE_KEY), topics) }
  catch { return parseProgress(null, topics) }
}

function NetworkIllustration() {
  return <div className="network-illustration" aria-hidden="true">
    <div className="illustration-grid" />
    <svg viewBox="0 0 430 280" className="network-lines">
      <defs><linearGradient id="line-color" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7eacf4" /><stop offset="1" stopColor="#c5d7ee" /></linearGradient></defs>
      <g stroke="url(#line-color)" fill="none" strokeWidth="1.4"><path d="M215 131 100 67M215 131 335 73M215 131 97 211M215 131 330 214"/><path strokeDasharray="4 6" d="M100 67 335 73 330 214 97 211Z"/><ellipse cx="215" cy="131" rx="147" ry="94" stroke="#e0e8f3"/><ellipse cx="215" cy="131" rx="105" ry="126" stroke="#e6ecf5" transform="rotate(32 215 131)"/></g>
      <g fill="#fff" stroke="#90b1e5" strokeWidth="2"><circle cx="100" cy="67" r="4"/><circle cx="335" cy="73" r="4"/><circle cx="97" cy="211" r="4"/><circle cx="330" cy="214" r="4"/></g>
      <circle className="moving-packet" cx="154" cy="97" r="3" fill="#3381ef" />
    </svg>
    <div className="network-center"><Globe2 size={43} strokeWidth={1.15} /></div>
    <div className="network-node node-one"><Server size={21} /><span>192.168.1.1</span></div>
    <div className="network-node node-two"><Cloud size={23} /><span>Cloud</span></div>
    <div className="network-node node-three"><Wifi size={23} /><span>Wireless</span></div>
    <div className="network-node node-four"><ShieldCheck size={23} /><span>Secure</span></div>
    <span className="connected-label"><span />Her şey birbirine bağlı.</span>
  </div>
}

function Sidebar({ view, category, progress, stats, onNavigate, onCategory, onClose }) {
  return <div className="sidebar-content">
    <a className="brand" href="#" onClick={event => { event.preventDefault(); onNavigate('roadmap') }} aria-label="Network Atlas ana sayfa"><span className="brand-mark"><Layers size={24} strokeWidth={1.7} /></span><span>network<span className="brand-light">atlas</span><small>BAĞLANTILARIN ÖTESİNDE.</small></span></a>
    {onClose && <button className="mobile-close icon-button" aria-label="Menüyü kapat" onClick={onClose}><X size={20} /></button>}
    <div className="sidebar-scroll">
    <div className="workspace-label">ÇALIŞMA ALANIN</div>
    <nav className="primary-nav" aria-label="Ana gezinme">{views.map(({ id, label, Icon }) => <button key={id} className={view === id ? 'active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => onNavigate(id)}><Icon size={19} strokeWidth={1.7} /><span>{label}</span>{id === 'saved' && progress.bookmarks.length > 0 && <span className="nav-count">{progress.bookmarks.length}</span>}{id === 'roadmap' && <ChevronRight size={15} className="nav-chevron" />}</button>)}</nav>
    <div className="stage-nav-header"><span>ÖĞRENME AŞAMALARI</span><span>{stages.length}</span></div>
    <nav className="stage-nav" aria-label="Öğrenme aşamaları">{stages.map(stage => {
      const stageTopics = topics.filter(t => t.category === stage.id)
      const complete = stageTopics.every(topic => progress.statuses[topic.id] === 'done')
      return <button key={stage.id} className={view === 'roadmap' && category === stage.id ? 'selected' : ''} aria-pressed={view === 'roadmap' && category === stage.id} onClick={() => onCategory(stage.id)}><span className="stage-nav-number">{complete ? <Check size={13} /> : stage.number}</span><span>{stage.title}</span><span className="stage-nav-dot" data-done={complete} /></button>
    })}</nav>
    </div>
    <div className="sidebar-bottom">
      <div className="sidebar-progress"><div className="flex items-center gap-2"><span className="mini-cap"><GraduationCap size={17} /></span><span className="sidebar-progress-title">Her gün bir adım.</span><strong>%{stats.percent}</strong></div><div className="progress-track"><span style={{ width: `${stats.percent}%` }} /></div><p>{stats.completed} / {stats.total} konu tamamlandı</p></div>
      <a className="source-sidebar" href={sourceRoadmap} target="_blank" rel="noopener noreferrer"><span className="source-logo">r.</span><span>roadmap.sh’den ilhamla<small>Öğrenmek için tasarlandı.</small></span><ArrowUpRight size={15} /></a>
    </div>
  </div>
}

function StageCard({ stage, stageTopics, progress, onOpen, layout }) {
  const Icon = icons[stage.icon]
  const done = stageTopics.filter(topic => progress.statuses[topic.id] === 'done').length
  return <article className={`stage-card ${layout === 'list' ? 'list-layout' : ''}`}>
    <div className="stage-card-heading"><span className={`stage-icon color-${stage.color}`}><Icon size={23} strokeWidth={1.7} /></span><span className="stage-card-level">{stage.level}</span><span className="stage-card-number">{stage.number}</span></div>
    <h3>{stage.title}</h3><p className="stage-subtitle">{stage.subtitle}</p>
    <div className="topic-list">{stageTopics.map(topic => {
      const status = progress.statuses[topic.id] ?? 'todo'
      return <button key={topic.id} className={`topic-row topic-${status}`} onClick={() => onOpen(topic)}><span className="topic-state">{status === 'done' ? <CheckCircle2 size={16} /> : status === 'learning' ? <span className="learning-indicator" /> : <Circle size={16} />}</span><span>{topic.title}</span>{progress.bookmarks.includes(topic.id) && <Bookmark className="topic-bookmark" size={13} fill="currentColor" />}<ChevronRight size={15} className="topic-arrow" /><span className="sr-only"> — {STATUS_LABELS[status]}, ayrıntıları aç</span></button>
    })}</div>
    <div className="stage-card-footer"><span><BookOpen size={13} />{stageTopics.length} konu</span><span>{done > 0 ? `${done}/${stageTopics.length} tamamlandı` : 'Keşfetmeye başla'}<ArrowRight size={13} /></span></div>
  </article>
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [view, setView] = useState('roadmap')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState('grid')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [toast, setToast] = useState('')
  const [storageError, setStorageError] = useState(false)
  const [resourceType, setResourceType] = useState('all')
  const searchRef = useRef(null)
  const menuRef = useRef(null)
  const contentRef = useRef(null)
  const stats = getStats(topics, progress.statuses)
  const next = nextTopic(topics, progress.statuses)
  const currentView = views.find(v => v.id === view)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); setStorageError(false) }
    catch { setStorageError(true) }
    document.documentElement.dataset.theme = progress.theme
  }, [progress])

  useEffect(() => {
    const handleKey = event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer) }, [toast])

  const filtered = useMemo(() => filterTopics(topics, { query, category, status, bookmarked: view === 'saved' }, progress), [query, category, status, view, progress])
  const visibleStages = stages.map(stage => ({ ...stage, visibleTopics: filtered.filter(topic => topic.category === stage.id) })).filter(stage => stage.visibleTopics.length)
  const visibleResources = Object.values(resources).filter(resource => {
    const categoryMatch = category === 'all' || topics.some(topic => topic.category === category && topic.resources.includes(resource))
    return categoryMatch && (resourceType === 'all' || resource.type === resourceType) && (!query || normalizeSearch(`${resource.title} ${resource.provider} ${resource.type}`).includes(normalizeSearch(query)))
  })

  function navigate(nextView) { setView(nextView); setCategory('all'); setStatus('all'); setQuery(''); setResourceType('all'); menuRef.current?.close(); window.scrollTo({ top: 0, behavior: 'instant' }) }
  function chooseCategory(id) { setCategory(id); setView('roadmap'); setQuery(''); setStatus('all'); menuRef.current?.close(); requestAnimationFrame(() => contentRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })) }
  function bookmark(id) { const saved = progress.bookmarks.includes(id); setProgress(previous => ({ ...previous, bookmarks: saved ? previous.bookmarks.filter(value => value !== id) : [...previous.bookmarks, id] })); setToast(saved ? 'Konu kaydedilenlerden kaldırıldı.' : 'Konu kaydedilenlere eklendi.') }
  function updateStatus(id, value) { setProgress(previous => ({ ...previous, statuses: { ...previous.statuses, [id]: value } })); setToast(value === 'done' ? 'Bir adım daha. Konu tamamlandı!' : 'İlerlemen güncellendi.') }
  function clearFilters() { setQuery(''); setCategory('all'); setStatus('all'); setResourceType('all') }

  const sidebarProps = { view, category, progress, stats, onNavigate: navigate, onCategory: chooseCategory }

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">İçeriğe geç</a>
    <aside className="desktop-sidebar"><Sidebar {...sidebarProps} /></aside>
    <dialog className="mobile-menu" ref={menuRef} aria-label="Gezinme menüsü"><Sidebar {...sidebarProps} onClose={() => menuRef.current.close()} /></dialog>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb"><button className="icon-button menu-trigger" aria-label="Gezinme menüsünü aç" onClick={() => menuRef.current.showModal()}><Menu size={21} /></button><span className="breadcrumb-home">Öğrenme alanın</span><ChevronRight size={13} className="breadcrumb-separator" /><span>{view === 'roadmap' ? 'Network Engineer' : currentView.label}</span></div>
        <div className="topbar-actions"><div className="global-search"><Search size={16} /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} aria-label="Konu veya kaynak ara" placeholder="Bir konu ara…" />{query ? <button className="search-clear" aria-label="Aramayı temizle" onClick={() => setQuery('')}><X size={14} /></button> : <kbd><Command size={10} /> K</kbd>}</div><span className="topbar-divider" /><button className="icon-button theme-toggle" aria-label={progress.theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'} onClick={() => setProgress(previous => ({ ...previous, theme: previous.theme === 'dark' ? 'light' : 'dark' }))}>{progress.theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button><span className="profile-avatar" title="Kişisel öğrenme alanı">E</span></div>
      </header>

      <main id="main-content" className="main-content">
        {storageError && <p className="storage-notice" role="alert">Tarayıcı depolamasına erişilemiyor. Değişikliklerin bu oturum boyunca kullanılabilir; sayfa yenilendiğinde kaybolabilir.</p>}
        {view === 'roadmap' ? <>
          <section className="hero"><div className="hero-copy"><span className="eyebrow hero-eyebrow"><span />MERAKLA BAŞLA. BAĞLANTILAR KUR.</span><h1>Öğrenmenin<br />bir yolu var.</h1><p>Ağ mühendisliğine uzanan yolculuğun.<br className="desktop-break" /> Temelleri keşfet, bağlantıları anla, kendi yolunu çiz.</p><div className="hero-actions"><button className="primary-button" onClick={() => next ? setSelectedTopic(next) : contentRef.current?.scrollIntoView({ behavior: 'auto' })}>{stats.completed === stats.total ? 'Yolculuğunu keşfet' : stats.completed || stats.learning ? 'Kaldığın yerden devam et' : 'Yolculuğa başla'}<ArrowRight size={16} /></button><a href={sourceRoadmap} className="hero-source" target="_blank" rel="noopener noreferrer">Orijinal roadmap<ArrowUpRight size={14} /></a></div><div className="hero-meta"><span><CheckCircle2 size={13} />Kendi hızında öğren</span><span className="meta-dot" /><span>Başlangıçtan uzmanlığa</span></div></div><NetworkIllustration /></section>

          <section className="journey-summary" aria-label="Öğrenme özeti"><div className="summary-intro"><span className="summary-icon"><Route size={22} strokeWidth={1.6} /></span><div><strong>Senin yolun. Senin hızın.</strong><p>Küçük adımlar, sağlam bağlantılar.</p></div></div><div className="summary-stat"><strong>{stages.length}<span>aşama</span></strong><small>Birbirini tamamlayan adımlar</small></div><div className="summary-stat"><strong>{topics.length}<span>konu</span></strong><small>Temelden ileri seviyeye</small></div><div className="summary-stat"><strong>{resourceCount}<span>kaynak</span></strong><small>Özenle seçilmiş içerikler</small></div><div className="summary-completion"><div><strong>%{stats.percent}</strong><span>tamamlandı</span></div><div className="progress-track"><span style={{ width: `${stats.percent}%` }} /></div><small>{stats.completed}/{stats.total} konu</small></div></section>
        </> : <section className="view-hero"><span className="eyebrow">KENDİ ÖĞRENME ALANIN</span><h1>{view === 'resources' ? 'Biraz merak. Pek çok kaynak.' : 'Sonra dönmek istediklerin.'}</h1><p>{view === 'resources' ? 'Dokümantasyon, rehberler ve uygulamalar. Bir sonraki keşfin burada.' : 'İlgini çeken konuları bir arada tut. Hazır olduğunda kaldığın yerden devam et.'}</p></section>}

        <section className="curriculum-section" ref={contentRef} aria-labelledby="curriculum-title">
          <div className="curriculum-heading"><div><span className="eyebrow section-eyebrow">{view === 'resources' ? 'KAYNAK KÜTÜPHANESİ' : view === 'saved' ? 'KİŞİSEL KOLEKSİYONUN' : 'BÜYÜK RESMİ GÖR'}</span><h2 id="curriculum-title">{view === 'resources' ? 'Bilgiyi keşfet.' : view === 'saved' ? 'Kaydedilen konular' : 'Adım adım, daha ileri.'}<span>{view === 'resources' ? visibleResources.length : filtered.length}</span></h2><p>{view === 'roadmap' ? 'Her aşama bir sonrakinin kapısını açar. İstediğin yerden başlayabilirsin.' : view === 'saved' ? 'Bir konudaki yer imi simgesiyle kendi koleksiyonunu oluştur.' : 'Doğrudan kaynak sağlayıcılarının içeriklerine ulaş.'}</p></div>{view === 'roadmap' && <div className="layout-toggle" aria-label="Görünüm seçimi"><button aria-label="Kart görünümü" aria-pressed={layout === 'grid'} className={layout === 'grid' ? 'active' : ''} onClick={() => setLayout('grid')}><Grid2X2 size={17} /></button><button aria-label="Liste görünümü" aria-pressed={layout === 'list'} className={layout === 'list' ? 'active' : ''} onClick={() => setLayout('list')}><LayoutList size={18} /></button></div>}</div>

          <div className="filter-bar"><div className="stage-filter-tabs"><button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>Tüm aşamalar</button><button className={category === 'foundations' ? 'active' : ''} onClick={() => setCategory('foundations')}>Temeller</button><label className="select-wrap"><span className="sr-only">Aşamaya göre filtrele</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="all">Aşama seç</option>{stages.map(stage => <option key={stage.id} value={stage.id}>{stage.number} — {stage.title}</option>)}</select><ChevronDown size={13} /></label></div><label className="status-filter"><span className="sr-only">{view === 'resources' ? 'Kaynak türüne göre filtrele' : 'İlerlemeye göre filtrele'}</span><span className="filter-indicator" /><select value={view === 'resources' ? resourceType : status} onChange={event => view === 'resources' ? setResourceType(event.target.value) : setStatus(event.target.value)}><option value="all">{view === 'resources' ? 'Tüm kaynak türleri' : 'Tüm durumlar'}</option>{view === 'resources' ? [...new Set(Object.values(resources).map(r => r.type))].map(type => <option key={type}>{type}</option>) : Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={13} /></label></div>

          {query && <div className="search-results-label" role="status">“{query}” için {view === 'resources' ? visibleResources.length : filtered.length} sonuç<button onClick={() => setQuery('')}>Aramayı temizle <X size={12} /></button></div>}
          {view === 'resources' ? <div className="resource-grid">{visibleResources.map(resource => <a className="resource-card" key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer"><div className="resource-card-top"><span className="resource-letter">{resource.provider[0]}</span><span>{resource.type}</span><ArrowUpRight size={17} /></div><h3>{resource.title}</h3><p>{resource.provider}<span>·</span>{resource.language}</p><div className="resource-link">Kaynağı aç<ExternalLink size={13} /></div></a>)}</div> : view === 'saved' ? <div className="saved-grid">{filtered.map(topic => { const stage = stages.find(stage => stage.id === topic.category); const Icon = icons[stage.icon]; return <article className="saved-card" key={topic.id}><div className="flex items-center justify-between"><span className={`stage-icon color-${stage.color}`}><Icon size={21} /></span><button className="icon-button is-saved" aria-label={`${topic.title} konusunu kaydedilenlerden kaldır`} onClick={() => bookmark(topic.id)}><Bookmark size={17} fill="currentColor" /></button></div><small>{stage.title}</small><h3>{topic.title}</h3><p>{topic.description}</p><button className="text-button" onClick={() => setSelectedTopic(topic)}>Konuyu keşfet<ArrowRight size={15} /></button></article> })}</div> : <div className={`stage-grid ${layout === 'list' ? 'is-list' : ''}`}>{visibleStages.map(stage => <StageCard key={stage.id} stage={stage} stageTopics={stage.visibleTopics} progress={progress} onOpen={setSelectedTopic} layout={layout} />)}</div>}

          {(view === 'resources' ? !visibleResources.length : !filtered.length) && <div className="empty-state">{view === 'saved' && !query && category === 'all' && status === 'all' ? <Bookmark size={34} strokeWidth={1.3} /> : <Search size={34} strokeWidth={1.3} />}<h3>{view === 'saved' && !progress.bookmarks.length ? 'Merak ettiklerini burada topla.' : 'Henüz bir eşleşme yok.'}</h3><p>{view === 'saved' && !progress.bookmarks.length ? 'Bir konuyu açıp yer imi simgesine dokun. Daha sonra burada bulabilirsin.' : 'Başka bir kelime dene veya filtreleri kaldır.'}</p><button className="secondary-button" onClick={() => view === 'saved' && !progress.bookmarks.length ? navigate('roadmap') : clearFilters()}>{view === 'saved' && !progress.bookmarks.length ? 'Yol haritasını keşfet' : 'Filtreleri temizle'}<ArrowRight size={15} /></button></div>}
        </section>

        {view === 'roadmap' && category === 'all' && !query && <section className="learning-note"><span className="learning-note-icon"><Sparkles size={21} strokeWidth={1.5} /></span><div><h3>Hepsini bir günde öğrenmek zorunda değilsin.</h3><p>Bir konu seç. Bir kaynak aç. Bir bağlantı daha kur. İlerlemek böyle başlar.</p></div><ArrowDown size={19} /></section>}
        <footer className="page-footer"><span>networkatlas <span className="footer-dot">·</span> Merakla tasarlandı.</span><a href={sourceRoadmap} target="_blank" rel="noopener noreferrer">roadmap.sh’den ilham alan bağımsız öğrenme rehberi<ArrowUpRight size={12} /></a><span>İlerlemen bu tarayıcıda saklanır.</span></footer>
      </main>
    </div>
    {selectedTopic && <TopicDialog key={selectedTopic.id} topic={selectedTopic} stage={stages.find(stage => stage.id === selectedTopic.category)} progress={progress} onClose={() => setSelectedTopic(null)} onStatus={updateStatus} onBookmark={bookmark} onNote={(id, note) => setProgress(previous => ({ ...previous, notes: { ...previous.notes, [id]: note } }))} />}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><CheckCircle2 size={17} />{toast}</>}</div>
  </div>
}
