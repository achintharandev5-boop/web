import { createRoot, extend, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import {
  AmbientLight, BufferGeometry, CapsuleGeometry, DirectionalLight, Float32BufferAttribute, Group,
  IcosahedronGeometry, InstancedMesh, LineBasicMaterial, LineSegments, MathUtils, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, QuadraticBezierCurve3, SphereGeometry, TorusGeometry, Vector3, WebGLRenderer,
} from 'three'
import { SceneBoundary } from './SolutionArtwork'

extend({ AmbientLight, CapsuleGeometry, DirectionalLight, Group, IcosahedronGeometry, InstancedMesh, LineBasicMaterial,
  LineSegments, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, TorusGeometry })

interface SceneProps {
  managed: boolean
  compact: boolean
  loop: 'always' | 'demand' | 'never'
  pointer: RefObject<{ x: number; y: number; active: boolean }>
  onReady: (ready: boolean) => void
  onFailure: (failed: boolean) => void
}

function Scene({ managed, compact, pointer, onReady }: Omit<SceneProps, 'loop' | 'onFailure'>) {
  const rig = useRef<Group>(null)
  const core = useRef<Group>(null)
  const signals = useRef<InstancedMesh>(null)
  const viewport = useThree(state => state.viewport)
  const time = useRef(0)
  const hover = useRef({ x: 0, y: 0, strength: 0 })
  const initialized = useRef(false)
  const marker = useMemo(() => new Object3D(), [])
  const points = useMemo(() => {
    const count = compact ? 6 : 10
    return Array.from({ length: count }, (_, i) => {
      const angle = i * Math.PI * 2 / count
      return new Vector3(Math.cos(angle) * 2.7, Math.sin(angle) * (managed ? 1.43 : 1.56), Math.sin(angle * 2) * 0.65)
    })
  }, [compact, managed])
  const { geometry, curves } = useMemo(() => {
    const origin = new Vector3()
    const curves = points.map((point, i) => new QuadraticBezierCurve3(
      origin, point.clone().multiplyScalar(0.64).add(new Vector3(0, (i % 2 ? 1 : -1) * 0.45, 0.33)), point,
    ))
    const vertices: number[] = []
    for (const curve of curves) {
      const path = curve.getPoints(14)
      for (let i = 1; i < path.length; i++) vertices.push(...path[i - 1].toArray(), ...path[i].toArray())
    }
    return { curves, geometry: new BufferGeometry().setAttribute('position', new Float32BufferAttribute(vertices, 3)) }
  }, [points])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ frameloop }, delta) => {
    if (!rig.current || !core.current || !signals.current) return
    const frame = frameloop === 'always' ? Math.min(delta, 0.04) : 0
    time.current += frame
    const cursor = pointer.current
    const active = !compact && cursor?.active === true
    if (active) {
      hover.current.x = MathUtils.damp(hover.current.x, cursor.x, 7, frame)
      hover.current.y = MathUtils.damp(hover.current.y, cursor.y, 7, frame)
    }
    hover.current.strength = MathUtils.damp(hover.current.strength, active ? 1 : 0, 5, frame)
    rig.current.rotation.x = MathUtils.damp(rig.current.rotation.x, active ? -cursor.y * 0.12 : 0, 4, frame)
    rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, active ? cursor.x * 0.18 : 0, 4, frame)
    rig.current.rotation.z = 0.07 * Math.sin(time.current * 0.48)
    core.current.rotation.y = managed ? Math.sin(time.current * 0.42) * 0.2 : time.current * 0.37
    core.current.position.y = Math.sin(time.current * 1.1) * 0.085
    points.forEach((point, index) => {
      marker.position.copy(point)
      const distance = Math.hypot(point.x - hover.current.x * 3, point.y - hover.current.y * 1.7)
      const highlight = Math.max(0, 1 - distance) * hover.current.strength * 0.042
      marker.scale.setScalar(0.062 + highlight + Math.sin(time.current * 1.3 + index) * 0.009)
      marker.updateMatrix()
      signals.current!.setMatrixAt(index * 2, marker.matrix)
      const progress = (time.current * (managed ? 0.22 : 0.15) + index * 0.16) % 1
      curves[index].getPoint(managed ? 1 - progress : progress, marker.position)
      marker.scale.setScalar(0.033)
      marker.updateMatrix()
      signals.current!.setMatrixAt(index * 2 + 1, marker.matrix)
    })
    signals.current.instanceMatrix.needsUpdate = true
    if (!initialized.current) {
      initialized.current = true
      onReady(true)
    }
  })

  const scale = Math.min(viewport.width / 6.55, viewport.height / 4)
  return <>
    <ambientLight intensity={1.4} />
    <directionalLight position={[3, 4, 6]} intensity={3.0} />
    <directionalLight position={[-3, 1, -4]} intensity={3.4} color="#a4b4cd" />
    <group ref={rig} scale={scale}>
      <lineSegments><primitive attach="geometry" object={geometry} /><lineBasicMaterial color="#9ba6b7" opacity={0.48} transparent depthWrite={false} /></lineSegments>
      <instancedMesh key={points.length} ref={signals} args={[undefined, undefined, points.length * 2]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#dce4f0" />
      </instancedMesh>
      <group ref={core}>
        {managed ? [-0.59, 0, 0.59].map((x, index) => <group key={x} position={[x, index === 1 ? 0.12 : -0.08, index === 1 ? 0.24 : -0.07]} scale={index === 1 ? 1 : 0.82}>
          <mesh position={[0, 0.31, 0]}><sphereGeometry args={[0.235, 24, 14]} /><meshStandardMaterial color="#cad1dc" metalness={0.46} roughness={0.31} /></mesh>
          <mesh position={[0, -0.29, 0]} scale={[1.26, 1.08, 0.72]}><capsuleGeometry args={[0.32, 0.25, 6, 16]} /><meshStandardMaterial color="#7c8798" metalness={0.42} roughness={0.36} /></mesh>
        </group>) : <>
          <mesh rotation={[0.28, 0.3, 0.16]}><icosahedronGeometry args={[0.82, 0]} /><meshStandardMaterial color="#acb9cb" metalness={0.52} roughness={0.32} flatShading /></mesh>
          <mesh rotation={[0.28, 0.3, 0.16]}><icosahedronGeometry args={[0.97, 0]} /><meshBasicMaterial color="#dce4ef" wireframe opacity={0.5} transparent /></mesh>
        </>}
      </group>
      <mesh rotation={[managed ? -0.34 : 0.37, managed ? 0.22 : -0.22, 0.2]}>
        <torusGeometry args={[managed ? 1.35 : 1.17, 0.009, 5, 72]} /><meshBasicMaterial color="#a9b4c6" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[0.35, -0.32, -0.2]} scale={[1, 0.66, 1]}>
        <torusGeometry args={[2.48, 0.007, 5, 80]} /><meshBasicMaterial color="#8492a6" transparent opacity={0.43} />
      </mesh>
    </group>
  </>
}

