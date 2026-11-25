import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeroInput } from './Hero3D'

/**
 * "Building systems" model: a glass high-rise on a podium with every system Capital installs drawn as a live layer
 * (CCTV cones, access readers, fire detectors per floor, entry intercom, suite smart locks, automatic doors, and the
 * integration riser that ties them together). `layer` (ref) picks the highlighted layer; 'all' lights everything.
 */
import { LAYERS, type Layer } from './layers'
export { LAYERS, type Layer }

type Props = {
  active: boolean
  layer: MutableRefObject<Layer>
  progress: MutableRefObject<number>
  input: MutableRefObject<HeroInput>
  lite?: boolean
  still?: boolean
  onReady: () => void
  onPerfFail: () => void
}

const FLOORS = 18
const FH = 0.34
const TW = 2.5
const TD = 2.5
const POD_H = 1.25
const POD_W = 4.8
const POD_D = 3.7
const TOP = POD_H + FLOORS * FH

const SIGNAL = new THREE.Color('#62adff')
const ALARM = new THREE.Color('#ff4b37')
const WARM = new THREE.Color('#ffc98a')
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))

/** Shared per-layer intensity (0..1), eased toward the target every frame. */
function useLevels(layer: MutableRefObject<Layer>) {
  const lv = useRef<Record<Layer, number>>({ cctv: 0, access: 0, fire: 0, intercom: 0, smart: 0, doors: 0, integrated: 0 })
  useFrame((_, dt) => {
    const cur = layer.current
    for (const k of LAYERS) {
      const target = cur === 'integrated' ? (k === 'integrated' ? 1 : 0.75) : k === cur ? 1 : 0.12
      lv.current[k] = damp(lv.current[k], target, 4, Math.min(dt, 0.1))
    }
  })
  return lv
}
type Levels = ReturnType<typeof useLevels>

function Edges({ w, h, d, y = 0, opacity = 0.55 }: { w: number; h: number; d: number; y?: number; opacity?: number }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d])
  return (
    <lineSegments geometry={geo} position={[0, y + h / 2, 0]}>
      <lineBasicMaterial color={SIGNAL} transparent opacity={opacity} />
    </lineSegments>
  )
}

