'use client'

import {
  Children,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react'

type HorizontalCarouselProps = {
  children: ReactNode
  label: string
  trackClassName: string
}

export function HorizontalCarousel({ children, label, trackClassName }: HorizontalCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, moved: false, pointerId: -1, startX: 0, scrollLeft: 0 })
  const suppressClickRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const itemCount = Children.count(children)

  const scrollToItem = (index: number) => {
    const track = trackRef.current
    if (!track) return

    const nextIndex = Math.max(0, Math.min(index, itemCount - 1))
    const item = track.children.item(nextIndex) as HTMLElement | null
    if (!item) return

    const paddingLeft = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: item.offsetLeft - track.offsetLeft - paddingLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    setActiveIndex(nextIndex)
  }

  const updateActiveItem = () => {
    const track = trackRef.current
    if (!track) return

    const trackCenter = track.scrollLeft + track.clientWidth / 2
    const items = Array.from(track.children) as HTMLElement[]
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft - track.offsetLeft + item.offsetWidth / 2
      const distance = Math.abs(itemCenter - trackCenter)
      if (distance < closestDistance) {
        closestIndex = index
        closestDistance = distance
      }
    })

    setActiveIndex(closestIndex)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToItem(activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToItem(activeIndex + 1)
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const track = trackRef.current
    if (!track) return

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const drag = dragRef.current
    if (!track || !drag.active || drag.pointerId !== event.pointerId) return

    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 6 && !drag.moved) {
      drag.moved = true
      suppressClickRef.current = true
      // Só agora vale capturar: o gesto virou arrasto, e o clique já não é do link.
      track.setPointerCapture(event.pointerId)
    }
    if (!drag.moved) return

    event.preventDefault()
    track.scrollLeft = drag.scrollLeft - distance
  }

  const finishPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
    dragRef.current.active = false
    setIsDragging(false)
  }

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  return (
    <div className="mobile-carousel" role="region" aria-label={label}>
      <div
        className={`${trackClassName}${isDragging ? ' is-dragging' : ''}`}
        ref={trackRef}
        tabIndex={0}
        onScroll={updateActiveItem}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
        onClickCapture={handleClickCapture}
      >
        {children}
      </div>
      <div className="mobile-carousel__controls">
        <div
          className="mobile-carousel__progress"
          role="progressbar"
          aria-label={`Posição em ${label}`}
          aria-valuemin={1}
          aria-valuemax={itemCount}
          aria-valuenow={activeIndex + 1}
          style={{ '--carousel-progress': (activeIndex + 1) / itemCount } as CSSProperties}
        >
          <span />
        </div>
      </div>
    </div>
  )
}
