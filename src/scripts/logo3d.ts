/**
 * Falls City Dev Studio — 3D logo mark.
 *
 * Treated as a crafted relief rather than a scene: the three building
 * silhouettes rise out of the page in shallow steps (tallest at the back,
 * smallest in front), each waterfall sits just proud of the building it pours
 * from, and depth comes from fine chamfered edges and real soft shadows cast
 * onto the page. The only motion in the loop is the water itself.
 *
 * Brand fidelity:
 * - Front faces are unlit, so #0d1927 navy and #0096b8 cyan render exactly.
 * - Chamfers are cut inward, so the silhouette and the logo's white gaps never change.
 * - The first frame is flat and pixel-aligned with the SVG poster; sides take
 *   the front color until each piece has risen.
 */
import {
  AmbientLight,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  ShapePath,
  SRGBColorSpace,
  Vector2,
  VSMShadowMap,
  WebGLRenderer,
  type Shape,
} from 'three';
import { MARK_BOUNDS, MARK_CYAN, MARK_NAVY, type Segment } from '../data/logo-mark';

const BRAND = {
  navy: '#0d1927',
  navySide: '#1a2a3d',
  cyan: '#0096b8',
  cyanSide: '#00809d',
};

/** Framing square (in source px) shared with the CSS poster: mark width × 1.3. */
const MARK_W = MARK_BOUNDS[2] - MARK_BOUNDS[0];
const MARK_H = MARK_BOUNDS[3] - MARK_BOUNDS[1];
export const FRAME_PX = Math.max(MARK_W, MARK_H) * 1.3;
const WORLD_W = 4;
const UNIT = WORLD_W / MARK_W;
const CX = (MARK_BOUNDS[0] + MARK_BOUNDS[2]) / 2;
const CY = (MARK_BOUNDS[1] + MARK_BOUNDS[3]) / 2;

/** Relief depth per building, back (tallest) to front (smallest). */
const BUILDING_DEPTH = [0.16, 0.24, 0.32];
/** How far each waterfall stands proud of its building. */
const WATER_PROUD = 0.035;
const CHAMFER = { thickness: 0.02, size: 0.016 };
const TOP_SAMPLES = 32;

const toWorld = (x: number, y: number) => new Vector2((x - CX) * UNIT, (CY - y) * UNIT);

function shapesFrom(sub: Segment[]): Shape[] {
  const path = new ShapePath();
  for (const seg of sub) {
    const n = seg.slice(1) as number[];
    const at = (i: number) => n[i] ?? 0;
    if (seg[0] === 'M') {
      const p = toWorld(at(0), at(1));
      path.moveTo(p.x, p.y);
    } else if (seg[0] === 'L') {
      const p = toWorld(at(0), at(1));
      path.lineTo(p.x, p.y);
    } else if (seg[0] === 'C') {
      const a = toWorld(at(0), at(1));
      const b = toWorld(at(2), at(3));
      const c = toWorld(at(4), at(5));
      path.bezierCurveTo(a.x, a.y, b.x, b.y, c.x, c.y);
    }
  }
  return path.toShapes(false);
}

interface Extent {
  shape: Shape;
  min: Vector2;
  max: Vector2;
}

/** Shapes with their bounds, ordered right (tallest, back) to left (smallest, front). */
function extents(subs: Segment[][]): Extent[] {
  return subs
    .flatMap((sub) => shapesFrom(sub))
    .map((shape) => {
      const min = new Vector2(Infinity, Infinity);
      const max = new Vector2(-Infinity, -Infinity);
      shape.extractPoints(12).shape.forEach((p) => {
        min.min(p);
        max.max(p);
      });
      return { shape, min, max };
    })
    .sort((a, b) => b.min.x - a.min.x);
}

/** Height of a shape's top edge across its width, so the water's lip highlight follows the real curve. */
function topEdge({ shape, min, max }: Extent): number[] {
  const pts = shape.extractPoints(40).shape;
  const tops: number[] = [];
  for (let k = 0; k < TOP_SAMPLES; k += 1) {
    const x = MathUtils.lerp(min.x + 1e-4, max.x - 1e-4, k / (TOP_SAMPLES - 1));
    let top = -Infinity;
    for (let i = 0; i < pts.length; i += 1) {
      const a = pts[i]!;
      const b = pts[(i + 1) % pts.length]!;
      if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) top = Math.max(top, a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y));
    }
    tops.push(Number.isFinite(top) ? top : (tops[tops.length - 1] ?? max.y));
  }
  return tops;
}

type Uniform<T> = { value: T };

