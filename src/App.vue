<template>
  <div id="q-app">
    <!-- <router-view :EventBus="EventBus" :class="($q.loading.active) ? 'invisible' : 'visible'"  /> -->
    <router-view :EventBus="EventBus"/>
  </div>
</template>

<script>
/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
import Vue from 'vue'
export const EventBus = new Vue();


export default {
  name: 'App',
  data () {
    return {
      EventBus : EventBus
    }
  },

  
}
</script>

<style>
</style>
