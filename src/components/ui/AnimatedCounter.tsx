'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  separator?: boolean
}

export function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '', separator = true }: Props) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [visible, target, duration])

  const formatted = separator ? count.toLocaleString('en-IN') : count.toString()

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
