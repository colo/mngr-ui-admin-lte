<template>

  <component
    v-observe-visibility="visibilityChanged"
    :is="type+'-wrapper'"
    :id="id"
    :ref="id"
    :EventBus="EventBus"
    :chart="chart"
    :stat="tabular"
  />
  </component>

</template>

<script>
// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
// let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

import dygraphWrapper from 'components/wrappers/dygraph'

import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  name: 'chart-tabular',

  components: {
    dygraphWrapper
  },

  // __chart: undefined,
  __unwatcher: undefined,
  __chart_init: false,
  visible: true,

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

  created () {
    this.create()
  },
  // mounted () {
  //   this.create()
  // },
  updated () {
    this.create()
  },
  destroyed (){
    this.destroy()
    this.$off()
  },
  methods: {
    create (){

      let unwatch = this.$watch('stat.data', function (val, old) {

        console.log('create chart vue', this.id, this.$options.__chart_init, val)

        if(val && val.length > 1){

          if(this.$options.__chart_init == false){
            // console.log('chart vue __watcher', val)

            // this.__process_stat(this.chart, this.id, this.stat.data)
            this.__create_watcher(this.id)
            this.$options.__chart_init = true

            // this.$refs[this.id].create()
          }



          unwatch()
        }

      }, { deep: true } )
    },

    destroy: function(){
      console.log('destroy  chart vue', this.id)

      if(this.$options.__unwatcher)
        this.$options.__unwatcher()

      this.$set(this.tabular, 'data', [[]])

      // this.$refs[this.id].destroy()
      this.$options.__chart_init == false

    },
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      this.$options.visible = isVisible
    },

    // __process_stat (chart, name, stat){
    //   //////console.log('__process_stat', stat)
    //   if(!Array.isArray(stat))
    //     stat = [stat]
    //
    //
    //   // if(Array.isArray(stat[0].value)){//like 'cpus'
    //   //
    //   //   this.__process_chart(
    //   //     chart.pre_process(chart, name, stat),
    //   //     name,
    //   //     stat
    //   //   )
    //   //
    //   // }
    //   // else
    //   if(isNaN(stat[0].value)){
    //     //sdX.stats.
    //
    //     let filtered = false
    //     if(chart.watch && chart.watch.filters){
    //       Array.each(chart.watch.filters, function(filter){
    //         let prop_to_filter = Object.keys(filter)[0]
    //         let value_to_filter = filter[prop_to_filter]
    //
    //         if(
    //           stat[0].value[prop_to_filter]
    //           && value_to_filter.test(stat[0].value[prop_to_filter]) == true
    //         ){
    //           filtered = true
    //         }
    //
    //       })
    //     }
    //     else{
    //       filtered = true
    //     }
    //
    //     if(filtered == true){
    //
    //       chart = chart.pre_process(chart, name, stat)
    //
    //       // chart.label = this.__process_chart_label(chart, name, stat) || name
    //       // let chart_name = this.__process_chart_name(chart, stat) || name
    //
    //       this.__process_chart(chart, name, stat)
    //     }
    //
    //   }
    //   else{
    //
    //     // chart.label = this.__process_chart_label(chart, name, stat) || name
    //     // let chart_name = this.__process_chart_name(chart, stat) || name
    //
    //     this.__process_chart(
    //       chart.pre_process(chart, name, stat),
    //       name,
    //       stat
    //     )
    //   }
    //
    // },
    // __process_chart (chart, name, stat){
    //
    //   if(chart.init && typeOf(chart.init) == 'function')
    //     chart.init(this, chart, name, stat, 'chart')
    //
    //   /**
    //   * first update
    //   **/
    //   if(this.stat.data.length > 0)
    //     data_to_tabular(this.stat.data, chart, name, this.update_chart_stat.bind(this))
    //
    //   this.__create_watcher(name, chart)
    //
    // },

    __create_watcher(name, chart){
      // let watcher = chart.watch || {}
      //
      // watcher.value = watcher.value || ''
      // watcher.transform = watcher.transform || ''
      //
      // if(this.$options.__unwatcher){
      //   this.$options.__unwatcher()
      //   this.$options.__unwatcher == undefined
      // }
      //
      let generic_data_watcher = function(current){
        if(current){
          // console.log('generic_data_watcher', name, current)
          // Array.each(current, function(row, index){
          //   console.log('generic_data_watcher', row)
          // })

          // console.log('generic_data_watcher val', chart)
          if(this.$options.visible){
            let data = []
            Array.each(current, function(row){
              data.push(row.value)
            })
            // if(chart.watch && chart.watch.cumulative == true){//send all values
            //   console.log('generic_data_watcher send all', name)
            //   data_to_tabular(current, chart, name, this.update_chart_stat.bind(this))
            // }
            // else{//send last only
            //   console.log('generic_data_watcher send last', name, current)
            //   data_to_tabular([ current[current.length - 1] ], chart, name, this.update_chart_stat.bind(this))
            // }
            this.update_chart_stat(data)
          }
        }
      }

      console.log('gonna watch...', name, this.stat.data)

      this.$options.__unwatcher = this.$watch('stat.data', generic_data_watcher)

    },

    // generic_data_watcher: data_to_tabular,

    update_chart_stat (data){

      console.log('update_chart_stat visibility', data)

      if(this.$options.visible && data.length > 0){
        if(data.length == 1){

          this.tabular.data.shift()
          this.tabular.data.push(data[0])
          // let old_data = this.tabular.data
          // old_data.shift()
          // old_data.push(data[0])
          // old_data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // this.$set(this.tabular, 'data', old_data)
        }
        else{
          let length = this.stat.data.length
          if(data.length > length)
            data.splice(
              -length -1,
              data.length - length
            )

          data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

          this.$set(this.tabular, 'data', data)

        }

        this.tabular.lastupdate = Date.now()
      }
      ////console.log('update_chart_stat',name, this.tabular.data, window.performance.memory)
    },


  }
}
</script>