const NOISE_GLSL = /* glsl */ `
  float fcHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float fcNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(fcHash(i), fcHash(i + vec2(1.0, 0.0)), u.x),
               mix(fcHash(i + vec2(0.0, 1.0)), fcHash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
`;

/**
 * Brand-cyan water face. Motion is deliberately quiet: fine vertical threads that
 * drift down and lengthen as the water accelerates, plus a thin highlight that
 * traces the lip where the water rolls out of the building.
 */
function waterFront(time: Uniform<number>, fx: Uniform<number>, fall: Extent, tops: number[]) {
  const material = new MeshBasicMaterial({ color: BRAND.cyan, toneMapped: false });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uTime: time,
      uFx: fx,
      uMin: { value: fall.min },
      uMax: { value: fall.max },
      uTop: { value: tops },
    });
    shader.vertexShader = `varying vec2 vXY;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\n  vXY = position.xy;',
    );
    shader.fragmentShader = `uniform float uTime;
      uniform float uFx;
      uniform vec2 uMin;
      uniform vec2 uMax;
      uniform float uTop[${TOP_SAMPLES}];
      varying vec2 vXY;
      ${NOISE_GLSL}
      ${shader.fragmentShader}`.replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      float x01 = clamp((vXY.x - uMin.x) / (uMax.x - uMin.x), 0.0, 1.0);
      float fi = x01 * ${(TOP_SAMPLES - 1).toFixed(1)};
      int i0 = int(floor(fi));
      float top = mix(uTop[i0], uTop[min(i0 + 1, ${TOP_SAMPLES - 1})], fract(fi));
      float drop = max(top - vXY.y, 0.0) / (uMax.y - uMin.y);
      // Falling water accelerates: sample along sqrt(distance) so threads stretch as they drop.
      float v = sqrt(drop) * 2.6;
      float threadA = fcNoise(vec2(x01 * 46.0, v * 1.6 - uTime * 0.55));
      float threadB = fcNoise(vec2(x01 * 83.0 + 11.0, v * 2.4 - uTime * 0.9));
      float threads = smoothstep(0.58, 0.95, threadA) * 0.6 + smoothstep(0.66, 0.97, threadB) * 0.4;
      float lip = exp(-drop * 140.0);
      float shade = 1.0 + (threads * 0.09 - 0.03) + lip * 0.16;
      diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * shade, uFx);`,
    );
  };
  material.customProgramCacheKey = () => 'fallscity-water-v5';
  return material;
}

/** Matte sides and chamfers; they hold the exact front color until the piece has risen. */
function sideMaterial(kind: 'navy' | 'cyan', rise: Uniform<number>) {
  const isCyan = kind === 'cyan';
  const material = new MeshStandardMaterial({
    color: isCyan ? BRAND.cyanSide : BRAND.navySide,
    roughness: isCyan ? 0.42 : 0.68,
    metalness: 0,
  });
  const front = new Color(isCyan ? BRAND.cyan : BRAND.navy);
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uRise: rise, uFront: { value: front } });
    shader.fragmentShader = `uniform float uRise;\nuniform vec3 uFront;\n${shader.fragmentShader}`.replace(
      '#include <opaque_fragment>',
      'outgoingLight = mix(uFront, outgoingLight, smoothstep(0.0, 0.8, uRise));\n#include <opaque_fragment>',
    );
  };
  material.customProgramCacheKey = () => `fallscity-side-${kind}-v5`;
  return material;
}

interface Piece {
  mesh: Mesh;
  delay: number;
  rise: Uniform<number>;
}

