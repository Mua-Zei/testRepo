<template>
  <div class="home">
    <canvas ref="canvas" class="snow-canvas"></canvas>
    <h1>Home</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

interface Snowflake {
  x: number;
  y: number;
  r: number;
  vy: number;
  alpha: number;
}

export default defineComponent({
  name: 'Home',
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const flakes: Snowflake[] = [];
    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;

    const createFlake = (x: number, y: number) => {
      flakes.push({
        x,
        y,
        r: Math.random() * 3 + 1,
        vy: Math.random() * 1 + 0.5,
        alpha: Math.random() * 0.5 + 0.5
      });
    };

    const update = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];
        f.y += f.vy;
        if (f.y > height) {
          flakes.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
      requestAnimationFrame(update);
    };

    onMounted(() => {
      if (canvas.value) {
        ctx = canvas.value.getContext('2d');
        const resize = () => {
          width = window.innerWidth;
          height = window.innerHeight;
          canvas.value!.width = width;
          canvas.value!.height = height;
        };
        resize();
        window.addEventListener('resize', resize);
        canvas.value.addEventListener('mousemove', (e) => {
          for (let i = 0; i < 5; i++) {
            createFlake(e.clientX, e.clientY);
          }
        });
        update();
      }
    });

    return { canvas };
  }
});
</script>

<style scoped>
.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
}
.snow-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
