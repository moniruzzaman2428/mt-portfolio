
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "modern-react-hooks-complete-guide",
    title: "Modern React Hooks: A Complete Guide to Building Scalable React Applications",
    excerpt:
      "Learn how React Hooks work, manage component state, handle side effects, optimize performance, and build reusable logic with practical examples.",
    date: "2026-11-22",
    dateLabel: "November 22, 2026",
    readTime: "12 min",
    category: "react",
    tags: ["React", "React Hooks", "useState", "useEffect", "Frontend", "JavaScript"],
    image: "/images/blog/react-hookss.webp",
    content: `
<h2>Introduction to React Hooks</h2>
<p>React Hooks changed the way developers build modern React applications. Introduced in React 16.8, Hooks allow functional components to use state, manage side effects, access context, and reuse application logic without writing class components.</p>
<p>Today, understanding React Hooks is an essential skill for frontend developers. Whether you are building a small application or a large-scale production platform, Hooks help you organize code, improve maintainability, and create reusable components.</p>

<h2>1. Understanding useState</h2>
<p>The useState Hook allows functional components to store and update local state. Whenever the state changes, React schedules a re-render so the interface can reflect the latest data.</p>
<pre><code>import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;h2&gt;Count: {count}&lt;/h2&gt;
      &lt;button onClick={() =&gt; setCount(prev =&gt; prev + 1)}&gt;
        Increase
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

export default Counter;</code></pre>
<p>In this example, count stores the current value, while setCount updates it. Functional updates are especially useful when the next state depends on the previous state.</p>

<h2>2. Managing Side Effects with useEffect</h2>
<p>The useEffect Hook is used to synchronize a component with external systems, such as APIs, browser events, subscriptions, and timers.</p>
<pre><code>import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() =&gt; {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    }

    fetchUsers();

    return () =&gt; controller.abort();
  }, []);

  return &lt;div&gt;{users.length} users loaded&lt;/div&gt;;
}</code></pre>
<p>The dependency array determines when the effect should re-run. Cleanup functions help prevent outdated subscriptions and unnecessary ongoing work.</p>

<h2>3. Sharing Data with useContext</h2>
<p>React Context provides a way to share data across components without passing props through every intermediate component. It is useful for authentication information, themes, and application-wide preferences.</p>
<pre><code>import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return &lt;button className={theme}&gt;
    Current Theme: {theme}
  &lt;/button&gt;;
}</code></pre>

<h2>4. Managing Complex State with useReducer</h2>
<p>When state transitions become complex, useReducer provides a structured approach. It is useful for forms, multi-step workflows, and state involving multiple related values.</p>
<pre><code>import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0
  });

  return (
    &lt;div&gt;
      &lt;p&gt;{state.count}&lt;/p&gt;
      &lt;button onClick={() =&gt; dispatch({ type: "increment" })}&gt;
        Increase
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>5. Optimizing Performance</h2>
<p>React provides tools such as useMemo, useCallback, and memo to help reduce unnecessary calculations and rendering in suitable situations.</p>
<ul>
<li><strong>useMemo:</strong> Caches the result of a calculation between renders.</li>
<li><strong>useCallback:</strong> Caches a function definition between renders.</li>
<li><strong>memo:</strong> Can skip rendering a component when its props have not changed.</li>
</ul>
<p>Do not optimize every component automatically. Measure performance first and apply memoization where it provides a meaningful benefit.</p>

<h2>6. Building Custom Hooks</h2>
<p>Custom Hooks allow developers to extract reusable stateful logic into independent functions. Their names must start with use.</p>
<pre><code>import { useState, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() =&gt; {
    const updateWidth = () =&gt; {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWidth);

    return () =&gt; {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return width;
}</code></pre>

<h2>7. Common React Hooks Mistakes</h2>
<ul>
<li>Calling Hooks conditionally or inside loops.</li>
<li>Ignoring dependencies in useEffect.</li>
<li>Updating state directly instead of using its setter.</li>
<li>Using effects for calculations that can happen during rendering.</li>
<li>Adding unnecessary memoization.</li>
</ul>

<h2>Conclusion</h2>
<p>React Hooks are fundamental to modern React development. Start with useState and useEffect, then explore Context, Reducer, and custom Hooks. Practice by building real applications, managing API data, creating reusable components, and optimizing actual performance bottlenecks.</p>
<p>Consistent practice and a clear understanding of React's rendering model will help you become a more confident React developer.</p>
`,
  },

  {
    slug: "mastering-tailwind-css-modern-ui",
    title: "Mastering Tailwind CSS: Build Modern and Responsive User Interfaces",
    excerpt:
      "Discover how to use Tailwind CSS effectively, create reusable design systems, implement responsive layouts, and build professional interfaces.",
    date: "2026-11-18",
    dateLabel: "November 18, 2026",
    readTime: "11 min",
    category: "css",
    tags: ["Tailwind CSS", "CSS", "Responsive Design", "UI Design", "Frontend"],
    image: "/images/blog/tailwind-csss.webp",
    content: `
<h2>Introduction</h2>
<p>Creating consistent, responsive, and visually appealing interfaces is an important part of modern frontend development. Tailwind CSS provides a utility-first approach that allows developers to style components directly within their markup.</p>
<p>Instead of writing separate CSS rules for every element, developers can combine utility classes to build layouts quickly while maintaining design consistency.</p>

<h2>1. Understanding the Utility-First Approach</h2>
<p>Traditional CSS often requires creating custom class names and maintaining separate stylesheets. Tailwind provides small, reusable utility classes for spacing, typography, colors, layout, and more.</p>
<pre><code>&lt;div class="rounded-2xl bg-white p-6 shadow-lg"&gt;
  &lt;h2 class="text-2xl font-bold text-slate-900"&gt;
    Welcome to My Website
  &lt;/h2&gt;
  &lt;p class="mt-3 text-slate-600"&gt;
    Building modern interfaces with Tailwind CSS.
  &lt;/p&gt;
&lt;/div&gt;</code></pre>

<h2>2. Responsive Design with Breakpoints</h2>
<p>Tailwind follows a mobile-first responsive design approach. Base utilities apply to smaller screens, while breakpoint prefixes modify styles at larger viewport widths.</p>
<pre><code>&lt;div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"&gt;
  &lt;article class="rounded-xl bg-white p-5"&gt;
    Responsive Card
  &lt;/article&gt;
&lt;/div&gt;</code></pre>
<ul>
<li><strong>sm:</strong> Small screens and larger.</li>
<li><strong>md:</strong> Medium screens and larger.</li>
<li><strong>lg:</strong> Large screens and larger.</li>
<li><strong>xl:</strong> Extra-large screens and larger.</li>
</ul>

<h2>3. Creating Consistent Color Systems</h2>
<p>A professional website should use a consistent color palette. Define primary, secondary, background, surface, and text colors based on your design requirements.</p>
<p>For larger projects, centralizing design tokens makes it easier to maintain a consistent visual identity across components.</p>

<h2>4. Building Modern Layouts with Flexbox and Grid</h2>
<p>Flexbox is useful for one-dimensional alignment, while CSS Grid works well for two-dimensional layouts.</p>
<pre><code>&lt;section class="grid grid-cols-1 gap-8 lg:grid-cols-2"&gt;
  &lt;div&gt;Content Area&lt;/div&gt;
  &lt;div&gt;Image Area&lt;/div&gt;
&lt;/section&gt;</code></pre>

<h2>5. Hover, Focus, and Interactive States</h2>
<p>Interactive states help users understand how elements behave. Tailwind provides variants for hover, focus, active, disabled, and other states.</p>
<pre><code>&lt;button class="rounded-lg bg-blue-600 px-6 py-3
  text-white transition hover:bg-blue-700
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-blue-600"&gt;
  Get Started
&lt;/button&gt;</code></pre>

<h2>6. Component Reusability</h2>
<p>In React projects, repeated UI patterns should be extracted into reusable components. This reduces duplication and makes future design changes easier.</p>
<ul>
<li>Create reusable buttons and cards.</li>
<li>Keep spacing and typography consistent.</li>
<li>Use shared layout components.</li>
<li>Extract repeated class combinations when appropriate.</li>
</ul>

<h2>7. Common Mistakes to Avoid</h2>
<ul>
<li>Using too many unnecessary utility classes.</li>
<li>Ignoring mobile responsiveness.</li>
<li>Repeating large blocks of identical markup.</li>
<li>Using inconsistent spacing and colors.</li>
<li>Forgetting focus states and accessible contrast.</li>
</ul>

<h2>Conclusion</h2>
<p>Tailwind CSS can make frontend development faster and more consistent when used with a clear design system. Learn responsive utilities, Grid, Flexbox, interactive states, and component reuse to build professional web interfaces.</p>
`,
  },

  {
    slug: "nodejs-express-backend-development",
    title: "Node.js and Express.js: A Practical Guide to Backend Development",
    excerpt:
      "Learn how to create REST APIs, organize backend architecture, handle errors, validate requests, and build maintainable server-side applications.",
    date: "2026-11-14",
    dateLabel: "November 14, 2026",
    readTime: "13 min",
    category: "node",
    tags: ["Node.js", "Express.js", "REST API", "Backend", "JavaScript"],
    image: "/images/blog/nodejss.webp",
    content: `
<h2>Introduction to Backend Development</h2>
<p>Backend development powers the functionality behind modern web applications. It handles business logic, database communication, authentication, authorization, and API responses.</p>
<p>Node.js allows JavaScript to run outside the browser, while Express.js provides a lightweight framework for building HTTP servers and APIs.</p>

<h2>1. Understanding Node.js</h2>
<p>Node.js is a JavaScript runtime built on the V8 engine. Its event-driven, non-blocking I/O model makes it suitable for applications that handle many concurrent connections.</p>
<p>Common use cases include REST APIs, real-time applications, automation tools, and backend services.</p>

<h2>2. Creating an Express Server</h2>
<pre><code>const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) =&gt; {
  res.json({
    message: "Welcome to my API"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =&gt; {
  console.log(\`Server running on port \${PORT}\`);
});</code></pre>
<p>The express.json() middleware parses incoming JSON request bodies. Environment variables help separate configuration from application code.</p>

<h2>3. Understanding REST API Design</h2>
<p>REST APIs organize application functionality around resources. HTTP methods describe the operations performed on those resources.</p>
<ul>
<li><strong>GET:</strong> Retrieve information.</li>
<li><strong>POST:</strong> Create a resource.</li>
<li><strong>PUT:</strong> Replace a resource.</li>
<li><strong>PATCH:</strong> Update selected fields.</li>
<li><strong>DELETE:</strong> Remove a resource.</li>
</ul>
<pre><code>app.get("/api/products", getProducts);
app.post("/api/products", createProduct);
app.patch("/api/products/:id", updateProduct);
app.delete("/api/products/:id", deleteProduct);</code></pre>

<h2>4. Organizing Backend Architecture</h2>
<p>Keeping all application logic in a single file makes projects difficult to maintain. A modular architecture separates different responsibilities.</p>
<pre><code>src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  app.js
  server.js</code></pre>
<p>Routes define endpoints, controllers handle HTTP requests, services contain reusable business logic, and models manage database interactions.</p>

<h2>5. Middleware and Request Validation</h2>
<p>Middleware functions execute during the request-response cycle. They can inspect requests, authenticate users, validate data, and handle errors.</p>
<pre><code>function requestLogger(req, res, next) {
  console.log(req.method, req.originalUrl);
  next();
}

app.use(requestLogger);</code></pre>
<p>Validate incoming data before storing it. Never assume that frontend validation alone is sufficient.</p>

<h2>6. Centralized Error Handling</h2>
<p>Consistent error handling makes an API easier to debug and safer to operate. Express error-handling middleware accepts four arguments.</p>
<pre><code>app.use((err, req, res, next) =&gt; {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: "Something went wrong"
  });
});</code></pre>

<h2>7. Backend Security Best Practices</h2>
<ul>
<li>Store secrets in environment variables.</li>
<li>Validate and sanitize incoming data.</li>
<li>Use secure authentication and authorization.</li>
<li>Configure CORS for trusted origins.</li>
<li>Use HTTPS in production.</li>
<li>Apply rate limiting where appropriate.</li>
<li>Never expose stack traces or sensitive credentials in production responses.</li>
</ul>

<h2>8. Testing and Deployment</h2>
<p>Test API endpoints with tools such as Postman or automated test frameworks. Verify success responses, validation failures, authentication errors, and unexpected server errors.</p>
<p>Deploy using a suitable hosting platform, configure environment variables, connect your production database, and monitor application logs.</p>

<h2>Conclusion</h2>
<p>Node.js and Express.js provide a practical foundation for backend development. Focus on REST principles, modular architecture, validation, security, and error handling to build reliable server-side applications.</p>
`,
  },

  {
    slug: "responsive-web-design-complete-guide",
    title: "Responsive Web Design: Principles, Techniques, and Best Practices",
    excerpt:
      "Explore mobile-first design, CSS Grid, Flexbox, fluid layouts, responsive images, and accessibility techniques for modern websites.",
    date: "2026-11-10",
    dateLabel: "November 10, 2026",
    readTime: "10 min",
    category: "web",
    tags: ["Responsive Design", "CSS", "Mobile First", "Frontend", "UI UX"],
    image: "/images/blog/responsives.webp",
    content: `
<h2>Introduction</h2>
<p>People access websites using smartphones, tablets, laptops, and large desktop displays. A responsive website adapts its layout and content to different screen sizes without sacrificing usability.</p>
<p>Responsive design is not simply about shrinking a desktop layout. It involves planning flexible structures, readable typography, accessible controls, and efficient content presentation.</p>

<h2>1. Start with Mobile-First Design</h2>
<p>A mobile-first workflow begins by designing for smaller screens and progressively enhancing the experience for larger devices.</p>
<ul>
<li>Prioritize essential content.</li>
<li>Keep navigation simple.</li>
<li>Use readable typography.</li>
<li>Make interactive elements easy to tap.</li>
</ul>

<h2>2. Use Flexible Layouts</h2>
<p>Fixed-width layouts can create horizontal scrolling on smaller devices. Prefer percentages, flexible units, max-width, and responsive CSS layout systems.</p>
<pre><code>.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}</code></pre>

<h2>3. Build Layouts with CSS Grid</h2>
<p>CSS Grid is useful for responsive cards, galleries, dashboards, and multi-column layouts.</p>
<pre><code>.card-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 250px), 1fr)
  );
  gap: 1.5rem;
}</code></pre>

<h2>4. Use Flexbox for Alignment</h2>
<p>Flexbox is ideal for navigation bars, button groups, horizontal content alignment, and flexible component layouts.</p>
<pre><code>.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}</code></pre>

<h2>5. Responsive Typography</h2>
<p>Typography should remain readable across screen sizes. The CSS clamp() function creates fluid font sizes within defined limits.</p>
<pre><code>.hero-title {
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.1;
}</code></pre>

<h2>6. Responsive Images and Media</h2>
<p>Images should scale within their containers and preserve their intended aspect ratio.</p>
<pre><code>img {
  display: block;
  max-width: 100%;
  height: auto;
}</code></pre>
<p>For more advanced use cases, use srcset and sizes to provide appropriate image resources for different screen conditions.</p>

<h2>7. Navigation for Mobile Devices</h2>
<p>Mobile navigation should be easy to discover and operate. If you use a menu toggle, provide an accessible button, communicate its expanded state, and support keyboard navigation.</p>

<h2>8. Test Across Different Viewports</h2>
<ul>
<li>Check small mobile screens.</li>
<li>Test tablet and desktop layouts.</li>
<li>Inspect horizontal overflow.</li>
<li>Verify touch target usability.</li>
<li>Test keyboard navigation.</li>
<li>Check text readability and contrast.</li>
</ul>

<h2>Common Responsive Design Mistakes</h2>
<ul>
<li>Using fixed widths for every component.</li>
<li>Hiding important content unnecessarily.</li>
<li>Ignoring landscape orientation.</li>
<li>Using images that overflow containers.</li>
<li>Testing only one mobile device size.</li>
</ul>

<h2>Conclusion</h2>
<p>Responsive design is a fundamental skill for web developers. By combining mobile-first thinking, flexible layouts, modern CSS, and thorough testing, you can create websites that work smoothly across a wide range of devices.</p>
`,
  },

  {
    slug: "mongodb-database-design-guide",
    title: "MongoDB Database Design: A Practical Guide for MERN Stack Developers",
    excerpt:
      "Understand MongoDB documents, collections, schema design, indexing, relationships, aggregation pipelines, and database optimization.",
    date: "2026-11-06",
    dateLabel: "November 6, 2026",
    readTime: "12 min",
    category: "database",
    tags: ["MongoDB", "Database Design", "MERN Stack", "NoSQL", "Backend"],
    image: "/images/blog/mongodbs.webp",
    content: `
<h2>Introduction to MongoDB</h2>
<p>MongoDB is a document-oriented NoSQL database that stores data in flexible BSON documents. It is widely used in JavaScript applications because its document structure works naturally with JSON-based APIs.</p>
<p>For MERN Stack developers, MongoDB provides a flexible database foundation for building modern applications.</p>

<h2>1. Documents and Collections</h2>
<p>A document represents an individual record, while a collection groups related documents together.</p>
<pre><code>{
  "_id": "product-001",
  "name": "Mechanical Keyboard",
  "price": 4500,
  "category": "Accessories",
  "inStock": true
}</code></pre>

<h2>2. Connecting MongoDB with Node.js</h2>
<p>The official MongoDB Node.js driver allows applications to communicate directly with a MongoDB deployment.</p>
<pre><code>const { MongoClient } = require("mongodb");

const client = new MongoClient(
  process.env.MONGODB_URI
);

async function connectDatabase() {
  await client.connect();

  const database = client.db("storeDB");

  return database;
}</code></pre>
<p>Keep the connection URI outside your source code and use environment variables for configuration.</p>

<h2>3. Understanding Schema Design</h2>
<p>MongoDB provides flexible documents, but that does not mean database structure should be ignored. Good schema design depends on how the application reads and writes data.</p>
<p>For example, a product document might contain its name, price, description, and category. Related data can be embedded or referenced depending on access patterns.</p>

<h2>4. Embedding vs Referencing</h2>
<h3>Embedding</h3>
<p>Embedding stores related information inside a parent document. It is useful when related data is frequently retrieved together and has a suitable lifecycle.</p>
<pre><code>{
  "name": "Laptop",
  "reviews": [
    { "rating": 5, "comment": "Excellent" },
    { "rating": 4, "comment": "Very good" }
  ]
}</code></pre>
<h3>Referencing</h3>
<p>Referencing stores the relationship using document identifiers. It is useful when related records are large, shared, or independently updated.</p>
<pre><code>{
  "productId": "product-001",
  "userId": "user-102",
  "quantity": 2
}</code></pre>

<h2>5. MongoDB Indexes</h2>
<p>Indexes help MongoDB locate documents efficiently without scanning every document in a collection for supported queries.</p>
<pre><code>db.products.createIndex({
  category: 1,
  price: -1
});</code></pre>
<p>Indexes improve certain reads but also consume storage and add work to writes. Create indexes based on real query patterns and validate them using query execution plans.</p>

<h2>6. Aggregation Pipelines</h2>
<p>Aggregation pipelines transform and summarize documents through a sequence of stages.</p>
<pre><code>db.orders.aggregate([
  {
    $match: {
      status: "completed"
    }
  },
  {
    $group: {
      _id: "$customerId",
      totalSpent: {
        $sum: "$amount"
      }
    }
  },
  {
    $sort: {
      totalSpent: -1
    }
  }
]);</code></pre>

<h2>7. Database Security</h2>
<ul>
<li>Use authentication and appropriate database roles.</li>
<li>Restrict network access.</li>
<li>Never expose database credentials in frontend code.</li>
<li>Validate incoming documents.</li>
<li>Use secure connections and backups.</li>
<li>Apply least-privilege access.</li>
</ul>

<h2>8. Common Database Design Mistakes</h2>
<ul>
<li>Creating indexes without checking query patterns.</li>
<li>Embedding unlimited arrays in documents.</li>
<li>Ignoring document growth and update patterns.</li>
<li>Storing passwords as plain text.</li>
<li>Using unnecessary references for frequently accessed data.</li>
</ul>

<h2>Conclusion</h2>
<p>MongoDB is more than a place to store JSON-like data. Understanding access patterns, embedding, referencing, indexing, aggregation, and security helps you build reliable and scalable applications.</p>
`,
  },

  {
    slug: "javascript-es6-modern-development",
    title: "Modern JavaScript ES6+: Essential Features Every Developer Should Know",
    excerpt:
      "Master modern JavaScript concepts including arrow functions, destructuring, spread syntax, modules, promises, async/await, and array methods.",
    date: "2026-11-02",
    dateLabel: "November 2, 2026",
    readTime: "12 min",
    category: "javascript",
    tags: ["JavaScript", "ES6", "Async Await", "Promises", "Programming"],
    image: "/images/blog/javascripts.webp",
    content: `
<h2>Introduction</h2>
<p>JavaScript has evolved significantly over the years. Modern ECMAScript features help developers write cleaner, more readable, and maintainable code.</p>
<p>Whether you work with React, Node.js, or browser applications, understanding modern JavaScript is essential.</p>

<h2>1. let and const</h2>
<p>Modern JavaScript provides let and const for block-scoped variable declarations.</p>
<pre><code>const name = "Moniruzzaman";
let experience = "Learning JavaScript";

experience = "Building Applications";</code></pre>
<p>Use const by default and let when reassignment is necessary. Avoid var in modern code unless working with legacy requirements.</p>

<h2>2. Arrow Functions</h2>
<p>Arrow functions provide a concise function syntax and have lexical this behavior.</p>
<pre><code>const greet = (name) =&gt; {
  return \`Hello, \${name}!\`;
};

console.log(greet("Developer"));</code></pre>

<h2>3. Template Literals</h2>
<p>Template literals make string interpolation and multiline strings easier.</p>
<pre><code>const product = "Laptop";
const price = 65000;

const message = \`The \${product} costs \${price} BDT.\`;</code></pre>

<h2>4. Destructuring</h2>
<p>Destructuring extracts values from arrays and properties from objects.</p>
<pre><code>const user = {
  name: "Rahim",
  role: "Developer"
};

const { name, role } = user;

const colors = ["red", "blue"];
const [primary, secondary] = colors;</code></pre>

<h2>5. Spread and Rest Syntax</h2>
<p>Spread syntax expands iterable values or object properties, while rest syntax collects remaining values.</p>
<pre><code>const oldUser = {
  name: "Rahim",
  age: 22
};

const updatedUser = {
  ...oldUser,
  role: "Developer"
};

function sum(...numbers) {
  return numbers.reduce((total, number) =&gt;
    total + number, 0
  );
}</code></pre>

<h2>6. Array Methods</h2>
<p>Methods such as map, filter, find, and reduce make data transformation more expressive.</p>
<pre><code>const products = [
  { name: "Laptop", price: 60000 },
  { name: "Mouse", price: 800 },
  { name: "Keyboard", price: 2500 }
];

const affordable = products.filter(
  product =&gt; product.price &lt; 5000
);

const names = products.map(
  product =&gt; product.name
);

const total = products.reduce(
  (sum, product) =&gt; sum + product.price,
  0
);</code></pre>

<h2>7. JavaScript Modules</h2>
<p>Modules help organize code into reusable files. ES modules use export and import.</p>
<pre><code>// math.js
export const add = (a, b) =&gt; a + b;

// app.js
import { add } from "./math.js";

console.log(add(10, 20));</code></pre>

<h2>8. Promises and Async/Await</h2>
<p>Promises represent the eventual completion or failure of asynchronous operations. Async/await provides a more readable syntax for working with promises.</p>
<pre><code>async function getPosts() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}</code></pre>

<h2>9. Optional Chaining and Nullish Coalescing</h2>
<p>Optional chaining safely accesses nested properties. Nullish coalescing provides a fallback only when a value is null or undefined.</p>
<pre><code>const city = user?.address?.city ?? "Unknown";</code></pre>

<h2>10. Best Practices</h2>
<ul>
<li>Use meaningful variable and function names.</li>
<li>Prefer const when reassignment is unnecessary.</li>
<li>Handle asynchronous errors properly.</li>
<li>Use modules to organize application code.</li>
<li>Avoid unnecessary mutations.</li>
<li>Write small, reusable functions.</li>
</ul>

<h2>Conclusion</h2>
<p>Modern JavaScript features are essential for building professional applications. Practice these concepts through real projects and learn how they work together in React and Node.js development.</p>
`,
  },

  {
    slug: "building-ai-powered-web-applications",
    title: "Building AI-Powered Web Applications: A Beginner's Guide for Developers",
    excerpt:
      "Explore how developers can integrate AI APIs into web applications, design prompt workflows, manage API security, and create intelligent user experiences.",
    date: "2026-10-28",
    dateLabel: "October 28, 2026",
    readTime: "14 min",
    category: "ai",
    tags: ["Artificial Intelligence", "Generative AI", "LLM", "API Integration", "Web Development"],
    image: "/images/blog/ai-developments.webp",
    content: `
<h2>Introduction to AI-Powered Applications</h2>
<p>Artificial Intelligence is changing how modern applications interact with users. Developers can now integrate language models and other AI services to build applications that understand natural language, summarize information, generate content, and assist with complex tasks.</p>
<p>For web developers, AI integration creates opportunities to move beyond traditional forms and static interfaces toward more intelligent user experiences.</p>

<h2>1. Understanding Generative AI</h2>
<p>Generative AI systems can produce text, images, code, and other content based on input instructions. Large Language Models (LLMs) are commonly used for conversational applications, writing assistance, information extraction, and reasoning tasks.</p>
<p>However, model output is not guaranteed to be correct. Important information should be validated before being presented as fact.</p>

<h2>2. Understanding the Basic Architecture</h2>
<p>A typical AI-powered web application contains three major layers:</p>
<ul>
<li><strong>Frontend:</strong> Collects user input and displays AI-generated responses.</li>
<li><strong>Backend:</strong> Handles authentication, validation, prompts, and API requests.</li>
<li><strong>AI Service:</strong> Processes requests and generates model responses.</li>
</ul>
<pre><code>Frontend (React)
      |
      v
Backend (Node.js / Express)
      |
      v
AI Provider API
      |
      v
Generated Response
      |
      v
Frontend UI</code></pre>

<h2>3. Connecting an AI API Securely</h2>
<p>AI provider credentials should remain on the server. Never expose secret API keys inside React components or public frontend environment variables.</p>
<pre><code>const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/ai", async (req, res) =&gt; {
  const { prompt } = req.body;

  if (
    typeof prompt !== "string" ||
    !prompt.trim() ||
    prompt.length &gt; 4000
  ) {
    return res.status(400).json({
      message: "Invalid prompt"
    });
  }

  // Call your selected AI provider here.
  // Keep provider credentials on the server.

  res.json({
    message: "AI request validated successfully"
  });
});</code></pre>
<p>This example demonstrates request validation. A real implementation should call an AI provider through its official SDK or API, handle provider errors, and enforce usage limits.</p>

<h2>4. Writing Effective Prompts</h2>
<p>Prompt engineering means designing clear instructions and context to guide model responses.</p>
<p>A useful prompt generally includes:</p>
<ul>
<li>Role or task definition.</li>
<li>Relevant context.</li>
<li>Specific instructions.</li>
<li>Expected output format.</li>
<li>Restrictions and quality requirements.</li>
</ul>
<pre><code>const prompt = \`
You are a professional coding assistant.

Task:
Explain the following JavaScript concept.

Requirements:
- Use beginner-friendly language.
- Include a practical example.
- Explain common mistakes.
- End with a short summary.
\`;</code></pre>

<h2>5. Building a Conversational Interface</h2>
<p>A chat interface should clearly distinguish user messages from assistant responses. It should also communicate loading states, errors, and the ability to retry failed requests.</p>
<ul>
<li>Maintain conversation history.</li>
<li>Show a loading indicator.</li>
<li>Handle empty messages.</li>
<li>Provide clear error feedback.</li>
<li>Support keyboard accessibility.</li>
</ul>

<h2>6. Managing AI Costs and Performance</h2>
<p>AI requests can consume resources depending on the selected model, input size, output size, and usage frequency.</p>
<ul>
<li>Limit request sizes.</li>
<li>Apply user-level rate limits.</li>
<li>Monitor API usage.</li>
<li>Choose suitable models for each task.</li>
<li>Cache results where appropriate.</li>
<li>Stream responses when the provider supports it and the user experience benefits.</li>
</ul>

<h2>7. AI Security and Responsible Development</h2>
<p>AI applications require more than traditional API security. User prompts may contain sensitive information, and model outputs may be inaccurate or manipulated.</p>
<ul>
<li>Never trust model output as executable code.</li>
<li>Validate data before database operations.</li>
<li>Protect API credentials.</li>
<li>Apply authentication and authorization.</li>
<li>Consider prompt injection risks.</li>
<li>Review privacy and data retention requirements.</li>
<li>Provide human review for high-impact decisions.</li>
</ul>

<h2>8. Project Ideas for Beginners</h2>
<ul>
<li>AI-powered writing assistant.</li>
<li>Programming explanation chatbot.</li>
<li>Document summarization tool.</li>
<li>AI-powered FAQ assistant.</li>
<li>Personalized learning assistant.</li>
</ul>

<h2>Conclusion</h2>
<p>AI integration is becoming an important skill for modern web developers. Start by learning API fundamentals, JavaScript asynchronous programming, backend security, and prompt design. Then build small AI-powered applications and gradually explore more advanced architectures.</p>
<p>The goal is not simply to connect an AI API, but to create a useful, secure, and reliable product that solves a real problem.</p>
`,
  },

  {
    slug: "full-stack-mern-development-roadmap",
    title: "Full Stack MERN Development Roadmap: From Beginner to Professional Developer",
    excerpt:
      "A structured roadmap covering JavaScript, React, Node.js, Express, MongoDB, authentication, deployment, Git, and real-world project development.",
    date: "2026-10-24",
    dateLabel: "October 24, 2026",
    readTime: "15 min",
    category: "career",
    tags: ["MERN Stack", "React", "Node.js", "MongoDB", "Career Roadmap", "Web Development"],
    image: "/images/blog/mern-roadmaps.webp",
    content: `
<h2>Introduction</h2>
<p>Becoming a full stack web developer requires more than learning a collection of technologies. You need to understand how frontend interfaces, backend services, databases, and deployment systems work together.</p>
<p>The MERN Stack is a popular JavaScript-based technology combination consisting of MongoDB, Express.js, React, and Node.js.</p>

<h2>1. Build a Strong HTML and CSS Foundation</h2>
<p>Start by learning semantic HTML, CSS fundamentals, layouts, responsive design, and accessibility.</p>
<ul>
<li>HTML document structure and semantic elements.</li>
<li>CSS selectors and the box model.</li>
<li>Flexbox and CSS Grid.</li>
<li>Responsive layouts and media queries.</li>
<li>Basic accessibility principles.</li>
</ul>

<h2>2. Master JavaScript Fundamentals</h2>
<p>JavaScript is the foundation of the MERN Stack. Learn the language before moving into advanced frameworks.</p>
<ul>
<li>Variables, functions, and scope.</li>
<li>Arrays and objects.</li>
<li>DOM manipulation.</li>
<li>ES6+ syntax.</li>
<li>Promises and async/await.</li>
<li>Closures and higher-order functions.</li>
<li>Modules and error handling.</li>
</ul>

<h2>3. Learn React.js</h2>
<p>React helps developers build interactive user interfaces through reusable components.</p>
<ul>
<li>JSX and component architecture.</li>
<li>Props and state.</li>
<li>React Hooks.</li>
<li>Context API.</li>
<li>React Router.</li>
<li>API integration.</li>
<li>Performance optimization.</li>
</ul>
<pre><code>function Welcome({ name }) {
  return &lt;h1&gt;Welcome, {name}!&lt;/h1&gt;;
}

export default Welcome;</code></pre>

<h2>4. Understand Backend Development</h2>
<p>Learn Node.js and Express.js to create APIs, implement business logic, and communicate with databases.</p>
<ul>
<li>HTTP methods and status codes.</li>
<li>REST API design.</li>
<li>Express routing and middleware.</li>
<li>Request validation.</li>
<li>Error handling.</li>
<li>Authentication and authorization.</li>
</ul>

<h2>5. Learn MongoDB and Database Design</h2>
<p>Database knowledge is essential for building applications that store and retrieve real user information.</p>
<ul>
<li>Collections and documents.</li>
<li>CRUD operations.</li>
<li>Schema design.</li>
<li>Relationships and references.</li>
<li>Indexes and aggregation.</li>
<li>Database security and backups.</li>
</ul>

<h2>6. Implement Authentication and Authorization</h2>
<p>Learn how to register users, securely authenticate them, and restrict access to protected resources.</p>
<ul>
<li>Password hashing.</li>
<li>Session-based authentication.</li>
<li>JWT fundamentals.</li>
<li>Role-based access control.</li>
<li>Protected frontend and backend routes.</li>
</ul>

<h2>7. Learn Git and GitHub</h2>
<p>Version control is an essential professional development skill. Git helps you track changes, collaborate, and maintain project history.</p>
<pre><code>git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main</code></pre>

<h2>8. Build Real-World Projects</h2>
<p>Projects demonstrate your ability to combine technologies into working applications. Start small and increase complexity as your skills improve.</p>
<ul>
<li>Personal portfolio website.</li>
<li>Task management application.</li>
<li>E-commerce platform.</li>
<li>Blog management system.</li>
<li>Student management application.</li>
<li>AI-powered web application.</li>
</ul>

<h2>9. Deployment and Production Fundamentals</h2>
<p>A developer should understand how to move an application from a local environment to production.</p>
<ul>
<li>Frontend and backend hosting.</li>
<li>Environment variables.</li>
<li>Production database configuration.</li>
<li>Domain and DNS configuration.</li>
<li>HTTPS and deployment security.</li>
<li>Logging and error monitoring.</li>
</ul>

<h2>10. Prepare for Professional Opportunities</h2>
<p>Technical knowledge is only one part of becoming a professional developer. You should also practice explaining your projects, reading documentation, solving problems, and communicating clearly.</p>
<ul>
<li>Build a professional portfolio.</li>
<li>Maintain a meaningful GitHub profile.</li>
<li>Write clear project documentation.</li>
<li>Practice JavaScript interview questions.</li>
<li>Learn to debug independently.</li>
<li>Improve technical English communication.</li>
</ul>

<h2>Conclusion</h2>
<p>The MERN Stack provides a practical path into full stack web development. Focus on fundamentals, build real projects, understand the complete request-response lifecycle, and keep improving through consistent practice.</p>
<p>Remember: learning technologies is important, but the ability to solve real problems is what makes you a valuable developer.</p>
`,
  },
];

export const getPost = (slug: string) =>
  posts.find((post) => post.slug === slug);
