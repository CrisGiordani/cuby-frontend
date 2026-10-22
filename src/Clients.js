const clients = [
  { name: 'Inmetrics', file: 'inmetrics.svg', style: 'inmetrics' },
  { name: 'Banco Digio', file: 'digio.png', style: 'digio' },
  { name: 'Banco Neon', file: 'neon.svg', style: 'neon' },
  { name: 'Getnet', file: 'getnet.png', style: 'getnet' },
  { name: 'Ambev', file: 'ambev.png', style: 'ambev' },
  { name: 'FCamara', file: 'fcamara.png', style: 'fcamara' },
  { name: 'Grupo Elfa', file: 'grupo-elfa.svg', style: 'elfa' },
  { name: 'Simon Engenharia', file: 'simon.png', style: 'simon' },
  { name: 'MZ Group', file: 'mz-group.svg', style: 'mz' },
  { name: 'Payface', file: 'payface.svg', style: 'payface' },
  { name: 'CNI', file: 'cni.svg', style: 'cni' },
  { name: 'Sebrae', file: 'sebrae.svg', style: 'sebrae' },
  { name: 'IEL', file: 'iel.svg', style: 'iel' },
  { name: 'Claro', file: 'claro.webp', style: 'claro' },
];

export default function Clients() {
  return (
    <section className="clients" id="clientes" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients-heading">
          <div>
            <p className="eyebrow"><span className="section-mark" /> CLIENTES</p>
            <h2 id="clients-title">Empresas que já atendemos.</h2>
          </div>
          <p className="clients-since">Uma trajetória que começou em <strong>2009.</strong></p>
        </div>
        <ul className="clients-gallery" aria-label="Empresas que foram clientes da Cuby">
          {clients.map(client => (
            <li className="client-tile" key={client.name}>
              <img
                className={`client-logo client-logo-${client.style}`}
                src={`/images/clients/${client.file}`}
                alt={client.name}
                title={client.name}
                loading="lazy"
                decoding="async"
                width="140"
                height="48"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
