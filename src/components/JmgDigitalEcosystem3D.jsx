import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * 3D STUDIO ENVIRONMENT FOR JMG DIGITAL ECOSYSTEM
 * 
 * Purposeful 3D objects representing the 5 core JMG verticals:
 * 1. Technology: Sleek digital monolithic slab with procedural circuit topology
 * 2. Finance: Ascending geometric prism steps (capital growth)
 * 3. Insurance: Faceted geometric shield structure (risk protection)
 * 4. Infrastructure: Architectural structural beam lattice (built environment)
 * 5. Trade & Travel: Connected orbital navigation ring with illuminated logistics nodes
 */

const VERTICAL_COLORS = {
  'technology': 0x38BDF8,
  'technology-digital': 0x38BDF8,
  'finance': 0x10B981,
  'insurance': 0x06B6D4,
  'finance-insurance': 0x10B981,
  'business-services': 0xF97316,
  'infrastructure': 0x6366F1,
  'infrastructure-trade': 0x6366F1,
  'travel': 0xF59E0B,
  'trade': 0x8B5CF6,
  'retail': 0xEC4899,
  'retail-travel': 0xEC4899,
};

const DOMAIN_TO_ELEMENT_KEY = {
  'technology': 'technology-digital',
  'technology-digital': 'technology-digital',
  'finance': 'finance-insurance',
  'insurance': 'insurance-shield',
  'finance-insurance': 'finance-insurance',
  'business-services': 'infrastructure-trade',
  'infrastructure': 'infrastructure-trade',
  'infrastructure-trade': 'infrastructure-trade',
  'travel': 'retail-travel',
  'trade': 'retail-travel',
  'retail': 'retail-travel',
  'retail-travel': 'retail-travel',
};

