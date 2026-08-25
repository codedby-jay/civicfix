import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRevealVariants } from '@/lib/motion'

export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const variants = useRevealVariants()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
