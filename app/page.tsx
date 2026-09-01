const archiveEvents = [
  {
    year: "2025 — 2026",
    events: [
      "Mai · Imagerie tête et cou — Alexandre Faure, Hôpital Tenon",
      "Avril · Imagerie gynécologique — Benjamin Fedida, Hôpital Tenon",
      "Mars · Imagerie ostéo-articulaire — Teodor Grand, Hôpital Européen Georges-Pompidou",
      "Février · Imagerie uro-néphrologique — Chloé Gallego, Hôpital Saint-Joseph",
      "Janvier · Imagerie digestive — Mathilde Wagner, Hôpital Saint-Antoine",
      "Novembre · Imagerie thoracique — Stéphane Tran Ba, Hôpital Avicenne",
    ],
  },
  {
    year: "2024 — 2025",
    events: [
      "Mai · Imagerie ORL — Guillaume Poillon, Fondation Adolphe de Rothschild",
      "Avril · Imagerie ostéo-articulaire — Maxime Lacroix, HEGP",
      "Mars · Imagerie gynécologique — Benjamin Fedida, Hôpital Tenon",
      "Février · Imagerie thoracique — Samia Boussouar, Pitié-Salpêtrière",
      "Janvier · Imagerie digestive — Aurélien Saltel-Fulero, HEGP",
      "Décembre · Imagerie neurologique — Matthias Babin, Hôpital Bicêtre",
      "Novembre · Imagerie uro-néphrologique — Michel Dupuis, Pitié-Salpêtrière",
    ],
  },
  {
    year: "2023 — 2024",
    events: [
      "Juin · Imagerie digestive — Aurélien Saltel-Fulero, HEGP",
      "Mai · Radiologie interventionnelle — Lambros Tselikas, Gustave-Roussy",
      "Avril · Imagerie tête et cou — Guillaume Poillon, Fondation Rothschild",
      "Mars · Imagerie cardio-vasculaire — Alban Redheuil, Pitié-Salpêtrière",
      "Février · Imagerie uro-néphrologique — Emmanuel Arama, Hôpital Béclère",
      "Janvier · Imagerie ostéo-articulaire — Raphaël Campagna, Hôpital Cochin",
      "Novembre · Imagerie thoracique — Guillaume Chassagnon, Hôpital Cochin",
    ],
  },
];

const board = [
  { name: "David Toubert", role: "Président", initials: "DT" },
  { name: "Quentin Vigogne", role: "Vice-président", initials: "QV" },
  { name: "Quentin Bui", role: "Trésorier", initials: "QB" },
  { name: "Camélia El Gani", role: "Secrétaire", initials: "CE" },
  { name: "Emmanuelle Sirieix", role: "Membre du bureau", initials: "ES" },
  { name: "Julie Montret", role: "Membre du bureau", initials: "JM" },
  { name: "Rachid Chekour", role: "Membre du bureau", initials: "RC" },
  { name: "Tom Galvier", role: "Membre du bureau", initials: "TG" },
];

