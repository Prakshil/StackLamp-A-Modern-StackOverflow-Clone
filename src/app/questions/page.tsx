"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { databases } from "@/models/client/config";
import { db, QUESTION_COLLECTION } from "@/models/name";
import { Query } from "appwrite";
import toast from "react-hot-toast";

interface Question {
  $id: string;
  title: string;
  content: string;
  tags?: string[];
  $createdAt: string;
  isStatic?: boolean;
}

// Static placeholder questions
const staticQuestions: Question[] = [
  {
    $id: "static-1",
    title: "How do I center a div in CSS?",
    content: "I've been trying to center a div element both horizontally and vertically on my page. I've tried using margin: auto but it only centers horizontally. What's the best modern approach to center elements in CSS?",
    tags: ["css", "html", "frontend"],
    $createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isStatic: true
  },
  {
    $id: "static-2",
    title: "What's the difference between let, const, and var in JavaScript?",
    content: "I'm learning JavaScript and I'm confused about when to use let, const, or var. Can someone explain the differences and best practices for each?",
    tags: ["javascript", "es6", "variables"],
    $createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isStatic: true
  },
  {
    $id: "static-3",
    title: "How to fix 'Cannot read property of undefined' error?",
    content: "I keep getting this error in my React app: 'Cannot read property 'map' of undefined'. I'm trying to map over an array from an API response. How can I handle this properly?",
    tags: ["javascript", "react", "error-handling"],
    $createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isStatic: true
  },
  {
    $id: "static-4",
    title: "Best practices for REST API design",
    content: "I'm building a REST API for my application and want to follow best practices. What are the key principles I should follow for URL structure, HTTP methods, and response codes?",
    tags: ["api", "rest", "backend", "best-practices"],
    $createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isStatic: true
  },
  {
    $id: "static-5",
    title: "How to optimize React app performance?",
    content: "My React application is getting slow as it grows. What are some effective ways to optimize performance? I've heard about useMemo and useCallback but not sure when to use them.",
    tags: ["react", "performance", "optimization"],
    $createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isStatic: true
  },
  {
    $id: "static-6",
    title: "Understanding async/await vs Promises",
    content: "What are the main differences between using async/await syntax and traditional Promise chains? When should I use one over the other?",
    tags: ["javascript", "async", "promises"],
    $createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    isStatic: true
  },
  {
    $id: "static-7",
    title: "How to deploy Next.js app to production?",
    content: "I've built a Next.js application and I'm ready to deploy it. What are the recommended hosting platforms and what configuration do I need to set up?",
    tags: ["nextjs", "deployment", "production"],
    $createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    isStatic: true
  },
  {
    $id: "static-8",
    title: "Git merge vs rebase - which one to use?",
    content: "I'm working on a team project and we're debating whether to use merge or rebase for integrating changes. What are the pros and cons of each approach?",
    tags: ["git", "version-control", "workflow"],
    $createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    isStatic: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(staticQuestions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    setLoading(true);
    try {
      const response = await databases.listDocuments(db, QUESTION_COLLECTION, [
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]);
      
      // Combine real questions with static ones
      const realQuestions = response.documents as unknown as Question[];
      const allQuestions = [...realQuestions, ...staticQuestions].sort((a, b) => 
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
      
      setQuestions(allQuestions);
    } catch (err) {
      console.error("Error loading questions:", err);
      // On error, just show static questions
      toast.error("Could not load latest questions. Showing sample questions.");
      setQuestions(staticQuestions);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">All Questions</h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse and discover questions from the community
                {questions.some(q => !q.isStatic) && (
                  <span className="ml-2 text-indigo-600">• {questions.filter(q => !q.isStatic).length} live</span>
                )}
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Link href="/ask" className="block">
                <Button variant="primary" className="w-full md:w-auto">Ask a question</Button>
              </Link>
            </div>
          </motion.div>

          {loading && (
            <motion.div 
              className="text-center py-4"
              variants={itemVariants}
            >
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading latest questions...</p>
            </motion.div>
          )}

          <motion.div 
            className="grid grid-cols-1 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {questions.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Card>
                  <div className="text-center py-12">
                    <p className="text-gray-600">No questions yet. Be the first to ask!</p>
                    <Link href="/ask" className="mt-4 inline-block">
                      <Button variant="primary">Ask the first question</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ) : (
              questions.map((question) => (
                <motion.div key={question.$id} variants={itemVariants}>
                  <Link href={question.isStatic ? "#" : `/question/${question.$id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                          <h3 className="text-base md:text-lg font-semibold hover:text-indigo-600 transition-colors">
                            {question.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {question.content}
                          </p>
                          {question.tags && question.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {question.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-3 text-xs text-gray-500">
                            Asked {new Date(question.$createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
