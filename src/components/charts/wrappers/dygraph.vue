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

import { frameDebounce } from 'quasar'

import Dygraph from 'dygraphs'
// import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

export default {
  name: 'dygraph-wrapper',

  graph: undefined,
  freezed: false,

  __unwatcher: undefined,

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
      focus: true,
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
      // //console.log('class visible', val, this.container_class_helper)
    }
  },

  created () {
    //console.log('created', this.id, this.stat.data)
    // this.$set(stat, 'data', [[]])

    if(EventBus && typeof(EventBus.$on) == 'function'){
      EventBus.$on('highlightCallback', params => {
        this.highlighted = true
        // //////console.log('event highlightCallback', params)
  		})
      EventBus.$on('unhighlightCallback', event => {
        this.highlighted = false
        // //////console.log('event unhighlightCallback', event)
  		})
    }

    window.addEventListener('blur', function() {
       this.focus = false
    }.bind(this), false)

    window.addEventListener('focus', function() {
       this.focus = true
    }.bind(this), false)

    this.__watcher()
    // keypath
    // let __unwatcher = this.$watch('stat.data', function (val, oldVal) {
    //
    //
    //   //console.log('updated data dygraph', this.id, this.stat.data)
    //
    //   // if(val.length > 1 && this.chart == null){
    //   if(val.length > 1){
    //
    //     if(this.$options.graph == null){
    //
    //       this.__create_dygraph()
    //
    //     }
    //     // this.__create_dygraph()
    //     //
    //     // __unwatcher()
    //     this.update()
    //   }
    //
    // })
  },
  mounted () {

    // if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){
    //
    //   this.__create_dygraph()
    //
    // }
    // this.__watcher()

  },
  updated () {

    // if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){
    //
    //   this.__create_dygraph()
    //
    // }
    // this.__watcher()

  },
  destroyed (){
    if(this.$options.graph){
      // //console.log('destroying ...', this.id)
      this.$options.graph.destroy()
      this.$options.graph = undefined
    }

    if(this.$options.__unwatcher)
      this.$options.__unwatcher()

    this.$off()
  },
  methods: {
    __watcher (){
      // console.log('dygraph __watcher', this.stat.data, this.stat.data.length)
      if(this.$options.__unwatcher){
        this.$options.__unwatcher()//unwatch
        this.$options.__unwatcher = undefined
      }

      this.$options.__unwatcher = this.$watch('stat.data', function (val, old) {


        console.log('updated stat data dygraph', this.id, this.stat.data, this.stat.data.length)

        // if(val.length > 1 && this.chart == null){
        if(val.length > 1){

          if(!this.$options.graph){

            this.__create_dygraph()

          }
          // this.__create_dygraph()
          //
          // __unwatcher()
          this.update()
        }

      })
    },
    __create_dygraph (){
      //console.log('__create_dygraph', this.stat.data)

      let options = Object.clone(this.chart.options)

      if(options.labelsDiv)
        options.labelsDiv = this.id+'-'+options.labelsDiv

      this.$options.graph = new Dygraph(
        document.getElementById(this.id),  // containing div
        this.stat.data,
        options
      )

      this.$options.graph.ready(function(){
        // //////console.log('chart '+this.id+' ready')
        this.ready = true
      }.bind(this))

      if(this.chart.init)
        this.chart.init(this, this.$options.graph, 'dygraph')
    },
    update (){
      // https://stackoverflow.com/questions/17218938/requestanimationframe-and-knowing-when-the-browser-is-re-painting
      if(this.focus === true){
        console.log('focus, frameDebounce...')
        frameDebounce(
          this.updateOptions(
            { 'dateWindow': this.$options.graph.xAxisExtremes() },
            false
          )
        )
      }
      else{
        console.log('no focus, forcing...')
        this.updateOptions(
          { 'dateWindow': this.$options.graph.xAxisExtremes() },
          true
        )
        // setTimeout(this.updateOptions(
        //   { 'dateWindow': this.$options.graph.xAxisExtremes() },
        //   false
        // ), 50)
      }
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
          // self.stat.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

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
