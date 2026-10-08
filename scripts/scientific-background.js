import * as THREE from 'three';

(() => {
  const root = document.querySelector('.scientific-background');
  if (!root) return;

  const equations = [
    '∂u/∂t + (u·∇)u = −∇p + ν∇²u',
    'P(y|x) = ∫ P(y|z)P(z|x) dz',
    'f(x) = wᵀx + b',
    '∇·u = 0',
    'E[X] = ∫ x p(x) dx',
    'σ(z) = 1/(1 + e⁻ᶻ)',
    'xₜ = Axₜ₋₁ + εₜ',
    'ŷ = fθ(x)',
    'R² = 1 − SSE/SST',
    'dy/dt = F(y,t)'
  ];

  const eqLayer = root.querySelector('.scientific-equations');

  const equationPositions = [
    { left: 52, top: 8 },
    { left: 72, top: 13 },
    { left: 87, top: 30 },
    { left: 61, top: 42 },
    { left: 79, top: 57 },
    { left: 91, top: 73 },
    { left: 6, top: 78 },
    { left: 24, top: 88 },
    { left: 49, top: 79 },
    { left: 68, top: 88 }
  ];

  equations.forEach((formula, i) => {
    const el = document.createElement('span');

    el.className = 'scientific-equation';
    el.textContent = formula;

    const position = equationPositions[i];

    el.style.left = `${position.left}%`;
    el.style.top = `${position.top}%`;

    el.style.setProperty('--delay', `${-(i * 1.7)}s`);
    el.style.setProperty('--duration', `${13 + (i % 5) * 2}s`);
    el.style.setProperty(
      '--rotation',
      `${(i % 2 ? 1 : -1) * (1 + i % 3)}deg`
    );

    eqLayer.appendChild(el);
  });

  const particleLayer = root.querySelector('.scientific-particles');

  for (let i = 0; i < 34; i++) {
    const p = document.createElement('span');

    p.className = 'scientific-particle';
    p.style.left = `${(i * 37) % 100}%`;
    p.style.top = `${(i * 61) % 100}%`;
    p.style.setProperty('--size', `${2 + (i % 3)}px`);
    p.style.setProperty('--delay', `${-(i * 0.6)}s`);
    p.style.setProperty('--duration', `${7 + (i % 6)}s`);

    particleLayer.appendChild(p);
  }

  const svg = root.querySelector('.scientific-network');
  const ns = 'http://www.w3.org/2000/svg';
  const layers = [4, 6, 5, 2];
  const nodes = [];

  layers.forEach((count, layer) => {
    const x = 10 + layer * 27;

    for (let i = 0; i < count; i++) {
      const y = 15 + (i + 1) * (70 / (count + 1));
      nodes.push({ layer, x, y });
    }
  });

  /* ------------------------------------------------------------
     3D Surface Graph
  ------------------------------------------------------------ */

  const surfaceCanvas = document.querySelector('#scientific-surface-3d');

  if (surfaceCanvas) {
    const surfaceScene = new THREE.Scene();

    const surfaceCamera = new THREE.PerspectiveCamera(
      42,
      surfaceCanvas.clientWidth / surfaceCanvas.clientHeight,
      0.1,
      100
    );

    surfaceCamera.position.set(0, 2.8, 5.5);
    surfaceCamera.lookAt(0, 0, 0);

    const surfaceRenderer = new THREE.WebGLRenderer({
      canvas: surfaceCanvas,
      alpha: true,
      antialias: true
    });

    surfaceRenderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    surfaceRenderer.setSize(
      surfaceCanvas.clientWidth,
      surfaceCanvas.clientHeight,
      false
    );

    const surfaceGroup = new THREE.Group();

    const surfaceGeometry = new THREE.PlaneGeometry(
      3.8,
      2.4,
      36,
      28
    );

    const surfacePositions =
      surfaceGeometry.attributes.position;

    for (let i = 0; i < surfacePositions.count; i++) {
      const x = surfacePositions.getX(i);
      const y = surfacePositions.getY(i);

      const radius = Math.sqrt(x * x + y * y);

      const z =
        0.42 *
        Math.sin(radius * 3.2) /
        (1 + radius * 0.8);

      surfacePositions.setZ(i, z);
    }

    surfaceGeometry.computeVertexNormals();

    const surfaceMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x73d3c7,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });

    const surfaceMesh =
      new THREE.Mesh(
        surfaceGeometry,
        surfaceMaterial
      );

    surfaceGroup.add(surfaceMesh);

    surfaceScene.add(surfaceGroup);

    function animateSurface() {
      requestAnimationFrame(animateSurface);

      surfaceGroup.rotation.x = -0.72;
      surfaceGroup.rotation.z += 0.0018;

      surfaceRenderer.render(
        surfaceScene,
        surfaceCamera
      );
    }

    animateSurface();
  }

  /* ------------------------------------------------------------
     3D Scatter Graph
  ------------------------------------------------------------ */

  const scatterCanvas =
    document.querySelector('#scientific-scatter-3d');

  if (scatterCanvas) {
    const scatterScene = new THREE.Scene();

    const scatterCamera =
      new THREE.PerspectiveCamera(
        42,
        scatterCanvas.clientWidth /
        scatterCanvas.clientHeight,
        0.1,
        100
      );

    scatterCamera.position.set(
      0,
      1.8,
      5.5
    );

    scatterCamera.lookAt(0, 0, 0);

    const scatterRenderer =
      new THREE.WebGLRenderer({
        canvas: scatterCanvas,
        alpha: true,
        antialias: true
      });

    scatterRenderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    scatterRenderer.setSize(
      scatterCanvas.clientWidth,
      scatterCanvas.clientHeight,
      false
    );

    const scatterGroup =
      new THREE.Group();

    const points = [];

    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;

      points.push(x, y, z);
    }

    const scatterGeometry =
      new THREE.BufferGeometry();

    scatterGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        points,
        3
      )
    );

    const scatterMaterial =
      new THREE.PointsMaterial({
        color: 0x73d3c7,
        size: 0.2,
        transparent: true,
        opacity: 0.8
      });

    const scatterPoints =
      new THREE.Points(
        scatterGeometry,
        scatterMaterial
      );

    scatterGroup.add(scatterPoints);

    scatterScene.add(scatterGroup);

    function animateScatter() {
      requestAnimationFrame(
        animateScatter
      );

      scatterGroup.rotation.y += 0.0018;
      scatterGroup.rotation.x += 0.0007;

      scatterRenderer.render(
        scatterScene,
        scatterCamera
      );
    }

    animateScatter();
  }

  for (let layer = 0; layer < layers.length - 1; layer++) {
    const a = nodes.filter(n => n.layer === layer);
    const b = nodes.filter(n => n.layer === layer + 1);

    a.forEach((from, ai) =>
      b.forEach((to, bi) => {
        const line = document.createElementNS(ns, 'line');

        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute(
          'class',
          'network-connection'
        );

        line.style.animationDelay =
          `${-((ai + bi) % 8) * 0.25}s`;

        svg.appendChild(line);
      })
    );
  }

  nodes.forEach((node, i) => {
    const circle =
      document.createElementNS(ns, 'circle');

    circle.setAttribute(
      'cx',
      node.x
    );

    circle.setAttribute(
      'cy',
      node.y
    );

    circle.setAttribute(
      'r',
      node.layer === 0 || node.layer === 3
        ? '2.2'
        : '1.8'
    );

    circle.setAttribute(
      'class',
      'network-neuron'
    );

    circle.style.animationDelay =
      `${-(i % 9) * 0.3}s`;

    svg.appendChild(circle);
  });
})();