function Building({ start, still, lite, lv }: { start: MutableRefObject<number>; still?: boolean; lite?: boolean; lv: Levels }) {
  const grow = useRef<THREE.Group>(null)
  const plates = useRef<THREE.InstancedMesh>(null)
  const wins = useRef<THREE.InstancedMesh>(null)
  const plateMat = useRef<THREE.MeshBasicMaterial>(null)
  const scan = useRef<THREE.Mesh>(null)

  // windows: 4 facades x floors x columns, ~38% lit warm
  const winData = useMemo(() => {
    const cols = lite ? 4 : 6
    const out: { p: THREE.Vector3; ry: number; lit: boolean; f: number }[] = []
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let f = 0; f < FLOORS; f++) {
      for (let side = 0; side < 4; side++) {
        for (let c = 0; c < cols; c++) {
          const u = (c + 0.5) / cols - 0.5
          const y = POD_H + f * FH + FH * 0.55
          const s = side % 2 === 0 ? TW : TD
          const off = (side % 2 === 0 ? TD : TW) / 2 + 0.004
          const p = side === 0 ? new THREE.Vector3(u * s, y, off) : side === 1 ? new THREE.Vector3(off, y, -u * s) : side === 2 ? new THREE.Vector3(-u * s, y, -off) : new THREE.Vector3(-off, y, u * s)
          out.push({ p, ry: (side * Math.PI) / 2, lit: rnd() < 0.27, f })
        }
      }
    }
    return { out, cols }
  }, [lite])

  useEffect(() => {
    const m = wins.current; if (!m) return
    const o = new THREE.Object3D()
    const dark = new THREE.Color('#10253d')
    winData.out.forEach((w, i) => {
      o.position.copy(w.p); o.rotation.set(0, w.ry, 0); o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      m.setColorAt(i, w.lit ? WARM.clone().multiplyScalar(0.42 + ((i * 37) % 10) / 45) : dark)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    const p = plates.current; if (!p) return
    for (let f = 0; f <= FLOORS; f++) {
      o.position.set(0, POD_H + f * FH, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); o.updateMatrix()
      p.setMatrixAt(f, o.matrix)
      p.setColorAt(f, SIGNAL)
    }
    p.instanceMatrix.needsUpdate = true
    if (p.instanceColor) p.instanceColor.needsUpdate = true
  }, [winData])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime - start.current
    if (grow.current) grow.current.scale.y = still ? 1 : Math.max(0.001, ease(t / 1.9))
    // fire layer: a red sweep climbs the floor plates
    const fire = lv.current.fire
    const p = plates.current
    if (p) {
      const head = ((t * 0.55) % 1.25) * FLOORS
      const c = new THREE.Color()
      for (let f = 0; f <= FLOORS; f++) {
        const k = Math.max(0, 1 - Math.abs(f - head) / 2.2) * fire
        c.copy(SIGNAL).lerp(ALARM, Math.min(1, k * 1.6))
        p.setColorAt(f, c)
      }
      if (p.instanceColor) p.instanceColor.needsUpdate = true
    }
    if (plateMat.current) plateMat.current.opacity = 0.22 + 0.5 * Math.max(fire, lv.current.integrated)
    if (scan.current) {
      const k = still ? 1.2 : ((t - 0.2) / 1.9)
      scan.current.visible = k > 0 && k < 1.05
      scan.current.position.y = POD_H + Math.min(1, k) * FLOORS * FH
    }
  })

  return (
    <group>
      {/* podium */}
      <mesh position={[0, POD_H / 2, 0]}>
        <boxGeometry args={[POD_W, POD_H, POD_D]} />
        <meshStandardMaterial color="#0b1b2e" roughness={0.45} metalness={0.5} />
      </mesh>
      <Edges w={POD_W} h={POD_H} d={POD_D} opacity={0.7} />
      {/* lobby glazing band */}
      <mesh position={[0, POD_H * 0.42, POD_D / 2 + 0.005]}>
        <planeGeometry args={[POD_W * 0.78, POD_H * 0.62]} />
        <meshBasicMaterial color="#2b4f78" transparent opacity={0.55} />
      </mesh>
      <group ref={grow}>
        {/* tower glass volume */}
        <mesh position={[0, POD_H + (FLOORS * FH) / 2, 0]}>
          <boxGeometry args={[TW, FLOORS * FH, TD]} />
          <meshStandardMaterial color="#0e2440" roughness={0.18} metalness={0.7} transparent opacity={0.88} />
        </mesh>
        <instancedMesh ref={wins} args={[undefined, undefined, winData.out.length]}>
          <planeGeometry args={[(TW / winData.cols) * 0.62, FH * 0.5]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={plates} args={[undefined, undefined, FLOORS + 1]}>
          <boxGeometry args={[TW + 0.08, 0.018, TD + 0.08]} />
          <meshBasicMaterial ref={plateMat} transparent opacity={0.4} toneMapped={false} />
        </instancedMesh>
        <Edges w={TW} h={FLOORS * FH} d={TD} y={POD_H} opacity={0.8} />
        {/* rooftop mechanical */}
        <mesh position={[0, TOP + 0.22, 0]}>
          <boxGeometry args={[1.3, 0.44, 1.3]} />
          <meshStandardMaterial color="#0b1b2e" roughness={0.5} metalness={0.4} />
        </mesh>
        <Edges w={1.3} h={0.44} d={1.3} y={TOP} opacity={0.6} />
      </group>
      {/* intro scan plane */}
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TW + 0.6, TD + 0.6]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.35} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** CCTV: cameras on podium corners + roof, each with a sweeping translucent field-of-view cone. */
function Cameras({ lv, lite }: { lv: Levels; lite?: boolean }) {
  const spots = useMemo(() => {
    const y = POD_H + 0.02
    const hw = POD_W / 2 - 0.05, hd = POD_D / 2 - 0.05
    const s: { p: [number, number, number]; yaw: number; pitch: number; len: number }[] = [
      { p: [hw, y, hd], yaw: Math.PI * 0.25, pitch: 0.75, len: 2.6 },
      { p: [-hw, y, hd], yaw: -Math.PI * 0.25, pitch: 0.75, len: 2.6 },
      { p: [hw, y, -hd], yaw: Math.PI * 0.75, pitch: 0.75, len: 2.6 },
      { p: [-hw, y, -hd], yaw: -Math.PI * 0.75, pitch: 0.75, len: 2.6 },
    ]
    if (!lite) s.push({ p: [TW / 2, TOP, TD / 2], yaw: Math.PI * 0.25, pitch: 1.0, len: 2.6 }, { p: [-TW / 2, TOP, -TD / 2], yaw: -Math.PI * 0.75, pitch: 1.0, len: 2.6 })
    return s
  }, [lite])
  return <>{spots.map((s, i) => <Cam key={i} {...s} i={i} lv={lv} />)}</>
}
function Cam({ p, yaw, pitch, len, i, lv }: { p: [number, number, number]; yaw: number; pitch: number; len: number; i: number; lv: Levels }) {
  const head = useRef<THREE.Group>(null)
  const coneMat = useRef<THREE.MeshBasicMaterial>(null)
  const bodyMat = useRef<THREE.MeshBasicMaterial>(null)
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(Math.tan(0.42) * len, len, 32, 1, true)
    g.translate(0, -len / 2, 0) // apex at origin, opening along -Y
    g.rotateX(-Math.PI / 2) // opening along +Z
    return g
  }, [len])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const k = lv.current.cctv
    if (head.current) head.current.rotation.set(pitch, yaw + Math.sin(t * 0.5 + i * 1.7) * 0.42, 0, 'YXZ')
    if (coneMat.current) coneMat.current.opacity = Math.max(0, k - 0.15) * 0.2
    if (bodyMat.current) bodyMat.current.color.copy(SIGNAL).multiplyScalar(0.35 + 0.9 * k)
  })
  return (
    <group position={p}>
      <group ref={head}>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.12, 0.1, 0.24]} />
          <meshBasicMaterial ref={bodyMat} toneMapped={false} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial ref={coneMat} color={SIGNAL} transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/** A glowing node with an expanding ring (readers, intercom, detectors, locks). */
