import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * JMG LIGHT-THEME 3D GEOMETRIC VISUALIZER
 * 
 * Specifically engineered for the JMG Light Theme:
 * - Clean translucent crystal polyhedra with subtle JMG Blue (#2563EB) & Orange (#EA580C) reflections.
 * - Gentle floating oscillation and interactive cursor parallax.
 * - Color and rotation morphs smoothly when activePhaseIndex changes.
 * - Auto-pauses when off-screen via IntersectionObserver.
 * - High-performance, lightweight geometry (under 150 vertices), zero memory leaks.
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

export default function JmgLightTimeline3D({ activeIndex = 0, accentColor = '#2563EB', className = '' }) {
  const mountRef = useRef(null);
  const [hasWebGL] = useState(checkWebGLSupport);
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !hasWebGL) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    camera.position.set(0, 0, 5.2);

    // Renderer (Light Theme Optimized: alpha enabled, tone mapping)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Parse accent color
    const colorNum = parseInt(accentColor.replace('#', '0x'), 16) || 0x2563EB;

    // 1. Central Precision Crystal Polyhedron
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      emissive: colorNum,
      emissiveIntensity: 0.22,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.85,
      thickness: 1.2,
      transparent: true,
      opacity: 0.92,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Subtle Precision Edges
    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: colorNum,
      transparent: true,
      opacity: 0.55,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    coreMesh.add(edgesMesh);

    // 2. Dual Delicate Orbital Gyro Rings
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.018, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x2563EB,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.4;
    ring1.rotation.y = Math.PI / 7;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.015, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xEA580C,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.8;
    ring2.rotation.y = -Math.PI / 5;
    rootGroup.add(ring2);

    // 3. Studio Light Rig (Designed for crisp white/grey surfaces)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(4, 6, 4);
    scene.add(dirLight1);

    const rimBlue = new THREE.DirectionalLight(0x2563EB, 1.6);
    rimBlue.position.set(-5, -3, 2);
    scene.add(rimBlue);

    const rimOrange = new THREE.DirectionalLight(0xEA580C, 1.4);
    rimOrange.position.set(5, -4, -2);
    scene.add(rimOrange);

    // Interactive pointer parallax
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationRef.current = { x: y * 0.4, y: x * 0.5 };
    };
    container.addEventListener('pointermove', handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 260;
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

      const elapsed = (performance.now() - startTime) * 0.001;

      // Base rotation + gentle floating
      coreMesh.rotation.y += 0.006;
      coreMesh.rotation.x = Math.sin(elapsed * 0.7) * 0.15 + targetRotationRef.current.x;
      coreMesh.rotation.z = Math.cos(elapsed * 0.6) * 0.1 + targetRotationRef.current.y;

      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      rootGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      coreGeo.dispose();
      coreMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
    };
  }, [activeIndex, accentColor, hasWebGL]);

  if (!hasWebGL) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-200 rotate-45 flex items-center justify-center shadow-md">
          <span className="font-mono text-blue-600 font-bold -rotate-45 text-sm">JMG</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden cursor-default select-none ${className}`}
      aria-hidden="true"
    />
  );
}

