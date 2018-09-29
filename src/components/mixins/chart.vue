<template>

  <component
    v-observe-visibility="visibilityChanged"
    :is="type+'-wrapper'"
    :id="id"
    :ref="id"
    :EventBus="EventBus"
    :chart="chart"
    :stat="tabular"
    v-bind="wrapper_props"
  />
  </component>

</template>

<script>

import dygraphWrapper from 'components/wrappers/dygraph'
import vueEasyPieChartWrapper from 'components/wrappers/vueEasyPieChart'
import jqueryKnobWrapper from 'components/wrappers/jqueryKnob'
import highchartsVueWrapper from 'components/wrappers/highchartsVue'

export default {

  components: {
    dygraphWrapper,
    vueEasyPieChartWrapper,
    jqueryKnobWrapper,
    highchartsVueWrapper
  },


  __unwatcher: undefined,
  __chart_init: false,
  visible: true,
  data: [],

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
    },
    wrapper_props: {
      type: [Object],
      default: () => ({})
    },
    merged: {
      type: [Boolean],
      default: false
    }
  },

  data () {
    return {
      tabular: {lastupdate: 0, 'data': [[]] },
    }
  },

  created () {
    this.create()
  },
  // mounted () {
  //   this.create()
  // },
  // updated () {
  //   this.create()
  // },
  destroyed (){
    this.destroy()
    this.$off()
  },
  methods: {
    destroy: function(){
      console.log('destroy  chart vue', this.id)

      if(this.$options.__unwatcher)
        this.$options.__unwatcher()

      this.$set(this.tabular, 'data', [[]])

      // this.$refs[this.id].destroy()
      this.$options.__chart_init = false

    },
    __create_watcher(name, chart){},
    update_chart_stat (name, data){},
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      this.$options.visible = isVisible
      // if(isVisible == false)
      //   this.$destroy()
    },
  }
}
</script>
