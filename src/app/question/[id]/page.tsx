"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { databases } from "@/models/client/config";
import { db, QUESTION_COLLECTION, ANSWERS_COLLECTION, VOTE_COLLECTION } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { Query } from "appwrite";
import { IconArrowUp, IconArrowDown, IconPaperclip } from "@tabler/icons-react";
import toast from "react-hot-toast";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  attachmentId?: string;
  $createdAt: string;
}

interface Answer {
  $id: string;
  content: string;
  authorId: string;
  questionId: string;
  $createdAt: string;
}

interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: "upvoted" | "downvoted" | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;
  const { user } = useAuthStore();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [votes, setVotes] = useState<VoteData>({ upvotes: 0, downvotes: 0, userVote: null });
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestion();
    loadAnswers();
    loadVotes();
  }, [questionId]);

  async function loadQuestion() {
    try {
      const doc = await databases.getDocument(db, QUESTION_COLLECTION, questionId);
      setQuestion(doc as any);
    } catch (err) {
      console.error("Error loading question:", err);
      toast.error("Failed to load question");
    }
  }

  async function loadAnswers() {
    try {
      const response = await databases.listDocuments(db, ANSWERS_COLLECTION, [
        Query.equal("questionId", questionId),
        Query.orderDesc("$createdAt"),
      ]);
      setAnswers(response.documents as any);
    } catch (err) {
      console.error("Error loading answers:", err);
      toast.error("Failed to load answers");
    } finally {
      setLoading(false);
    }
  }

  async function loadVotes() {
    try {
      const [upvoteRes, downvoteRes] = await Promise.all([
        databases.listDocuments(db, VOTE_COLLECTION, [
          Query.equal("type", "question"),
          Query.equal("typeId", questionId),
          Query.equal("voteStatus", "upvoted"),
        ]),
        databases.listDocuments(db, VOTE_COLLECTION, [
          Query.equal("type", "question"),
          Query.equal("typeId", questionId),
          Query.equal("voteStatus", "downvoted"),
        ]),
      ]);

      let userVote: "upvoted" | "downvoted" | null = null;
      if (user) {
        const userVoteRes = await databases.listDocuments(db, VOTE_COLLECTION, [
          Query.equal("type", "question"),
          Query.equal("typeId", questionId),
          Query.equal("votedById", user.$id),
        ]);
        if (userVoteRes.documents.length > 0) {
          userVote = (userVoteRes.documents[0] as any).voteStatus;
        }
      }

      setVotes({
        upvotes: upvoteRes.total,
        downvotes: downvoteRes.total,
        userVote,
      });
    } catch (err) {
      console.error("Error loading votes:", err);
    }
  }

  async function handleVote(voteStatus: "upvoted" | "downvoted") {
    if (!user) {
      toast.error("Please log in to vote");
      router.push("/login");
      return;
    }

    // Optimistic update - update UI immediately
    const currentVote = votes.userVote;
    const currentUpvotes = votes.upvotes;
    const currentDownvotes = votes.downvotes;

    // Calculate new vote counts
    let newUpvotes = currentUpvotes;
    let newDownvotes = currentDownvotes;

    if (currentVote === voteStatus) {
      // User is removing their vote
      if (voteStatus === "upvoted") {
        newUpvotes--;
      } else {
        newDownvotes--;
      }
      // Update UI immediately
      setVotes({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: null,
      });
    } else if (currentVote === null) {
      // User is adding a new vote
      if (voteStatus === "upvoted") {
        newUpvotes++;
      } else {
        newDownvotes++;
      }
      // Update UI immediately
      setVotes({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: voteStatus,
      });
    } else {
      // User is changing their vote
      if (currentVote === "upvoted") {
        newUpvotes--;
        newDownvotes++;
      } else {
        newUpvotes++;
        newDownvotes--;
      }
      // Update UI immediately
      setVotes({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: voteStatus,
      });
    }

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus,
          type: "question",
          typeId: questionId,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setVotes({
          upvotes: currentUpvotes,
          downvotes: currentDownvotes,
          userVote: currentVote,
        });
        toast.error("Failed to vote. Please try again.");
      }
    } catch (err) {
      console.error("Error voting:", err);
      // Revert on error
      setVotes({
        upvotes: currentUpvotes,
        downvotes: currentDownvotes,
        userVote: currentVote,
      });
      toast.error("Failed to vote. Please try again.");
    }
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !answerContent.trim()) return;

    setSubmitting(true);
    const toastId = toast.loading("Posting your answer...");
    
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          answer: answerContent,
          authorId: user.$id,
        }),
      });

      if (response.ok) {
        toast.success("Answer posted successfully!", { id: toastId });
        setAnswerContent("");
        loadAnswers();
      } else {
        toast.error("Failed to post answer. Please try again.", { id: toastId });
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      toast.error("Failed to post answer. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-12">Loading question...</div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <Header />
        <div className="text-center py-12">Question not found.</div>
      </>
    );
  }

  const voteCount = votes.upvotes - votes.downvotes;

  return (
    <>
      <Header />
      <motion.div 
        className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Question Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Vote buttons */}
              <div className="flex md:flex-col flex-row items-center gap-2 md:gap-2">
                <button
                  onClick={() => handleVote("upvoted")}
                  className={`p-2 rounded-md transition-colors ${
                    votes.userVote === "upvoted"
                      ? "bg-indigo-100 text-indigo-600"
                      : "hover:bg-gray-100"
                  }`}
                  disabled={!user}
                >
                  <IconArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <div className="text-lg md:text-xl font-bold">{voteCount}</div>
                <button
                  onClick={() => handleVote("downvoted")}
                  className={`p-2 rounded-md transition-colors ${
                    votes.userVote === "downvoted"
                      ? "bg-red-100 text-red-600"
                      : "hover:bg-gray-100"
                  }`}
                  disabled={!user}
                >
                  <IconArrowDown className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Question content */}
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold mb-4">{question.title}</h1>
                <div className="prose prose-sm max-w-none">
                  <p className="text-neutral-700 dark:text-neutral-300">{question.content}</p>
                </div>

                {question.attachmentId && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
                    <IconPaperclip className="w-4 h-4" />
                    <span>Attachment: {question.attachmentId}</span>
                  </div>
                )}

                {question.tags && question.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
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

                <div className="mt-4 text-xs text-neutral-500">
                  Asked {new Date(question.$createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Answers section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          <div className="space-y-4">
            {answers.map((answer, index) => (
              <motion.div 
                key={answer.$id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-neutral-700 dark:text-neutral-300">{answer.content}</p>
                  </div>
                  <div className="mt-4 text-xs text-neutral-500">
                    Answered {new Date(answer.$createdAt).toLocaleDateString()}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Answer form */}
        <motion.div variants={itemVariants}>
          {user ? (
            <Card>
              <h3 className="text-base md:text-lg font-semibold mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                  placeholder="Write your answer here..."
                  disabled={submitting}
                />
                <div className="mt-4 flex justify-end">
                  <Button type="submit" variant="primary" disabled={submitting || !answerContent.trim()}>
                    {submitting ? "Submitting..." : "Post Answer"}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card>
              <p className="text-center text-sm md:text-base text-neutral-600">
                <a href="/login" className="text-indigo-600 hover:underline">
                  Log in
                </a>{" "}
                to post an answer.
              </p>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