export function mountLogo3D(container: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap; // blurred, diffuse shadows rather than hard offsets
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  // A narrow lens keeps the relief honest, like a product photograph rather than a fisheye.
  const camera = new PerspectiveCamera(16, 1, 0.1, 200);
  const logo = new Group();
  scene.add(logo);

  // --- Light: one soft key from the upper left, quiet fill ----------------
  scene.add(new HemisphereLight(0xf4f8fb, 0xc9d3da, 1.15));
  scene.add(new AmbientLight(0xffffff, 0.2));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.position.set(-3.5, 5, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3.2, right: 3.2, top: 3.2, bottom: -3.2, near: 1, far: 20 });
  key.shadow.bias = -0.0006;
  key.shadow.radius = 20;
  key.shadow.blurSamples = 24;
  scene.add(key);

  // The page itself: an invisible wall that only shows the shadows the relief casts.
  const wall = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ color: new Color(BRAND.navy), opacity: 0.13 }));
  wall.receiveShadow = true;
  logo.add(wall);

  // --- Relief ------------------------------------------------------------------
  const time = { value: 0 };
  const fx = { value: reduceMotion ? 1 : 0 };
  const navyFront = new MeshBasicMaterial({ color: BRAND.navy, toneMapped: false });
  const pieces: Piece[] = [];

  const extrude = (shape: Shape, depth: number) => {
    const geometry = new ExtrudeGeometry(shape, {
      depth: depth - CHAMFER.thickness * 2,
      bevelEnabled: true,
      bevelThickness: CHAMFER.thickness,
      bevelSize: CHAMFER.size,
      bevelOffset: -CHAMFER.size, // inward, so the outer edge sits exactly on the artwork
      bevelSegments: 3,
      curveSegments: 24,
    });
    geometry.translate(0, 0, CHAMFER.thickness); // back face on the page (z = 0)
    geometry.computeBoundingBox();
    return geometry;
  };

  const addPiece = (geometry: ExtrudeGeometry, front: MeshBasicMaterial, kind: 'navy' | 'cyan') => {
    const rise = { value: reduceMotion ? 1 : 0 };
    const mesh = new Mesh(geometry, [front, sideMaterial(kind, rise)]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    pieces.push({ mesh, delay: 0, rise });
    logo.add(mesh);
  };

  const buildings = extents(MARK_NAVY);
  buildings.forEach((b, i) => addPiece(extrude(b.shape, BUILDING_DEPTH[i] ?? BUILDING_DEPTH[0]!), navyFront, 'navy'));

  // Waterfall i pours from building i (both ordered right to left).
  extents(MARK_CYAN).forEach((w, i) => {
    const depth = (BUILDING_DEPTH[i] ?? BUILDING_DEPTH[0]!) + WATER_PROUD;
    addPiece(extrude(w.shape, depth), waterFront(time, fx, w, topEdge(w)), 'cyan');
  });

  // Rise back to front: the tallest building first, the smallest last.
  [...pieces]
    .sort((a, b) => b.mesh.geometry.boundingBox!.max.x - a.mesh.geometry.boundingBox!.max.x)
    .forEach((piece, index) => {
      piece.delay = index * 0.07;
    });

  // --- Framing: the flat state matches the SVG poster exactly -------------
  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const visibleHeight = FRAME_PX * UNIT * Math.max(1, height / width);
    const distance = visibleHeight / 2 / Math.tan(MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  // --- Motion: rise once, then only the water moves -----------------------
  const pointer = new Vector2();
  const tilt = new Vector2();
  if (!reduceMotion) {
    window.addEventListener(
      'pointermove',
      (event) => pointer.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2),
      { passive: true },
    );
  }

  const easeInOut = (t: number) => {
    const c = MathUtils.clamp(t, 0, 1);
    return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  };
  const HOLD = 0.4;
  const RISE = 1.4;
  let clock = 0;

  function pose() {
    for (const piece of pieces) {
      const progress = reduceMotion ? 1 : easeInOut((clock - HOLD - piece.delay) / RISE);
      piece.mesh.scale.z = Math.max(0.001, progress);
      piece.rise.value = progress;
    }
    const turn = reduceMotion ? 1 : easeInOut((clock - HOLD - 0.2) / 1.8);
    tilt.lerp(pointer, 0.04);
    const sway = reduceMotion ? 0 : Math.sin(clock * 0.35) * 0.025;
    logo.rotation.y = turn * (-0.32 + sway + tilt.x * 0.08);
    logo.rotation.x = turn * (0.12 + tilt.y * 0.04);
    fx.value = reduceMotion ? 1 : easeInOut((clock - HOLD - 0.5) / 1.2);
    time.value = reduceMotion ? 2 : clock;
  }

  let last = performance.now();
  let visible = true;
  let running = false;

  const frame = (now: number) => {
    clock += Math.min((now - last) / 1000, 0.1);
    last = now;
    pose();
    renderer.render(scene, camera);
  };

  const setRunning = (run: boolean) => {
    if (reduceMotion || run === running) return;
    running = run;
    last = performance.now();
    renderer.setAnimationLoop(run ? frame : null);
  };

  new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    setRunning(visible && !document.hidden);
  }).observe(container);
  document.addEventListener('visibilitychange', () => setRunning(visible && !document.hidden));
  new ResizeObserver(() => {
    resize();
    if (!running) renderer.render(scene, camera);
  }).observe(container);

  renderer.domElement.addEventListener('webglcontextlost', () => {
    container.dataset.ready = 'false';
    setRunning(false);
  });

  resize();
  pose();
  renderer.render(scene, camera);
  container.dataset.ready = 'true';
  setRunning(true);
}
