import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin signal-blue reading-progress line pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 })
  return <motion.div aria-hidden className="ax-progress" style={{ scaleX: x }} />
}
