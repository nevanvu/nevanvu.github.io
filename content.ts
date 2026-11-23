// Everything the site says lives here. Edit this file to update the portfolio.
// Fields marked TODO are placeholders that should be replaced before deploying.

export const profile = {
  name: "Nevan Vu",
  role: "DevOps and cloud infrastructure",
  headline: "I build, test, and automate software solutions.",
  intro: "Computer Science student at University of Ottawa.",
  location: "Toronto, Canada",
  availability: "Open to DevOps, QA, Platform and Cloud roles",
  email: "nevanvu@gmail.com",
  resume: "/resume.pdf", // TODO: replace the empty public/resume.pdf with the real resume
  github: "https://github.com/nevanvu",
  linkedin: "https://www.linkedin.com/in/nevan-vu-95863632b",
};

// The pipeline's stages, in page order: each is a section of the site, a
// link in the header, and a step on the welcome screen.
export const stages = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "off-court", label: "Off court" },
  { id: "contact", label: "Contact" },
] as const;

// The first-visit welcome screen: a hello, then an invitation to run the
// pipeline. A small greeting for the visitor's time of day and the time sit
// above it. The site's stages (above) are listed as a preview, idle; "Run
// pipeline" spins them for a moment, then opens the portfolio.
export const welcome = {
  hello: "Hi, I'm Nevan.",
  headline: "Check out the pipeline.",
  subline: "Five stages, about ten seconds. The quickest way to get to know me.",
  cta: "Run pipeline",
  running: "Running pipeline…",
};

export const about = [
  "I enjoy building solutions where thoughtful design leads to functional results.",
  "Right now I'm picking up new tools and technologies by building personal projects, and sharpening the skills I picked up writing automated tests and CI/CD for production applications.",
];

export const focus = ["Test Automation", "CI/CD pipelines", "Cloud Infrastructure", "DevSecOps"];

export type Role = {
  title: string;
  org: string;
  dates: string;
  points: string[];
  /** White-on-blue company logo in /public, shown beside the org name. */
  logo?: string;
};

export const experience: Role[] = [
  {
    title: "Builder",
    org: "Career training",
    dates: "Present",
    points: ["Building personal projects with AI."],
  },
  {
    title: "Jr. Associate QA Engineer",
    org: "Export Development Canada",
    dates: "Jul 2025 – Aug 2026",
    logo: "/edc-logo.png",
    points: [
      "Worked within the DevSecOps Platform team to build test automation and maintain CI/CD pipelines across 5 production applications at EDC.",
    ],
  },
];

export type Project = {
  name: string;
  summary: string;
  stack: string[];
  repo?: string;
  live?: string;
  placeholder?: boolean; // hidden from the page until you replace it and delete this
  /** With details, the card opens a pop-up with the full write-up. */
  details?: ProjectDetails;
};

export type ProjectDetails = {
  /** Used in the link, e.g. yoursite.com/#autodrive opens this project. */
  slug: string;
  /** The line above the title, e.g. "Java 21 · JavaFX". Defaults to the stack. */
  tech?: string;
  intro: string;
  /** Optional picture or GIF in /public, shown under the intro. */
  media?: { src: string; alt: string; width: number; height: number };
  /** A few headline numbers: a short value and what it measures. */
  results?: { value: string; label: string }[];
  /** The pipeline, step by step. */
  steps?: { name: string; text: string }[];
  /** "Inside the project" bullet points. */
  highlights?: string[];
};

// TODO: replace these with real projects, and delete `placeholder: true`.
export const projects: Project[] = [
  {
    name: "AutoDrive",
    summary: "A self-driving car that teaches itself to drive a busy highway.",
    stack: ["Java", "JavaFX", "Neural Networks"],
    repo: "https://github.com/nevanvu/autodrive",
    // From the AutoDrive README.
    details: {
      slug: "autodrive",
      tech: "Java 21 · JavaFX · Maven · JUnit 5",
      intro:
        "A self-driving car that teaches itself to drive a busy highway. A population of cars, each run by a small neural network, is evolved by a genetic algorithm until it keeps a safe distance, obeys the speed limit and overtakes slow traffic. Nobody writes any driving rules, and there are no machine-learning libraries: the network, the genetic algorithm and the simulation are all built from scratch.",
      results: [
        { value: "0 / 50", label: "crashes on test highways it never saw in training" },
        { value: "100 km/h", label: "average speed, never over the 120 limit" },
        { value: "13", label: "overtakes per 60-second highway" },
        { value: "0.1%", label: "of the time spent too close to the car ahead" },
      ],
      steps: [
        { name: "Sense", text: "11 distance sensors with radar-style closing speed, a blind-spot radar and a turn-signal detector." },
        { name: "Think", text: "A 27 → 14 → 9 → 2 neural network decides whether to change lanes and picks a target speed." },
        { name: "Act", text: "A lane-change safety check, adaptive cruise control and lane keeping carry out the plan." },
        { name: "Score", text: "Rewards distance and overtakes; penalizes crashes, tailgating, harsh braking and jerky steering." },
        { name: "Evolve", text: "The best brains survive and the next generation is bred from mutated combinations of them." },
      ],
      highlights: [
        "A layered driving stack like real autonomous cars: the network plans, simple hand-built controllers execute.",
        "Other traffic follows the Intelligent Driver Model, signals before changing lanes and brakes for the AI car.",
        "Trained for 80 generations (about 3 minutes on a laptop); three random seeds all finished the 50 test highways without a crash.",
        "Every generation drives a new random highway, and results come from a separate test set never used in training.",
        "Reproducible and tested: the same seed replays the same drive, and unit tests run on every push.",
      ],
    },
  },
  {
    name: "Project name",
    summary: "The problem it solves, who uses it, and one number that shows it worked.",
    stack: ["Tool", "Tool"],
    repo: "https://github.com/nevanvu",
    placeholder: false,
  },
  {
    name: "Project name",
    summary: "A short note on the hardest part and how you solved it.",
    stack: ["Tool", "Tool", "Tool"],
    placeholder: false,
  },
];

export type Interest = {
  id: "food" | "raptors"; // picks the icon
  name: string;
  meta: string;
  text: string;
};

// The Off court section.
export const offCourt: { lead: string; interests: Interest[] } = {
  lead: "What I'm up to when I'm not shipping.",
  interests: [
    {
      id: "food",
      name: "Food and culture",
      meta: "Always exploring",
      text: "I enjoy exploring different cultures, and trying their food is my favourite way in.",
    },
    {
      id: "raptors",
      name: "Toronto Raptors",
      meta: "Fan",
      text: "Cheering on the Raptors from home in Toronto.",
    },
  ],
};

// The Contact section, the pipeline's last stage. Its status reads "waiting on you".
export const contact = {
  lead: "The last stage needs a manual approval. Open to opportunities, new ideas, and good conversation. Let’s connect!",
};
