// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'

// 仙尘光标
function fairyDustCursor(isStart: boolean) {
  const possibleColors = ['#D61C59', '#E7D84B', '#1B8798']
  let width = window.innerWidth
  let height = window.innerHeight
  const cursor = { x: width / 2, y: width / 2 }
  const particles = []

  function init() {
    if (isStart) {
      bindEvents()
      loop()
    } else {
      unbindEvents()
      // 清理所有粒子
      const container = document.querySelector('.js-cursor-container')
      if (container) {
        container.innerHTML = ''
      }
    }
  }

  function onWindowResize() {
    width = window.innerWidth
    height = window.innerHeight
  }

  function onMouseMove(e: MouseEvent) {
    cursor.x = e.clientX
    cursor.y = e.clientY

    addParticle(
      cursor.x,
      cursor.y,
      possibleColors[Math.floor(Math.random() * possibleColors.length)]
    )
  }

  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onWindowResize)
  }

  function unbindEvents() {
    document.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onWindowResize)
  }

  function addParticle(x: number, y: number, color: string) {
    const particle = new Particle()
    particle.init(x, y, color)
    particles.push(particle)
  }

  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles[i].die()
        particles.splice(i, 1)
      }
    }
  }

  function loop() {
    requestAnimationFrame(loop)
    updateParticles()
  }

  function Particle() {
    this.character = '*'
    this.lifeSpan = 120
    this.initialStyles = {
      position: 'fixed',
      display: 'inline-block',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      'touch-action': 'none',
      'z-index': '10000000',
      fontSize: '25px',
      'will-change': 'transform',
    }

    this.init = function (x: number, y: number, color: string) {
      this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1,
      }

      this.position = { x: x + 10, y: y + 10 }
      this.initialStyles.color = color

      this.element = document.createElement('span')
      this.element.innerHTML = this.character
      applyProperties(this.element, this.initialStyles)
      this.update()

      const container = document.querySelector('.js-cursor-container')
      if (container) {
        container.appendChild(this.element)
      }
    }

    this.update = function () {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.lifeSpan--

      this.element.style.transform = `translate3d(${this.position.x}px,${this.position.y}px, 0) scale(${this.lifeSpan / 120})`
    }

    this.die = function () {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
    }
  }

  function applyProperties(target: HTMLElement, properties: Record<string, string>) {
    for (const key in properties) {
      target.style[key] = properties[key]
    }
  }

  // 使用现代触摸检测API
  if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) init()
}

export default function FairyDustCursor({ isEnabled }: { isEnabled: boolean }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // 先清理现有的容器和效果
    const existingContainer = document.querySelector('.js-cursor-container')
    if (existingContainer) {
      existingContainer.remove()
    }
    fairyDustCursor(false)

    // 如果需要启用，创建新容器并初始化
    if (isEnabled) {
      const container = document.createElement('div')
      container.className = 'js-cursor-container'
      document.body.appendChild(container)
      fairyDustCursor(true)
    }

    return () => {
      // 清理
      const container = document.querySelector('.js-cursor-container')
      if (container) {
        container.remove()
      }
      fairyDustCursor(false)
    }
  }, [isEnabled, isMounted])

  // 只在客户端渲染
  if (!isMounted) {
    return null
  }

  return null
}
