<template>
  <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
    :style="chart.style"
  >
     <div
       :ref="id"
       :id="id"
       :class="chart.class"
     >

    </div>
    <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div>
  </div>
</template>

<script>

import Dygraph from 'dygraphs'
// import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

export default {
  name: 'dygraph-wrapper',

  graph: null,
  freezed: false,

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    id: {
      type: [String],
      default: () => ('')
    },
    chart: {
      type: [Object],
      default: () => ({})
    },

    stat: {
      type: [Object],
      default: () => ({})
    },

    freezed: {
      type: [Boolean],
      default: () => (false)
    },
    visible: {
      type: [Boolean],
      default: () => (true)
    },
  },
  data () {
    return {
      container_class_helper: '',
      // graph: null,
      highlighted: false,
      ready: false,
      // to_suspend: false,
    }
  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val == false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    }
  },

  created () {
    // //console.log('created', this.id, this.visible)

    if(EventBus && typeof(EventBus.$on) == 'function'){
      EventBus.$on('highlightCallback', params => {
        this.highlighted = true
        // ////console.log('event highlightCallback', params)
  		})
      EventBus.$on('unhighlightCallback', event => {
        this.highlighted = false
        // ////console.log('event unhighlightCallback', event)
  		})
    }
    // keypath
    let unwatch = this.$watch('stat.data', function (val, oldVal) {


      console.log('updated data dygraph', this.id, this.stat.data)

      // if(val.length > 1 && this.chart == null){
      if(val.length > 1){

        if(this.$options.graph == null){

          this._create_dygraph()

        }
        // this._create_dygraph()
        //
        // unwatch()
        this.update()
      }

    })
  },
  mounted () {

    if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){

      this._create_dygraph()

    }

  },

  destroyed (){
    if(this.$options.graph){
      // console.log('destroying ...', this.id)
      this.$options.graph.destroy()
      this.$options.graph = null
    }
    this.$off()
  },
  methods: {

    _create_dygraph (){
      console.log('_create_dygraph', this.stat.data)

      let options = Object.clone(this.chart.options)

      if(options.labelsDiv)
        options.labelsDiv = this.id+'-'+options.labelsDiv

      this.$options.graph = new Dygraph(
        document.getElementById(this.id),  // containing div
        this.stat.data,
        options
      )

      this.$options.graph.ready(function(){
        // ////console.log('chart '+this.id+' ready')
        this.ready = true
      }.bind(this))

      if(this.chart.init)
        this.chart.init(this, this.$options.graph, 'dygraph')
    },
    update (){
      this.updateOptions(
        { 'dateWindow': this.$options.graph.xAxisExtremes() },
        false
      )
    },
    updateOptions (options, block_redraw){

      let self = this

      if(
        this.highlighted == false
        && this.ready == true
        // && this.stat.data.length > 1
        // && this.stat.data[0].length > 1
        // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
        // && this.freezed == false
      ){

        // if(self.stat.data[0][0] == undefined && self.chart.options && self.chart.options.labels)//dygraph code, should be would
        //   Array.each(self.chart.options.labels, function(label, index){
        //     if(index == 0){
        //       self.stat.data[0].push(Date.now())
        //     }
        //     else{
        //       // data[0].push(0)
        //       self.stat.data[0].push(null)
        //     }
        //
        //   })

          this.$options.graph.updateOptions(
            Object.merge(
              {
                'file': self.stat.data
              },
              options
            ),
            block_redraw
          );

          this.$options.graph.setSelection(this.$options.graph.numRows() - 1, {}, false)


      }

    }
  }
}
</script>
