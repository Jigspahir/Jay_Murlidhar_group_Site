import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * LIGHTWEIGHT 3D MINI-VIEWPORT FOR SELECTED MILESTONES
 * 
 * Provides bespoke 3D geometric artifacts for key anchor milestones:
 * - 'prism': Hexagonal bedrock prism representing the Civic Foundation (Phase 01)
 * - 'shield': Luminous torus knot shield representing Enterprise Risk Protection (Phase 04)
 * - 'core': Nested quantum gyro representing Enterprise Cloud Ecosystem (Phase 06)
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

export default function TimelineMilestone3D({ type = 'prism', accentColor = '#2563EB', className = '' }) {
  const mountRef = useRef(null);
  const [hasWebGL] = useState(checkWebGLSupport);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !hasWebGL) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
    camera.position.set(0, 0, 4.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    const colorNum = parseInt(accentColor.replace('#', '0x'), 16) || 0x2563EB;

    // Ambient + Rim Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(colorNum, 2.0);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const group = new THREE.Group();
    scene.add(group);

    let mainMesh;
    let edgesMesh;
    let mainGeo;
    let mainMat;
    let edgesGeo;
    let edgesMat;

    if (type === 'shield') {
      // Torus knot for Risk & Asset Shield
      mainGeo = new THREE.TorusKnotGeometry(0.78, 0.18, 64, 12, 2, 3);
      mainMat = new THREE.MeshStandardMaterial({
        color: 0x07152A,
        emissive: colorNum,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.7,
      });
      mainMesh = new THREE.Mesh(mainGeo, mainMat);
      group.add(mainMesh);
    } else if (type === 'core') {
      // Nested Quantum Core for Cloud Platform
      mainGeo = new THREE.OctahedronGeometry(0.95, 1);
      mainMat = new THREE.MeshStandardMaterial({
        color: 0x0A1020,
        emissive: colorNum,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8,
      });
      mainMesh = new THREE.Mesh(mainGeo, mainMat);
      group.add(mainMesh);

      edgesGeo = new THREE.EdgesGeometry(mainGeo);
      edgesMat = new THREE.LineBasicMaterial({ color: colorNum, transparent: true, opacity: 0.8 });
      edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      mainMesh.add(edgesMesh);
    } else {
      // Hexagonal Prism for Foundation
      mainGeo = new THREE.CylinderGeometry(0.85, 0.95, 1.2, 6);
      mainMat = new THREE.MeshStandardMaterial({
        color: 0x061814,
        emissive: colorNum,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.6,
      });
      mainMesh = new THREE.Mesh(mainGeo, mainMat);
      group.add(mainMesh);

      edgesGeo = new THREE.EdgesGeometry(mainGeo);
      edgesMat = new THREE.LineBasicMaterial({ color: colorNum, transparent: true, opacity: 0.75 });
      edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      mainMesh.add(edgesMesh);
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (performance.now() - startTime) * 0.001;
      group.rotation.y = elapsed * 0.45;
      group.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      group.position.y = Math.sin(elapsed * 1.1) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 180;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      if (mainGeo) mainGeo.dispose();
      if (mainMat) mainMat.dispose();
      if (edgesGeo) edgesGeo.dispose();
      if (edgesMat) edgesMat.dispose();
    };
  }, [type, accentColor, hasWebGL]);

  if (!hasWebGL) return null;

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-36 sm:h-44 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
