<template>

    <div v-if="chart.class"
      v-observe-visibility="visibilityChanged"
      :id="id+'-container'"
      class="netdata-container-with-legend"
      :style="chart.style"
      v-bind:class="container_class_helper"
    >
    <!--   -->
    <highcharts
      :ref="id"
      :id="id"
      :class="chart.class"
      :options="chart.options"
    >
    </highcharts>

    <!-- <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div> -->
    </div>

    <div v-else
      v-observe-visibility="visibilityChanged"
      :id="id+'-container'"
    >
      <highcharts
        :ref="id"
        :id="id"
        :options="chart.options"
      >
      </highcharts>
    </div>


</template>


<script>

/**
* highcharts sync
* https://www.highcharts.com/blog/snippets/synchronisation-of-multiple-charts/
**/
import { frameDebounce } from 'quasar'

export default {
  name: 'highcharts-vue-wrapper',

  // components: {
  //   highcharts
  // },

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
    gauge: {
      type: [Boolean],
      default: () => (false)
    },
    decimals: {
      type: [Number],
      default: 2
    },
    // animation: {
    //   type: [Boolean],
    //   default: false
    // }
  },
  data () {
    return {
      // values: [],
      // labels: [],
      container_class_helper: '',
      // chart: null,
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
    window.addEventListener('blur', function() {
       this.focus = false
    }.bind(this), false)

    window.addEventListener('focus', function() {
       this.focus = true
    }.bind(this), false)

    let __unwatcher = this.$watch('stat.data', function (val, oldVal) {

      if(val.length > 1){

        // if(this.$options.graph == null){
        //
        //   this.__create_dygraph()
        //
        // }

        this.update()
      }

    })
  },
  // mounted () {
  //
  //   if(this.chart == null){
  //
  //     this._create_frappe()
  //
  //   }
  //
  // },

  destroyed (){
    this.$off()
  },
  methods: {
    update (data){
      data = data || this.stat.data
      console.log('highcharts-vue update', data)
      if(this.$options.visible == true){

        if(this.gauge == true){
          let value = data.getLast()[1]
          if (value != null)
            frameDebounce(
              this.$set(this.chart.options.series[0].data, 0, value.toFixed(this.decimals) * 1)
              // this.chart.options.series[0].data.push(value.toFixed(this.decimals) * 1)
              // this.chart.options.series[0].data.shift()
            )
        }
        else{

          Array.each(data, function(column, index){

            // if(column.length == 1){//gauge type
            //   this.$set(this.options.options.series[0].data, 0, column[0])
            //   // this.options.options.series[0].data.push(column[0])
            //   // this.options.options.series[0].data.shift()
            // }
            // else{
            Array.each(column, function(value, value_index){
              if(value_index != 0){
                // if(!this.$refs[this.id].options.series[value_index -1]){
                //   this.$refs[this.id].options.series[value_index -1] = {
                //     name: this.id,
                //     data: []
                //   }
                // }
                // else
                if (index == 0){
                  // let serie = this.options.options.series[value_index -1]
                  // serie.data = []
                  this.$set(this.chart.options.series[value_index -1], 'data', [])

                }

                this.chart.options.series[value_index -1].data.push([
                  new Date(column[0]).getTime(),//timestamp
                  value
                ])
              }

            }.bind(this))
            // }



          }.bind(this))

        }

      }


    },



    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      this.$options.visible = isVisible
      // if(isVisible == true && !this.$options.graph)
      //   this.__create_dygraph()
    },
  }
}
</script>