function Node({ p, color, level, size = 0.09, ring = true, phase = 0, rate = 1, face = 'z' }: { p: [number, number, number]; color: THREE.Color; level: () => number; size?: number; ring?: boolean; phase?: number; rate?: number; face?: 'z' | 'x' | 'y' }) {
  const dot = useRef<THREE.MeshBasicMaterial>(null)
  const r = useRef<THREE.Mesh>(null)
  const rm = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    const k = level()
    const t = (clock.elapsedTime * rate + phase) % 1
    if (dot.current) { dot.current.color.copy(color).multiplyScalar(0.25 + 1.1 * k); dot.current.opacity = 0.35 + 0.65 * k }
    if (r.current) { const s = 1 + t * 3.2; r.current.scale.set(s, s, s) }
    if (rm.current) rm.current.opacity = (1 - t) * 0.8 * k
  })
  const rot: [number, number, number] = face === 'x' ? [0, Math.PI / 2, 0] : face === 'y' ? [-Math.PI / 2, 0, 0] : [0, 0, 0]
  return (
    <group position={p} rotation={rot}>
      <mesh>
        <circleGeometry args={[size, 20]} />
        <meshBasicMaterial ref={dot} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {ring ? (
        <mesh ref={r}>
          <ringGeometry args={[size * 1.1, size * 1.35, 32]} />
          <meshBasicMaterial ref={rm} color={color} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </group>
  )
}

function Systems({ lv, lite }: { lv: Levels; lite?: boolean }) {
  const fz = POD_D / 2 + 0.02
  const tz = TD / 2 + 0.02
  const tx = TW / 2 + 0.02
  // access readers: lobby doors, garage, and the elevator core on every 3rd floor (east facade marker)
  const access = useMemo(() => {
    const a: [number, number, number][] = [[-0.55, 0.55, fz], [0.55, 0.55, fz], [-POD_W / 2 + 0.5, 0.45, fz]]
    for (let f = 1; f < FLOORS; f += lite ? 4 : 3) a.push([tx, POD_H + f * FH + FH * 0.5, 0])
    return a
  }, [lite, fz, tx])
  // fire detectors: two per floor on the west facade
  const fire = useMemo(() => {
    const a: [number, number, number][] = []
    for (let f = 0; f < FLOORS; f += lite ? 2 : 1) a.push([-tx, POD_H + f * FH + FH * 0.5, -0.6], [-tx, POD_H + f * FH + FH * 0.5, 0.6])
    a.push([-POD_W / 2 - 0.02, 0.75, 0], [-POD_W / 2 - 0.02, 0.75, 1.1])
    return a
  }, [lite, tx])
  // smart locks: suite doors on the front facade
  const locks = useMemo(() => {
    const a: { p: [number, number, number]; ph: number }[] = []
    for (let f = 1; f < FLOORS; f += lite ? 3 : 2) for (let c = 0; c < 3; c++) a.push({ p: [(c - 1) * 0.72, POD_H + f * FH + FH * 0.5, tz], ph: ((f * 7 + c * 13) % 10) / 10 })
    return a
  }, [lite, tz])
  return (
    <group>
      {access.map((p, i) => <Node key={'a' + i} p={p} color={SIGNAL} face={p[0] === tx ? 'x' : 'z'} level={() => lv.current.access} phase={i * 0.17} rate={0.8} size={0.075} />)}
      {fire.map((p, i) => <Node key={'f' + i} p={p} color={ALARM} face="x" ring={i % 3 === 0} level={() => lv.current.fire} phase={i * 0.05} rate={1.1} size={0.055} />)}
      {locks.map((l, i) => <Node key={'s' + i} p={l.p} color={new THREE.Color('#7cf0c8')} level={() => lv.current.smart} phase={l.ph} rate={0.6} size={0.05} />)}
      {/* intercom at the main entrance: bigger beacon with fast rings */}
      <Node p={[0, 0.62, fz + 0.01]} color={SIGNAL} level={() => lv.current.intercom} size={0.12} rate={1.4} />
      <Node p={[0, 0.62, fz + 0.012]} color={SIGNAL} level={() => lv.current.intercom} size={0.12} rate={1.4} phase={0.5} />
    </group>
  )
}

/** Automatic door operators: two lobby door leaves that swing open when the layer is lit. */
function Doors({ lv }: { lv: Levels }) {
  const l = useRef<THREE.Group>(null)
  const r = useRef<THREE.Group>(null)
  const m = useRef<THREE.MeshBasicMaterial>(null)
  const open = useRef(0)
  useFrame(({ clock }, dt) => {
    const k = lv.current.doors
    const cyc = (Math.sin(clock.elapsedTime * 1.4) + 1) / 2
    open.current = damp(open.current, k > 0.5 ? cyc : 0, 5, Math.min(dt, 0.1))
    const a = open.current * 1.2
    if (l.current) l.current.rotation.y = -a
    if (r.current) r.current.rotation.y = a
    if (m.current) m.current.color.copy(SIGNAL).multiplyScalar(0.3 + k)
  })
  const z = POD_D / 2 + 0.02, w = 0.34, h = 0.72
  return (
    <group position={[0, 0, z]}>
      {[[-1, l], [1, r]].map(([s, ref], i) => (
        <group key={i} ref={ref as RefObject<THREE.Group>} position={[(s as number) * w, 0, 0]}>
          <mesh position={[-(s as number) * w / 2, h / 2, 0]}>
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial ref={i === 0 ? m : undefined} color={SIGNAL} transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Integration riser: a vertical line through the core with data pulses travelling up and down. */
function Riser({ lv, lite }: { lv: Levels; lite?: boolean }) {
  const n = lite ? 4 : 7
  const pulses = useRef<THREE.InstancedMesh>(null)
  const lineMat = useRef<THREE.LineBasicMaterial>(null)
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0, TOP + 0.4, 0)]), [])
  const busGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-POD_W / 2, 0.02, POD_D / 2), new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(POD_W / 2, 0.02, POD_D / 2), new THREE.Vector3(0, 0.02, 0),
    new THREE.Vector3(-POD_W / 2, 0.02, -POD_D / 2), new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(POD_W / 2, 0.02, -POD_D / 2), new THREE.Vector3(0, 0.02, 0),
  ]), [])
  useFrame(({ clock }) => {
    const k = Math.max(lv.current.integrated, 0.25)
    const m = pulses.current; if (!m) return
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      const t = (clock.elapsedTime * 0.28 + i / n) % 1
      const y = (i % 2 ? 1 - t : t) * (TOP + 0.3)
      const s = 0.6 + k
      o.position.set(0, y, 0); o.scale.set(s, s, s); o.updateMatrix(); m.setMatrixAt(i, o.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    if (lineMat.current) lineMat.current.opacity = 0.2 + 0.7 * lv.current.integrated
    ;(m.material as THREE.MeshBasicMaterial).opacity = 0.25 + 0.75 * lv.current.integrated
  })
  return (
    <group>
      <lineSegments geometry={geo}><lineBasicMaterial ref={lineMat} color={SIGNAL} transparent opacity={0.4} /></lineSegments>
      <lineSegments geometry={busGeo}><lineBasicMaterial color={SIGNAL} transparent opacity={0.25} /></lineSegments>
      <instancedMesh ref={pulses} args={[undefined, undefined, n]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#cfe6ff" transparent toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

function Ground() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(36, 36, '#1d4673', '#12304f')
    const m = g.material as THREE.LineBasicMaterial
    m.transparent = true; m.opacity = 0.55
    return g
  }, [])
  return (
    <group>
      <primitive object={grid} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[18, 48]} />
        <meshBasicMaterial color="#071322" />
      </mesh>
    </group>
  )
}

