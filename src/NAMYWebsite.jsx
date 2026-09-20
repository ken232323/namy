import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sun,
  Moon,
  MessageCircle,
  Send,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Download,
  CheckCircle2,
  Users,
  Lightbulb,
  Briefcase,
  Cpu,
  Sprout,
  Leaf,
  HeartHandshake,
  Globe2,
  GraduationCap,
  Wrench,
  BookOpen,
  Award,
  PlayCircle,
  Target,
  Eye,
  Flag,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import emailjs from "@emailjs/browser";

import { api } from "./api";
import image1 from "./assets/image1.webp";
import image2 from "./assets/image2.webp";
import image3 from "./assets/image3.webp";
import image4 from "./assets/about.webp";
import image1Mobile from "./assets/mobileimage3.webp";
import image2Mobile from "./assets/mobileimage2.webp";
import image3Mobile from "./assets/mobileimage1.webp";
import logo from "./assets/namy.webp";
import ged from "./assets/gedzam.png";
import nydc from "./assets/nydc.jpg";
import namylabs from "./assets/namylabs.webp";
import { IconWorld } from "@tabler/icons-react";
/* ---------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ---------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Leadership", id: "leadership" },
  { label: "Vision & Mission", id: "vision" },
  { label: "Programs", id: "programs" },
  { label: "Namy Labs", id: "innovation" },
  { label: "Seminars", id: "seminars" },
  { label: "Workshops", id: "workshops" },
  { label: "News", id: "news" },
  { label: "Contact", id: "contact" },
];

// Stats keep a fallback so the page never shows a blank "0" for headline
// numbers. Every other section shows an honest empty-state message instead
// of fake placeholder content when the backend has no data yet.
const STATS_FALLBACK = [
  { value: 15, suffix: "+", label: "District Programs" },
  { value: 300, suffix: "+", label: "Youth Members" },
  { value: 50, suffix: "+", label: "Innovation Projects" },
  { value: 1000, suffix: "+", label: "Lives Impacted" },
  { value: 25, suffix: "+", label: "Partners" },
];

const PROGRAMS = [
  {
    icon: Users,
    title: "Youth Leadership",
    desc: "Building confident, principled leaders equipped to steer their communities forward.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Turning youth ideas into working prototypes that solve real local problems.",
  },
  {
    icon: Briefcase,
    title: "Entrepreneurship",
    desc: "Mentorship, seed-capital access and business skills for young founders.",
  },
  {
    icon: Cpu,
    title: "Digital Skills",
    desc: "Practical training in coding, digital marketing and the tools of a modern economy.",
  },
  {
    icon: Sprout,
    title: "Agriculture",
    desc: "Climate-smart farming techniques for a new generation of agripreneurs.",
  },
  {
    icon: Leaf,
    title: "Climate Action",
    desc: "Youth-led environmental projects and climate resilience initiatives.",
  },
  {
    icon: HeartHandshake,
    title: "Women's Empowerment",
    desc: "Dedicated platforms for young women to lead, build and thrive.",
  },
  {
    icon: Globe2,
    title: "Community Development",
    desc: "Grassroots projects that strengthen infrastructure and social cohesion.",
  },
  {
    icon: GraduationCap,
    title: "STEM Education",
    desc: "Hands-on science, technology, engineering and maths for schools.",
  },
  {
    icon: Wrench,
    title: "Technical Skills",
    desc: "Vocational and trade training aligned with real market demand.",
  },
  {
    icon: BookOpen,
    title: "Research",
    desc: "Youth-driven research that informs policy and community solutions.",
  },
  {
    icon: Award,
    title: "Volunteerism",
    desc: "Structured volunteer pathways that turn goodwill into measurable impact.",
  },
];

const PARTNERS = [ged, nydc];

const WHATSAPP_NUMBER = "260970115956";
const WHATSAPP_OPTIONS = [
  { label: "Become a Member", msg: "Hello NAMY, I'd like to become a member." },
  {
    label: "Seminar Registration",
    msg: "Hello NAMY, I'd like to register for an upcoming seminar.",
  },
  {
    label: "Workshop Support",
    msg: "Hello NAMY, I have a question about an upcoming workshop.",
  },
  {
    label: "Namy Labs",
    msg: "Hello NAMY, I want to know more about the Innovation Hub.",
  },
  {
    label: "Talk to Administration",
    msg: "Hello NAMY, I would like to speak with the administration team.",
  },
  { label: "General Enquiry", msg: "Hello NAMY, I have a general enquiry." },
];

const heroSlides = [
  {
    image: image3,
    mobileImage: image3Mobile,
    title: "Empowering Youths.",
    subtitle: "Strengthening Communities.",
    color: "#F4B400",
  },
  {
    image: image2,
    mobileImage: image2Mobile,
    title: "Building Leaders.",
    subtitle: "Creating Opportunity.",
    color: "#22C55E",
  },
  {
    image: image1,
    mobileImage: image1Mobile,
    title: "Inspiring Innovation.",
    subtitle: "Shaping Zambia's Future.",
    color: "#38BDF8",
  },
];

/* ---------------------------------------------------------------------- */
/*  HOOKS                                                                  */
/* ---------------------------------------------------------------------- */

