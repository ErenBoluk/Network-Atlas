import { useEffect, useRef } from 'react'
import { ArrowUpRight, Bookmark, Check, CheckCircle2, Circle, Play, X, BookOpen, PencilLine, FlaskConical } from 'lucide-react'
import { STATUS_LABELS } from '../lib/learning.js'

export default function TopicDialog({ topic, stage, progress, onClose, onStatus, onBookmark, onNote }) {
  const ref = useRef(null)
  const status = progress.statuses[topic.id] ?? 'todo'
  const saved = progress.bookmarks.includes(topic.id)

  useEffect(() => {
    const dialog = ref.current
    // StrictMode repeats setup in development. Opening is idempotent; removing
    // this component removes the native dialog, so no synthetic close is needed.
    if (!dialog.open) dialog.showModal()
  }, [])

  function closeFromBackdrop(event) {
    if (event.target !== ref.current) return
    const box = ref.current.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) ref.current.close()
  }

  return <dialog ref={ref} className="topic-dialog" aria-labelledby="topic-title" onClose={onClose} onClick={closeFromBackdrop}>
    <div className="dialog-toolbar">
      <span className={`eyebrow text-${stage.color}`}>AŞAMA {stage.number} <span className="mx-2 opacity-40">/</span> {stage.title}</span>
      <div className="flex gap-2">
        <button className={`icon-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Kaydedilenlerden kaldır' : 'Konuyu kaydet'} aria-pressed={saved} onClick={() => onBookmark(topic.id)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button>
        <button className="icon-button" aria-label="Konu ayrıntılarını kapat" onClick={() => ref.current.close()}><X size={20} /></button>
      </div>
    </div>
    <div className="dialog-body">
      <div className={`stage-icon color-${stage.color} mb-6`}><BookOpen size={23} /></div>
      <h2 id="topic-title">{topic.title}</h2>
      <p className="dialog-description">{topic.description}</p>
      <div className="flex flex-wrap gap-2 mt-5">{topic.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>

      <fieldset className="status-fieldset">
        <legend>Bu konudaki ilerlemen</legend>
        <div className="status-options">{Object.entries(STATUS_LABELS).map(([value, label]) => {
          const Icon = value === 'done' ? CheckCircle2 : value === 'learning' ? Play : Circle
          return <button key={value} className={status === value ? `selected status-${value}` : ''} aria-pressed={status === value} onClick={() => onStatus(topic.id, value)}><Icon size={16} />{label}</button>
        })}</div>
      </fieldset>

      <section className="dialog-section">
        <h3>Neler öğreneceksin?</h3>
        <ul className="objectives">{topic.objectives.map(objective => <li key={objective}><Check size={16} /><span>{objective}</span></li>)}</ul>
      </section>
      <section className="dialog-section">
        <div className="section-label"><h3>Öğrenme kaynakları</h3><span>{topic.resources.length} kaynak</span></div>
        <div className="dialog-resources">{topic.resources.map(resource => <a href={resource.url} target="_blank" rel="noopener noreferrer" key={resource.url} className="dialog-resource">
          <span className="resource-letter">{resource.provider.slice(0, 1)}</span>
          <span className="min-w-0 flex-1"><strong>{resource.title}</strong><small>{resource.provider} <span>·</span> {resource.type} <span>·</span> {resource.language}</small></span><ArrowUpRight size={18} />
        </a>)}</div>
      </section>
      <section className="lab-note"><FlaskConical size={21} /><div><h3>Şimdi sıra sende.</h3><p>{topic.lab}</p></div></section>
      <section className="dialog-section">
        <label className="note-label" htmlFor="topic-note"><PencilLine size={17} />Kendi notların</label>
        <textarea id="topic-note" maxLength={10000} value={progress.notes[topic.id] ?? ''} onChange={event => onNote(topic.id, event.target.value)} placeholder="Öğrendiğin bir şeyi, bir soruyu veya sonraki adımını yaz…" rows={4} />
        <p className="note-hint">Notların bu tarayıcıda otomatik saklanır.</p>
      </section>
    </div>
    <div className="dialog-footer"><span>{STATUS_LABELS[status]}</span><button className="primary-button" onClick={() => ref.current.close()}>Yol haritasına dön <Check size={16} /></button></div>
  </dialog>
}