const hospitalJobs = [
  {
    title: "Radiologue en CDI · Temps plein ou temps partiel (80 %)",
    place: "Hôpital Saint-Camille · Bry-sur-Marne (94)",
    href: "https://apir-radio.notion.site/3ced6c1400ba80bbb27bd44ed7a41a27",
  },
  {
    title: "CCA ou Assistant",
    place: "Ambroise-Paré · Boulogne-Billancourt",
    href: "https://apir-radio.notion.site/3b5d6c1400ba8075a7cfff4d8a061292",
  },
  {
    title: "CCA · Imagerie de la femme",
    place: "Jean-Verdier · Bondy",
    href: "https://apir-radio.notion.site/372d6c1400ba80eabe55c5eec20b2b09",
  },
  {
    title: "Assistant · Imagerie pédiatrique",
    place: "Necker · Paris 15e",
    href: "https://apir-radio.notion.site/321d6c1400ba80f68526c9448911f5ec",
  },
  {
    title: "CCA / Assistant · Imagerie digestive",
    place: "Pitié-Salpêtrière · Paris 13e",
    href: "https://apir-radio.notion.site/feeb82326e4d462d84c3d19f5e4405ff",
  },
  {
    title: "Assistant spécialiste · Imagerie urologique",
    place: "Pitié-Salpêtrière · Paris 13e",
    href: "https://apir-radio.notion.site/2a8d6c1400ba802a9782cf294ae18b13",
  },
  {
    title: "Assistant spécialiste · Imagerie séno-gynécologique",
    place: "Pitié-Salpêtrière · Paris 13e",
    href: "https://apir-radio.notion.site/14dd6c1400ba80839c33f2c1130fbb16",
  },
  {
    title: "Chef de clinique · Imagerie thoracique et cardiaque",
    place: "Cochin A UF1 · Paris 14e",
    href: "https://apir-radio.notion.site/313d6c1400ba802796b0c337d188a5b2",
  },
  {
    title: "Assistant spécialiste · Imagerie digestive",
    place: "Beaujon · Clichy",
    href: "https://apir-radio.notion.site/313d6c1400ba805f8eb2d74a81ab6f58",
  },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const adhesionPath = `${basePath}/adhesion`;

function assetPath(path: string) {
  return `${basePath}${path}`;
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="header-identity">
          <a className="brand" href="#top" aria-label="APIR, retour en haut">
            <img className="brand-logo" src={assetPath("/apir-logo.webp")} alt="" width="900" height="959" />
            <span>APIR</span>
          </a>
          <a className="header-contact" href="mailto:contact@apir-radio.fr">Nous contacter</a>
        </div>
        <nav aria-label="Navigation principale">
          <a href="#mission">L’association</a>
          <a href="#bureau">Bureau</a>
          <a href="#soirees">Soirées</a>
          <a href="#ressources">Ressources</a>
        </nav>
        <a className="header-cta" href={adhesionPath}>
          Adhérer <Arrow />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Association loi 1901 · Depuis 1998</p>
          <h1>L’APIR, par et pour les <em>internes en radiologie.</em></h1>
          <p className="hero-lede">
            Depuis 1998, l’APIR organise des soirées de formation et rassemble les internes en radiologie d’Île-de-France.
          </p>
        </div>

        <div className="hero-mark">
          <img
            className="hero-logo"
            src={assetPath("/apir-logo.webp")}
            alt="Logo de l’Association Parisienne des Internes en Radiologie"
            width="900"
            height="959"
            fetchPriority="high"
          />
        </div>

        <div className="hero-stats" aria-label="APIR en chiffres">
          <div><strong>1998</strong><span>Fondation de l’association</span></div>
          <div><strong>8</strong><span>Internes au bureau</span></div>
          <div><strong>6</strong><span>Soirées organisées en 2025–2026</span></div>
        </div>
      </section>

      <section className="section mission-section" id="mission">
        <div className="section-kicker">01 · L’association</div>
        <div className="mission-grid">
          <h2>Des soirées de formation pour tous les semestres.</h2>
          <div className="mission-copy">
            <p className="large-copy">
              L’APIR organise des soirées consacrées aux différentes spécialités d’imagerie, avec des radiologues choisis pour leur expérience et leurs qualités pédagogiques.
            </p>
            <p>
              Ouvertes à tous les semestres, ces rencontres complètent la formation du DES. Elles permettent aussi d’échanger avec les intervenants et de faire connaissance avec les autres internes franciliens.
            </p>
          </div>
        </div>
      </section>

      <section className="section board-section" id="bureau">
        <div className="section-kicker light">02 · Bureau 2025 — 2026</div>
        <div className="board-heading">
          <h2>Le bureau de l’APIR</h2>
          <p>Huit internes bénévoles organisent les formations et animent l’association tout au long de l’année.</p>
        </div>
        <div className="board-grid">
          {board.map((member) => (
            <article className="member-card" key={member.name}>
              <span className="member-avatar">{member.initials}</span>
              <div><h3>{member.name}</h3><p>{member.role}</p></div>
            </article>
          ))}
        </div>
        <div className="coordination">
          <span>Coordination du DES</span>
          <div>
            <p>Pr Raphaële Renard-Penna<br />Pr Stéphanie Franchi-Abella</p>
            <a href="mailto:coordidesrx.psl@aphp.fr">coordidesrx.psl@aphp.fr <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="section events-section" id="soirees">
        <div className="section-kicker">03 · Les soirées de formation</div>
        <div className="event-heading">
          <div>
            <p className="status-pill"><span /> Prochaine soirée</p>
            <h2>On se retrouve<br />à la rentrée.</h2>
          </div>
          <div className="next-card">
            <p>Le programme sera annoncé prochainement.</p>
            <span>La date, le thème et les inscriptions seront publiés sur Instagram.</span>
            <a href="https://www.instagram.com/apir.radiologie" target="_blank" rel="noreferrer">@apir.radiologie <Arrow /></a>
          </div>
        </div>

        <div className="archive-wrap">
          <p className="archive-label">Archives des soirées</p>
          {archiveEvents.map((season) => (
            <details key={season.year}>
              <summary><span>{season.year}</span><span className="plus">+</span></summary>
              <ul>{season.events.map((event) => <li key={event}>{event}</li>)}</ul>
            </details>
          ))}
        </div>
      </section>

      <section className="section resources-section" id="ressources">
        <div className="section-kicker light">04 · Ressources</div>
        <div className="resources-heading">
          <h2>Les informations utiles pendant l’internat.</h2>
          <p>Adhérer à l’association, suivre son actualité et consulter les offres de postes.</p>
        </div>
        <div className="resource-grid">
          <article className="resource-card featured">
            <span className="card-number">01</span>
            <div>
              <p className="card-tag">Adhésion</p>
              <h3>Adhérer à l’APIR</h3>
              <p>L’adhésion couvre toute la durée de l’internat et contribue à l’organisation des soirées de formation. Elle devient annuelle après l’internat.</p>
            </div>
            <a href={adhesionPath}>Adhérer sur HelloAsso <Arrow /></a>
          </article>
          <article className="resource-card social-card">
            <span className="card-number">02</span>
            <div>
              <p className="card-tag">La communauté</p>
              <h3>Suivre la vie de l’association</h3>
              <p>Les annonces et les rappels sont publiés sur Instagram et dans le groupe Facebook des internes.</p>
            </div>
            <div className="double-links">
              <a href="https://www.instagram.com/apir.radiologie" target="_blank" rel="noreferrer">Instagram <Arrow /></a>
              <a href="https://www.facebook.com/groups/apir.radio" target="_blank" rel="noreferrer">Groupe Facebook <Arrow /></a>
            </div>
          </article>
          <article className="resource-card">
            <span className="card-number">03</span>
            <div>
              <p className="card-tag">Postes hospitaliers</p>
              <h3>Offres de postes hospitaliers</h3>
              <p>Consultez les offres de CCA, d’assistant et de spécialiste relayées par l’APIR en Île-de-France.</p>
            </div>
            <a href="#postes-hospitaliers">Voir les postes <span aria-hidden="true">↓</span></a>
          </article>
          <article className="resource-card">
            <span className="card-number">04</span>
            <div>
              <p className="card-tag">Postes libéraux</p>
              <h3>Annonces d’exercice libéral</h3>
              <p>Depuis juillet 2024, les annonces concernant l’exercice libéral sont centralisées par notre partenaire CORAIL.</p>
            </div>
            <a href="https://corail-radiologie.fr/annonces/" target="_blank" rel="noreferrer">Voir les annonces CORAIL <Arrow /></a>
          </article>
        </div>

      </section>

      <section className="section jobs-section" id="postes-hospitaliers">
        <div className="jobs-panel">
          <div className="jobs-heading">
            <div>
              <p className="card-tag">Annonces APIR</p>
              <h3>Offres hospitalières</h3>
            </div>
            <a href="https://apir-radio.notion.site/5d8f70d7adf64035b91657532f316a55" target="_blank" rel="noreferrer">
              Voir la page complète <Arrow />
            </a>
          </div>
          <div className="jobs-list">
            {hospitalJobs.map((job, index) => (
              <a href={job.href} target="_blank" rel="noreferrer" className="job-row" key={job.href}>
                <span className="job-index">{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{job.title}</strong><small>{job.place}</small></span>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow dark"><span /> Une question ou une proposition ?</p>
          <h2>Contactez le bureau.</h2>
        </div>
        <div className="contact-links">
          <a
            className="contact-mail"
            href="mailto:contact@apir-radio.fr"
            aria-label="Écrire à l’APIR par e-mail"
          >
            <span className="contact-mail-copy">
              <small>Par e-mail</small>
              <strong>Écrire à l’APIR</strong>
              <span className="contact-address">contact@apir-radio.fr</span>
            </span>
            <span className="contact-mail-arrow"><Arrow /></span>
          </a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="APIR, retour en haut">
          <img className="brand-logo" src={assetPath("/apir-logo.webp")} alt="" width="900" height="959" />
          <span>APIR</span>
        </a>
        <p>
          Association Parisienne des Internes en Radiologie (APIR)<br />
          Association loi 1901 · RNA W751134082 · SIREN 440 769 057<br />
          83 boulevard de l’Hôpital, 75013 Paris<br />
          Site officiel : apir-radio.fr
        </p>
        <div className="footer-links">
          <a href="https://www.instagram.com/apir.radiologie" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/groups/apir.radio" target="_blank" rel="noreferrer">Facebook</a>
          <a href="mailto:contact@apir-radio.fr">Contact</a>
        </div>
        <div className="footer-partner">
          <span>Partenaire</span>
          <img
            src={assetPath("/la-medicale-logo.png")}
            alt="La Médicale par Generali"
            width="2048"
            height="661"
          />
        </div>
      </footer>
    </main>
  );
}
