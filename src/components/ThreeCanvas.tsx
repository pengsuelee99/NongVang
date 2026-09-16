"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xe8a0bf, 2, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9b72cf, 2, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // 5. 3D Floating Mesh Objects (Glowing 3D Polyhedrons & Spheres)
    const group = new THREE.Group();
    scene.add(group);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0xe8a0bf,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x9b72cf,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xc9b8e8,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.6,
      }),
    ];

    const geometries = [
      new THREE.IcosahedronGeometry(1.8, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.DodecahedronGeometry(1.4, 0),
      new THREE.TorusGeometry(1.2, 0.4, 16, 32),
      new THREE.SphereGeometry(1.0, 16, 16),
    ];

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 25; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );

      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);
      meshes.push(mesh);
    }

    // 6. 3D Starfield Particles
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0xe8a0bf),
      new THREE.Color(0x9b72cf),
      new THREE.Color(0xc9b8e8),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse / Touch Parallax Camera Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove);

    // 8. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate group & meshes smoothly
      group.rotation.y = elapsedTime * 0.05;
      group.rotation.x = elapsedTime * 0.03;

      meshes.forEach((m, idx) => {
        m.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
        m.rotation.y += 0.008 * (idx % 3 === 0 ? 1 : -1);
        m.position.y += Math.sin(elapsedTime + idx) * 0.005;
      });

      particles.rotation.y = -elapsedTime * 0.02;

      // Smooth camera lerp parallax
      targetX += (mouseX * 4 - targetX) * 0.05;
      targetY += (-mouseY * 4 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
