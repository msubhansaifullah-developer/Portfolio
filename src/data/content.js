/**
 * Portfolio content and launch settings.
 *
 * Before you publish, set email, github, and linkedin.
 * Leave a value as an empty string to hide that public link.
 * Do not invent profile URLs.
 *
 * If the live domain is not https://abdulsubhan.netlify.app,
 * change `url` and rebuild so canonicals, the sitemap, and JSON-LD match it.
 */
export const site = {
  name: "Abdul Subhan Durrani",
  shortName: "Abdul Subhan",
  givenName: "Abdul Subhan",
  familyName: "Durrani",
  title: "Full Stack Developer",
  company: "Shape Solutions (Pvt.) Ltd.",
  location: "Islamabad, Pakistan",
  locality: "Islamabad",
  country: "Pakistan",
  countryCode: "PK",
  employmentStart: "December 2025",
  employmentStartIso: "2025-12",
  url: "https://abdulsubhan.netlify.app",
  email: "devsubhan01@gmail.com",
  phoneDisplay: "0326 644 7696",
  phoneHref: "tel:+923266447696",
  github: "",
  linkedin: "https://www.linkedin.com/in/abdul-subhan-durrani-7302a2361",
  resumePath: "/resume.pdf",
  resumeDownloadName: "Abdul-Subhan-Durrani-CV.pdf",
  ogImage: "/images/og-abdul-subhan-durrani.png",
  portrait: "/images/abdul-subhan-durrani.jpg",
  description:
    "Abdul Subhan Durrani is a Full Stack Developer in Islamabad, Pakistan, specializing in Laravel, PHP, MySQL, JavaScript and scalable web applications.",
};

export const navLinks = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export const hero = {
  eyebrow: "HELLO, I'M ABDUL SUBHAN",
  headingLead: "Building",
  headingHighlight: "Digital Experiences",
  headingTail: "That Make an Impact.",
  role: "Full Stack Developer | Laravel & Modern Web Technologies",
  summary:
    "I'm Abdul Subhan Durrani, a Full Stack Developer based in Islamabad, Pakistan. I specialize in building scalable web applications, business management systems, and efficient digital solutions using Laravel, PHP, JavaScript, and modern frontend technologies.",
};

export const about = {
  title: "About Me",
  subtitle: "Turning Ideas Into Scalable Software Solutions.",
  paragraphs: [
    "I'm a Full Stack Developer currently working at Shape Solutions (Pvt.) Ltd. in Islamabad, where I contribute to the development and maintenance of business applications and employee management systems.",
    "My work involves developing Laravel applications, implementing backend business logic, managing databases, building frontend functionality, and improving application workflows.",
    "I enjoy solving real-world problems through clean code, efficient architecture, and user-focused development.",
  ],
  facts: [
    { label: "Professional Role", value: "Full Stack Developer" },
    { label: "Current Company", value: "Shape Solutions (Pvt.) Ltd." },
    { label: "Since", value: "December 2025" },
    { label: "Location", value: "Islamabad, Pakistan" },
  ],
};

export const skillGroups = [
  {
    id: "backend",
    title: "Backend Development",
    items: [
      "PHP",
      "Laravel",
      "REST APIs",
      "MVC Architecture",
      "Eloquent ORM",
      "Authentication & Authorization",
    ],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    items: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap", "Vue.js", "Inertia.js"],
  },
  {
    id: "database",
    title: "Database",
    items: ["MySQL", "SQL", "Database Design", "Query Optimization"],
  },
  {
    id: "tools",
    title: "Development Tools",
    items: ["Git", "GitHub", "Bitbucket", "Postman", "Composer", "Laragon", "Cursor"],
  },
];

export const allSkills = skillGroups.flatMap((group) => group.items);

export const experience = {
  company: "Shape Solutions (Pvt.) Ltd.",
  position: "Full Stack Developer",
  location: "Islamabad, Pakistan",
  start: "December 2025",
  startIso: "2025-12",
  end: "Present",
  responsibilities: [
    "Developing and maintaining Laravel-based applications.",
    "Building and maintaining employee management systems.",
    "Developing backend functionality and business logic.",
    "Managing MySQL databases and Eloquent relationships.",
    "Implementing employee workflows and approval processes.",
    "Developing and integrating frontend components.",
    "Working with APIs and third-party integrations.",
    "Automating reports and repetitive business processes.",
    "Troubleshooting and maintaining production applications.",
    "Improving application performance and user experience.",
  ],
};

