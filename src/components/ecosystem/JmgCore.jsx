import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * JMG CORE — Central Architectural Digital Core Object
 * Supports WebGL with smooth fallback for non-WebGL or reduced-motion environments.
 */
export default function JmgCore({ onCoreClick, activeDomainAccent = '#38BDF8' }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // WebGL 3D Core Ring Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container || prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    let renderer, scene, camera, animationFrameId;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 180;
      const height = container.clientHeight || 180;

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // Core Geometric Objects (Concentric Torus & Hexagonal Ring)
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // Ambient & Key Light
      const ambient = new THREE.AmbientLight(0x38bdf8, 1.2);
      scene.add(ambient);
      const point = new THREE.PointLight(0xffffff, 2, 10);
      point.position.set(2, 3, 4);
      scene.add(point);

      // Outer Torus Ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.03, 12, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      coreGroup.add(ringMesh);

      // Inner Rotating Hex Prism Wireframe
      const hexGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 6, 1, true);
      const hexMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const hexMesh = new THREE.Mesh(hexGeo, hexMat);
      coreGroup.add(hexMesh);

      const startTime = performance.now();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = (performance.now() - startTime) * 0.001;
        coreGroup.rotation.z = elapsed * 0.18;
        coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.15;
        coreGroup.rotation.y = Math.cos(elapsed * 0.25) * 0.15;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (e) {
      setHasWebGL(false);
    }
  }, [prefersReducedMotion]);

  return (
    <div 
      className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#09111E] border border-white/20 shadow-[0_12px_44px_rgba(0,0,0,0.8)] cursor-pointer group transition-all duration-300 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
      onClick={onCoreClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCoreClick && onCoreClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Jay Murlidhar Group Central Core Hub"
    >
      {/* 3D WebGL Canvas Layer */}
      {hasWebGL && !prefersReducedMotion && (
        <div 
          ref={mountRef} 
          className="absolute inset-0 -m-4 pointer-events-none flex items-center justify-center overflow-visible opacity-75"
          aria-hidden="true"
        />
      )}

      {/* Non-WebGL Fallback: Layered Geometric SVG Rings */}
      {(!hasWebGL || prefersReducedMotion) && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
          <svg className="w-full h-full scale-125" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
            <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#38BDF8" strokeWidth="0.6" opacity="0.4" />
          </svg>
        </div>
      )}

      {/* Outer compass tick marks */}
      <div className="absolute -inset-1 rounded-2xl border border-white/5 pointer-events-none" />

      {/* Core Badge */}
      <div className="relative z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest text-[#38BDF8] uppercase mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
        <span>JMG CORE</span>
      </div>

      {/* Primary Brand Typography */}
      <span className="relative z-10 text-sm sm:text-base font-bold tracking-tight text-white uppercase text-center leading-tight">
        JAY MURLIDHAR<br />GROUP
      </span>

      {/* Subtitle */}
      <span className="relative z-10 text-[10px] text-slate-400 font-mono tracking-wider mt-1.5 text-center">
        ONE GROUP &bull; MULTIPLE BUSINESSES
      </span>
    </div>
  );
}
