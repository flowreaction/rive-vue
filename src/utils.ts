import { onUnmounted, onMounted, ref } from 'vue';
// import { Dimensions } from './types';

export function useWindowSize() {
  const width = ref(0);
  const height = ref(0);

  const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { width, height };
}
