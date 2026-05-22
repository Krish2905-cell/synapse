import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useAnimationFrame } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {Zap, Brain, Code2, Cpu, Layers, ArrowDown } from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COLORS = {
  bg0: "#0a0d14",
  bg1: "#0f1117",
  bg2: "#161b27",
  bg3: "#1e2535",
  accent: "#3b5bdb",
  accentBright: "#4c6ef5",
  accentGlow: "rgba(59,91,219,0.35)",
  purple: "#7c3aed",
  purpleGlow: "rgba(124,58,237,0.2)",
  cyan: "#06b6d4",
  text: "#e8eaf6",
  textMuted: "#7986a9",
  glass: "rgba(30,37,53,0.6)",
  glassBorder: "rgba(59,91,219,0.18)",
};

const TEAM = [
  {
    name: "Khushi Gupta",
    role: "Frontend & MERN Developer",
    quote: "Turning caffeine and creativity into pixels.",
    icon: <Code2 size={20} />,
    gradient: "linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)",
    glowColor: "rgba(59,91,219,0.5)",
    initials: "KG",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Krish",
    role: "Backend & Realtime Systems",
    quote: "If it scales, it was engineered. If it doesn't, it was rushed.",
    icon: <Cpu size={20} />,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b5bdb 100%)",
    glowColor: "rgba(6,182,212,0.5)",
    initials: "K",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Hitakshi",
    role: "Product Design & Collaboration",
    quote: "Design is the silent ambassador of your brand.",
    icon: <Layers size={20} />,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
    glowColor: "rgba(124,58,237,0.5)",
    initials: "H",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Vaanshi",
    role: "AI Productivity & Innovation",
    quote: "The best interface is no interface — just intelligence.",
    icon: <Brain size={20} />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 80%, #ec4899 100%)",
    glowColor: "rgba(245,158,11,0.45)",
    initials: "V",
    github: "#",
    linkedin: "#",
  },
];

// ─── ANIMATED BACKGROUND BLOBS ────────────────────────────────────────────────

