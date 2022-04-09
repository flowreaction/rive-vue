<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUpdate,
  watch,
  computed,
  watchEffect,
  reactive,
} from 'vue';
import VRive from './components/VRive.vue';
import useStateMachineInput from './components/useStateMachineInput';
import { useWindowSize } from './utils';

const canvas = ref();
const size = useWindowSize();
let agreeInput = null;
const riveParams = {
  src: 'https://public.rive.app/community/runtime-files/2396-4820-animated-head.riv',
  autoplay: true,
  stateMachines: 'default',
  //   animations: 'idlePreview',
  //   layout: new Layout({
  //     fit: Fit.Cover,
  //     alignment: Alignment.TopCenter,
  //   }),
  //   onLoad: () => {
  //     console.log('loaded and playing', canvas.value.rive);
  //   },
};

watch(canvas, () => {
  console.log('canvas changed', canvas.value.RiveInstance);
  agreeInput = useStateMachineInput(
    canvas.value.RiveInstance,
    'default',
    'agree'
  );
});

const riveOptions = {
  //   fitCanvasToArtboardHeight: true,
  //   useOffscreenRenderer: true,
};
</script>

<template>
  <div id="parentcontainer">
    <h1>Rive Example</h1>
    <VRive
      id="rive"
      ref="canvas"
      :rive-params="riveParams"
      :rive-options="riveOptions"
    />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#rive {
}
#parentcontainer {
  width: 70vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
