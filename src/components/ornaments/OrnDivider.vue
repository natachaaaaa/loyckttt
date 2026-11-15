<script setup>
// Section divider: an eye in the middle, thorned vines with curling tendrils on each side, dotwork trailing off.
// Geometry is generated once (deterministic), mirrored for the right side.
defineProps({ blok: Object })

const W = 1000
const CY = 45

function side() {
  const vine = []
  const thorns = []
  const curls = []
  const start = 432
  const end = 60
  for (let x = start, i = 0; x >= end; x -= 8, i++) {
    const d = start - x
    const taper = 1 - d / (start - end) / 2
    vine.push([x, CY + Math.sin(d * 0.04) * 7 * taper])
  }
  // Thorns: short spikes alternating up/down, leaning away from the eye.
  vine.forEach(([x, y], i) => {
    if (i % 4 !== 2) return
    const up = i % 8 === 2 ? -1 : 1
    const len = 10 * (1 - i / vine.length / 1.5)
    thorns.push(`M${x + 3} ${y} L${x - len * 0.6} ${y + up * len} L${x - 3} ${y}`)
  })
  // Tendrils: a spiral leaving the vine at a few points.
  for (const i of [9, 23, 37]) {
    const [x, y] = vine[i]
    const dir = i % 2 ? 1 : -1
    const pts = []
    for (let k = 0; k <= 22; k++) {
      const a = -Math.PI / 2 * dir + k * 0.42 * dir
      const r = 13 * (1 - k / 26)
      pts.push(`${(x - 8 + Math.cos(a) * r).toFixed(1)} ${(y + dir * 14 + Math.sin(a) * r * dir).toFixed(1)}`)
    }
    curls.push(`M${x} ${y} L${pts.join(' L')}`)
  }
  const last = vine[vine.length - 1]
  const dots = [0, 1, 2, 3, 4].map((k) => [last[0] - 12 - k * 11, last[1], 2.2 - k * 0.38])
  return { vine: 'M' + vine.map((p) => p.join(' ')).join(' L'), thorns, curls, dots }
}

const left = side()
// Upper lid, as a quadratic, to place the lashes on it.
const lid = (t) => [
  (1 - t) ** 2 * 440 + 2 * (1 - t) * t * 500 + t ** 2 * 560,
  (1 - t) ** 2 * CY + 2 * (1 - t) * t * 3 + t ** 2 * CY,
]
const lashes = [0.2, 0.32, 0.44, 0.56, 0.68, 0.8].map((t) => {
  const [x, y] = lid(t)
  const nx = (x - 500) / 60
  return `M${x} ${y + 3} L${x + nx * 7} ${y - 6}`
})
</script>

<template>
  <div v-draw v-editable="blok" class="divider" aria-hidden="true">
    <svg :viewBox="`0 0 ${W} 90`" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <g v-for="mirror in [false, true]" :key="mirror" :transform="mirror ? `translate(${W} 0) scale(-1 1)` : undefined">
        <path :d="left.vine" stroke-width="1.6" />
        <path v-for="t in left.thorns" :key="t" :d="t" stroke-width="1.1" />
        <path v-for="c in left.curls" :key="c" :d="c" stroke-width="1" />
        <circle v-for="d in left.dots" :key="d[0]" class="dot" :cx="d[0]" :cy="d[1]" :r="d[2]" fill="currentColor" stroke="none" />
      </g>
      <path d="M440 45 Q500 3 560 45 Q500 87 440 45 Z" stroke-width="1.6" />
      <path v-for="l in lashes" :key="l" :d="l" stroke-width="1" />
      <circle cx="500" cy="45" r="14" stroke-width="1.2" />
      <circle class="dot" cx="500" cy="45" r="6" fill="currentColor" stroke="none" />
      <circle class="dot" cx="500" cy="73" r="1.6" fill="currentColor" stroke="none" />
      <circle class="dot" cx="500" cy="81" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  </div>
</template>

<style scoped>
.divider {
  color: var(--bone);
  width: min(100% - 2 * var(--gutter), 960px);
  margin: clamp(3rem, 7vw, 7rem) auto;
}

.divider svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.divider :deep(path),
.divider :deep(circle) {
  vector-effect: non-scaling-stroke;
}
</style>
