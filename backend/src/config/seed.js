import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db.js";
import Question from "../models/question_model.js";

const questions = [
  // ── Technical ───────────────────────────────────────────────────────────────
  {
    title: "What is closure in JavaScript?",
    description: "Explain the concept of closures and give an example.",
    category: "Technical",
    difficulty: "Medium",
    answer:
      "A closure is a function that retains access to its outer scope even after the outer function has returned. It allows inner functions to access variables from the enclosing scope.",
    tags: ["javascript", "functions", "scope"],
  },
  {
    title: "What is the difference between == and === in JavaScript?",
    description: "Explain loose vs strict equality.",
    category: "Technical",
    difficulty: "Easy",
    answer:
      "== checks value equality with type coercion, while === checks both value and type without coercion. For example, '5' == 5 is true but '5' === 5 is false.",
    tags: ["javascript", "operators"],
  },
  {
    title: "What is REST API?",
    description: "Explain REST and its principles.",
    category: "Technical",
    difficulty: "Easy",
    answer:
      "REST (Representational State Transfer) is an architectural style for building APIs using HTTP methods (GET, POST, PUT, DELETE). It is stateless, uses standard HTTP status codes, and communicates via JSON or XML.",
    tags: ["api", "rest", "http"],
  },
  {
    title: "What is the event loop in Node.js?",
    description: "Explain how the event loop works in Node.js.",
    category: "Technical",
    difficulty: "Hard",
    answer:
      "The event loop allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel. It continuously checks the call stack and callback queue, pushing callbacks to the stack when it is empty.",
    tags: ["nodejs", "async", "event-loop"],
  },
  {
    title: "What is the difference between SQL and NoSQL?",
    description: "Compare relational and non-relational databases.",
    category: "Technical",
    difficulty: "Medium",
    answer:
      "SQL databases are relational, use structured tables with fixed schemas, and support ACID transactions (e.g. MySQL, PostgreSQL). NoSQL databases are non-relational, flexible in schema, and scale horizontally (e.g. MongoDB, Redis).",
    tags: ["database", "sql", "nosql"],
  },

  // ── DSA ─────────────────────────────────────────────────────────────────────
  {
    title: "What is the time complexity of binary search?",
    description: "Explain binary search and its complexity.",
    category: "DSA",
    difficulty: "Easy",
    answer:
      "Binary search runs in O(log n) time. It works on sorted arrays by repeatedly halving the search space — comparing the target with the middle element and eliminating half the array each step.",
    tags: ["searching", "algorithms", "complexity"],
  },
  {
    title: "What is the difference between a stack and a queue?",
    description: "Compare stack and queue data structures.",
    category: "DSA",
    difficulty: "Easy",
    answer:
      "A stack follows LIFO (Last In First Out) — the last element added is the first removed. A queue follows FIFO (First In First Out) — the first element added is the first removed.",
    tags: ["stack", "queue", "data-structures"],
  },
  {
    title: "Explain merge sort and its time complexity.",
    description: "How does merge sort work?",
    category: "DSA",
    difficulty: "Medium",
    answer:
      "Merge sort is a divide-and-conquer algorithm. It splits the array in half recursively, sorts each half, then merges them. Time complexity is O(n log n) in all cases. Space complexity is O(n).",
    tags: ["sorting", "algorithms", "divide-and-conquer"],
  },
  {
    title: "What is a hash table and how does it work?",
    description: "Explain hashing and collision handling.",
    category: "DSA",
    difficulty: "Medium",
    answer:
      "A hash table stores key-value pairs. A hash function maps keys to array indices. Collisions (two keys mapping to the same index) are handled using chaining (linked lists) or open addressing. Average time complexity is O(1) for insert/search.",
    tags: ["hashing", "data-structures"],
  },
  {
    title: "What is dynamic programming?",
    description: "Explain dynamic programming with an example.",
    category: "DSA",
    difficulty: "Hard",
    answer:
      "Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing results (memoization or tabulation) to avoid recomputation. Classic examples include Fibonacci, knapsack, and longest common subsequence.",
    tags: ["dp", "optimization", "algorithms"],
  },

  // ── System Design ────────────────────────────────────────────────────────────
  {
    title: "How would you design a URL shortener like bit.ly?",
    description: "Walk through the high-level design of a URL shortener.",
    category: "System Design",
    difficulty: "Medium",
    answer:
      "Key components: a unique ID generator (base62 encoding), a key-value store (Redis/DynamoDB) mapping short codes to long URLs, a redirect service, and a CDN for caching. Consider rate limiting, analytics tracking, and expiry handling.",
    tags: ["system-design", "scalability", "databases"],
  },
  {
    title: "What is load balancing and why is it important?",
    description: "Explain load balancing strategies.",
    category: "System Design",
    difficulty: "Easy",
    answer:
      "Load balancing distributes incoming traffic across multiple servers to prevent overload and improve availability. Common strategies include round-robin, least connections, and IP hash. Tools include Nginx, HAProxy, and AWS ELB.",
    tags: ["load-balancing", "scalability", "infrastructure"],
  },
  {
    title: "What is the CAP theorem?",
    description: "Explain CAP theorem in distributed systems.",
    category: "System Design",
    difficulty: "Hard",
    answer:
      "CAP theorem states that a distributed system can only guarantee two of three: Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (system works despite network splits). Most distributed systems choose AP or CP.",
    tags: ["distributed-systems", "cap-theorem"],
  },

  // ── Behavioral ───────────────────────────────────────────────────────────────
  {
    title: "Tell me about a time you handled a conflict in a team.",
    description: "Describe how you resolved a team disagreement.",
    category: "Behavioral",
    difficulty: "Medium",
    answer:
      "Use the STAR method: Situation — describe the conflict context. Task — your role. Action — how you communicated, listened, and found a compromise. Result — positive outcome for the team.",
    tags: ["teamwork", "conflict", "communication"],
  },
  {
    title: "Describe a time you missed a deadline. What happened?",
    description: "How do you handle failure or missed deadlines?",
    category: "Behavioral",
    difficulty: "Medium",
    answer:
      "Be honest and show accountability. Describe the situation, what caused the delay, how you communicated with stakeholders, what steps you took to recover, and what you learned to prevent it in the future.",
    tags: ["accountability", "time-management"],
  },

  // ── HR ───────────────────────────────────────────────────────────────────────
  {
    title: "Why do you want to work at this company?",
    description: "How to answer company-specific motivation questions.",
    category: "HR",
    difficulty: "Easy",
    answer:
      "Research the company's mission, products, and culture. Align your answer with their values and explain how your skills and goals match what they are building. Be specific — avoid generic answers.",
    tags: ["motivation", "culture-fit"],
  },
  {
    title: "Where do you see yourself in 5 years?",
    description: "How to answer long-term career goal questions.",
    category: "HR",
    difficulty: "Easy",
    answer:
      "Show ambition but also alignment with the role. Talk about growing your technical skills, taking on more responsibility, and contributing to the company's growth. Avoid saying you want your interviewer's job.",
    tags: ["career-goals", "growth"],
  },
  {
    title: "What is your greatest weakness?",
    description: "How to answer weakness questions honestly.",
    category: "HR",
    difficulty: "Medium",
    answer:
      "Choose a real but non-critical weakness. Show self-awareness and explain the steps you are actively taking to improve. For example: 'I used to struggle with delegating tasks, so I have been working on trusting my team more by assigning clear ownership.'",
    tags: ["self-awareness", "growth"],
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Question.deleteMany({});
    console.log("🗑️  Old questions deleted");

    await Question.insertMany(questions);
    console.log(`✅  ${questions.length} questions seeded successfully`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();