function Blob({ style, color, size, duration, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(80px)",
        opacity: 0.18,
        pointerEvents: "none",
        ...style,
      }}
      animate={{
        scale: [1, 1.15, 1],
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
        opacity: [0.14, 0.22, 0.14],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 90;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,91,219,${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76,110,245,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.7,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── GLITCH TEXT ──────────────────────────────────────────────────────────────

function GlitchText({ children, style }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── ANIMATED SCAN LINE ───────────────────────────────────────────────────────

function ScanLine() {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: "1px",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(59,91,219,0.7) 40%, rgba(76,110,245,1) 50%, rgba(59,91,219,0.7) 60%, transparent 100%)",
        zIndex: 2,
        pointerEvents: "none",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
    />
  );
}

// ─── TEAM CARD ────────────────────────────────────────────────────────────────

function TeamCard({ member, index }) {
  const [hovered, setHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      style={{ width: "100%", maxWidth: 280 }}
    >
      <Tilt
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        glareEnable={true}
        glareMaxOpacity={0.12}
        glareColor={member.glowColor}
        glarePosition="all"
        glareBorderRadius="20px"
        scale={1.03}
        transitionSpeed={1200}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{
            boxShadow: hovered
              ? `0 0 0 1px ${member.glowColor}, 0 8px 60px ${member.glowColor}, 0 2px 20px rgba(0,0,0,0.6)`
              : `0 0 0 1px rgba(59,91,219,0.12), 0 4px 30px rgba(0,0,0,0.4)`,
          }}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(22,27,39,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 20,
            padding: "36px 28px 32px",
            position: "relative",
            overflow: "hidden",
            cursor: "default",
            border: "1px solid rgba(59,91,219,0.14)",
          }}
        >
          {/* Animated top border */}
          <motion.div
            animate={{
              scaleX: hovered ? 1 : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: member.gradient,
              transformOrigin: "left",
              borderRadius: "20px 20px 0 0",
            }}
          />

          {/* Corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 60,
              height: 60,
              background: `radial-gradient(circle at top right, ${member.glowColor} 0%, transparent 70%)`,
              opacity: hovered ? 0.6 : 0.25,
              transition: "opacity 0.3s",
              borderRadius: "0 20px 0 0",
            }}
          />

          {/* Inner glow bg */}
          <motion.div
            animate={{ opacity: hovered ? 0.08 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              background: member.gradient,
              borderRadius: 20,
              pointerEvents: "none",
            }}
          />

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <motion.div
              animate={{
                boxShadow: hovered
                  ? `0 0 0 3px rgba(255,255,255,0.08), 0 0 30px ${member.glowColor}`
                  : `0 0 0 2px rgba(255,255,255,0.05)`,
              }}
              transition={{ duration: 0.35 }}
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: member.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.5px",
                position: "relative",
              }}
            >
              {member.initials}
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: hovered ? 360 : 0 }}
                transition={{ duration: 8, repeat: hovered ? Infinity : 0, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `1.5px dashed ${member.glowColor}`,
                  opacity: hovered ? 0.7 : 0,
                  transition: "opacity 0.3s",
                }}
              />
            </motion.div>
          </div>

          {/* Role chip */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,91,219,0.12)",
                border: "1px solid rgba(59,91,219,0.22)",
                borderRadius: 100,
                padding: "4px 12px",
                fontSize: 11,
                color: COLORS.accentBright,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              {member.icon}
              {member.role}
            </div>
          </div>

          {/* Name */}
          <h3
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.text,
              margin: "0 0 10px",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.3px",
            }}
          >
            {member.name}
          </h3>

          {/* Quote */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12.5,
              color: COLORS.textMuted,
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.65,
              margin: "0 0 22px",
              fontStyle: "italic",
              padding: "0 4px",
            }}
          >
            "{member.quote}"
          </p>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(59,91,219,0.25), transparent)",
              marginBottom: 18,
            }}
          />

          
          
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(59,91,219,0.1)",
        border: "1px solid rgba(59,91,219,0.3)",
        borderRadius: 100,
        padding: "6px 18px",
        marginBottom: 20,
        fontSize: 11,
        color: COLORS.accentBright,
        fontFamily: "'Space Mono', monospace",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      <Zap size={11} />
      {children}
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    background: COLORS.bg0,
    color: COLORS.text,
    fontFamily: "'Syne', sans-serif",
    overflowX: "hidden",
    position: "relative",
  };

  return (
    <div style={pageStyle}>
      {/* ── HERO ─────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 24px",
        }}
      >
        {/* Background blobs */}
        <Blob color="#3b5bdb" size={600} style={{ top: "-10%", left: "-15%" }} duration={12} delay={0} />
        <Blob color="#7c3aed" size={500} style={{ top: "20%", right: "-10%" }} duration={15} delay={2} />
        <Blob color="#06b6d4" size={380} style={{ bottom: "5%", left: "30%" }} duration={10} delay={4} />

        {/* Particle field */}
        <ParticleField />

        {/* Scan line */}
        <ScanLine />

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(59,91,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,91,219,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* Radial vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(10,13,20,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 5,
            textAlign: "center",
            maxWidth: 780,
            opacity: heroOpacity,
            y: heroY,
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(59,91,219,0.08)",
              border: "1px solid rgba(59,91,219,0.35)",
              borderRadius: 100,
              padding: "7px 20px",
              marginBottom: 36,
              fontSize: 12,
              color: COLORS.accentBright,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            SYNAPSE · ABOUT US
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(42px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.06,
              margin: "0 0 24px",
              letterSpacing: "-2.5px",
              color: COLORS.text,
            }}
          >
            The Minds{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4c6ef5 0%, #7c3aed 50%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Behind
            </span>
            <br />
            Synapse
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              color: COLORS.textMuted,
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.75,
              margin: "0 auto 52px",
              maxWidth: 560,
              letterSpacing: "0.01em",
            }}
          >
            Building the future of collaborative productivity.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: COLORS.textMuted,
              fontSize: 11,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            <span>SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(transparent, ${COLORS.bg0})`,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      </section>

      {/* ── TEAM SECTION ─────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px 120px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Subtle bg blobs for team section */}
        <Blob color="#3b5bdb" size={400} style={{ top: "10%", right: "-5%", opacity: 0.1 }} duration={14} delay={1} />
        <Blob color="#7c3aed" size={350} style={{ bottom: "10%", left: "-5%", opacity: 0.1 }} duration={16} delay={3} />

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel>Our Team</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            The{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4c6ef5, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              People
            </span>{" "}
            & Ideas
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              color: COLORS.textMuted,
              fontSize: 15,
              fontFamily: "'Space Mono', monospace",
              maxWidth: 440,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Every great product is built by curious minds.
            <br />
            Meet the force behind Synapse.
          </motion.p>
        </div>

        {/* Team cards grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {TEAM.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(59,91,219,0.4), rgba(124,58,237,0.4), transparent)",
            marginTop: 80,
            transformOrigin: "center",
          }}
        />
      </section>

      {/* ── MISSION STRIP ────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "60px 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(59,91,219,0.06) 0%, rgba(124,58,237,0.06) 100%)",
            borderTop: "1px solid rgba(59,91,219,0.1)",
            borderBottom: "1px solid rgba(59,91,219,0.1)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            position: "relative",
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              lineHeight: 1.5,
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            We believe productivity should feel{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #4c6ef5, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              effortless.
            </span>
          </div>
          <p
            style={{
              color: COLORS.textMuted,
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            Synapse was born from a simple question: what if your tools worked as fast as your thoughts?
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        style={{
          position: "relative",
          padding: "48px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(59,91,219,0.1)",
        }}
      >
        {/* Footer glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(59,91,219,0.5), rgba(124,58,237,0.5), transparent)",
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b5bdb, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={16} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: COLORS.text,
              }}
            >
              Synapse
            </span>
          </div>

          <p
            style={{
              color: COLORS.textMuted,
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            Crafted with{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ display: "inline-block" }}
            >
              ❤️
            </motion.span>{" "}
            passion by{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #4c6ef5, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              Team Synapse
            </span>
          </p>

          <p
            style={{
              color: "rgba(121,134,169,0.4)",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              marginTop: 12,
            }}
          >
            © {new Date().getFullYear()} SYNAPSE · ALL RIGHTS RESERVED
          </p>
        </motion.div>
      </footer>
    </div>
  );
}