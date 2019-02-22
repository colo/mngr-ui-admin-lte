
<script>
import * as Debug from "debug"
const debug = Debug("mngr-ui-admin-lte:components:chart.tabular"),
      debug_internals = Debug("mngr-ui-admin-lte:components:chart.tabular:Internals"),
      debug_events = Debug("mngr-ui-admin-lte:components:chart.tabular:Events");

// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
// let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular


import graph from 'components/mixins/graph'
import stat from 'components/mixins/stat'

export default {
  mixins: [graph, stat],

  name: 'chart-tabular',

  type: 'tabular',

  methods: {
    create (){
      //////console.log('create chart.tabular', this.id, this.chart)

      // if(this.$refs[this.id] && typeof this.$refs[this.id].create == 'function')
      //   this.$refs[this.id].create()

      this.$options.tabular = {
        lastupdate: 0,
        data: []
      }



      let unwatch = this.$watch('stat_data', function (val, old) {
        // //////console.log('create chart.tabular', val)
        // if(val && val.length > 1){
        if(val){
          // if(this.$options.__chart_init == false){
          if(this.chart_init == false){

            // this.__create_watcher(this.id)
            this.__process_chart(this.chart, this.id)
            // this.$options.__chart_init = true


          }


          unwatch()
        }

      }, { deep: true } )
    },
    __process_chart (chart, name, stat){
      ////console.log('__process_chart', this.stat_data, name, stat)

      if(chart.init && typeOf(chart.init) == 'function'){
        chart.init(this, chart, name, stat, 'chart')
        this.$set(this, 'chart_init', true)
      }
      else{
        this.$set(this, 'chart_init', true)
      }

      this.__create_watcher(name, chart)

    },
    __create_watcher(name, chart){


      let generic_data_watcher = function(current, inmediate){
        // console.log('chart.tabular generic_data_watcher', current)
        // if(current && this.$options.visible){
         if(current){
          let data = []
          Array.each(current, function(row){
            //fix for incorrect values like "" (empty)
            if(Array.isArray(row.value))
              Array.each(row.value, function(value, index){
                if(!value || isNaN(value))
                  row.value[index] = 0 //or should be undefined?
              })


            data.push(row.value)
          })

          // debug_internals('__create_watcher->generic_data_watcher',this.id, data, inmediate)

          this.update_chart_stat(this.id, data, inmediate)

        }
      }.bind(this)

      // ////////console.log('gonna watch...', name, this.stat.data)

      /**
      * first update
      **/
      if(this.stat_data[0] && this.stat_data[0].value)
        generic_data_watcher(this.stat_data, true)//inmediate update

      this.$options.__data_unwatcher = this.$watch('stat_data', generic_data_watcher)

    },




  }
}
</script>
