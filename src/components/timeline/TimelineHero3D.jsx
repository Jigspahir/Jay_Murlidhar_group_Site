import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * JMG TIMELINE 3D HERO CENTERPIECE
 * 
 * Features:
 * - Precision architectural polyhedral core representing JMG's central governance.
 * - Dual counter-rotating orbital rings in JMG Primary Blue (#2563EB) & Accent Orange (#EA580C).
 * - 6 orbiting satellite nodes representing JMG's 6 canonical business verticals.
 * - Micro-particle constellation field with subtle luminescence.
 * - Interactive pointer parallax & smooth scroll-linked acceleration.
 * - Auto-pauses when off-screen via IntersectionObserver for optimal performance.
 * - Graceful CSS/SVG fallback when WebGL is unavailable.
 */
function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export default function TimelineHero3D({ className = "" }) {
  const containerRef = useRef(null);
  const [hasWebGL] = useState(checkWebGLSupport);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasWebGL) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 460;
    const isMobile = window.innerWidth < 768;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070D18, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 6.2);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('[TimelineHero3D] WebGL renderer init error:', err);
      return;
    }

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Core: Multi-faceted Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0A1222,
      roughness: 0.22,
      metalness: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Luminous Wireframe Edges
    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.65,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    coreMesh.add(edgesMesh);

    // Inner Glowing Octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.72, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1E3A8A,
      emissive: 0x2563EB,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 2. Dual Counter-Rotating Precision Orbital Rings
    // Ring 1: Primary JMG Blue
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.016, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x2563EB,
      emissive: 0x1D4ED8,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.rotation.y = Math.PI / 8;
    rootGroup.add(ring1);

    // Ring 2: Accent JMG Orange
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.014, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xEA580C,
      emissive: 0xC2410C,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.6;
    ring2.rotation.y = -Math.PI / 6;
    rootGroup.add(ring2);

    // 3. Orbiting Nodes (6 Canonical Domain Satellites)
    const nodeColors = [0x10B981, 0xF59E0B, 0xDB2777, 0x0284C7, 0xEA580C, 0x2563EB];
    const satellites = [];
    const satelliteGroup = new THREE.Group();
    rootGroup.add(satelliteGroup);

    nodeColors.forEach((colorHex, idx) => {
      const angle = (idx / 6) * Math.PI * 2;
      const radius = 2.15;
      const nodeGeo = new THREE.SphereGeometry(0.085, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.5,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.7, Math.sin(angle) * radius * 0.8);
      satelliteGroup.add(node);
      satellites.push({ mesh: node, baseAngle: angle, speed: 0.45 + (idx % 2) * 0.15 });
    });

    // 4. Subtle Ambient Particle Field
    const particleCount = 42;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93C5FD,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Cinematic Three-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const rimLightBlue = new THREE.DirectionalLight(0x2563EB, 2.2);
    rimLightBlue.position.set(-6, -4, -2);
    scene.add(rimLightBlue);

    const rimLightOrange = new THREE.DirectionalLight(0xEA580C, 1.8);
    rimLightOrange.position.set(6, -3, 3);
    scene.add(rimLightOrange);

    // Interactive pointer parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth pointer parallax lerping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Base rotation + floating oscillation
      if (!isDragging) {
        coreMesh.rotation.y += 0.0045;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.6) * 0.12 + mouseY;
        coreMesh.rotation.z = Math.cos(elapsedTime * 0.5) * 0.08 + mouseX;

        // Counter-rotating orbital rings
        ring1.rotation.z += 0.006;
        ring2.rotation.z -= 0.005;

        // Smooth satellite orbits
        satellites.forEach((sat, i) => {
          const t = elapsedTime * sat.speed + sat.baseAngle;
          const r = 2.15 + Math.sin(elapsedTime * 0.8 + i) * 0.08;
          sat.mesh.position.x = Math.cos(t) * r;
          sat.mesh.position.y = Math.sin(t * 1.2) * 0.55;
          sat.mesh.position.z = Math.sin(t) * r * 0.85;
        });

        // Floating root movement
        rootGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.1;
      }

      // Parallax particles drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      // Geometries & materials disposal
      coreGeo.dispose();
      coreMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [hasWebGL]);

  // Graceful CSS Fallback if WebGL is unavailable
  if (!hasWebGL) {
    return (
      <div className={`relative flex items-center justify-center p-8 ${className}`}>
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange-500/30 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600/30 via-slate-900 to-orange-500/20 backdrop-blur-md border border-white/20 rotate-45 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-600/40 -rotate-45 flex items-center justify-center text-white font-mono font-bold text-xs tracking-widest">
              JMG
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[420px] lg:h-[460px] cursor-grab active:cursor-grabbing select-none ${className}`}
      aria-label="Interactive 3D JMG Core Architecture Visualization"
    >
      {/* Subtle interaction hint pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 text-[11px] font-mono text-slate-400 backdrop-blur-md transition-opacity">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {isInteracting ? 'Manipulating 3D Core' : 'Drag to Rotate 3D Architecture'}
        </span>
      </div>
    </div>
  );
}
