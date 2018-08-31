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
let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

import dygraphWrapper from 'components/charts/wrappers/dygraph'

import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  name: 'chart',

  components: {
    dygraphWrapper
  },

  // __chart: undefined,
  __unwatcher: undefined,
  __chart_init: false,

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
      visible: true
    }
  },

  created () {
    this.__watcher()
  },
  mounted () {
    this.__watcher()
  },
  destroyed (){
    if(this.$options.__unwatcher)
      this.$options.__unwatcher()

    this.$set(this.tabular, 'data', [[]])
  },
  methods: {
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      // let {path, list} = this.name_to_module(entry.target.id.replace('-card',''))

      console.log('visibilityChanged', isVisible, entry.target.id)
      this.visible = isVisible

      // if(isVisible == true){
      //   this.$store.commit('hosts/whitelist_module', {path: path, list: list} )
      // }
      // else{
      //   this.$store.commit('hosts/erase_whitelist_module', {path: path, list: list} )
      // }

      // // this.$set(this.visibles, entry.target.id.replace('-container',''), isVisible)
      //
      // // this.$options.visibles[entry.target.id.replace('-card','')] = isVisible
      //
      // // frameDebounce(function() {//performance reasons
      // //   // //////////console.log('visibilityChanged frameDebounce')
      // //   Object.each(this.$options.visibles, function(bool, visible){
      // //     this.$set(this.visibles, visible, bool)
      // //   }.bind(this))
      // //
      // // }.bind(this))()
      //
      // this.$set(this.visibles, entry.target.id.replace('-card',''), isVisible)

    },
    // update: function(){
    //   this.$refs[this.id].update()
    // },
    __process_stat (chart, name, stat){
      //////console.log('__process_stat', stat)
      if(!Array.isArray(stat))
        stat = [stat]


      // if(Array.isArray(stat[0].value)){//like 'cpus'
      //
      //   this.__process_chart(
      //     chart.pre_process(chart, name, stat),
      //     name,
      //     stat
      //   )
      //
      // }
      // else
      if(isNaN(stat[0].value)){
        //sdX.stats.

        let filtered = false
        if(chart.watch && chart.watch.filters){
          Array.each(chart.watch.filters, function(filter){
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if(
              stat[0].value[prop_to_filter]
              && value_to_filter.test(stat[0].value[prop_to_filter]) == true
            ){
              filtered = true
            }

          })
        }
        else{
          filtered = true
        }

        if(filtered == true){

          chart = chart.pre_process(chart, name, stat)

          // chart.label = this.__process_chart_label(chart, name, stat) || name
          // let chart_name = this.__process_chart_name(chart, stat) || name

          this.__process_chart(chart, name, stat)
        }

      }
      else{

        // chart.label = this.__process_chart_label(chart, name, stat) || name
        // let chart_name = this.__process_chart_name(chart, stat) || name

        this.__process_chart(
          chart.pre_process(chart, name, stat),
          name,
          stat
        )
      }

    },
    __process_chart (chart, name, stat){

      if(chart.init && typeOf(chart.init) == 'function')
        chart.init(this, chart, name, stat, 'chart')

      /**
      * first update
      **/
      if(this.stat.data.length > 0)
        data_to_tabular(this.stat.data, chart, name, this.update_chart_stat.bind(this))

      this.__create_watcher(name, chart)

    },

    __create_watcher(name, chart){
      let watcher = chart.watch || {}

      watcher.value = watcher.value || ''
      watcher.transform = watcher.transform || ''

      if(this.$options.__unwatcher){
        this.$options.__unwatcher()
        this.$options.__unwatcher == undefined
      }

      let generic_data_watcher = function(current){
        // console.log('generic_data_watcher', name, current)
        // Array.each(current, function(row, index){
        //   console.log('generic_data_watcher', row)
        // })

        console.log('generic_data_watcher visibility', this.id, this.visible)
        if(this.visible){
          data_to_tabular(current, chart, name, this.update_chart_stat.bind(this))
        }
      }

      // console.log('gonna watch...', name, this.stat.data)

      this.$options.__unwatcher = this.$watch('stat.data', generic_data_watcher)

    },

    // generic_data_watcher: data_to_tabular,

    update_chart_stat (name, data){

      console.log('update_chart_stat visibility', this.id, this.visible)
      if(this.visible){

        let length = this.stat.data.length
        data.splice(
          -length -1,
          data.length - length
        )

        // data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

        this.$set(this.tabular, 'data', data)
        this.tabular.lastupdate = Date.now()
      }
      ////console.log('update_chart_stat',name, this.tabular.data, window.performance.memory)
    },
    __watcher (){
      let unwatch = this.$watch('stat.data', function (val, old) {
        // console.log('chart vue', val)

        if(val.length > 1){

          if(this.$options.__chart_init == false){
            // console.log('chart vue __watcher', val)
            this.__process_stat(this.chart, this.id, val)
            this.$options.__chart_init = true

          }

          unwatch()
        }

      })
    },

  }
}
</script>
