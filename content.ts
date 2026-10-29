// Everything the site says lives here. Edit this file to update the portfolio.
// Fields marked TODO are placeholders that should be replaced before deploying.

export const profile = {
  name: "Nevan Vu",
  role: "DevOps and cloud infrastructure",
  headline: "I build and automate cloud infrastructure.",
  intro:
    "Computer science student and former Junior DevSecOps Engineer at EDC. Trying to be 1% better than yesterday.",
  availability: "Open to DevOps, platform and cloud roles",
  email: "nevanvu@gmail.com",
  resume: "/resume.pdf", // TODO: add resume.pdf to the public/ folder
  github: "https://github.com/nevanvu",
  linkedin: "https://www.linkedin.com/in/nevan-vu-95863632b",
};

export const about = [
  "I'm a computer science student who likes the parts of software most people never see: the pipelines, tests and infrastructure that let a team ship without holding its breath.",
  "Right now I'm building personal projects with AI as a pair programmer, and sharpening the skills I picked up writing automated tests and CI/CD for production applications.",
];

export const focus = ["CI/CD pipelines", "Automated testing", "Cloud infrastructure", "DevSecOps"];

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
    title: "Junior DevSecOps Engineer",
    org: "EDC",
    dates: "Jul 2025 – Aug 2026",
    points: [
      "Built and integrated automated tests for applications, including repository setup and CI/CD pipeline execution.",
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
