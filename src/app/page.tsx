"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconBolt, IconBulb, IconCode, IconHeart, IconRocket, IconSparkles, IconTrophy, IconUsers } from "@tabler/icons-react";

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
      duration: 0.5,
    },
  },
};

const features = [
  {
    icon: IconCode,
    title: "Ask Questions",
    description: "Get expert answers to your programming questions instantly",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: IconUsers,
    title: "Join Community",
    description: "Connect with developers from around the world",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: IconTrophy,
    title: "Earn Reputation",
    description: "Build your profile by helping others and sharing knowledge",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: IconBolt,
    title: "Fast Answers",
    description: "Real-time voting and instant notifications",
    color: "from-pink-500 to-rose-500"
  }
];

const stats = [
  { label: "Active Users", value: "10K+", icon: IconUsers },
  { label: "Questions", value: "50K+", icon: IconBulb },
  { label: "Answers", value: "150K+", icon: IconSparkles },
  { label: "Communities", value: "100+", icon: IconHeart }
];

const faqs = [
  {
    question: "How do I ask a good question?",
    answer: "Be specific, provide context, include code samples, and explain what you've tried. The more details you provide, the better answers you'll receive."
  },
  {
    question: "How does the voting system work?",
    answer: "Users can upvote helpful questions and answers, or downvote unhelpful ones. Your reputation increases when your content receives upvotes."
  },
  {
    question: "Can I attach files to my questions?",
    answer: "Yes! You can upload images, code snippets, and other files to help illustrate your question."
  },
  {
    question: "Is StackLamp free to use?",
    answer: "Absolutely! StackLamp is completely free for everyone. Ask unlimited questions and provide unlimited answers."
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section 
          className="pt-20 pb-16 sm:pt-32 sm:pb-24"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-center">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 mb-8"
            >
              <IconRocket className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Welcome to the future of Q&A</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.05)"
              }}
            >
              Ask, Learn,
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Grow Together
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of developers sharing knowledge, solving problems, 
              and building the future of technology together.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/ask">
                <Button variant="primary" className="text-lg px-8 py-4 group">
                  Ask a Question
                  <IconArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/questions">
                <Button variant="ghost" className="text-lg px-8 py-6">
                  Browse Questions
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you learn faster and share knowledge effectively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10, rotateX: 5 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Marquee Section */}
        <motion.section
          className="py-12 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by developers worldwide</h2>
          </motion.div>
          
          <div className="relative">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{
                x: [0, -1000]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear"
                }
              }}
            >
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {["JavaScript", "Python", "React", "Node.js", "TypeScript", "Go", "Rust", "Java", "C++", "Swift"].map((tech) => (
                    <div key={`${tech}-${i}`} className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 inline-block">
                      <span className="text-gray-700 font-medium">{tech}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* FAQs Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about StackLamp
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === idx ? "auto" : 0,
                    opacity: openFaq === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join our community and start asking questions today
            </p>
            <Link href="/register">
              <Button variant="default" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                Sign Up Free
                <IconArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}

