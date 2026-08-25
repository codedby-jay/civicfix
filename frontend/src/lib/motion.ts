import { useReducedMotion, type Variants } from 'framer-motion'

export function useRevealVariants(): Variants {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    }
  }

  return {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

export function useStaggerContainer(): Variants {
  const reduceMotion = useReducedMotion()

  return {
    hidden: {},
    visible: {
      transition: reduceMotion ? {} : { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  }
}
