import type { ReactNode } from 'react';
import { faqs, homePath, langs, privacyPath, services, steps, studio, tools, ui, type Lang } from '../data/site';

const sections = ['work', 'services', 'faq'] as const;

function NavLinks({ lang }: { lang: Lang }) {
  return (
    <ul>
      {sections.map(id => <li key={id}><a href={`${homePath[lang]}#${id}`}>{ui.nav[id][lang]}</a></li>)}
    </ul>
  );
}

export function SiteHeader({ lang, paths, children }: { lang: Lang; paths: Record<Lang, string>; children?: ReactNode }) {
  return (
    <header className="site-header">
      <div className="header-blur" aria-hidden="true">{children}</div>
      <div className="wrap">
        <a className="logo" href={homePath[lang]} aria-label={studio.name}>
          <img className="logo-wordmark" src="/brand/wordmark.webp" width="640" height="117" alt="" />
          <img className="logo-inverse" src="/brand/fallscity-inverse.svg" width="1024" height="187" alt="" />
          <img className="logo-symbol" src="/brand/fallscity-symbol.svg" width="432" height="176" alt="" />
        </a>
        <nav className="nav" aria-label={ui.nav.label[lang]}>
          <div className="nav-wide"><NavLinks lang={lang} /></div>
          <a className="btn primary small" href={`${homePath[lang]}#contact`}>{ui.nav.cta[lang]}</a>
          <div className="lang" role="group" aria-label={ui.nav.langLabel[lang]}>
            {langs.map(l => (
              <a key={l} href={`${paths[l]}?lang=${l}`} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined}>
                <span aria-hidden="true">{l.toUpperCase()}</span>
                <span className="sr-only">{l === 'en' ? 'English' : 'Español'}</span>
              </a>
            ))}
          </div>
          <details className="mobile-nav">
            <summary aria-label={ui.nav.menu[lang]}><span aria-hidden="true">☰</span></summary>
            <NavLinks lang={lang} />
          </details>
        </nav>
      </div>
    </header>
  );
}

export function HeroCopy({ lang, children }: { lang: Lang; children?: ReactNode }) {
  const copy = ui.hero;
  return (
    <div className="hero-copy">
      <h1 id="hero-title">{children}</h1>
      <p className="lead">{copy.lead[lang]}</p>
      <div className="actions">
        <a className="btn primary" href="#contact">{copy.cta[lang]} <span aria-hidden="true">↗</span></a>
        <a className="btn ghost" href="#work">{copy.secondary[lang]} <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  );
}

export function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return <header className="section-head" data-scroll-heading><h2 id={id}>{title}</h2>{lead && <p>{lead}</p>}</header>;
}

export function ServiceRows({ lang, kind }: { lang: Lang; kind: 'services' | 'tools' }) {
  const items = kind === 'services' ? services : tools;
  return (
    <ul className={kind === 'services' ? 'service-rows' : 'service-tools'}>
      {items.map(item => (
        <li key={item.id}>
          <h3>{item.title[lang]}</h3>
          <p>{item.body[lang]}</p>
        </li>
      ))}
    </ul>
  );
}

export function ProcessSteps({ lang }: { lang: Lang }) {
  return (
    <ol className="process-steps">
      {steps.map(step => <li key={step.title.en}><h3>{step.title[lang]}</h3><p>{step.body[lang]}</p></li>)}
    </ol>
  );
}

export function Questions({ lang }: { lang: Lang }) {
  return (
    <div className="faq-list">
      {faqs.map(({ q, a }) => <details key={q.en}><summary>{q[lang]}</summary><p>{a[lang]}</p></details>)}
    </div>
  );
}

export function ContactIntro({ lang, children }: { lang: Lang; children: ReactNode }) {
  const copy = ui.contact;
  return (
    <div className="contact-intro">
      <h2 id="contact-title">{copy.title[lang]}</h2>
      <p className="lead">{copy.lead[lang]}</p>
      <p className="or-email">{copy.form.orEmail[lang]}</p>
      {children}
      <p className="where">{copy.where[lang]}</p>
    </div>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>© {new Date().getFullYear()} {studio.name}, Louisville, KY.</p>
        <ul>
          <li><a href={`mailto:${studio.email}`}>{studio.email}</a></li>
          <li><a href={privacyPath[lang]}>{ui.footer.privacy[lang]}</a></li>
        </ul>
      </div>
    </footer>
  );
}
