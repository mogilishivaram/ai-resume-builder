import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiCpu, FiLock, FiLayout, FiDownload, FiArrowRight } from "react-icons/fi";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-36 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6">
            <FiCpu /> Powered by Google Gemini AI
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Build Your Perfect Resume<br />
            <span className="text-primary-200">with AI Assistance</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create ATS-friendly, professional resumes in minutes. Our AI helps you craft compelling
            content, suggest skills, and optimise every section for your target role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              {user ? "Go to Dashboard" : "Get Started Free"} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
          Everything You Need to Land Your Dream Job
        </h2>
        <p className="text-center text-slate-500 mb-14 max-w-2xl mx-auto">
          Our AI-powered platform handles the heavy lifting so you can focus on what matters.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            icon={<FiCpu className="text-3xl text-primary-500" />}
            title="AI Content Generation"
            desc="Generate professional summaries, bullet points, and skill suggestions tailored to your role."
          />
          <Feature
            icon={<FiLock className="text-3xl text-green-500" />}
            title="Secure Google Auth"
            desc="Sign in safely with your Google account. Your data is always protected."
          />
          <Feature
            icon={<FiLayout className="text-3xl text-purple-500" />}
            title="Multiple Templates"
            desc="Choose from Professional, Modern, and Creative templates to match your style."
          />
          <Feature
            icon={<FiDownload className="text-3xl text-amber-500" />}
            title="PDF Export"
            desc="Download your polished resume as a PDF, ready to send to recruiters."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-indigo-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Resume?</h2>
          <p className="text-primary-100 mb-8">
            Join thousands of professionals who've created winning resumes with AI.
          </p>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition shadow-lg"
          >
            Start Building Now <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 text-sm">
        <p>© {new Date().getFullYear()} AI Resume Builder. Built with ❤️ using React & Flask.</p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