function Rig({ progress, input, still }: { progress: MutableRefObject<number>; input: MutableRefObject<HeroInput>; still?: boolean }) {
  const { camera, size } = useThree()
  const s = useRef({ yaw: 0.62, x: 0, y: 0, p: 0.5 })
  useFrame(({ clock }, dt) => {
    const d = Math.min(dt, 0.1)
    const c = s.current
    const t = still ? 0 : clock.elapsedTime
    c.x = damp(c.x, input.current.x, 2.5, d)
    c.y = damp(c.y, input.current.y, 2.5, d)
    c.p = damp(c.p, progress.current, 6, d)
    const aspect = size.width / size.height
    const yaw = 0.62 + t * 0.06 + c.x * 0.35 + input.current.drag + input.current.tilt * 0.3 + (c.p - 0.5) * 0.9
    // keep the whole tower in frame at any aspect: back off when the canvas is narrow
    const phone = size.width < 700
    const r = (phone ? 16.5 + Math.max(0, 1 - aspect) * 10 : 21.5 + Math.max(0, 1 - aspect) * 12) - (c.p - 0.5) * 6
    const h = 7.2 + c.y * -1.4 + (c.p - 0.5) * 2.6
    camera.position.set(Math.sin(yaw) * r, h, Math.cos(yaw) * r)
    camera.lookAt(0, phone ? 2.9 : 3.5, 0)
  })
  return null
}

