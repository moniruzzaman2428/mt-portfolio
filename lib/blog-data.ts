/** Blog posts carried over from the previous portfolio. Content is HTML. */
export type Post = {
  slug: string; title: string; excerpt: string; date: string; dateLabel: string;
  readTime: string; category: string; tags: string[]; image: string; content: string
}

export const posts: Post[] = [
  {
    slug: "getting-started-with-react-hooks",
    title: "Getting Started with React Hooks",
    excerpt: "Master React Hooks to simplify functional components and manage state effectively.",
    date: "2024-03-15",
    dateLabel: "March 15, 2024",
    readTime: "5 min",
    category: "react",
    tags: ["react", "hooks", "frontend", "javascript"],
    image: "/images/blog/react-hooks.webp",
    content: `<p>React Hooks revolutionized functional components by providing access to React features without classes. Introduced in React 16.8, they've become the standard for modern React development.</p>
<h3>🚀 Why Use Hooks?</h3>
<ul>
<li>Simplify complex components</li>
<li>Reuse stateful logic</li>
<li>Reduce class component boilerplate</li>
<li>Improve code organization</li>
</ul>
<h3>📚 Core Hooks</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
<div class="bg-teal-500/10 p-4 rounded-xl">
<h4 class="font-bold text-teal-400">useState</h4>
<p>Add state to functional components</p>
</div>
<div class="bg-blue-500/10 p-4 rounded-xl">
<h4 class="font-bold text-blue-400">useEffect</h4>
<p>Handle side effects and lifecycle</p>
</div>
<div class="bg-purple-500/10 p-4 rounded-xl">
<h4 class="font-bold text-purple-400">useContext</h4>
<p>Access context without nesting</p>
</div>
<div class="bg-pink-500/10 p-4 rounded-xl">
<h4 class="font-bold text-pink-400">useReducer</h4>
<p>Manage complex state logic</p>
</div>
</div>
<p>Start using Hooks today to write cleaner, more maintainable React code!</p>`,
  },
  {
    slug: "mastering-tailwind-css",
    title: "Mastering Tailwind CSS",
    excerpt: "Build stunning UIs faster with Tailwind's utility-first approach and advanced features.",
    date: "2024-04-02",
    dateLabel: "April 2, 2024",
    readTime: "7 min",
    category: "css",
    tags: ["tailwind", "css", "styling", "frontend"],
    image: "/images/blog/tailwind-css.webp",
    content: `<p>Tailwind CSS has transformed how we write CSS by adopting a utility-first approach that prioritizes speed and consistency.</p>
<h3>🎨 Why Developers Love Tailwind</h3>
<ul>
<li>No context switching between HTML and CSS</li>
<li>Consistent design system</li>
<li>Incredibly fast prototyping</li>
<li>Smaller production CSS bundles</li>
</ul>
<h3>⚡ Advanced Features</h3>
<p>Explore JIT mode, custom configurations, and plugin development to supercharge your workflow.</p>`,
  },
  {
    slug: "node-js-best-practices",
    title: "Node.js Best Practices",
    excerpt: "Build scalable and maintainable Node.js applications with industry-proven patterns.",
    date: "2024-04-18",
    dateLabel: "April 18, 2024",
    readTime: "10 min",
    category: "node",
    tags: ["nodejs", "backend", "javascript", "server"],
    image: "/images/blog/nodejs.webp",
    content: `<p>Node.js powers millions of applications worldwide. Following best practices ensures your app scales efficiently.</p>
<h3>🏗️ Architecture Patterns</h3>
<ul>
<li>Layered Architecture</li>
<li>Microservices</li>
<li>Event-Driven Design</li>
</ul>`,
  },
  {
    slug: "responsive-design-principles",
    title: "Responsive Design Principles",
    excerpt: "Create flawless experiences across all devices with modern responsive techniques.",
    date: "2024-05-05",
    dateLabel: "May 5, 2024",
    readTime: "6 min",
    category: "web",
    tags: ["responsive", "design", "mobile", "ui"],
    image: "/images/blog/responsive.webp",
    content: `<p>In today's multi-device world, responsive design isn't optional—it's essential.</p>
<h3>📱 Mobile-First Approach</h3>
<p>Start small and scale up for optimal performance and user experience.</p>`,
  },
  {
    slug: "introduction-to-mongodb",
    title: "Introduction to MongoDB",
    excerpt: "Get started with MongoDB, the flexible NoSQL database for modern applications.",
    date: "2024-05-22",
    dateLabel: "May 22, 2024",
    readTime: "8 min",
    category: "database",
    tags: ["mongodb", "database", "nosql", "backend"],
    image: "/images/blog/mongodb.webp",
    content: `<p>MongoDB offers a flexible, document-oriented approach to data storage that scales with your needs.</p>
<h3>📄 Document Model Advantages</h3>
<ul>
<li>JSON-like documents</li>
<li>Dynamic schemas</li>
<li>Rich query language</li>
</ul>`,
  },
  {
    slug: "javascript-es6-plus-features",
    title: "JavaScript ES6+ Features",
    excerpt: "Supercharge your JavaScript with modern ES6+ syntax and features.",
    date: "2024-06-10",
    dateLabel: "June 10, 2024",
    readTime: "9 min",
    category: "javascript",
    tags: ["javascript", "es6", "modernjs", "frontend"],
    image: "/images/blog/javascript.webp",
    content: `<p>ES6+ brought JavaScript into the modern era with powerful features that make coding more enjoyable.</p>
<h3>✨ Must-Know Features</h3>
<ul>
<li>Arrow Functions</li>
<li>Destructuring</li>
<li>Async/Await</li>
<li>Modules</li>
</ul>`,
  },
]

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)