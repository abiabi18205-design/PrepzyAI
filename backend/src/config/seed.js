import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db.js";
import Question from "../models/question_model.js";

const questions = [
  // ── Technical (15 questions) ──────────────────────────────────────────────
  {
    title: "What is a closure in JavaScript?",
    description: "Explain what a closure is and provide a practical example.",
    category: "Technical",
    difficulty: "Medium",
    answer: "A closure is created when an inner function retains access to variables from its outer scope after the outer function has returned. Example: function outer() { let count = 0; return function inner() { count++; return count; } }",
    tags: ["javascript", "closure", "scope"]
  },
  {
    title: "Explain event delegation in JavaScript",
    description: "Describe event delegation and why it's useful.",
    category: "Technical",
    difficulty: "Medium",
    answer: "Event delegation attaches a single event listener to a parent element instead of individual children. Events bubble up, allowing you to handle dynamically added elements efficiently and improve performance.",
    tags: ["javascript", "dom", "events", "performance"]
  },
  {
    title: "What is the difference between 'let', 'const', and 'var'?",
    description: "Compare variable declarations in JavaScript.",
    category: "Technical",
    difficulty: "Easy",
    answer: "'var' is function-scoped and can be redeclared. 'let' and 'const' are block-scoped. 'const' cannot be reassigned after declaration. 'let' allows reassignment. Use const by default, let when reassignment is needed.",
    tags: ["javascript", "variables", "es6"]
  },
  {
    title: "Explain how 'this' works in JavaScript",
    description: "Describe the behavior of the 'this' keyword in different contexts.",
    category: "Technical",
    difficulty: "Hard",
    answer: "'this' refers to the object that owns the current execution context. In methods, it refers to the parent object. In functions, it refers to the global object (or undefined in strict mode). Arrow functions inherit 'this' from parent scope.",
    tags: ["javascript", "this", "context", "scope"]
  },
  {
    title: "What is the purpose of the virtual DOM in React?",
    description: "Explain how virtual DOM improves performance in React applications.",
    category: "Technical",
    difficulty: "Medium",
    answer: "Virtual DOM is an in-memory representation of the real DOM. React compares virtual DOM changes with the previous version (diffing) and batch updates only changed elements to the real DOM, minimizing expensive DOM manipulations.",
    tags: ["react", "virtual-dom", "performance", "frontend"]
  },
  {
    title: "What is middleware in Express.js?",
    description: "Explain the concept of middleware and its common use cases.",
    category: "Technical",
    difficulty: "Easy",
    answer: "Middleware functions have access to request and response objects. They can execute code, modify request/response, end the request cycle, or call the next middleware. Common uses: logging, authentication, parsing JSON, and error handling.",
    tags: ["express", "nodejs", "middleware", "backend"]
  },
  {
    title: "Explain the difference between SQL and NoSQL databases",
    description: "Compare relational and non-relational databases with use cases.",
    category: "Technical",
    difficulty: "Medium",
    answer: "SQL databases have fixed schemas, support ACID transactions, and use structured query language. NoSQL databases have flexible schemas, scale horizontally, and suit unstructured data. SQL for financial systems, NoSQL for social media or real-time apps.",
    tags: ["database", "sql", "nosql", "comparison"]
  },
  {
    title: "What is the event loop in Node.js?",
    description: "Explain how the event loop enables non-blocking I/O operations.",
    category: "Technical",
    difficulty: "Hard",
    answer: "The event loop continuously checks the call stack and callback queue. When the stack is empty, it pushes callbacks onto the stack. This allows Node.js to handle concurrent operations without creating multiple threads.",
    tags: ["nodejs", "event-loop", "async", "non-blocking"]
  },
  {
    title: "What are React hooks?",
    description: "Explain React hooks and name the most common ones.",
    category: "Technical",
    difficulty: "Easy",
    answer: "Hooks are functions that let you use state and lifecycle features in functional components. Common hooks: useState for state management, useEffect for side effects, useContext for consuming context, and useRef for DOM references.",
    tags: ["react", "hooks", "state", "functional-components"]
  },
  {
    title: "Explain how JWT authentication works",
    description: "Describe JSON Web Token flow for authentication.",
    category: "Technical",
    difficulty: "Medium",
    answer: "JWT is a stateless authentication method. Server generates a signed token containing user claims after login. Client stores token and sends it in Authorization header for subsequent requests. Server verifies signature before processing.",
    tags: ["jwt", "authentication", "security", "api"]
  },
  {
    title: "What is the difference between HTTP and HTTPS?",
    description: "Compare HTTP and HTTPS protocols.",
    category: "Technical",
    difficulty: "Easy",
    answer: "HTTP transmits data in plain text, making it vulnerable to interception. HTTPS adds SSL/TLS encryption, securing data transmission. HTTPS requires an SSL certificate and protects sensitive information like passwords and credit card details.",
    tags: ["http", "https", "security", "ssl"]
  },
  {
    title: "Explain the same-origin policy and CORS",
    description: "Describe browser security policy and how to handle cross-origin requests.",
    category: "Technical",
    difficulty: "Medium",
    answer: "Same-origin policy restricts scripts from accessing resources from different origins. CORS (Cross-Origin Resource Sharing) allows servers to specify who can access resources using headers like Access-Control-Allow-Origin.",
    tags: ["cors", "security", "browser", "api"]
  },
  {
    title: "What is the difference between REST and GraphQL?",
    description: "Compare REST and GraphQL API paradigms.",
    category: "Technical",
    difficulty: "Medium",
    answer: "REST uses multiple endpoints and returns fixed data structures. GraphQL uses a single endpoint where clients request exactly the data they need. GraphQL reduces over-fetching and under-fetching but adds complexity.",
    tags: ["rest", "graphql", "api", "comparison"]
  },
  {
    title: "Explain database indexing and its trade-offs",
    description: "Describe how indexes work and when to use them.",
    category: "Technical",
    difficulty: "Hard",
    answer: "Indexes are data structures that speed up read queries by allowing faster lookups. They slow down write operations (INSERT, UPDATE, DELETE) because indexes must be updated. Use indexes on columns used frequently in WHERE or JOIN clauses.",
    tags: ["database", "indexing", "performance", "optimization"]
  },
  {
    title: "What is the difference between PUT and PATCH?",
    description: "Compare HTTP methods for updating resources.",
    category: "Technical",
    difficulty: "Easy",
    answer: "PUT replaces an entire resource with the provided data. If fields are missing, they become null or default. PATCH applies partial updates, only modifying the fields sent in the request. Use PUT for full updates, PATCH for partial updates.",
    tags: ["http", "rest", "api", "methods"]
  },

  // ── DSA (15 questions) ───────────────────────────────────────────────────
  {
    title: "What is time complexity of binary search?",
    description: "Explain binary search algorithm and its efficiency.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Binary search runs in O(log n) time complexity. It works on sorted arrays by repeatedly dividing the search space in half, comparing the target with the middle element and eliminating half the array each iteration.",
    tags: ["binary-search", "algorithms", "complexity", "searching"]
  },
  {
    title: "What is the difference between a stack and a queue?",
    description: "Compare stack and queue data structures with examples.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Stack follows LIFO (Last In First Out) - like a browser back button. Queue follows FIFO (First In First Out) - like a printer queue. Stacks use push/pop operations. Queues use enqueue/dequeue operations.",
    tags: ["stack", "queue", "data-structures", "lifo", "fifo"]
  },
  {
    title: "Explain how a hash table works internally",
    description: "Describe hashing, hash functions, and collision handling.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Hash tables store key-value pairs using a hash function to compute array indices. Collisions occur when two keys map to the same index. Solutions include chaining (linked lists) or open addressing (linear probing). Average time complexity is O(1).",
    tags: ["hash-table", "hashing", "collision", "data-structures"]
  },
  {
    title: "Explain merge sort and its time complexity",
    description: "Describe how merge sort works and analyze its efficiency.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Merge sort is a divide-and-conquer algorithm. It splits arrays into halves recursively, sorts each half, then merges them. Time complexity is O(n log n) in all cases with O(n) space complexity. Stable sorting algorithm.",
    tags: ["merge-sort", "sorting", "algorithms", "divide-conquer"]
  },
  {
    title: "What is the difference between DFS and BFS?",
    description: "Compare depth-first and breadth-first search traversal algorithms.",
    category: "DSA",
    difficulty: "Medium",
    answer: "DFS uses a stack (recursion) and explores as far as possible before backtracking. BFS uses a queue and explores all neighbors at current depth first. BFS finds shortest path in unweighted graphs. DFS uses less memory for deep graphs.",
    tags: ["dfs", "bfs", "graph", "traversal", "algorithms"]
  },
  {
    title: "What is dynamic programming?",
    description: "Explain dynamic programming with an example.",
    category: "DSA",
    difficulty: "Hard",
    answer: "Dynamic programming solves problems by breaking them into overlapping subproblems and storing results (memoization or tabulation) to avoid recomputation. Classic examples include Fibonacci sequence, knapsack problem, and longest common subsequence.",
    tags: ["dynamic-programming", "optimization", "algorithms", "memoization"]
  },
  {
    title: "What is the time complexity of quicksort in worst and average cases?",
    description: "Explain quicksort performance in different scenarios.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Average time complexity of quicksort is O(n log n) when pivot choice is balanced. Worst case is O(n²) when pivot is always smallest or largest (already sorted array). Space complexity is O(log n) for recursion stack.",
    tags: ["quicksort", "sorting", "complexity", "algorithms"]
  },
  {
    title: "What is the difference between an array and a linked list?",
    description: "Compare array and linked list data structures.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Arrays store elements in contiguous memory, allowing O(1) random access but costly insertions/deletions (O(n)). Linked lists store nodes with pointers, allowing O(1) insertions/deletions at ends but O(n) search and random access.",
    tags: ["array", "linked-list", "data-structures", "comparison"]
  },
  {
    title: "What is a binary search tree?",
    description: "Explain BST properties and operations.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Binary search tree is a tree structure where left children are smaller than parent and right children are larger. Search, insert, and delete average time complexity is O(log n). Worst case degrades to O(n) if unbalanced.",
    tags: ["binary-search-tree", "tree", "data-structures", "search"]
  },
  {
    title: "How do you detect a cycle in a linked list?",
    description: "Explain Floyd's cycle detection algorithm.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Use Floyd's cycle detection algorithm with slow and fast pointers. Move slow pointer one step, fast pointer two steps per iteration. If they meet, a cycle exists. Time complexity O(n), space complexity O(1).",
    tags: ["linked-list", "cycle-detection", "floyd", "algorithms"]
  },
  {
    title: "What is the difference between a process and a thread?",
    description: "Compare process and thread in operating systems.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Processes are independent execution units with separate memory space. Threads share memory space within the same process. Context switching between threads is faster than processes. Threads are lighter but harder to synchronize.",
    tags: ["process", "thread", "os", "concurrency"]
  },
  {
    title: "What is recursion and when would you use it?",
    description: "Explain recursion with example and potential pitfalls.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Recursion is when a function calls itself. Use it for problems with repetitive substructures like tree traversal, factorial, or Fibonacci. Always include a base case to prevent infinite loops. Can cause stack overflow for deep recursion.",
    tags: ["recursion", "algorithms", "functions", "stack"]
  },
  {
    title: "Explain the sliding window technique",
    description: "Describe sliding window algorithm pattern with example.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Sliding window maintains a subset of elements within a range, expanding or contracting the window as needed. Used for substring problems or maximum sum of subarray of size k. Reduces time complexity from O(n²) to O(n).",
    tags: ["sliding-window", "algorithms", "optimization", "pattern"]
  },
  {
    title: "What is the two-pointer technique?",
    description: "Explain two-pointer algorithm pattern.",
    category: "DSA",
    difficulty: "Easy",
    answer: "Two-pointer technique uses two indices moving toward each other or in the same direction to solve problems efficiently. Common uses: finding pairs in sorted array, removing duplicates, palindrome checking. Reduces nested loops to O(n).",
    tags: ["two-pointer", "algorithms", "optimization", "pattern"]
  },
  {
    title: "What is the difference between a heap and a stack?",
    description: "Compare heap and stack memory allocation.",
    category: "DSA",
    difficulty: "Medium",
    answer: "Stack stores primitive values and function calls in LIFO order, automatically managed and fast but limited size. Heap stores objects and references, dynamically allocated and larger but slower with garbage collection.",
    tags: ["heap", "stack", "memory", "javascript"]
  },

  // ── System Design (8 questions) ──────────────────────────────────────────
  {
    title: "How would you design a URL shortener like bit.ly?",
    description: "Walk through high-level design of URL shortening service.",
    category: "System Design",
    difficulty: "Medium",
    answer: "Key components: unique ID generator using base62 encoding, key-value store (Redis/DynamoDB) mapping short codes to long URLs, redirect service with HTTP 301/302, CDN caching, analytics tracking, and TTL expiry.",
    tags: ["system-design", "url-shortener", "scalability", "caching"]
  },
  {
    title: "What is load balancing and why is it important?",
    description: "Explain load balancing strategies and benefits.",
    category: "System Design",
    difficulty: "Easy",
    answer: "Load balancing distributes incoming traffic across multiple servers to prevent overload, improve availability, and provide redundancy. Common algorithms: round-robin, least connections, IP hash. Tools: Nginx, HAProxy, AWS ELB.",
    tags: ["load-balancing", "scalability", "infrastructure", "availability"]
  },
  {
    title: "Explain the CAP theorem in distributed systems",
    description: "Describe the CAP theorem and its implications.",
    category: "System Design",
    difficulty: "Hard",
    answer: "CAP theorem states a distributed system can only guarantee two of three: Consistency (every read returns latest write), Availability (every request gets response), Partition Tolerance (system works despite network splits). Most systems choose AP or CP.",
    tags: ["cap-theorem", "distributed-systems", "consistency", "availability"]
  },
  {
    title: "How would you design a chat system like WhatsApp?",
    description: "Design a real-time messaging system.",
    category: "System Design",
    difficulty: "Hard",
    answer: "Components include WebSocket servers for real-time messaging, message queues for offline users, database for message history, CDN for media files, and presence service for online status. Use sharding for scalability and encryption for security.",
    tags: ["system-design", "chat", "real-time", "websocket"]
  },
  {
    title: "What is database sharding?",
    description: "Explain horizontal partitioning of databases.",
    category: "System Design",
    difficulty: "Medium",
    answer: "Sharding distributes data across multiple database instances (shards) based on a shard key like user_id. Improves write scalability and reduces contention but adds complexity for cross-shard queries and rebalancing.",
    tags: ["sharding", "database", "scalability", "partitioning"]
  },
  {
    title: "What is a CDN and why would you use it?",
    description: "Explain content delivery network benefits.",
    category: "System Design",
    difficulty: "Easy",
    answer: "CDN is a geographically distributed network of servers that cache static assets (images, CSS, JS). Benefits include reduced latency, lower server load, improved availability, and DDoS protection. Popular providers: Cloudflare, AWS CloudFront.",
    tags: ["cdn", "caching", "performance", "scalability"]
  },
  {
    title: "How would you design a rate limiter?",
    description: "Design a system to limit API request rates.",
    category: "System Design",
    difficulty: "Medium",
    answer: "Use token bucket or sliding window log algorithm. Store counters in Redis with TTL. Return 429 status code when limit exceeded. Implement distributed rate limiting using Redis cluster or consistent hashing.",
    tags: ["rate-limiting", "api", "scalability", "redis"]
  },
  {
    title: "What is database replication?",
    description: "Explain master-slave and multi-master replication.",
    category: "System Design",
    difficulty: "Easy",
    answer: "Replication copies data from one database to another. Master-slave: writes to master, reads from slaves. Multi-master: writes to multiple nodes. Benefits include high availability, read scalability, and disaster recovery.",
    tags: ["replication", "database", "availability", "scalability"]
  },

  // ── Behavioral (6 questions) ─────────────────────────────────────────────
  {
    title: "Tell me about a time you handled a team conflict",
    description: "Describe how you resolved a disagreement within your team.",
    category: "Behavioral",
    difficulty: "Medium",
    answer: "Situation: Two engineers disagreed on architecture choice. Task: Align team on decision. Action: Facilitated meeting, encouraged both to present evidence, led team vote based on trade-offs. Result: Adopted best solution and improved team collaboration.",
    tags: ["conflict-resolution", "teamwork", "leadership", "star-method"]
  },
  {
    title: "Describe a time you missed a deadline",
    description: "Explain how you handled missing a deadline and what you learned.",
    category: "Behavioral",
    difficulty: "Medium",
    answer: "Situation: Underestimated testing complexity. Task: Deliver feature by Friday. Action: Immediately communicated delay, reprioritized tasks with manager, worked extra hours for critical path. Result: Delivered two days late but with quality, learned to add buffer.",
    tags: ["accountability", "time-management", "communication", "star-method"]
  },
  {
    title: "Tell me about a time you had to learn a new technology quickly",
    description: "Describe how you rapidly learned a new skill.",
    category: "Behavioral",
    difficulty: "Easy",
    answer: "Situation: Team needed to migrate to React. Task: Learn React in two weeks. Action: Completed official tutorial, built small prototype, pair-programmed with senior, reviewed PRs. Result: Successfully contributed to migration within deadline.",
    tags: ["learning", "adaptability", "growth", "star-method"]
  },
  {
    title: "Describe a time you made a mistake at work",
    description: "Explain a technical mistake and how you fixed it.",
    category: "Behavioral",
    difficulty: "Medium",
    answer: "Situation: Deployed breaking change to production. Task: Restore service quickly. Action: Rolled back immediately, communicated outage to stakeholders, wrote post-mortem with automated tests. Result: Service restored in 15 minutes, prevented future incidents.",
    tags: ["mistake", "accountability", "problem-solving", "star-method"]
  },
  {
    title: "Tell me about a time you went above and beyond",
    description: "Describe when you exceeded expectations.",
    category: "Behavioral",
    difficulty: "Easy",
    answer: "Situation: Documentation was outdated for critical service. Task: Improve onboarding. Action: Rewrote docs, added runbooks, recorded video tutorials, created quick-start guide. Result: New hires onboarded 50% faster, received recognition from manager.",
    tags: ["initiative", "leadership", "ownership", "star-method"]
  },

  // ── HR (6 questions) ─────────────────────────────────────────────────────
  {
    title: "Why do you want to work at this company?",
    description: "Answer company-specific motivation questions.",
    category: "HR",
    difficulty: "Easy",
    answer: "Research company mission, products, and culture. Align your answer with their values and explain how your skills match. Example: 'I admire your work in AI ethics, and my background in responsible ML aligns with your commitment to transparency.'",
    tags: ["motivation", "culture-fit", "company-research", "preparation"]
  },
  {
    title: "Where do you see yourself in 5 years?",
    description: "Answer long-term career goal questions.",
    category: "HR",
    difficulty: "Easy",
    answer: "Show ambition aligned with the role. Mention growth, leadership, and company contribution. Example: 'I want to become a technical lead, mentor junior developers, and help scale our product to millions of users.'",
    tags: ["career-goals", "growth", "ambition", "planning"]
  },
  {
    title: "What is your greatest weakness?",
    description: "Answer weakness questions honestly and constructively.",
    category: "HR",
    difficulty: "Medium",
    answer: "Choose real but non-critical weakness. Show self-awareness and improvement steps. Example: 'I struggled with delegating tasks because I wanted control. I've been trusting my team by assigning ownership and providing support without micromanaging.'",
    tags: ["self-awareness", "growth", "honesty", "improvement"]
  },
  {
    title: "Why are you leaving your current job?",
    description: "Answer about job transition professionally.",
    category: "HR",
    difficulty: "Medium",
    answer: "Focus on growth and opportunity, not negativity. Example: 'I've learned a lot but hit a growth plateau. I'm seeking more challenging technical problems and the opportunity to work on larger-scale systems.'",
    tags: ["job-transition", "professionalism", "growth", "honesty"]
  },
  {
    title: "Describe your ideal work environment",
    description: "Answer about preferred work culture.",
    category: "HR",
    difficulty: "Easy",
    answer: "Be honest but align with company values. Example: 'I thrive in collaborative environments with open communication, continuous learning, and focus on quality. I value autonomy with accountability and teams that celebrate diverse perspectives.'",
    tags: ["culture-fit", "work-environment", "collaboration", "values"]
  },
  {
    title: "How do you handle constructive criticism?",
    description: "Explain your response to feedback.",
    category: "HR",
    difficulty: "Easy",
    answer: "I welcome constructive criticism as an opportunity to grow. I listen actively without being defensive, ask clarifying questions, thank the person for feedback, and create an action plan to improve. I follow up to show progress.",
    tags: ["feedback", "growth", "professionalism", "communication"]
  }
];

const seed = async () => {
  try {
    await connectDB();

    await Question.deleteMany({});
    console.log("🗑️  Old questions deleted");

    await Question.insertMany(questions);
    console.log(`✅ ${questions.length} questions seeded successfully`);
    console.log(`   - Technical: ${questions.filter(q => q.category === "Technical").length}`);
    console.log(`   - DSA: ${questions.filter(q => q.category === "DSA").length}`);
    console.log(`   - System Design: ${questions.filter(q => q.category === "System Design").length}`);
    console.log(`   - Behavioral: ${questions.filter(q => q.category === "Behavioral").length}`);
    console.log(`   - HR: ${questions.filter(q => q.category === "HR").length}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();