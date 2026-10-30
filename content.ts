// Everything the site says lives here. Edit this file to update the portfolio.
// Fields marked TODO are placeholders that should be replaced before deploying.

export const profile = {
  name: "Nevan Vu",
  role: "DevOps and cloud infrastructure",
  headline: "I build, test, and automate software solutions.",
  intro:
    "Computer science student at University of Ottawa. Trying to be 1% better than yesterday.",
  availability: "Open to DevOps, QA, platform and cloud roles",
  email: "nevanvu@gmail.com",
  resume: "/resume.pdf", // TODO: add resume.pdf to the public/ folder
  github: "https://github.com/nevanvu",
  linkedin: "https://www.linkedin.com/in/nevan-vu-95863632b",
};

export const about = [
  "I enjoy building solutions where thoughtful design leads to functional results.",
  "Right now I'm building personal projects with AI as a pair programmer, and sharpening the skills I picked up writing automated tests and CI/CD for production applications.",
];

export const focus = ["CI/CD pipelines", "Test automation", "Cloud infrastructure", "DevSecOps"];

export type Role = {
  title: string;
  org: string;
  dates: string;
  points: string[];
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
    points: [
      "Worked within the DevSecOps Platform team to build test automation and maintain CI/CD pipelines across multiple production applications at EDC.",
    ],
  },
];

export type Project = {
  name: string;
  summary: string;
  stack: string[];
  repo?: string;
  live?: string;
  placeholder?: boolean; // shows a "Placeholder" tag until you replace it
};

// TODO: replace these with real projects, and delete `placeholder: true`.
export const projects: Project[] = [
  {
    name: "Project name",
    summary: "What it does and what changed because of it, in one or two lines.",
    stack: ["Tool", "Tool", "Tool"],
    repo: "https://github.com/nevanvu",
    placeholder: true,
  },
  {
    name: "Project name",
    summary: "The problem it solves, who uses it, and one number that shows it worked.",
    stack: ["Tool", "Tool"],
    repo: "https://github.com/nevanvu",
    placeholder: true,
  },
  {
    name: "Project name",
    summary: "A short note on the hardest part and how you solved it.",
    stack: ["Tool", "Tool", "Tool"],
    placeholder: true,
  },
];

export const offCourt = {
  sport: "Badminton",
  since: "2023 – present",
  results: [
    { result: "Winner", event: "Birdies Open, singles", year: "2025" },
    { result: "2× champion", event: "Super Series, doubles", year: "" },
  ],
};

// The Contact section, the pipeline's last stage. Its status reads "waiting on you".
export const contact = {
  lead: "The last stage needs a manual approval. Open to opportunities, new ideas, and good conversation. Let’s connect!",
};


// I enjoy exploring different cultures and trying their food. I'm also a fan of the Toronto Raptors.
