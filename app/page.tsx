import { PipelineController } from "@/components/PipelineController";
import { StageIcon } from "@/components/StageIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { about, contact, experience, focus, offCourt, profile, projects } from "@/content";

const stages = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "off-court", label: "Off court" },
  { id: "contact", label: "Contact" },
] as const;

type StageId = (typeof stages)[number]["id"];

function Stage({ id, gate, children }: { id: StageId; gate?: boolean; children: React.ReactNode }) {
  const label = stages.find((s) => s.id === id)!.label;
  return (
    <section id={id} className="stage" data-stage data-gate={gate || undefined} aria-labelledby={`${id}-title`}>
      <span className="stage-node" aria-hidden="true">
        <StageIcon />
      </span>
      <span className="stage-status" aria-hidden="true" />
      <h2 id={`${id}-title`} className="stage-title">
        {label}
      </h2>
      <div className="stage-body">{children}</div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="brand-icon">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

// Links to other sites open in a new tab so the portfolio stays open behind them.
// Screen readers hear that the link opens a new tab.
function ExternalLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// Square headshot in AVIF, WebP and JPEG at 320px and 640px; the browser picks
// the smallest file that stays sharp. Regenerate these when the photo changes.
function Headshot() {
  const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/headshot`;
  const set = (ext: string) => `${base}-320.${ext} 320w, ${base}-640.${ext} 640w`;
  const sizes = "(min-width: 960px) 17rem, 7rem";
  return (
    <picture className="hero-photo">
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-640.jpg`}
        srcSet={set("jpg")}
        sizes={sizes}
        width={640}
        height={640}
        alt={`Portrait of ${profile.name}`}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}

export default function Home() {
  const year = new Date().getFullYear();
  const resumeHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${profile.resume}`;

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top">
            {profile.name}
          </a>
          <nav className="stage-nav" aria-label="Sections">
            <ol>
              {stages.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} data-nav-for={s.id}>
                    <span className="nav-dot" aria-hidden="true" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="header-actions">
            <a
              className="icon-button header-github"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <GitHubIcon />
            </a>
            <ThemeToggle />
          </div>
        </div>
        <span className="page-progress" data-page-progress aria-hidden="true" />
      </header>

      <main id="top" className="pipeline" data-pipeline>
        <div className="rail" aria-hidden="true">
          <span className="rail-fill" />
        </div>

        <section className="hero stage" data-trigger aria-labelledby="hero-title">
          <span className="stage-node" aria-hidden="true">
            <StageIcon />
          </span>
          <p className="hero-availability stage-title">{profile.availability}</p>
          <div className="stage-body">
            <Headshot />
            <div className="hero-text">
              <h1 id="hero-title" className="hero-name reveal">
                {profile.name}
              </h1>
              <p className="hero-headline reveal">{profile.headline}</p>
              <p className="hero-intro reveal">{profile.intro}</p>
              <div className="actions reveal">
                <a className="button button-primary" href={`mailto:${profile.email}`}>
                  Email me
                </a>
                <a className="button" href={resumeHref} download>
                  Download resume
                </a>
              </div>
            </div>
          </div>
        </section>

        <Stage id="about">
          {about.map((p) => (
            <p key={p} className="prose">
              {p}
            </p>
          ))}
          <ul className="focus-list" aria-label="Focus areas">
            {focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Stage>

        <Stage id="experience">
          <ol className="jobs">
            {experience.map((role) => (
              <li key={`${role.title}-${role.org}`} className="job">
                <div className="job-head">
                  <h3 className="job-title">
                    {role.title}
                    <span className="job-org">{role.org}</span>
                  </h3>
                  <p className="job-meta">{role.dates}</p>
                </div>
                <ul className="job-points">
                  {role.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Stage>

        <Stage id="projects">
          <ul className="jobs">
            {projects.map((project, i) => (
              <li key={i} className="job" data-placeholder={project.placeholder || undefined}>
                <div className="job-head">
                  <h3 className="job-title">
                    {project.name}
                    {project.placeholder && <span className="tag">Placeholder</span>}
                  </h3>
                  {(project.repo || project.live) && (
                    <p className="job-links">
                      {project.repo && <ExternalLink href={project.repo}>Code</ExternalLink>}
                      {project.live && <ExternalLink href={project.live}>Live site</ExternalLink>}
                    </p>
                  )}
                </div>
                <p className="job-summary">{project.summary}</p>
                <ul className="stack" aria-label="Built with">
                  {project.stack.map((tool, j) => (
                    <li key={j}>{tool}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Stage>

        <Stage id="off-court">
          <p className="prose">
            {offCourt.sport}, {offCourt.since}. The same habit as the day job: show up, review what went
            wrong, run it again.
          </p>
          <ul className="results">
            {offCourt.results.map((r) => (
              <li key={r.event}>
                <span className="result">{r.result}</span>
                <span className="event">{r.event}</span>
                {r.year && <span className="year">{r.year}</span>}
              </li>
            ))}
          </ul>
        </Stage>

        <Stage id="contact" gate>
          <p className="contact-lead">{contact.lead}</p>
          <div className="actions">
            <a className="button button-primary" href={`mailto:${profile.email}`}>
              Email me
            </a>
            <ExternalLink className="button" href={profile.linkedin}>
              Connect on LinkedIn
            </ExternalLink>
          </div>
          <ul className="contact-links">
            <li>
              <ExternalLink href={profile.github}>GitHub</ExternalLink>
            </li>
            <li>
              <a href={resumeHref} download>
                Resume
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
          </ul>
        </Stage>
      </main>

      <footer className="site-footer">
        <p>
          © {year} {profile.name}
        </p>
      </footer>

      <PipelineController />
    </>
  );
}