function Loop({ active, onReady, onPerfFail, still }: { active: boolean; onReady: () => void; onPerfFail: () => void; still?: boolean }) {
  const { invalidate } = useThree()
  const frames = useRef(0)
  const t0 = useRef(0)
  const told = useRef(false)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const loop = () => { invalidate(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active, invalidate])
  useFrame(() => {
    frames.current++
    if (frames.current === 2 && !told.current) { told.current = true; onReady() }
    if (still) return
    const now = performance.now()
    if (frames.current === 10) t0.current = now
    if (frames.current === 70 && t0.current) {
      const avg = (now - t0.current) / 60
      if (avg > 60) onPerfFail()
    }
  })
  return null
}

function Scene({ layer, progress, input, lite, still, start }: Omit<Props, 'active' | 'onReady' | 'onPerfFail'> & { start: MutableRefObject<number> }) {
  const lv = useLevels(layer)
  return (
    <>
      <color attach="background" args={['#050c17']} />
      <fog attach="fog" args={['#050c17', 22, 46]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 12, 8]} intensity={1.6} color="#bcd8ff" />
      <directionalLight position={[-8, 4, -6]} intensity={0.7} color="#3d78c2" />
      <Ground />
      <Building start={start} still={still} lite={lite} lv={lv} />
      <Cameras lv={lv} lite={lite} />
      <Systems lv={lv} lite={lite} />
      <Doors lv={lv} />
      <Riser lv={lv} lite={lite} />
      <Rig progress={progress} input={input} still={still} />
    </>
  )
}

export default function SystemsTower({ active, layer, progress, input, lite, still, onReady, onPerfFail }: Props) {
  const start = useRef(0)
  return (
    <Canvas
      frameloop="demand"
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 34, near: 0.5, far: 90, position: [12, 7, 17] }}
      onCreated={({ clock }) => { start.current = clock.elapsedTime + 0.15 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene layer={layer} progress={progress} input={input} lite={lite} still={still} start={start} />
      <Loop active={active} onReady={onReady} onPerfFail={onPerfFail} still={still} />
    </Canvas>
  )
}