export default function JmgDigitalEcosystem3D({ activeCategory }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const elementsRef = useRef({});
  const spotLightRef = useRef(null);

  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;
    const isMobile = window.innerWidth < 768;

    // Renderer creation with safe WebGL check
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGL context creation failed, activating elegant fallback:', err);
      setWebGlSupported(false);
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x07111F, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 7.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Root 3D Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // -------------------------------------------------------------
    // LIGHTING (Studio setup: Key, Ambient, Dynamic Spotlight)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x0e1e36, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    backRimLight.position.set(-5, -3, -4);
    scene.add(backRimLight);

    // Dynamic spotlight that subtly reacts to the active business category
    const dynamicSpot = new THREE.PointLight(0x3B82F6, 3.5, 12);
    dynamicSpot.position.set(2, 2, 2.5);
    scene.add(dynamicSpot);
    spotLightRef.current = dynamicSpot;

    // -------------------------------------------------------------
    // ARCHITECTURAL STUDIO FLOOR (Subtle depth grid)
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(16, 24, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -2.6;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.45;
    worldGroup.add(gridHelper);

    // -------------------------------------------------------------
    // 1. TECHNOLOGY METAPHOR — Digital Monolith (Left editorial framing)
    // -------------------------------------------------------------
    const techGroup = new THREE.Group();
    techGroup.position.set(-3.8, 1.4, -2.5);
    techGroup.scale.set(0.75, 0.75, 0.75);

    const monolithGeo = new THREE.BoxGeometry(0.7, 1.5, 0.12);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.15,
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    techGroup.add(monolith);

    // Circuit wireframe edges
    const techEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(monolithGeo),
      new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.45 })
    );
    techGroup.add(techEdges);
    worldGroup.add(techGroup);
    elementsRef.current['technology-digital'] = techGroup;

    // -------------------------------------------------------------
    // 2. FINANCE METAPHOR — Ascending Geometric Growth Prism (Far bottom-left)
    // -------------------------------------------------------------
    const financeGroup = new THREE.Group();
    financeGroup.position.set(-3.6, -1.6, -2.6);
    financeGroup.scale.set(0.7, 0.7, 0.7);

    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x059669,
      emissiveIntensity: 0.2,
    });

    [-0.24, 0, 0.24].forEach((xOffset, i) => {
      const heightVal = 0.5 + i * 0.45;
      const barGeo = new THREE.BoxGeometry(0.18, heightVal, 0.18);
      const barMesh = new THREE.Mesh(barGeo, prismMat);
      barMesh.position.set(xOffset, heightVal / 2 - 0.7, 0);
      financeGroup.add(barMesh);

      const barEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(barGeo),
        new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.45 })
      );
      barEdges.position.copy(barMesh.position);
      financeGroup.add(barEdges);
    });
    worldGroup.add(financeGroup);
    elementsRef.current['finance-insurance'] = financeGroup;

    // -------------------------------------------------------------
    // 3. INFRASTRUCTURE METAPHOR — Architectural Structural Truss (Deep bottom)
    // -------------------------------------------------------------
    const infraGroup = new THREE.Group();
    infraGroup.position.set(-1.6, -2.6, -3.0);
    infraGroup.scale.set(0.65, 0.65, 0.65);

    const trussGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.4, 6, 1, true);
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.7,
      roughness: 0.35,
      wireframe: true,
    });
    const trussMesh = new THREE.Mesh(trussGeo, trussMat);
    infraGroup.add(trussMesh);

    const centerCol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.9, roughness: 0.1 })
    );
    infraGroup.add(centerCol);
    worldGroup.add(infraGroup);
    elementsRef.current['infrastructure-trade'] = infraGroup;

    // -------------------------------------------------------------
    // 4. RETAIL & TRAVEL METAPHOR — Connected Orbit Rings (Deep background periphery)
    // Shifted far back & down so it never collides with 03 BUSINESS SERVICES UI
    // -------------------------------------------------------------
    const travelGroup = new THREE.Group();
    travelGroup.position.set(6.2, -4.2, -5.5);
    travelGroup.scale.set(0.48, 0.48, 0.48);

    const orbitRingGeo = new THREE.TorusGeometry(0.75, 0.015, 16, 64);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xbe185d,
      emissive: 0xdb2777,
      emissiveIntensity: 0.25,
      roughness: 0.4,
      transparent: true,
      opacity: 0.4,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    travelGroup.add(orbitRing);

    // Satellite node
    const nodeSph = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        emissive: 0xf43f5e,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.5,
      })
    );
    nodeSph.position.set(0.72, 0, 0);
    travelGroup.add(nodeSph);
    worldGroup.add(travelGroup);
    elementsRef.current['retail-travel'] = travelGroup;

    // -------------------------------------------------------------
    // MOUSE PARALLAX & ANIMATION LOOP
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.45;
      mouseY = -y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      worldGroup.rotation.y = targetX;
      worldGroup.rotation.x = targetY;

      // Subtle breathing idle rotations
      if (elementsRef.current['technology-digital']) {
        elementsRef.current['technology-digital'].rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;
        elementsRef.current['technology-digital'].position.y = 1.1 + Math.sin(elapsedTime * 0.8) * 0.05;
      }

      if (elementsRef.current['finance-insurance']) {
        elementsRef.current['finance-insurance'].rotation.y = elapsedTime * 0.2;
        elementsRef.current['finance-insurance'].position.y = 1.3 + Math.cos(elapsedTime * 0.7) * 0.05;
      }

      if (elementsRef.current['infrastructure-trade']) {
        elementsRef.current['infrastructure-trade'].rotation.y = -elapsedTime * 0.15;
        elementsRef.current['infrastructure-trade'].position.y = -1.4 + Math.sin(elapsedTime * 0.6) * 0.04;
      }

      if (elementsRef.current['retail-travel']) {
        elementsRef.current['retail-travel'].rotation.z = elapsedTime * 0.35;
        elementsRef.current['retail-travel'].position.y = -1.3 + Math.cos(elapsedTime * 0.9) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update spotlight and scale focus when active category changes
  useEffect(() => {
    if (!spotLightRef.current) return;
    const targetColor = VERTICAL_COLORS[activeCategory] || 0x38BDF8;
    spotLightRef.current.color.setHex(targetColor);

    const activeElementKey = DOMAIN_TO_ELEMENT_KEY[activeCategory] || activeCategory;

    // Highlight the active 3D element subtly
    Object.entries(elementsRef.current).forEach(([elemKey, group]) => {
      if (!group) return;
      if (elemKey === activeElementKey) {
        group.scale.set(1.18, 1.18, 1.18);
      } else {
        group.scale.set(0.94, 0.94, 0.94);
      }
    });
  }, [activeCategory]);

  if (!webGlSupported) {
    return (
      <div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-60" 
        aria-hidden="true"
      >
        <svg className="w-[500px] h-[500px] animate-spin" style={{ animationDuration: '60s' }} viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="160" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 8" opacity="0.3" />
          <circle cx="250" cy="250" r="220" stroke="#818CF8" strokeWidth="1" strokeDasharray="8 12" opacity="0.2" />
          <circle cx="250" cy="90" r="6" fill="#38BDF8" />
          <circle cx="410" cy="250" r="5" fill="#10B981" />
          <circle cx="250" cy="410" r="6" fill="#6366F1" />
          <circle cx="90" cy="250" r="5" fill="#F97316" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    />
  );
}
