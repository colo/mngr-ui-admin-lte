
<script>
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
      console.log('create chart.tabular', this.id, this.chart)

      // if(this.$refs[this.id] && typeof this.$refs[this.id].create == 'function')
      //   this.$refs[this.id].create()

      this.$options.tabular = {
        lastupdate: 0,
        data: []
      }



      let unwatch = this.$watch('stat_data', function (val, old) {
        // console.log('create chart.tabular', val)
        // if(val && val.length > 1){
        if(val){
          if(this.$options.__chart_init == false){

            this.__create_watcher(this.id)
            this.$options.__chart_init = true


          }


          unwatch()
        }

      }, { deep: true } )
    },

    __create_watcher(name, chart){


      let generic_data_watcher = function(current){
        console.log('chart.tabular generic_data_watcher', current)
        // if(current && this.$options.visible){
         if(current){
          let data = []
          Array.each(current, function(row){
            data.push(row.value)
          })

          this.update_chart_stat(this.id, data)

        }
      }.bind(this)

      // //console.log('gonna watch...', name, this.stat.data)
      if(this.stat_data[0].value.length > 0)
        generic_data_watcher(this.stat_data)

      this.$options.__data_unwatcher = this.$watch('stat_data', generic_data_watcher)

    },




  }
}
</script>
