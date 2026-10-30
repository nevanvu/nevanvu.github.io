import { PipelineController } from "@/components/PipelineController";
import { StageIcon } from "@/components/StageIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { about, contact, experience, focus, offCourt, profile, projects, type Interest } from "@/content";

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
      {/* Sticks under the site header while the stage is on screen, so you can watch it pass. */}
      <div className="stage-head">
        <span className="stage-node" aria-hidden="true">
          <StageIcon />
        </span>
        <span className="stage-status" aria-hidden="true" />
        <h2 id={`${id}-title`} className="stage-title">
          {label}
        </h2>
      </div>
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" className="line-icon">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

// Line icons for the Off court interests, drawn to match the pin.
function InterestIcon({ id }: { id: Interest["id"] }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" focusable="false" className="line-icon">
      {id === "food" && (
        <>
          <path d="M3.5 12h17a8.5 8.5 0 0 1-17 0Z" />
          <path d="M13 9.5 16.5 3M16 9.5l4.5-5" />
        </>
      )}
      {id === "raptors" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5v17M3.5 12h17" />
          <path d="M6 6a9 9 0 0 1 0 12M18 6a9 9 0 0 0 0 12" />
        </>
      )}
    </svg>
  );
}

// Toronto skyline silhouette for the Food and culture card, seen from the lake.
// The CN Tower is drawn to its real proportions (553 m, main pod at 346 m,
// SkyPod at 447 m) and sits at the centre so narrow cards only crop the edges.
function TorontoSkyline() {
  return (
    <svg
      className="skyline"
      viewBox="0 0 480 120"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* condos to the west */}
      <path d="M0 120V96h14v24ZM16 120V84h10v36ZM28 120V94h4v-4h8v30ZM42 120V78h10v42ZM54 120V88h14v32ZM70 120V72h10v48Z" />
      <path d="M82 120V86h4v-4h10v38ZM98 120V92h12v28ZM112 120V80h12v40ZM126 120V86h12v34ZM140 120V76h10v44ZM152 120V90h12v30ZM166 120V98h10v22Z" />
      {/* Rogers Centre */}
      <path d="M178 120v-12c4-7 14-10 26-10s22 3 26 10v12Z" />
      {/* CN Tower */}
      <path d="M246.3 120L245.3 113L244.5 105.9L243.8 98.9L243.2 91.8L242.7 84.8L242.3 77.8L242 70.7L241.8 63.7L241.7 56.6L241.7 49.6L241.8 48.7L247 46.2L247.3 46L247.3 43.6L245.4 42.3L245.8 41.9L245.8 40.8L242.2 39.3L241.2 38.5L241.1 25.7L242.3 24.6L242.3 22.9L240.9 22.1L240.8 13.3L240.6 12.7L240.4 4.8L240.2 2L239.8 2L239.6 4.8L239.4 12.7L239.2 13.3L239.1 22.1L237.7 22.9L237.7 24.6L238.9 25.7L238.8 38.5L237.8 39.3L234.2 40.8L234.2 41.9L234.6 42.3L232.7 43.6L232.7 46L233 46.2L238.2 48.7L238.3 49.6L238.3 56.6L238.2 63.7L238 70.7L237.7 77.8L237.3 84.8L236.8 91.8L236.2 98.9L235.5 105.9L234.7 113L233.7 120Z" />
      {/* financial district to the east */}
      <path d="M250 120v-10h22v10ZM274 120V74h12v46ZM288 120V66l7-4 7 4v54ZM304 120V56h14v64ZM310.5 56v-6h1v6ZM320 120V70h12v50ZM334 120V64h4v-2h8v58Z" />
      <path d="M348 120V76h12v44ZM362 120V68h12v52ZM376 120V82h14v38ZM392 120V74h10v46ZM404 120V88h14v32ZM420 120V80h10v40ZM432 120V94h14v26ZM448 120V86h12v34ZM462 120v-18h18v18Z" />
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
              <p className="hero-location reveal">
                <PinIcon />
                {profile.location}
              </p>
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
          <p className="prose">{offCourt.lead}</p>
          <ul className="interests">
            {offCourt.interests.map((interest) => (
              <li key={interest.id} className="interest" data-interest={interest.id}>
                <div className="interest-head">
                  <span className="interest-icon" aria-hidden="true">
                    <InterestIcon id={interest.id} />
                  </span>
                  <div>
                    <h3 className="interest-name">{interest.name}</h3>
                    <p className="interest-meta">{interest.meta}</p>
                  </div>
                </div>
                <p className="interest-text">{interest.text}</p>
                {interest.id === "food" && <TorontoSkyline />}
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
