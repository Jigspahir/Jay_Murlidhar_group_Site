import React, { useEffect, useRef } from 'react';
import { ArrowDown, Briefcase, Compass, Sparkles, Building, Users } from 'lucide-react';

export default function CareersHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let angleX = 0.4;
    let angleY = 0.6;
    let targetAngleX = 0.4;
    let targetAngleY = 0.6;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = mouseX * 1.5;
      targetAngleX = -mouseY * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Isometric cube vertices
    const size = 110;
    const vertices = [
      [-size, -size, -size],
      [size, -size, -size],
      [size, size, -size],
      [-size, size, -size],
      [-size, -size, size],
      [size, -size, size],
      [size, size, size],
      [-size, size, size],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    // Inner orbiting nodes
    const innerNodes = [
      { x: 0, y: 0, z: 0, color: '#2563EB', r: 7 },
      { x: 50, y: 40, z: -30, color: '#EA580C', r: 5 },
      { x: -45, y: -45, z: 40, color: '#10B981', r: 5 },
      { x: 30, y: -50, z: 30, color: '#8B5CF6', r: 4 },
      { x: -40, y: 35, z: -40, color: '#0284C7', r: 4 },
    ];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let t = 0;
    const render = () => {
      t += 0.012;
      angleX += (targetAngleX - angleX) * 0.05 + Math.sin(t * 0.7) * 0.002;
      angleY += (targetAngleY - angleY) * 0.05 + 0.006;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const fov = 420;

      // Project 3D to 2D with rotation
      const project = (x, y, z) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const distance = fov + z2;
        const scale = fov / Math.max(distance, 50);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale
        };
      };

      // Draw subtle ambient glow
      const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      radial.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
      radial.addColorStop(0.6, 'rgba(234, 88, 12, 0.03)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw cube edges
      const projected = vertices.map(([x, y, z]) => project(x, y, z));

      ctx.lineWidth = 1.4;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.min(Math.max((avgZ + 150) / 300, 0.2), 0.85);

        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw corner vertices
      projected.forEach((p) => {
        ctx.fillStyle = '#2563EB';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw inner animated nodes
      innerNodes.forEach((node, idx) => {
        // slight individual orbiting
        const nx = node.x + Math.cos(t * 1.5 + idx) * 12;
        const ny = node.y + Math.sin(t * 1.3 + idx) * 12;
        const nz = node.z + Math.cos(t + idx) * 8;
        const p = project(nx, ny, nz);

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, node.r * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node halo
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (node.r + 4) * p.scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-[#FAFAFA] via-[#FFFFFF] to-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
      {/* Background radial elements */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-b from-blue-100/35 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-20 right-0 w-[380px] h-[380px] bg-blue-50/60 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Messaging */}
          <div className="lg:col-span-7">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-mono font-semibold uppercase tracking-[0.16em] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-[#2563EB]">CAREERS AT JAY MURLIDHAR GROUP</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0F172A] tracking-[-0.035em] leading-[1.12] mb-6">
              YOUR NEXT CHAPTER<br />
              STARTS WITH <span className="text-[#2563EB] underline decoration-blue-200 decoration-4 underline-offset-4">JMG.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg lg:text-xl text-[#475569] leading-relaxed font-normal max-w-2xl mb-8">
              Discover opportunities to contribute, collaborate and grow with Jay Murlidhar Group. Bring your skills, ideas and ambition to a workplace built around progress.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <a
                href="#job-directory"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Explore Open Positions</span>
                <ArrowDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#why-jmg"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm border border-[#CBD5E1] shadow-sm transition-all duration-200 hover:border-slate-400"
              >
                <Compass className="w-4 h-4 text-[#EA580C]" />
                <span>Discover JMG</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E2E8F0]">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">6</div>
                <div className="text-xs font-mono uppercase text-[#64748B] mt-0.5">Group Companies</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#2563EB] tracking-tight">7</div>
                <div className="text-xs font-mono uppercase text-[#64748B] mt-0.5">Departments</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#EA580C] tracking-tight">100%</div>
                <div className="text-xs font-mono uppercase text-[#64748B] mt-0.5">Real Production</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#10B981] tracking-tight">Gujarat</div>
                <div className="text-xs font-mono uppercase text-[#64748B] mt-0.5">Headquarters</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Geometric Canvas */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-white/70 backdrop-blur-sm border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 flex items-center justify-center overflow-hidden">
              
              {/* Top pill badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-mono tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>JMG ARCHITECTURE</span>
              </div>

              {/* Canvas for 3D isometric structure */}
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                style={{ width: '100%', height: '100%' }}
              />

              {/* Bottom floating status badge */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 border border-[#E2E8F0] shadow-sm text-xs font-mono text-[#0F172A]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Actively Reviewing</span>
              </div>
            </div>

            {/* Small note underneath */}
            <div className="mt-4 flex items-center gap-4 text-xs font-mono text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" /> Multi-disciplinary
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-orange-600" /> People-First
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
