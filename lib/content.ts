/**
 * ✏️  All personal information lives here (migrated from the previous portfolio).
 * Edit this file to update text, links, projects, skills, experience, etc.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://md-moniruzzaman-tonoy.web.app").replace(/\/$/, "")

export const site = {
  brand: "MT",
  name: "Md Moniruzzaman Tonoy",
  firstName: "Md Moniruzzaman",
  lastName: "Tonoy",
  jobTitle: "Full Stack Developer",
  email: "moniruzzaman2428@gmail.com",
  phone: "+880 1618 160869",
  whatsapp: "8801618160869",
  location: "Kendua, Netrokona, Bangladesh",
  timezone: "GMT+6 (Bangladesh Standard Time)",
  workingHours: "9:00 AM – 6:00 PM (Sunday–Thursday)",
  birthDate: "07 May 2007",
  freelance: "Available",
  // Contact form (Web3Forms). Public client key — restrict it to your domain in the Web3Forms dashboard.
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "a9b6bb6c-f178-437d-a90a-f26a96a2c11d",
  gaId: "G-LNGB733JTD",
  googleVerification: [
    "avGOZ8aixEXukZwgKtglByHvxqJkYoW1G27N-pjUaLQ",
    "0YW6tzUbChvDTF05mjHuTaBsUNnJv0dGD_LdeVfth5E",
  ],
  roles: [
    "Full Stack Developer",
    "UI/UX Enthusiast",
    "React & Next.js Developer",
    "Graphics Designer",
    "MS Office Instructor",
  ],
  description:
    "Md Moniruzzaman Tonoy — Full Stack Web Developer from Bangladesh specializing in React, Next.js, Tailwind CSS, Node.js and Firebase. View projects, skills, blog and contact.",
  intro:
    "I craft exceptional digital experiences that blend beautiful design with cutting-edge technology. Passionate about creating intuitive, accessible and pixel-perfect web applications.",
  keywords: [
    "Md Moniruzzaman Tonoy", "Moniruzzaman Tonoy", "MT portfolio", "Full Stack Developer", "React Developer",
    "Next.js Developer", "Web Developer Bangladesh", "Tailwind CSS", "JavaScript", "Netrokona", "Kendua", "Portfolio",
  ],
  resume: {
    view: "https://drive.google.com/file/d/1Ox-10YznAyJ7LI1AGRuP4lCCZ0loBo7w/view",
    download: "https://drive.google.com/uc?export=download&id=1Ox-10YznAyJ7LI1AGRuP4lCCZ0loBo7w",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Work", href: "#work" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/nur922184", icon: "github", handle: "@nur922184" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/md-moniruzzaman-tonoy-7bb52b285/", icon: "linkedin", handle: "Md Moniruzzaman" },
    { label: "X (Twitter)", href: "https://x.com/moniruzzaman_24", icon: "twitter", handle: "@moniruzzaman_24" },
    { label: "Facebook", href: "https://www.facebook.com/md.moniruzzaman.tonoy", icon: "facebook", handle: "md.moniruzzaman.tonoy" },
    { label: "YouTube", href: "https://www.youtube.com/@moniruzzamam2428", icon: "youtube", handle: "@moniruzzamam2428" },
    { label: "DEV Community", href: "https://dev.to/moniruzzaman2428", icon: "dev", handle: "moniruzzaman2428" },
    { label: "WhatsApp", href: "https://wa.me/8801618160869", icon: "whatsapp", handle: "+880 1618 160869" },
  ],
  stats: [
    { value: 50, suffix: "+", label: "Projects" },
    { value: 3, suffix: "+", label: "Years Experience" },
    { value: 100, suffix: "%", label: "Satisfaction" },
    { value: 24, suffix: "/7", label: "Availability" },
  ],
  marquee: [
    "React", "Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS",
    "Redux Toolkit", "GraphQL", "REST APIs", "Figma", "Photoshop", "Illustrator",
  ],
  about: {
    title: "Computer Specialist & Frontend Developer",
    typed: [
      "I am a passionate Computer Specialist",
      "Working as an MS Office Instructor at Open IT Institute",
      "Studied at Kendua Joyhori Spri Govt. High School",
      "Currently mastering Web Design & Development",
      "I love building clean & interactive UIs",
    ],
    text: [
      "A dedicated professional with a passion for technology and problem-solving. With experience in computer operations and ongoing education in web development, I'm constantly expanding my skills to create innovative digital solutions.",
      "I believe in the power of technology to transform lives and businesses — from the first sketch to the final deploy, I focus on clarity, speed and a polished experience.",
    ],
    quote:
      "Technology is best when it brings people together. My goal is to create digital experiences that not only solve problems but also inspire and connect people.",
    interests: ["Coding", "Technology", "Learning", "Open Source"],
  },
  skills: [
    { name: "HTML5", icon: "html5", level: 95, group: "Frontend" },
    { name: "CSS3", icon: "css3", level: 90, group: "Frontend" },
    { name: "JavaScript", icon: "javascript", level: 88, group: "Frontend" },
    { name: "React.js", icon: "react", level: 85, group: "Frontend" },
    { name: "Redux Toolkit", icon: "redux", level: 80, group: "Frontend" },
    { name: "Next.js", icon: "nextjs", level: 75, group: "Frontend" },
    { name: "Tailwind CSS", icon: "tailwind", level: 85, group: "Frontend" },
    { name: "Bootstrap", icon: "bootstrap", level: 80, group: "Frontend" },
    { name: "Node.js", icon: "nodejs", level: 70, group: "Backend" },
    { name: "Express.js", icon: "express", level: 70, group: "Backend" },
    { name: "MongoDB", icon: "mongodb", level: 65, group: "Backend" },
    { name: "Firebase", icon: "firebase", level: 78, group: "Backend" },
    { name: "Git & GitHub", icon: "github", level: 75, group: "Tools" },
    { name: "Webpack", icon: "webpack", level: 65, group: "Tools" },
    { name: "Figma", icon: "figma", level: 70, group: "Tools" },
    { name: "Debugging", icon: "bug", level: 85, group: "Tools" },
  ],
  experience: [
    {
      title: "Full Stack Developer",
      company: "Programming Hero",
      url: "https://www.programming-hero.com/",
      period: "Jan 2024 – Present",
      location: "Remote",
      text:
        "Recently completed the course and an internship. I build web applications with React.js, Node.js, Express.js and MongoDB. During the internship I gained real-world experience in responsive web design, REST API integration and authentication, and worked on individual and team projects with a focus on performance optimization and deployment — improving both frontend and backend functionality.",
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "REST API", "Authentication", "Performance Optimization", "Deployment"],
    },
    {
      title: "Microsoft Office Application Instructor",
      company: "Open IT Institute",
      period: "Jun 2021 – Present",
      location: "Kendua, Netrokona",
      text:
        "Level 1 Instructor, Executive Mentor and Graphics Designer. I teach Microsoft Office courses (Word, Excel, PowerPoint, Access) with hands-on training in office automation, data management and presentation design. As a graphics designer I work with Photoshop, Illustrator, InDesign and Canva on logo design, branding, banners, posters, social media and print/digital projects.",
      tech: ["MS Word", "Excel", "PowerPoint", "Access", "Office Automation", "Photoshop", "Illustrator", "InDesign", "Canva"],
    },
  ],
  education: [
    {
      title: "Higher Secondary Certificate (HSC)",
      institution: "Kendua Government College",
      period: "2025 – 2026",
      text: "Science Group with focus on Mathematics and Computer Science. Currently completing higher secondary education.",
    },
    {
      title: "Secondary School Certificate (SSC)",
      institution: "Kendua Joyhori Spri Government High School",
      period: "2023 – 2024",
      text: "Science Group with excellent academic performance.",
    },
    {
      title: "Web Design & Development",
      institution: "Open IT Institute",
      period: "2024 – Present",
      text: "Comprehensive web development program focusing on modern technologies.",
    },
  ],
  certificates: [
    { name: "Complete Web Development", issuer: "Programming Hero", year: "2024" },
    { name: "React Developer Certificate", issuer: "Online Platform", year: "2024" },
    { name: "Microsoft Office Specialist", issuer: "Microsoft", year: "2022" },
    { name: "Graphic Design Fundamentals", issuer: "Adobe", year: "2023" },
  ],
  languages: [
    { name: "Bengali", level: "Native", value: 100 },
    { name: "English", level: "Fluent", value: 85 },
    { name: "Hindi", level: "Conversational", value: 65 },
  ],
  services: [
    { icon: "code", title: "Web Development", text: "Fast, SEO-friendly websites and full-stack web apps with React, Next.js, Node.js and Firebase." },
    { icon: "palette", title: "UI/UX Design", text: "Clean, intuitive interfaces with a strong visual identity — from Figma to production." },
    { icon: "rocket", title: "Frontend Solutions", text: "Responsive, accessible and high-performance frontends with modern tooling and animation." },
    { icon: "message", title: "Consultation", text: "Practical advice on architecture, performance, deployment and getting your idea online." },
  ],
  projects: [
    {
      title: "Winter Clothing Donation Platform",
      text: "A comprehensive platform connecting donors with volunteers to assist vulnerable people during the winter season.",
      live: "https://assignment-nine-4896f.web.app/",
      image: "https://i.ibb.co.com/gwNZ04s/Screenshot-2024-11-28-085754.png",
      tech: ["React", "Firebase", "Tailwind CSS", "Node.js", "Express", "Redux"],
      tag: "Charity · Full Stack",
      launched: "March 2024",
      features: ["Real-time synchronization of donation data", "Secure user authentication system", "Scalable database architecture"],
    },
    {
      title: "Gadget Heaven E-commerce",
      text: "Modern e-commerce platform specializing in premium tech accessories with advanced shopping features.",
      live: "https://magical-gumption-061d0e.netlify.app/",
      source: "https://github.com/nur922184/gadget-heaven-accessories",
      image: "https://i.ibb.co.com/bHP8G53/Screenshot-2024-11-28-091404.png",
      tech: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe"],
      tag: "E-commerce · Full Stack",
      launched: "July 2024",
      features: ["Payment gateway security implementation", "Performance optimization for large catalog", "Cart synchronization across devices"],
    },
    {
      title: "Lifelink Relationship Platform",
      text: "Platform fostering meaningful connections through smart matching and community building.",
      live: "https://my-final-project-36ab9.web.app/",
      source: "https://github.com/nur922184/life-link-client",
      tech: ["React", "Firebase", "Tailwind CSS", "Node.js", "Next.js", "TypeScript"],
      tag: "Social · Full Stack",
      launched: "November 2024",
      features: ["Matching algorithm development", "Real-time chat implementation", "User privacy and data security"],
    },
    {
      title: "CrowdFund Platform",
      text: "Comprehensive crowdfunding solution empowering creators to bring innovative ideas to life.",
      live: "https://my-assignment-ten-57a0d.web.app/",
      source: "https://github.com/nur922184/crowd-funding-client-10",
      image: "https://i.ibb.co.com/m9RctdG/Screenshot-2024-12-20-233742.png",
      tech: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redux"],
      tag: "Crowdfunding · Full Stack",
      launched: "March 2025",
      features: ["Payment system compliance and security", "Campaign verification process", "Real-time funding updates"],
    },
  ] as {
    title: string; text: string; live: string; source?: string; image?: string
    tech: string[]; tag: string; launched: string; features: string[]
  }[],
}