function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useReveal();
  return (
    <div
      ref={ref}
      className={`namy-reveal ${inView ? "namy-in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useCountUp(target, inView, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

/* ---------------------------------------------------------------------- */
/*  SMALL COMPONENTS                                                       */
/* ---------------------------------------------------------------------- */

function DistrictNetwork({ className = "" }) {
  const nodes = [
    [40, 60],
    [140, 30],
    [230, 90],
    [320, 40],
    [400, 110],
    [90, 150],
    [200, 170],
    [300, 190],
    [370, 220],
    [60, 230],
    [160, 250],
    [260, 260],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [1, 5],
    [2, 6],
    [3, 6],
    [4, 8],
    [5, 9],
    [5, 10],
    [6, 10],
    [6, 11],
    [7, 8],
    [7, 11],
    [9, 10],
    [10, 11],
  ];
  return (
    <svg
      viewBox="0 0 440 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="url(#namyLineGrad)"
          strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 4.5 : 3}
          fill={i % 3 === 0 ? "#F4B400" : "#2E8B57"}
          className="namy-pulse-dot"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
      <defs>
        <linearGradient
          id="namyLineGrad"
          x1="0"
          y1="0"
          x2="440"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0B4F8C" />
          <stop offset="100%" stopColor="#2E8B57" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatCard({ stat }) {
  const [ref, inView] = useReveal();
  const value = useCountUp(stat.value, inView);
  return (
    <div ref={ref} className={`namy-reveal ${inView ? "namy-in-view" : ""} text-center`}>
      <div className="namy-stat-number">
        {value}
        {stat.suffix}
      </div>
      <div className="namy-muted text-sm md:text-base font-medium mt-2">
        {stat.label}
      </div>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div className="namy-eyebrow inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
      <span className="namy-eyebrow-dot" />
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="col-span-full text-center py-14 px-6 namy-surface rounded-2xl namy-muted text-sm">
      {message}
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="col-span-full text-center py-14 namy-muted text-sm">
      Loading…
    </div>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ---------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                         */
/* ---------------------------------------------------------------------- */

export default function NAMYWebsite() {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const [stats, setStats] = useState(STATS_FALLBACK);
  const [workshops, setWorkshops] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [news, setNews] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const form = useRef();

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    setSending(true);
    setSent(false);
    setError("");

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSent(true);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const getSrc = (s) => (isMobile ? s.mobileImage : s.image);

    const first = new Image();
    first.src = getSrc(heroSlides[0]);

    const preloadRemaining = () => {
      heroSlides.slice(1).forEach((s) => {
        const img = new Image();
        img.src = getSrc(s);
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadRemaining);
    } else {
      setTimeout(preloadRemaining, 1500);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      api.stats.list(),
      api.workshops.list(),
      api.seminars.list(),
      api.news.list(),
      api.leadership.list(),
      api.projects.list(),
    ])
      .then(([s, w, sem, n, lead, proj]) => {
        if (s.length) setStats(s);
        setWorkshops(w);
        setSeminars(sem);
        setNews(n);
        setLeadership(lead);
        setProjects(proj);
      })
      .catch(() => {
        // Backend unreachable — stats keeps its fallback; everything else
        // stays empty and renders its "nothing yet" message below.
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement;
      const pct =
        h.scrollHeight > h.clientHeight
          ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
          : 0;
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = useCallback((id) => {
    setMobileOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  const waLink = (msg) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  const vars = dark
    ? {
        "--namy-bg": "#0A0F1C",
        "--namy-surface": "#111A2E",
        "--namy-surface-2": "#0D1526",
        "--namy-border": "rgba(255,255,255,0.08)",
        "--namy-text": "#F1F5F9",
        "--namy-muted": "#94A3B8",
        "--namy-nav": "rgba(10,15,28,0.72)",
      }
    : {
        "--namy-bg": "#F8FAFC",
        "--namy-surface": "#FFFFFF",
        "--namy-surface-2": "#F1F5F9",
        "--namy-border": "#E2E8F0",
        "--namy-text": "#0F172A",
        "--namy-muted": "#475569",
        "--namy-nav": "rgba(248,250,252,0.72)",
      };

  return (
    <div
      style={{
        ...vars,
        backgroundColor: "var(--namy-bg)",
        color: "var(--namy-text)",
      }}
      className="namy-root min-h-screen w-full font-[Inter]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .namy-root { font-family: 'Inter', sans-serif; }
        .namy-display { font-family: 'Poppins', sans-serif; }
        .namy-muted { color: var(--namy-muted); }
        .namy-surface { background-color: var(--namy-surface); border: 1px solid var(--namy-border); }
        .namy-surface-2 { background-color: var(--namy-surface-2); }
        .namy-border-t { border-top: 1px solid var(--namy-border); }
        .namy-border-b { border-bottom: 1px solid var(--namy-border); }
        .namy-grad-text {
          background-image: linear-gradient(120deg, #0B4F8C 0%, #2E8B57 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .namy-grad-bg { background-image: linear-gradient(120deg, #0B4F8C 0%, #14507e 45%, #2E8B57 100%); }
        .namy-eyebrow { color: #0B4F8C; }
        .namy-eyebrow-dot { width: 6px; height: 6px; border-radius: 999px; background: #F4B400; display: inline-block; }
        .namy-glass { backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
        .namy-stat-number {
          font-family: 'Poppins', sans-serif; font-weight: 800; letter-spacing: -0.02em;
          font-size: clamp(2.4rem, 5vw, 3.6rem); line-height: 1;
          background-image: linear-gradient(135deg, #0B4F8C 0%, #2E8B57 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .namy-card { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease; }
        .namy-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -20px rgba(11,79,140,0.35); border-color: #2E8B57; }
        .namy-underline { position: relative; }
        .namy-underline::after {
          content: ''; position: absolute; left: 0; bottom: -6px; height: 2px; width: 28px;
          background: linear-gradient(90deg,#F4B400,#2E8B57); transition: width .3s ease;
        }
        .namy-card:hover .namy-underline::after { width: 56px; }
        @keyframes namyFloat { 0%,100% { transform: translate(0,0); } 50% { transform: translate(12px,-20px); } }
        .namy-float { animation: namyFloat 9s ease-in-out infinite; }
        .namy-float-slow { animation: namyFloat 13s ease-in-out infinite; }
        @keyframes namyPulseDot { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        .namy-pulse-dot { animation: namyPulseDot 2.6s ease-in-out infinite; }
        .namy-reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
        .namy-in-view { opacity: 1; transform: translateY(0); }
        .namy-btn-primary {
          background-image: linear-gradient(120deg,#0B4F8C,#2E8B57);
          color: #fff; box-shadow: 0 12px 28px -12px rgba(11,79,140,0.55);
        }
        .namy-btn-primary:hover { filter: brightness(1.08); }
        .namy-btn-gold { background-color: #F4B400; color: #0F172A; }
        .namy-btn-gold:hover { filter: brightness(1.06); }
        .namy-scrollbar-none::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .namy-float, .namy-float-slow, .namy-pulse-dot { animation: none !important; }
          .namy-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .namy-card:hover { transform: none; }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <div
        className="fixed top-0 left-0 h-[3px] z-[60] namy-grad-bg"
        style={{ width: `${scrollPct}%`, transition: "width .1s linear" }}
      />

      {/* ---------------- NAV ---------------- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 namy-glass transition-all duration-300 ${
          scrolled ? "namy-border-b" : ""
        }`}
        style={{
          backgroundColor: scrolled ? "var(--namy-nav)" : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <button
            onClick={() => scrollToId("hero")}
            className="flex items-center gap-3 shrink-0"
          >
            <span className="w-15 h-11 ">
              <img src={logo} alt="" />
            </span>
            <span className="text-left leading-tight">
              <span className="block namy-display font-bold text-base md:text-lg">
                NAMY
              </span>
              <span className="hidden md:block text-[11px] namy-muted tracking-wide">
                National Movement of Youths
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="text-sm font-medium namy-muted hover:opacity-100"
                style={{ color: "var(--namy-text)" }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
              className="w-10 h-10 rounded-full namy-surface flex items-center justify-center"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div> */}

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setDark((d) => !d)}
              className="w-10 h-10 rounded-full namy-surface flex items-center justify-center"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 rounded-full namy-surface flex items-center justify-center"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden namy-surface namy-border-t px-5 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="text-left py-3 text-sm font-medium namy-border-b last:border-none"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section
        id="hero"
        className="relative overflow-hidden pt-28 pb-14 md:pt-48 md:pb-36"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          {heroSlides.map((item, index) => (
            <picture key={item.image}>
              <source media="(max-width: 767px)" srcSet={item.mobileImage} />
              <img
                src={item.image}
                alt=""
                aria-hidden="true"
                className={`namy-hero-img absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </picture>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 namy-grad-bg opacity-70" />

        {/* Your existing decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl namy-float-slow" />

        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#F4B400]/20 blur-3xl namy-float" />

        <DistrictNetwork className="absolute right-0 top-10 w-[420px] opacity-30 hidden md:block" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 mt-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/85 bg-white/10 namy-glass rounded-full px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />{" "}
              National Youth Movement · Zambia
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div key={currentSlide} className="animate-hero-title">
              <h1 className="namy-display font-extrabold text-white leading-[1.04] text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] max-w-4xl tracking-tight">
                {slide.title}
                <br />
                <span style={{ color: slide.color }}>{slide.subtitle}</span>
              </h1>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 text-white/85 text-base md:text-lg max-w-xl leading-relaxed">
              Preparing local communities and young entrepreneurs to participate
              in Zambia's future economy — through innovation, leadership and
              hands-on skills.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-12 flex flex-wrap gap-3">
              <button
                onClick={() => scrollToId("contact")}
                className="namy-btn-gold px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-1.5"
              >
                Become a Member <ArrowRight size={15} />
              </button>
              <button
                onClick={() => scrollToId("seminars")}
                className="bg-white/10 namy-glass text-white border border-white/25 px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 flex items-center gap-1.5"
              >
                View Seminars <ArrowUpRight size={15} />
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="text-white/90 px-6 py-3.5 rounded-full text-sm font-semibold border border-white/25 hover:bg-white/10"
              >
                Partner With NAMY
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="text-white/90 px-6 py-3.5 rounded-full text-sm font-semibold border border-white/25 hover:bg-white/10"
              >
                Donate
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="relative namy-surface-2 py-16 md:py-20 namy-border-b overflow-hidden">
        <DistrictNetwork className="absolute -left-16 -bottom-16 w-80 opacity-[0.08]" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {stats.map((s) => (
            <StatCard key={s.id ?? s.label} stat={s} />
          ))}
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ================= IMAGE ================= */}
            <Reveal>
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-[480px] md:h-[560px] rounded-3xl overflow-hidden">
                  <img
                    src={image4}
                    alt="NAMY youth community"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Founded Badge */}
                <div
                  className="
              absolute
              bottom-6
              right-0
              md:right-[-16px]
              bg-white
              rounded-2xl
              shadow-xl
              px-6
              py-5
              border
              border-slate-100
            "
                >
                  <div
                    className="namy-display font-bold text-3xl"
                    style={{ color: "#0B4F8C" }}
                  >
                    2019
                  </div>

                  <p className="text-xs text-slate-500 mt-1 max-w-[120px] leading-relaxed">
                    Founded in Mwense, Luapula Province
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ================= CONTENT ================= */}
            <Reveal delay={120}>
              <div>
                {/* Eyebrow */}
                <SectionEyebrow>About NAMY</SectionEyebrow>

                {/* Heading */}
                <h2
                  className="
              namy-display
              font-bold
              text-3xl
              sm:text-4xl
              md:text-[2.8rem]
              lg:text-[3.2rem]
              leading-[1.08]
              tracking-tight
              mb-7
            "
                >
                  A National Institution for
                  <span className="block" style={{ color: "#0B4F8C" }}>
                    Youth Development & Innovation
                  </span>
                </h2>

                {/* Description */}
                <div className="space-y-5">
                  <p className="namy-muted leading-relaxed">
                    The National Movement of Youths (NAMY) is a Zambian
                    non-governmental organisation founded to bridge the gap
                    between young people's potential and real-world opportunity.
                    Operating across 15 districts, we deliver programmes in
                    leadership, entrepreneurship, STEM, digital skills,
                    agriculture, and community development.
                  </p>

                  <p className="namy-muted leading-relaxed">
                    Anchored in Mwense, Luapula Province, NAMY works alongside
                    government, development partners, and the private sector to
                    build a Zambia where every young person can create
                    sustainable social and economic impact.
                  </p>
                </div>

                {/* ================= VALUES ================= */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {/* Impact Driven */}
                  <div
                    className="
                namy-surface
                rounded-2xl
                p-5
                border
                border-slate-200/80
                hover:-translate-y-1
                transition-all
                duration-300
              "
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                    >
                      <Target size={20} style={{ color: "#0B4F8C" }} />
                    </div>

                    <h3 className="namy-display font-semibold text-sm mb-1">
                      Impact-Driven
                    </h3>

                    <p className="namy-muted text-xs leading-relaxed">
                      Every initiative is measured by real change in
                      communities.
                    </p>
                  </div>

                  {/* Inclusive */}
                  <div
                    className="
                namy-surface
                rounded-2xl
                p-5
                border
                border-slate-200/80
                hover:-translate-y-1
                transition-all
                duration-300
              "
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                    >
                      <HeartHandshake size={20} style={{ color: "#0B4F8C" }} />
                    </div>

                    <h3 className="namy-display font-semibold text-sm mb-1">
                      Inclusive
                    </h3>

                    <p className="namy-muted text-xs leading-relaxed">
                      We reach across gender, geography, and socioeconomic
                      lines.
                    </p>
                  </div>

                  {/* Innovative */}
                  <div
                    className="
                namy-surface
                rounded-2xl
                p-5
                border
                border-slate-200/80
                hover:-translate-y-1
                transition-all
                duration-300
              "
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                    >
                      <Lightbulb size={20} style={{ color: "#0B4F8C" }} />
                    </div>

                    <h3 className="namy-display font-semibold text-sm mb-1">
                      Innovative
                    </h3>

                    <p className="namy-muted text-xs leading-relaxed">
                      We champion local solutions built on technology and
                      creativity.
                    </p>
                  </div>

                  {/* Collaborative */}
                  <div
                    className="
                namy-surface
                rounded-2xl
                p-5
                border
                border-slate-200/80
                hover:-translate-y-1
                transition-all
                duration-300
              "
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                    >
                      <Globe2 size={20} style={{ color: "#0B4F8C" }} />
                    </div>

                    <h3 className="namy-display font-semibold text-sm mb-1">
                      Collaborative
                    </h3>

                    <p className="namy-muted text-xs leading-relaxed">
                      Partnerships with government, NGOs, and the private sector
                      amplify our reach.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => scrollToId("contact")}
                  className="
              mt-8
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              text-sm
              font-semibold
              text-white
              bg-[#0B4F8C]
              hover:bg-[#083D6D]
              transition-colors
            "
                >
                  Learn Our Story
                  <ChevronRight size={16} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- VISION & MISSION ---------------- */}
      <section id="vision" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <SectionEyebrow>Our Purpose</SectionEyebrow>
            <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight">
              Why we exist. What we're building toward.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="namy-card namy-surface rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="h-1.5" style={{ backgroundColor: "#0B4F8C" }} />
                <div className="p-8 flex flex-col flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                  >
                    <Eye size={22} style={{ color: "#0B4F8C" }} />
                  </div>
                  <h3 className="namy-underline namy-display font-semibold text-xl mb-4 inline-block">
                    Our Vision
                  </h3>
                  <p className="namy-muted leading-relaxed">
                    A society where every individual has access to skills,
                    resources, and opportunities to reach their full potential.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="namy-card namy-surface rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="h-1.5" style={{ backgroundColor: "#2E8B57" }} />
                <div className="p-8 flex flex-col flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(46,139,87,0.1)" }}
                  >
                    <Flag size={22} style={{ color: "#2E8B57" }} />
                  </div>
                  <h3 className="namy-underline namy-display font-semibold text-xl mb-4 inline-block">
                    Our Mission
                  </h3>
                  <p className="namy-muted leading-relaxed">
                    To empower individuals, advocate for social change, and
                    eradicate poverty through community engagement, skills
                    training, and resource provision.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- LEADERSHIP ---------------- */}
      <section
        id="leadership"
        className="py-24 md:py-32 namy-surface-2 namy-border-t namy-border-b scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <SectionEyebrow>Leadership</SectionEyebrow>
            <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight">
              The people steering the movement.
            </h2>
            <p className="namy-muted mt-4 leading-relaxed">
              Meet the team turning strategy into programmes on the ground, in
              every district.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <LoadingRow />
            ) : leadership.length === 0 ? (
              <EmptyState message="Leadership profiles will appear here once they're added in the admin panel." />
            ) : (
              leadership.map((leader, i) => (
                <Reveal key={leader.id ?? leader.name} delay={(i % 3) * 90}>
                  <div className="namy-card namy-surface rounded-2xl p-6 h-full flex flex-col">

                 {/* Profile Image */}
                 <div className="w-40 h-40 rounded-4xl mx-auto mb-5 overflow-hidden namy-surface-2 flex items-center justify-center">
                  {leader.photoUrl ? (
                    <img
                       src={leader.photoUrl}
                       alt={leader.name}
                       className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="namy-display font-bold text-lg"
                      style={{ color: "#0B4F8C" }}
                    >
                    {initials(leader.name)}
                  </span>
                  )}
                </div>

                  {/* Name */}
                <h3 className="namy-display font-semibold text-lg text-center mb-1">
                  {leader.name}
                </h3>

                {/* Position */}
                <p
                  className="text-sm font-semibold text-center leading-snug min-h-[40px] flex items-center justify-center"
                  style={{ color: "#2E8B57" }}
                >
                  {leader.position}
                </p>

                {/* Divider */}
                <div className="w-12 h-px bg-gray-200 mx-auto my-4" />

                {/* Bio */}
                {leader.bio && (
                <div className="flex-1">
                  <p className="namy-muted text-sm leading-7 text-left">
                    {leader.bio}
                  </p>
                </div>
              )}

            </div>
            </Reveal>  
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- PROGRAMS ---------------- */}
      <section id="programs" className="py-24 md:py-32 namy-border-b scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <SectionEyebrow>What We Do</SectionEyebrow>
            <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight">
              Twelve programmes. One movement.
            </h2>
            <p className="namy-muted mt-4 leading-relaxed">
              Each programme is district-delivered, mentor-led, and designed to
              produce something measurable — a business, a prototype, a skill, a
              leader.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 90}>
                <div className="namy-card namy-surface rounded-2xl p-6 h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(11,79,140,0.1)" }}
                  >
                    <p.icon size={20} style={{ color: "#0B4F8C" }} />
                  </div>
                  <h3 className="namy-underline namy-display font-semibold text-base mb-2 inline-block">
                    {p.title}
                  </h3>
                  <p className="namy-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- INNOVATION HUB ---------------- */}
      <section id="innovation" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={namylabs}
                  alt="NAMY"
                  className="w-10 h-10 md:w-20 md:h-12 object-contain"
                />

                <span
                  className="namy-display font-bold text-md md:text-xl tracking-[0.12em] uppercase"
                  style={{ color: "#0B4F8C" }}
                >
                  NAMY LABS
                </span>
              </div>
              <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight max-w-xl">
                From district workshops to working prototypes.
              </h2>
            </div>
            <button
              className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
              style={{ color: "#2E8B57" }}
            >
              View all innovations <ChevronRight size={15} />
            </button>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <LoadingRow />
            ) : projects.length === 0 ? (
              <EmptyState message="Projects will appear here once they're added in the admin panel." />
            ) : (
              projects.map((proj, i) => (
                <Reveal key={proj.id ?? proj.title} delay={i * 100}>
                  <div className="namy-card namy-surface rounded-2xl overflow-hidden h-full flex flex-col">
                    <div
                      className="h-40 relative flex items-end p-5"
                      style={
                        proj.imageUrl
                          ? {
                              backgroundImage: `url(${proj.imageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : {}
                      }
                    >
                      {!proj.imageUrl && (
                        <div className="absolute inset-0 namy-grad-bg" />
                      )}
                      <span className="relative namy-glass bg-white/15 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                        {proj.status}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="namy-display font-semibold text-base mb-2">
                        {proj.title}
                      </h3>
                      {proj.location && (
                        <div className="flex items-center gap-2 text-xs namy-muted mb-3">
                          <MapPin size={13} /> {proj.location}
                        </div>
                      )}
                      {proj.description && (
                        <p className="namy-muted text-sm leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: "#0B4F8C" }}
                        >
                          Learn More <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- SEMINARS ---------------- */}
      <section
        id="seminars"
        className="py-24 md:py-32 namy-surface-2 namy-border-t namy-border-b scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <SectionEyebrow>Seminars</SectionEyebrow>
              <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight max-w-xl">
                Conversations that shape the movement.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <LoadingRow />
            ) : seminars.length === 0 ? (
              <EmptyState message="No seminars scheduled yet — check back soon." />
            ) : (
              seminars.map((sem, i) => (
                <Reveal key={sem.id ?? sem.title} delay={i * 100}>
                  <div className="namy-card namy-surface rounded-2xl p-6 h-full flex flex-col">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full self-start mb-4"
                      style={{
                        backgroundColor: "rgba(11,79,140,0.12)",
                        color: "#0B4F8C",
                      }}
                    >
                      Seminar
                    </span>
                    <h3 className="namy-display font-semibold text-base mb-3">
                      {sem.title}
                    </h3>
                    <div className="space-y-2 text-sm namy-muted mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} /> {sem.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} /> {sem.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} /> Facilitated by {sem.facilitator}
                      </div>
                    </div>
                    {sem.description && (
                      <p className="namy-muted text-sm leading-relaxed mb-5">
                        {sem.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#2E8B57" }}
                      >
                        {sem.seats} seats left
                      </span>
                      <a
                        href={waLink(
                          `Hello NAMY, I want to register for the seminar: ${sem.title}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="namy-btn-primary px-4 py-2 rounded-full text-xs font-semibold"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- WORKSHOPS ---------------- */}
      <section id="workshops" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <SectionEyebrow>Training &amp; Workshops</SectionEyebrow>
              <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight max-w-xl">
                Skills you can use the same week.
              </h2>
            </div>
            <button
              className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
              style={{ color: "#2E8B57" }}
            >
              Full training calendar <ChevronRight size={15} />
            </button>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <LoadingRow />
            ) : workshops.length === 0 ? (
              <EmptyState message="No workshops scheduled yet — check back soon." />
            ) : (
              workshops.map((w, i) => (
                <Reveal key={w.id ?? w.title} delay={i * 100}>
                  <div className="namy-card namy-surface rounded-2xl p-6 h-full flex flex-col">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full self-start mb-4"
                      style={{
                        backgroundColor: "rgba(244,180,0,0.15)",
                        color: "#C98F00",
                      }}
                    >
                      {w.category}
                    </span>
                    <h3 className="namy-display font-semibold text-base mb-3">
                      {w.title}
                    </h3>
                    <div className="space-y-2 text-sm namy-muted mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} /> {w.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} /> {w.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} /> Facilitated by {w.facilitator}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#2E8B57" }}
                      >
                        {w.seats} seats left
                      </span>
                      <a
                        href={waLink(
                          `Hello NAMY, I want to register for the workshop: ${w.title}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="namy-btn-primary px-4 py-2 rounded-full text-xs font-semibold"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- NEWS ---------------- */}
      <section
        id="news"
        className="py-24 md:py-32 namy-surface-2 namy-border-t namy-border-b scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="max-w-2xl mb-14">
            <SectionEyebrow>News &amp; Stories</SectionEyebrow>
            <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight">
              From the movement, this month.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <LoadingRow />
            ) : news.length === 0 ? (
              <EmptyState message="No news posted yet — check back soon." />
            ) : (
              news.map((n, i) => (
                <Reveal key={n.id ?? n.title} delay={i * 100}>
                  <div className="namy-card namy-surface rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer">
                    <div className="h-36 namy-grad-bg flex items-center justify-center">
                      <PlayCircle size={30} className="text-white/70" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: "#0B4F8C" }}
                      >
                        {n.tag}
                      </span>
                      <h3 className="namy-display font-semibold text-[15px] leading-snug mt-2 mb-4">
                        {n.title}
                      </h3>
                      <span className="mt-auto text-xs namy-muted">
                        {n.date}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- PARTNERS ---------------- */}
      <section className="py-14 namy-border-b">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-center namy-muted text-xs uppercase tracking-[0.16em] font-semibold mb-8">
            Trusted by partners across government, development and industry
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="namy-display font-semibold text-sm md:text-base namy-muted opacity-80"
              >
                <img
                  src={p}
                  alt=""
                  className="w-28 h-14 md:w-52 md:h-24 object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA / JOIN ---------------- */}
      <section className="relative py-20 md:py-24 namy-grad-bg overflow-hidden">
        <DistrictNetwork className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] opacity-10" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <Reveal>
            <h2 className="namy-display font-bold text-white text-3xl md:text-4xl tracking-tight mb-5">
              Ready to be part of the movement?
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Membership is open to young Zambians aged 15–35 in every district.
              Bring your ambition — we'll bring the platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => scrollToId("contact")}
                className="namy-btn-gold px-7 py-3.5 rounded-full text-sm font-semibold"
              >
                Become a Member
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="bg-white/10 namy-glass text-white border border-white/25 px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20"
              >
                Partner With NAMY
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14">
          <Reveal>
            <SectionEyebrow>Contact</SectionEyebrow>
            <h2 className="namy-display font-bold text-3xl md:text-[2.6rem] tracking-tight mb-6">
              Let's talk.
            </h2>
            <p className="namy-muted leading-relaxed mb-8 max-w-md">
              Whether you're a young Zambian ready to join, an organisation
              looking to partner, or a donor exploring impact — reach out.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: "info@namyzambia.org" },
                { icon: Phone, label: "+260 97 072 7200 / +260 97 011 5956" },
                {
                  icon: MapPin,
                  label: "Mwense, Luapula Province, Zambia",
                },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full namy-surface flex items-center justify-center shrink-0">
                    <c.icon size={16} style={{ color: "#0B4F8C" }} />
                  </span>
                  <span className="text-sm">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <a
                href="https://www.facebook.com/profile.php?id=100081784870933"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full namy-surface flex items-center justify-center cursor-pointer hover:opacity-70"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="https://www.instagram.com/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full namy-surface flex items-center justify-center cursor-pointer hover:opacity-70"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href="https://chat.whatsapp.com/DWVOURGUhS51G07PvkyGM8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full namy-surface flex items-center justify-center cursor-pointer hover:opacity-70"
              >
                <FaWhatsapp size={15} />
              </a>

              <a
                href="https://www.youtube.com/@YOUR_CHANNEL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full namy-surface flex items-center justify-center cursor-pointer hover:opacity-70"
              >
                <FaYoutube size={15} />
              </a>

              <a
                href="https://x.com/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full namy-surface flex items-center justify-center cursor-pointer hover:opacity-70"
              >
                <FaXTwitter size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="namy-surface rounded-3xl p-8">
              <form onSubmit={sendMessage} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                  className="w-full namy-surface-2 rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--namy-border)" }}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="w-full namy-surface-2 rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--namy-border)" }}
                />

                <textarea
                  name="message"
                  placeholder="How can we help?"
                  rows={4}
                  required
                  className="w-full namy-surface-2 rounded-xl px-4 py-3 text-sm outline-none border resize-none"
                  style={{ borderColor: "var(--namy-border)" }}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                {sent && (
                  <div
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "rgba(46,139,87,0.12)",
                      color: "#2E8B57",
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Message sent — we'll be in touch.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="namy-btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="namy-surface-2 namy-border-t pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-15 h-11 ">
                <img src={logo} alt="" />
              </span>
              <span className="namy-display font-bold">NAMY</span>
            </div>
            <p className="namy-muted text-sm leading-relaxed">
              Empowering youth. Strengthening communities. Creating opportunity
              — in every district of Zambia.
            </p>
          </div>
          <div>
            <h4 className="namy-display font-semibold text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm namy-muted">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="hover:opacity-70"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="namy-display font-semibold text-sm mb-4">
              Programs
            </h4>
            <ul className="space-y-2.5 text-sm namy-muted">
              {PROGRAMS.slice(0, 5).map((p) => (
                <li key={p.title}>{p.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="namy-display font-semibold text-sm mb-4">
              Stay Updated
            </h4>
            <p className="namy-muted text-sm mb-4">
              Monthly updates on programmes, seminars and new opportunities.
            </p>
            <div className="flex gap-2">
              <input
                placeholder="Email address"
                className="flex-1 min-w-0 namy-surface rounded-full px-4 py-2.5 text-sm outline-none border"
                style={{ borderColor: "var(--namy-border)" }}
              />
              <button className="namy-btn-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 namy-border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs namy-muted">
          <span>
            © 2026 National Movement of Youths (NAMY). All rights reserved.
          </span>
          <div className="flex gap-5">
            <span className="hover:opacity-70 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:opacity-70 cursor-pointer">
              Terms of Use
            </span>
          </div>
        </div>
      </footer>

      {/* ---------------- WHATSAPP WIDGET ---------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {waOpen && (
          <div className="namy-surface rounded-2xl shadow-2xl w-72 overflow-hidden">
            <div className="namy-grad-bg p-4">
              <p className="text-white font-semibold text-sm">Hello 👋</p>
              <p className="text-white/85 text-xs mt-1">
                Welcome to NAMY. How can we help you today?
              </p>
            </div>
            <div className="p-2">
              {WHATSAPP_OPTIONS.map((o) => (
                <a
                  key={o.label}
                  href={waLink(o.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:namy-surface-2 hover:opacity-80"
                >
                  {o.label} <ChevronRight size={14} className="namy-muted" />
                </a>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setWaOpen((v) => !v)}
          aria-label="WhatsApp support"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{ backgroundColor: "#25D366" }}
        >
          {waOpen ? (
            <X size={22} color="#fff" />
          ) : (
            <FaWhatsapp size={24} color="#fff" />
          )}
        </button>
      </div>
    </div>
  );
}
