import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const NODES = [
  { id: 'education', name: 'Education', color: '#2563EB', desc: 'Institutional platforms & student portals', pos: [2.1, 1.1, 0.4] },
  { id: 'technology', name: 'Technology', color: '#7C3AED', desc: 'Modern web & resilient cloud systems', pos: [-2.1, 1.0, -0.3] },
  { id: 'innovation', name: 'Innovation', color: '#10B981', desc: 'Applied R&D & practical engineering', pos: [1.8, -1.3, -0.4] },
  { id: 'business', name: 'Business', color: '#F97316', desc: 'Commercial services & trade ecosystem', pos: [-1.8, -1.2, 0.5] },
];

export default function Hero3DEcosystem() {
  const mountRef = useRef(null);
  const [activeNode, setActiveNode] = useState(NODES[0]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 500;
    const isMobile = window.innerWidth < 768;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const ecosystemGroup = new THREE.Group();
    scene.add(ecosystemGroup);

    // Lighting (Controlled, studio-like)
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2563eb, 0.8);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    // Center Core: Precision Architectural Octahedron/Icosahedron (JMG Core)
    const coreGeo = new THREE.OctahedronGeometry(1.25, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0B1220,
      roughness: 0.25,
      metalness: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    ecosystemGroup.add(coreMesh);

    // Subtle Core Edges
    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x64748B, transparent: true, opacity: 0.5 });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    coreMesh.add(edgesMesh);

    // Dual Geometric Orbital Reference Rings
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.015, 16, 90);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xCBD5E1, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ecosystemGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.012, 16, 90);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xCBD5E1, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ecosystemGroup.add(ring2);

    // Satellite Nodes (Education, Technology, Innovation, Business)
    const nodeMeshes = [];
    const lines = [];

    NODES.forEach((item) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...item.pos);
      nodeGroup.userData = { id: item.id, base: new THREE.Vector3(...item.pos) };

      // Solid sphere
      const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color),
        roughness: 0.2,
        metalness: 0.4,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphere);

      // Subtle thin halo
      const haloGeo = new THREE.RingGeometry(0.28, 0.32, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(item.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      nodeGroup.add(halo);

      ecosystemGroup.add(nodeGroup);
      nodeMeshes.push(nodeGroup);

      // Thin architectural connection line to center
      const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...item.pos)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(item.color),
        transparent: true,
        opacity: 0.22,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      ecosystemGroup.add(line);
      lines.push({ line, nodeGroup });
    });

    // Mouse movement listener for controlled parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (!isMobile) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Restrained, steady rotation
      ecosystemGroup.rotation.y = t * 0.12 + mouse.x * 0.25;
      ecosystemGroup.rotation.x = Math.sin(t * 0.08) * 0.06 + mouse.y * 0.2;

      coreMesh.rotation.y = -t * 0.2;
      coreMesh.rotation.z = Math.sin(t * 0.15) * 0.1;

      // Slight floating wobble on satellite nodes
      nodeMeshes.forEach((node, idx) => {
        const base = node.userData.base;
        const wave = Math.sin(t * 1.2 + idx * 1.5) * 0.08;
        node.position.y = base.y + wave;

        // Sync connection line
        const conn = lines[idx];
        if (conn) {
          const arr = conn.line.geometry.attributes.position.array;
          arr[3] = node.position.x;
          arr[4] = node.position.y;
          arr[5] = node.position.z;
          conn.line.geometry.attributes.position.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (!isMobile) container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center select-none">
      
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Discrete Center Label */}
      <div className="absolute pointer-events-none flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-[#111827] bg-white/90 px-2 py-0.5 rounded border border-[#E2E8F0]">
          JMG CORE
        </span>
      </div>

      {/* Node Switcher Controls at Top for deliberate interaction */}
      <div className="absolute top-2 inset-x-2 flex items-center justify-center gap-1.5 z-10 flex-wrap">
        {NODES.map((node) => {
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white/90 text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: node.color }} />
              {node.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Detail Card at Bottom */}
      <div className="absolute bottom-2 inset-x-4 z-10">
        <div className="bg-white/95 border border-[#E2E8F0] rounded-[14px] p-3 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-[#111827] mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeNode.color }} />
              {activeNode.name} Node
            </span>
            <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
              Ecosystem Satellite
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-normal leading-relaxed">
            {activeNode.desc}
          </p>
        </div>
      </div>

    </div>
  );
}