export default function SolutionScene({ compact, managed, loop, pointer, onReady, onFailure }: SceneProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const root = useRef<ReturnType<typeof createRoot<HTMLCanvasElement>>>()
  const store = useRef<ReturnType<NonNullable<typeof root.current>['render']>>()

  useEffect(() => {
    const element = canvas.current
    const container = element?.parentElement
    if (!element || !container || !('ResizeObserver' in window)) {
      onFailure(true)
      return
    }
    const attributes = { alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true } as const
    let renderer: WebGLRenderer
    try {
      const context = element.getContext('webgl2', attributes) as WebGL2RenderingContext | null
      if (!context) {
        onFailure(true)
        return
      }
      renderer = new WebGLRenderer({ canvas: element, context, ...attributes })
    } catch {
      onFailure(true)
      return
    }
    const lost = () => onFailure(true)
    renderer.debug.onShaderError = lost
    element.addEventListener('webglcontextlost', lost)
    const sceneRoot = createRoot(element).configure({
      gl: renderer,
      camera: { fov: 38, position: [0, 0, 7.5], near: 0.1, far: 24 },
      frameloop: 'never',
      size: { width: container.clientWidth, height: container.clientHeight, top: 0, left: 0 },
    })
    root.current = sceneRoot
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width && height) store.current?.getState().setSize(width, height)
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      element.removeEventListener('webglcontextlost', lost)
      sceneRoot.unmount()
      renderer.dispose()
      root.current = undefined
      store.current = undefined
      onReady(false)
    }
  }, [onFailure, onReady])

  useEffect(() => {
    if (!root.current) return
    store.current = root.current.render(<SceneBoundary onFailure={() => onFailure(true)}>
      <Scene compact={compact} managed={managed} pointer={pointer} onReady={onReady} />
    </SceneBoundary>)
    store.current.getState().setDpr(compact ? 1 : [1, 1.5])
  }, [compact, managed, onFailure, onReady, pointer])

  useEffect(() => {
    store.current?.getState().setFrameloop(loop)
  }, [loop])

  return <canvas ref={canvas} />
}
