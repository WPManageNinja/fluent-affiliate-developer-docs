import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DocsHome from './components/DocsHome.vue'
import Mermaid from './components/Mermaid.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {}),
  enhanceApp({ app, router }) {
    app.component('DocsHome', DocsHome)
    app.component('Mermaid', Mermaid)

    if (typeof window === 'undefined') {
      return
    }

    let zoomedNode: HTMLElement | null = null

    const handleDiagramClick = (event: Event) => {
      const node = event.currentTarget as HTMLElement

      if (!node) {
        return
      }

      if (zoomedNode && zoomedNode !== node) {
        zoomedNode.classList.remove('zoomed')
      }

      node.classList.toggle('zoomed')
      zoomedNode = node.classList.contains('zoomed') ? node : null
      document.body.style.overflow = zoomedNode ? 'hidden' : ''
    }

    const wireMermaidZoom = () => {
      window.setTimeout(() => {
        document.querySelectorAll<HTMLElement>('.mermaid').forEach((node) => {
          if (node.dataset.zoomReady === 'true') {
            return
          }

          node.dataset.zoomReady = 'true'
          node.title = 'Click to zoom'
          node.addEventListener('click', handleDiagramClick)
        })
      }, 250)
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !zoomedNode) {
        return
      }

      zoomedNode.classList.remove('zoomed')
      zoomedNode = null
      document.body.style.overflow = ''
    })

    if (router) {
      router.onAfterRouteChanged = () => {
        wireMermaidZoom()
      }
    }

    wireMermaidZoom()
  },
} satisfies Theme
