<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { EventType, Rive } from '@rive-app/webgl';
import { UseRiveParameters, UseRiveOptions, Dimensions } from '../types';
import { useWindowSize } from '../utils';
import { computed } from '@vue/reactivity';

/**
 * Props definition
 *
 */
const props = defineProps<{
  riveParams?: UseRiveParameters;
  options?: Partial<UseRiveOptions>;
}>();

/**
 * Emit defintions
 */
const emit = defineEmits(['riveIsLoaded']);

/**
 * Template Refs
 */
const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLElement | null>(null);

/**
 * Reactive variables
 */
const { width: wWidth, height: wHeight } = useWindowSize();
const riveIsLoaded = ref(false);

let RiveInstance: Rive | null = null;

// const rive = ref<Rive | null>(null);
const dimensions = ref<Dimensions>({
  width: 0,
  height: 0,
});
const containerStyle = ref({
  width: `100%`,
  height: `100%`,
});
const animations = computed(() => {
  return props.riveParams?.animations;
});

/**
 * Computed Rive Options
 */
const options = computed(() => {
  return Object.assign({}, defaultOptions, props.options);
});

/**
 * Default Rive options will be overwritten if options are passed in
 */
const defaultOptions = {
  useDevicePixelRatio: true,
  fitCanvasToArtboardHeight: false,
  useOffscreenRenderer: true,
};

/**
 * Watches windowsize(height and width) and updates the canvas dimensions
 */
watchEffect(() => {
  if (canvas.value && container.value && wWidth.value && wHeight.value) {
    const { width, height } = getCanvasDimensions();
    const boundsChanged =
      width !== dimensions.value.width || height !== dimensions.value.height;
    if (
      canvas.value &&
      container.value &&
      riveIsLoaded.value &&
      boundsChanged
    ) {
      if (options.value.fitCanvasToArtboardHeight) {
        container.value.style.height = `${height}px`;
      }
      if (options.value.useDevicePixelRatio) {
        const dpr = 2;
        canvas.value.width = dpr * width;
        canvas.value.height = dpr * height;
        canvas.value.style.width = width + 'px';
        canvas.value.style.height = height + 'px';
      } else {
        canvas.value.width = width;
        canvas.value.height = height;
      }
      dimensions.value = { width, height };
      RiveInstance?.startRendering();
    }
    if (RiveInstance) {
      RiveInstance.resizeToCanvas();
    }
  }
});

/**
 * watches props.animations and updates the Rive instance
 */
watch(animations, () => {
  if (RiveInstance && animations.value) {
    RiveInstance.stop(RiveInstance.animationNames);
    RiveInstance.play(animations.value);
  }
});

/**
 * Set up IntersectionObserver to stop rendering if the animation is not in
 * view.
 */
//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       entry.isIntersecting
//         ? rive && rive.startRendering()
//         : rive && rive.stopRendering();
//     });

//     if (canvasRef.current) {
//       observer.observe(canvasRef.current);
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, [rive]);

/**
 * gets dimensions of container returns width and height
 */
function getCanvasDimensions() {
  const { width, height } =
    container.value?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);
  if (RiveInstance && options.value.fitCanvasToArtboardHeight) {
    const { maxY, maxX } = RiveInstance.bounds;
    return { width, height: width * (maxY / maxX) };
  }
  return { width, height };
}

/**
 * onMounted initializes the Rive instance
 */
onMounted(() => {
  if (canvas.value) {
    const { useOffscreenRenderer } = options.value;
    const r = new Rive({
      useOffscreenRenderer,
      ...props.riveParams,
      canvas: canvas.value,
    });
    r.on(EventType.Load, () => {
      RiveInstance = r;
      riveIsLoaded.value = true;
      emit('riveIsLoaded', r);
    });
  }
});

onUnmounted(() => {
  if (RiveInstance) {
    RiveInstance.stopRendering();
    Object.assign(RiveInstance, null);
  }
});

defineExpose({
  RiveInstance,
});
</script>

<template>
  <div ref="container">
    <canvas ref="canvas" style="vertical-align: top"></canvas>
  </div>
</template>

<style scoped>
div {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
