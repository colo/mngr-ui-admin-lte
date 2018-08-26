<template>
  <component
    :is="type+'-wrapper'"
    :id="id"
    :EventBus="EventBus"
    :chart="chart"
    :stat="stat"
  />
  </component>
</template>

<script>

import dygraphWrapper from 'components/charts/wrappers/dygraph'

import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  name: 'chart',

  components: {
    dygraphWrapper
  },

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    chart: {
      type: [Object],
      default: () => ({})
    },
    stat: {
      type: [Object],
      default: () => ({})
    },
    type:{
      type: [String],
      default: 'dygraph'
    },
    id:{
      type: [String],
      default: ''
    }
  },

  data () {
    return {
      tabular: {lastupdate: 0, 'data': [[]] },
    }
  },

  // created () {
  //   this.__watcher()
  // },
  // mounted () {
  //   this.__watcher()
  // },
  // methods: {
  //   __watcher (){
  //     this.$watch('stat.data', function (val, old) {
  //       if(val.length > 1){
  //
  //         if(this.$options.graph == null){
  //
  //           this.__create_dygraph()
  //
  //         }
  //         // this.__create_dygraph()
  //         //
  //         // unwatch()
  //         this.update()
  //       }
  //
  //     })
  //   },
  //
  // }
}
</script>
