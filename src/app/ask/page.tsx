"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
import { useAuthStore } from "@/store/auth";
import { databases } from "@/models/client/config";
import { db, QUESTION_COLLECTION } from "@/models/name";
import { ID, Permission, Role } from "appwrite";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function AskQuestionPage() {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [attachmentId, setAttachmentId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // Wait for hydration before checking auth
    if (hydrated && !user) {
      toast.error("Please login to ask a question");
      router.push("/login");
    }
  }, [user, hydrated, router]);

  // Show loading while hydrating
  if (!hydrated) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Show loading if not authenticated yet
  if (!user) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Posting your question...");

    try {
      const questionData: any = {
        title: title.trim(),
        content: content.trim(),
        authorId: user.$id,
      };

      // Only add tags if provided
      if (tags.trim()) {
        const tagArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        if (tagArray.length > 0) {
          questionData.tags = tagArray;
        }
      }

      // Only add attachment if provided
      if (attachmentId) {
        questionData.attachmentId = attachmentId;
      }

      console.log("Creating question with data:", questionData);
      console.log("Database:", db);
      console.log("Collection:", QUESTION_COLLECTION);

      const response = await databases.createDocument(
        db,
        QUESTION_COLLECTION,
        ID.unique(),
        questionData,
        [
          Permission.read(Role.any()), // Anyone can read
          Permission.update(Role.user(user.$id)), // Only author can update
          Permission.delete(Role.user(user.$id)), // Only author can delete
        ]
      );

      console.log("Question created successfully:", response);
      toast.success("Question posted successfully!", { id: toastId });
      router.push(`/question/${response.$id}`);
    } catch (err: any) {
      console.error("Error creating question:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        type: err.type,
        response: err.response
      });
      
      // Provide helpful error message
      let errorMessage = "Failed to create question.";
      if (err.message?.includes("Unknown attribute")) {
        errorMessage = "Database schema mismatch. Please check Appwrite collection attributes.";
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="text-center py-12">Redirecting to login...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.div 
        className="max-w-2xl mx-auto px-4 sm:px-0 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          Ask a Question
        </motion.h1>

        <motion.div variants={itemVariants}>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question? Be specific."
                  className="mt-2"
                  disabled={submitting}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="content">Details</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 w-full min-h-[180px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                  placeholder="Provide all the details someone would need to answer your question..."
                  disabled={submitting}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. javascript, react, typescript"
                  className="mt-2"
                  disabled={submitting}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label>Attachment (optional)</Label>
                <div className="mt-2">
                  <FileUpload
                    bucketId={process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "attachments"}
                    onUploadComplete={setAttachmentId}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row justify-end gap-3"
                variants={itemVariants}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? "Posting..." : "Post Question"}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
