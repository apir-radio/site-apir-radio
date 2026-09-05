import Image from "next/image";
import { ArchiveList } from "./archive-list";
import { board } from "./board";
import { JobList } from "./job-list";
import { hospitalJobs } from "./jobs";
import { SiteNav } from "./site-nav";
import { archiveEvents, upcomingEvent } from "./events";
import { assetPath, siteConfig, sitePath } from "./site-config";

// Page d’accueil publique : présentation, bureau, soirées, ressources et annonces.
const adhesionPath = sitePath("/adhesion");
const { siteUrl, organizationName, organizationDescription, email, socials, address } = siteConfig;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: organizationName,
      alternateName: "APIR",
      url: siteUrl,
      logo: `${siteUrl}/apir-logo.webp`,
      description: organizationDescription,
      email,
      address: {
        "@type": "PostalAddress",
        ...address,
      },
      sameAs: Object.values(socials),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.name,
      inLanguage: "fr-FR",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const currentSeason = archiveEvents[0];
  const currentSeasonEventCount = currentSeason?.events.length ?? 0;
  const upcomingEventDate = upcomingEvent?.date.replace(/\s+\d{4}$/, "");

  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="site-header">
        <div className="header-identity">
          <a className="brand" href="#top" aria-label="APIR, retour en haut">
            <Image className="brand-logo" src={assetPath("/apir-logo-small.webp")} alt="" width={192} height={205} sizes="2.5rem" />
            <span>APIR</span>
          </a>
          <a className="header-contact" href={`mailto:${email}`}>Nous contacter</a>
        </div>
        <SiteNav />
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
          <Image
            className="hero-logo"
            src={assetPath("/apir-logo.webp")}
            alt="Logo de l’Association Parisienne des Internes en Radiologie"
            width={900}
            height={959}
            sizes="(max-width: 720px) 34vw, 28vw"
            priority
          />
        </div>

        <div className="hero-stats" aria-label="APIR en chiffres">
          <div><strong>1998</strong><span>Fondation de l’association</span></div>
          <div><strong>{board.members.length}</strong><span>Internes au bureau</span></div>
          <div><strong>{currentSeasonEventCount}</strong><span>Soirées organisées en {currentSeason?.year ?? "cours"}</span></div>
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
        <div className="section-kicker light">02 · Bureau {board.season}</div>
        <div className="board-heading">
          <h2>Le bureau de l’APIR</h2>
          <p>{board.description}</p>
        </div>
        <div className="board-grid">
          {board.members.map((member) => (
            <article className="member-card" key={member.name}>
              <span className="member-avatar">{member.initials}</span>
              <div><h3>{member.name}</h3><p>{member.role}</p></div>
            </article>
          ))}
        </div>
        <div className="coordination">
          <span>Coordination du DES</span>
          <div>
            <p>{board.coordinationNames.map((name) => <span key={name}>{name}<br /></span>)}</p>
            <a href={`mailto:${board.coordinationEmail}`}>{board.coordinationEmail} <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="section events-section" id="soirees">
        <div className="section-kicker">03 · Les soirées de formation</div>
        <div className="event-heading">
          <div>
            <p className="status-pill"><span /> Prochaine soirée</p>
            <h2>{upcomingEvent ? <>Rendez-vous le {upcomingEventDate}.</> : <>On se retrouve<br />à la rentrée.</>}</h2>
          </div>
          <div className="next-card">
            {upcomingEvent ? (
              <>
                <strong>{upcomingEvent.specialty}</strong>
                <span>Avec {upcomingEvent.speaker}, {upcomingEvent.speakerHospital}.</span>
                <a href={upcomingEvent.registrationUrl} target="_blank" rel="noopener noreferrer">S’inscrire à la soirée <Arrow /></a>
              </>
            ) : (
              <>
                <p>Le programme sera annoncé prochainement.</p>
                <span>La date, le thème et les inscriptions seront publiés sur Instagram.</span>
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer">@apir.radiologie <Arrow /></a>
              </>
            )}
          </div>
        </div>

        <ArchiveList seasons={archiveEvents} />
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
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow /></a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer">Groupe Facebook <Arrow /></a>
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
            <a href={siteConfig.partners.corail} target="_blank" rel="noopener noreferrer">Voir les annonces CORAIL <Arrow /></a>
          </article>
        </div>

      </section>

      <section className="section jobs-section" id="postes-hospitaliers" aria-labelledby="jobs-heading" data-nosnippet>
        <div className="jobs-panel">
          <div className="jobs-heading">
            <div>
              <p className="card-tag">Annonces APIR</p>
              <h3 id="jobs-heading">Offres hospitalières</h3>
            </div>
            <p className="jobs-note">Cliquez sur une offre pour consulter les détails.</p>
          </div>
          <JobList jobs={hospitalJobs} />
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
            href={`mailto:${email}`}
            aria-label="Écrire à l’APIR par e-mail"
          >
            <span className="contact-mail-copy">
              <small>Par e-mail</small>
              <strong>Écrire à l’APIR</strong>
              <span className="contact-address">{email}</span>
            </span>
            <span className="contact-mail-arrow"><Arrow /></span>
          </a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="APIR, retour en haut">
          <Image className="brand-logo" src={assetPath("/apir-logo-small.webp")} alt="" width={192} height={205} sizes="2.5rem" />
          <span>APIR</span>
        </a>
        <p>
          Association Parisienne des Internes en Radiologie (APIR)<br />
          Association loi 1901 · RNA W751134082 · SIREN 440 769 057<br />
          83 boulevard de l’Hôpital, 75013 Paris<br />
          Site officiel : {siteConfig.domain}
        </p>
        <div className="footer-links">
          <a href={socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={`mailto:${email}`}>Contact</a>
        </div>
        <div className="footer-partner">
          <span>Partenaire</span>
          <a
            href={siteConfig.partners.laMedicale}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visiter le site de La Médicale par Generali"
          >
            <Image
              src={assetPath("/la-medicale-logo.webp")}
              alt=""
              width={2048}
              height={661}
              sizes="(max-width: 720px) 11rem, 13rem"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </footer>
    </main>
  );
}
