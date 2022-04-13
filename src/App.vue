<script setup lang="ts">
import { ref } from 'vue';
import Rive from './components/Rive.vue';
import useStateMachineInput from './components/useStateMachineInput';
import { useWindowSize } from './utils';
import { Layout, Fit, Alignment } from '@rive-app/webgl';
import { StateMachineInput } from '@rive-app/webgl';
// import { StateMachineInput } from '@rive-app/webgl';

let rive = null;
let agreeInput: StateMachineInput | null = null;
let disagreeInput: StateMachineInput | null = null;

const riveComp = ref();

const riveParams = {
  src: 'https://public.rive.app/community/runtime-files/2396-4820-animated-head.riv',
  autoplay: true,
  stateMachines: 'default',
  layout: new Layout({
    fit: Fit.Contain,
    alignment: Alignment.Center,
  }),
};
const riveOptions = {
  //   defaults
  //   useDevicePixelRatio: true,
  //   fitCanvasToArtboardHeight: false,
  //   useOffscreenRenderer: true,
};

function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

const riveHandler = (riveInstance) => {
  rive = riveInstance;
  console.log('parent rive instance', rive);
  agreeInput = useStateMachineInput(rive, 'default', 'agree');
  disagreeInput = useStateMachineInput(rive, 'default', 'disagree');
};

const clickHandler = () => {
  console.log('clickHandler');
  if (disagreeInput) {
    disagreeInput.fire();
  }
};
</script>

<template>
  <div id="parentcontainer">
    <h1>Rive Example</h1>
    <Rive
      @click="clickHandler"
      @rive-is-loaded="riveHandler"
      id="rive"
      ref="riveComp"
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
