<template>
  <div
  :style="options.style"
  :class="options.class"
  >
    <!-- linear-gauge | radial-gauge -->
    <bars
      :data="values"
      autoDraw
      smooth
      v-bind="options.options"
    >
    </bars>

  </div>
</template>


<script>

import Bars from 'vuebars'

export default {
  name: 'vue-bars-wrapper',

  components: {
    Bars
  },

  // chart: null,
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
    options: {
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
      values: [],
      // container_class_helper: '',
      chart: null,
      // highlighted: false,
      // ready: false,
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
    this.chart = this
  //   // //console.log('created', this.id, this.visible)
  //
  //   this.EventBus.$on('highlightCallback', params => {
  //     this.highlighted = true
  //     // ////console.log('event highlightCallback', params)
	// 	})
  //   this.EventBus.$on('unhighlightCallback', event => {
  //     this.highlighted = false
  //     // ////console.log('event unhighlightCallback', event)
	// 	})
  //
  //   // keypath
  //   let unwatch = this.$watch('stat.data', function (val, oldVal) {
  //
  //
  //     ////console.log('created', this.id, this.stat.data)
  //
  //     // if(val.length > 1 && this.chart == null){
  //     if(val.length > 1){
  //
  //
  //       this._create_dygraph()
  //
  //       unwatch()
  //     }
  //
  //   })
  // },
  // mounted () {
  //
  //   if(this.chart == null){
  //
  //     this._create_dygraph()
  //
  //   }
  //
  // },

  // destroyed (){
  //
  //   if(this.chart){
  //     this.chart.destroy()
  //     this.chart = null
  //   }
  //   this.$off()
  },
  methods: {

    // _create_dygraph (){
    //   let options = Object.clone(this.options.options)
    //
    //   if(options.labelsDiv)
    //     options.labelsDiv = this.id+'-'+options.labelsDiv
    //
    //   this.chart = new Dygraph(
    //     document.getElementById(this.id),  // containing div
    //     this.stat.data,
    //     options
    //   )
    //
    //   this.chart.ready(function(){
    //     // ////console.log('chart '+this.id+' ready')
    //     this.ready = true
    //   }.bind(this))
    //
    //   if(this.options.init)
    //     this.options.init(this, this.chart, 'dygraph')
    // },
    update () {
      this.$set(this, 'values', [])

      Array.each(this.stat.data, function(data){
        this.values.push(data[1])
      }.bind(this))


      // console.log('this.values', this.values)
    },
    // updateOptions (options, block_redraw){
    //
    //   let self = this
    //
    //   if(this.highlighted == false && this.ready == true
    //     // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
    //     // && this.freezed == false
    //   ){
    //
    //       this.chart.updateOptions(
    //         Object.merge(
    //           {
    //             'file': self.stat.data
    //           },
    //           options
    //         ),
    //         block_redraw
    //       );
    //
    //       this.chart.setSelection(this.chart.numRows() - 1, {}, false)
    //
    //
    //   }
    //
    // }
  }
}
</script>