export const projects = [
  {
    slug: "proforce-security-system",
    name: "Proforce Security System",
    category: "Workforce & Security Management System",
    visual: "shifts",
    description:
      "A comprehensive security workforce management platform designed to manage employees, operational activities, shift scheduling, payroll, and security-related business processes.",
    features: [
      "Employee Management",
      "Employee Profiles",
      "Shift Scheduling and Management",
      "Payroll Management",
      "Employee Document Management",
      "Incident Report Submission",
      "Operational Management",
      "Reporting and Data Management",
    ],
    contribution:
      "Worked on developing and maintaining different system modules, implementing backend business logic, managing databases, improving workflows, and supporting production functionality.",
    technologies: ["Laravel", "PHP", "MySQL", "JavaScript", "jQuery", "Bootstrap"],
    image: "/images/proforce-site-scheduler.jpg",
    imageAlt: "Site scheduler week view with daily shift times for a selected site.",
    imageWidth: 1024,
    imageHeight: 453,
    seoDescription:
      "Proforce Security System is a workforce and security management platform for employees, shifts, payroll, documents, incidents, and reporting. Abdul Subhan Durrani contributes to its Laravel modules at Shape Solutions in Islamabad.",
  },
  {
    slug: "employee-onboarding-module",
    name: "Employee Onboarding Module",
    category: "HRMS & Employee Onboarding",
    visual: "onboarding",
    description:
      "An employee onboarding solution designed to streamline the hiring and employee onboarding process.",
    features: [
      "Personal Information Collection",
      "Employment Details",
      "Document Upload and Management",
      "Applicant Information Management",
      "Form Validation",
      "Approval Workflows",
      "Employee Onboarding Process",
    ],
    contribution:
      "Developed onboarding functionality, implemented validation rules, managed document workflows, and worked on backend processing and approval logic.",
    technologies: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap"],
    image: "/images/employee-onboarding-application.jpg",
    imageAlt: "Employee application screen with personal details, documents, and approval checks.",
    imageWidth: 1024,
    imageHeight: 429,
    seoDescription:
      "The Employee Onboarding Module collects hiring details, documents, and approvals. Abdul Subhan Durrani develops its validation, document workflow, and backend logic with Laravel, PHP, and MySQL.",
  },
  {
    slug: "report-automation",
    name: "Report Automation",
    category: "Business Process Automation",
    visual: "reports",
    description:
      "A reporting automation solution designed to reduce manual reporting tasks and improve operational efficiency.",
    features: [
      "Automated Report Generation",
      "Database-Driven Reports",
      "Data Processing",
      "Reporting Workflows",
      "Reduced Manual Reporting Effort",
    ],
    contribution:
      "Worked on automating reporting processes and implementing backend logic for generating and managing reports.",
    technologies: ["Laravel", "PHP", "MySQL", "SQL"],
    image: "/images/report-automation-dashboard.jpg",
    imageAlt: "Reports analytics dashboard with total, pending, approved, and rejected counts, and a chart of incident levels.",
    imageWidth: 1024,
    imageHeight: 409,
    seoDescription:
      "Report Automation generates database-driven reports and reduces repetitive reporting work. Abdul Subhan Durrani implements the Laravel, PHP, MySQL, and SQL logic behind those reports.",
  },
];

export const principles = [
  {
    title: "Clean & Maintainable Code",
    text: "I write Laravel and PHP that another developer can follow, change, and return to without guesswork.",
  },
  {
    title: "Scalable Application Architecture",
    text: "I organize features, models, and routes so a business application can grow without a rewrite.",
  },
  {
    title: "Database Optimization",
    text: "I design MySQL tables and Eloquent relationships with care, and I tighten queries when a screen or report slows down.",
  },
  {
    title: "Performance Optimization",
    text: "I look for the slow step in a workflow and improve it so the application feels quicker in daily use.",
  },
  {
    title: "Problem Solving",
    text: "I break an operational problem into concrete steps, then implement those steps in the product.",
  },
  {
    title: "Responsive Development",
    text: "I build interfaces that stay readable and usable on phones, tablets, and desktop screens.",
  },
  {
    title: "Efficient Business Workflows",
    text: "I turn repeated operational work, including reports and approvals, into clearer application flows.",
  },
];

export const contactCopy = {
  title: "Let's Build Something Great Together.",
  text: "Have a project in mind or looking for a Full Stack Developer? I'd love to hear from you.",
};

export function projectPath(slug) {
  return `/projects/${slug}`;
}

export function findProject(slug) {
  return projects.find((project) => project.slug === slug);
}
