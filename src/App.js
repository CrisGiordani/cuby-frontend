import { useEffect, useRef, useState } from 'react';
import './App.css';
import Clients from './Clients';

const whatsapp = 'https://wa.me/5561995965833?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20Cuby.';
function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    architecture: <><rect x="8" y="3" width="8" height="6" rx="1" /><rect x="2" y="16" width="7" height="5" rx="1" /><rect x="15" y="16" width="7" height="5" rx="1" /><path d="M12 9v4M5.5 16v-3h13v3" /></>,
    ai: <path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3ZM20 2v4M18 4h4" />,
    code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
    automation: <path d="M20 8a8 8 0 0 0-14-2L3 9m0-6v6h6M4 16a8 8 0 0 0 14 2l3-3m0 6v-6h-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    whatsapp: <><path d="M20.3 11.7a8.3 8.3 0 0 1-12.2 7.4L3 20.5l1.4-5A8.3 8.3 0 1 1 20.3 11.7Z" /><path d="M8.3 7.5c-.7 0-1.2.7-1.1 1.5.3 3.2 3 5.9 6.1 6.3.9.1 1.8-.4 1.9-1.1l-2.1-1.3-.9.8a6.4 6.4 0 0 1-3.2-3.3l.7-.8-1.1-2.1Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
const layers = [
  { name: 'Arquitetura', label: 'A base da solução', text: 'Sistemas, dados e integrações desenhados para trabalhar juntos.' },
  { name: 'Inteligência artificial', label: 'Inteligência no processo', text: 'IA conectada aos seus dados, com critérios e supervisão humana.' },
  { name: 'Automação', label: 'Do processo à execução', text: 'Etapas conectadas para reduzir tarefas manuais e retrabalho.' },
];
function ArchitectureVisual() {
  const [active, setActive] = useState(0);
  return <div className={`architecture-visual layer-${active}`}>
    <div className="visual-topline"><span>VISÃO DE SOLUÇÃO</span><span className="visual-index">C / 01</span></div>
    <svg className="architecture-drawing" viewBox="0 0 560 450" role="img" aria-label="Diagrama de arquitetura: dados, sistemas e processos conectados a um núcleo de inteligência artificial.">
      <defs>
        <linearGradient id="cube-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d4ee9a" /><stop offset="1" stopColor="#a9d35a" /></linearGradient>
        <linearGradient id="cube-left" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#94ba48" /><stop offset="1" stopColor="#658435" /></linearGradient>
        <linearGradient id="cube-right" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b7dc72" /><stop offset="1" stopColor="#8aaf42" /></linearGradient>
        <pattern id="diagram-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#b4c4a1" strokeOpacity=".065" /></pattern>
      </defs>
      <rect width="560" height="450" fill="url(#diagram-grid)" />
      <g fill="none" stroke="#8b9e75" strokeWidth="1"><path opacity=".2" d="m80 280 200-115 200 115-200 115Z" /><path opacity=".3" d="m120 280 160-92 160 92-160 92Z" /><path opacity=".5" d="m160 280 120-69 120 69-120 69Z" /><path strokeDasharray="3 6" opacity=".35" d="M280 54v101M280 330v87M64 155l122 70M374 225l122-70" /><path className="flow-path" d="m95 301 89-52 30 17M344 270l39-22 85 49M126 125l88 51M346 176l88-51" /></g>
      <g><path d="m181 286 99-57 99 57-99 58Z" fill="#232d20" stroke="#63764c" /><path d="m181 286 99 58 99-58v12l-99 58-99-58Z" fill="#1a2218" stroke="#47553c" /></g>
      <g className="main-cube"><path d="m199 178 81-47 81 47-81 47Z" fill="url(#cube-top)" /><path d="m199 178 81 47v94l-81-47Z" fill="url(#cube-left)" /><path d="m280 225 81-47v94l-81 47Z" fill="url(#cube-right)" /><g fill="none" stroke="#25331b" strokeWidth="1.3" opacity=".6"><path d="m226 162 81 47v94M253 147l81 47v94M226 194l81-47M253 210l81-47M199 209l81 47 81-47M199 241l81 47 81-47M226 194v94M253 210v94M307 209v94M334 194v94" /></g><path d="m253 210 27 15v31l-27-15Z" fill="#283322" /><path d="m280 225 27-16v31l-27 16Z" fill="#3e512e" /></g>
      <g className="diagram-node node-data" transform="translate(60 276)"><path d="m0 15 35-20 35 20-35 20Z" fill="#303b2a" stroke="#8aa76a" /><path d="m0 15 35 20 35-20v15L35 50 0 30Z" fill="#1d271a" stroke="#667e50" /><path d="M35-5v-17" stroke="#9dba7d" /><circle cx="35" cy="-25" r="3" fill="#b2dd4c" /></g>
      <g className="diagram-node node-process" transform="translate(433 276)"><path d="m0 15 35-20 35 20-35 20Z" fill="#303b2a" stroke="#8aa76a" /><path d="m0 15 35 20 35-20v15L35 50 0 30Z" fill="#1d271a" stroke="#667e50" /><path d="M35-5v-17" stroke="#9dba7d" /><circle cx="35" cy="-25" r="3" fill="#b2dd4c" /></g>
      <g className="diagram-node node-system" transform="translate(95 88)"><path d="m0 15 31-18 31 18-31 18Z" fill="#293324" stroke="#788e61" /><path d="m0 15 31 18 31-18v15L31 48 0 30Z" fill="#1a2318" stroke="#556a43" /></g>
      <g className="diagram-node node-ai" transform="translate(403 88)"><path d="m0 15 31-18 31 18-31 18Z" fill="#293324" stroke="#788e61" /><path d="m0 15 31 18 31-18v15L31 48 0 30Z" fill="#1a2318" stroke="#556a43" /><path d="m26 12 5-9 5 9-5 9Z" fill="#b2dd4c" /></g>
      <g fill="#acb4a6" fontSize="10" letterSpacing="2" fontFamily="monospace"><text x="95" y="355" textAnchor="middle">DADOS</text><text x="468" y="355" textAnchor="middle">PROCESSOS</text><text x="126" y="69" textAnchor="middle">SISTEMAS</text><text x="434" y="69" textAnchor="middle">IA APLICADA</text><text x="280" y="392" textAnchor="middle" fill="#d1dbc7">SUA OPERAÇÃO</text></g>
      <g stroke="#7e8e6d" opacity=".5"><path d="M14 26h12M20 20v12M534 26h12M540 20v12M14 424h12M20 418v12M534 424h12M540 418v12" /></g>
    </svg>
    <div className="visual-tabs" role="group" aria-label="Explorar os pilares da solução">{layers.map((layer, i) => <button key={layer.name} className={active === i ? 'active' : ''} aria-pressed={active === i} onClick={() => setActive(i)}><span>0{i + 1}</span>{layer.name}</button>)}</div>
    <div className="visual-caption" aria-live="polite"><span className="status-dot" /><div><strong>{layers[active].label}</strong><p>{layers[active].text}</p></div></div>
  </div>;
}
const services = [
  { number: '01', icon: 'architecture', title: 'Arquitetura de software', text: 'Escolhas técnicas que sustentam o negócio. Planejamos novas soluções e revisamos sistemas existentes para reduzir riscos, integrar dados e permitir evolução.', tags: ['Consultoria técnica', 'Integração de sistemas', 'Modernização'], result: 'Uma base para crescer com controle.' },
  { number: '02', icon: 'ai', title: 'Inteligência artificial aplicada', text: 'IA dentro do seu fluxo de trabalho: análise de documentos, busca em dados da empresa e assistentes que apoiam atendimento e decisões.', tags: ['Assistentes de IA', 'Análise de documentos', 'Dados do negócio'], result: 'Mais capacidade para a sua equipe.' },
  { number: '03', icon: 'code', title: 'Desenvolvimento sob medida', text: 'Websites, portais e sistemas administrativos construídos para a sua realidade. Da presença digital ao controle de clientes, processos e informações.', tags: ['Websites e portais', 'Sistemas internos', 'Gestão e controle'], result: 'Software ajustado à sua operação.' },
  { number: '04', icon: 'automation', title: 'Automação de processos', text: 'Conectamos ferramentas e automatizamos etapas repetitivas: cadastros, conferências, relatórios e notificações. Menos tarefas manuais entre um sistema e outro.', tags: ['Fluxos de trabalho', 'Integrações', 'Rotinas operacionais'], result: 'Menos retrabalho. Mais tempo útil.' },
];
function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const statusRef = useRef(null);
  useEffect(() => { if (status === 'success') statusRef.current?.focus(); }, [status]);
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(20000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err.name === 'TimeoutError' || err instanceof TypeError ? 'Não conseguimos confirmar o envio. Tente novamente ou fale pelo WhatsApp.' : err.message);
    }
  }
  if (status === 'success') return <div className="form-success" ref={statusRef} tabIndex="-1" role="status"><span className="success-icon"><Icon name="check" size={32} /></span><h3>Mensagem enviada.</h3><p>Obrigado por compartilhar seu projeto. Vamos retornar pelo e-mail informado.</p><button className="text-link" onClick={() => setStatus('idle')}>Enviar outra mensagem <Icon /></button></div>;
  return <form className="contact-form" onSubmit={handleSubmit} aria-label="Fale com a Cuby" aria-busy={status === 'sending'}>
    <div className="form-row"><label>Seu nome<input name="name" autoComplete="name" placeholder="Como podemos chamar você?" required minLength={2} maxLength={100} /></label><label>E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@empresa.com.br" required maxLength={254} /></label></div>
    <div className="form-row"><label>Empresa <span>(opcional)</span><input name="company" autoComplete="organization" placeholder="Nome da sua empresa" maxLength={160} /></label><label>Sobre o que vamos conversar?<select name="service" defaultValue=""><option value="">Selecione uma opção</option>{services.map(service => <option key={service.number}>{service.title}</option>)}<option>Ainda preciso entender o melhor caminho</option></select></label></div>
    <label>O que você precisa resolver?<textarea name="message" rows="4" placeholder="Conte um pouco sobre o seu projeto ou desafio." required minLength={10} maxLength={5000} /></label>
    <div className="form-trap" aria-hidden="true"><label>Deixe este campo vazio<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
    <p className="form-privacy">Usaremos seus dados apenas para responder a este contato.</p>
    {error && <p className="form-error" role="alert">{error} <a href={whatsapp} target="_blank" rel="noreferrer">Abrir WhatsApp <Icon name="diagonal" size={14} /></a></p>}
    <button type="submit" className="button button-dark form-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando mensagem…' : 'Enviar mensagem'}{status === 'sending' ? <span className="spinner" /> : <Icon />}</button>
  </form>;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(window.location.hash.slice(1));
      section?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = event => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner">
      <a href="#inicio" className="brand" aria-label="Cuby Digital — início" onClick={() => setMenuOpen(false)}><img src="/images/cuby-logo.svg" alt="Cuby Digital" width="366" height="96" /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} size={25} /></button>
      <nav id="main-nav" aria-label="Navegação principal" className={menuOpen ? 'main-nav is-open' : 'main-nav'}><a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a><a href="#clientes" onClick={() => setMenuOpen(false)}>Clientes</a><a href="#como-trabalhamos" onClick={() => setMenuOpen(false)}>Como trabalhamos</a><a href="#a-cuby" onClick={() => setMenuOpen(false)}>A Cuby</a><a href="#contato" className="nav-contact" onClick={() => setMenuOpen(false)}>Vamos conversar <Icon name="diagonal" size={17} /></a></nav>
    </div></header>
    <main id="conteudo">
      <section className="hero" id="inicio" aria-labelledby="hero-title"><div className="container hero-grid">
        <div className="hero-content"><p className="eyebrow hero-eyebrow"><span className="status-dot" /> INTELIGÊNCIA ARTIFICIAL + AUTOMAÇÃO</p><h1 id="hero-title">Arquitetura de<br />software.<br /><span>IA na operação.</span></h1><p className="hero-description">Planejamos e desenvolvemos software, integramos sistemas e aplicamos IA para reduzir trabalho manual e dar controle à sua operação.</p><div className="hero-actions"><a className="button button-green" href="#contato">Converse sobre seu projeto <Icon name="diagonal" /></a><a className="hero-secondary" href="#solucoes">Explore as soluções <span>↓</span></a></div></div>
        <ArchitectureVisual />
      </div><div className="container hero-foot"><span>CUBY DIGITAL · FUNDADA EM 2009</span><div><span>Planejar.</span><span>Construir.</span><span>Integrar.</span><span>Evoluir.</span></div></div></section>
      <Clients />
      <section className="solutions section-space" id="solucoes" aria-labelledby="solutions-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span className="section-mark" /> O QUE RESOLVEMOS</p><h2 id="solutions-title">Tecnologia conectada<br />ao seu negócio.</h2></div><p>Do website ao sistema que sustenta a operação.<br className="desktop-break" /> Projetamos e executamos a solução completa.</p></div>
        <div className="services-grid">{services.map(service => <article className="service" key={service.number}><div className="service-top"><span className="service-icon"><Icon name={service.icon} size={27} /></span><span className="mono">/ {service.number}</span></div><h3>{service.title}</h3><p>{service.text}</p><ul className="service-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href="#contato" className="service-result" aria-label={`Conversar sobre ${service.title}`}><span>{service.result}</span><Icon name="diagonal" size={19} /></a></article>)}</div>
      </div></section>
      <section className="approach section-space" id="como-trabalhamos" aria-labelledby="approach-title"><div className="container"><div className="approach-intro"><p className="eyebrow"><span className="section-mark" /> COMO TRABALHAMOS</p><h2 id="approach-title">Primeiro o problema.<br />Depois, a tecnologia.</h2><p>Entendemos a operação, definimos prioridades e construímos com você. Cada decisão técnica precisa fazer sentido para o negócio.</p></div><ol className="process"><li><span className="process-number">01</span><h3>Entender</h3><p>Mapeamos o cenário, os gargalos e o que precisa mudar.</p><span className="process-deliverable">Diagnóstico e prioridades</span></li><li><span className="process-number">02</span><h3>Arquitetar</h3><p>Definimos a solução, as integrações e um plano viável de execução.</p><span className="process-deliverable">Escopo e direção técnica</span></li><li><span className="process-number">03</span><h3>Construir</h3><p>Desenvolvemos por etapas, com validação e visibilidade das entregas.</p><span className="process-deliverable">Software em funcionamento</span></li><li><span className="process-number">04</span><h3>Evoluir</h3><p>Acompanhamos o uso e ajustamos a solução à medida que o negócio muda.</p><span className="process-deliverable">Melhoria contínua</span></li></ol></div></section>
      <section className="about section-space" id="a-cuby" aria-labelledby="about-title"><div className="container about-grid"><div className="about-image"><img src="/images/cuby-studio.jpg" alt="Composição visual da Cuby Digital: logo oficial na parede e MacBook Pro preto sobre a mesa." width="1476" height="1065" loading="lazy" /></div><div className="about-content"><p className="eyebrow"><span className="section-mark" /> A CUBY</p><h2 id="about-title">Quem planeja,<br />também desenvolve.</h2><p className="about-intro">A Cuby reúne consultoria em arquitetura de software, desenvolvimento e especialização em inteligência artificial e automação.</p><p>Você conversa com quem entende o desafio, desenha a solução e participa da execução. Uma visão técnica do início ao fim, conectada ao que a sua empresa precisa.</p><div className="company-history"><strong>2009</strong><span>Fundação da Cuby Digital.<br />Consultoria e desenvolvimento de software.</span></div><a className="text-link" href="#contato">Vamos falar sobre o seu cenário <Icon name="diagonal" size={19} /></a></div></div></section>
      <section className="contact section-space" id="contato" aria-labelledby="contact-title"><div className="container contact-grid"><div className="contact-content"><p className="eyebrow"><span className="section-mark" /> VAMOS CONVERSAR</p><h2 id="contact-title">O que precisa<br />funcionar melhor<br />na sua empresa?</h2><p>Conte o seu desafio. A gente conversa sobre o caminho para resolver.</p><a className="button button-dark whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={21} /> Falar pelo WhatsApp <Icon name="diagonal" size={18} /></a><a className="contact-email" href="mailto:contato@cuby.com.br"><Icon name="mail" size={18} />contato@cuby.com.br</a><span className="contact-phone">+55 (61) 99596-5833</span><span className="contact-location"><Icon name="pin" size={17} /> Brasília, DF</span></div><div className="form-panel"><div className="form-heading"><h3>Vamos entender seu projeto.</h3><span className="mono">/ CONTATO</span></div><ContactForm /></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-main"><a className="brand" href="#inicio" aria-label="Cuby Digital — voltar ao início"><img src="/images/cuby-logo.svg" alt="Cuby Digital" width="366" height="96" /></a><p>Arquitetura de software.<br />Inteligência artificial. Execução.</p></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Cuby Digital. Todos os direitos reservados.</span><a href="#inicio">Voltar ao início ↑</a></div></footer>
  </>;
}
export default App;
