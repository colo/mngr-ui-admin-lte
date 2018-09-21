
<script>
// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
// let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular


import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  name: 'chart-tabular',

  methods: {
    create (){

      let unwatch = this.$watch('stat.data', function (val, old) {

        if(val && val.length > 1){

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
        if(current){

          if(this.$options.visible){
            let data = []
            Array.each(current, function(row){
              data.push(row.value)
            })


            this.update_chart_stat(data)
          }
        }
      }.bind(this)

      // //console.log('gonna watch...', name, this.stat.data)
      if(this.stat.data.length > 0)
        generic_data_watcher(this.stat.data)

      this.$options.__unwatcher = this.$watch('stat.data', generic_data_watcher)

    },

    // generic_data_watcher: data_to_tabular,

    update_chart_stat (data){

      if(this.$options.visible && data.length > 0){
        // console.log('update_chart_stat visibility', this.id, data)
        if(data.length == 1){

          this.tabular.data.shift()
          this.tabular.data.push(data[0])

        }
        else{

          data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

          this.$set(this.tabular, 'data', data)

        }

      }

    },


  }
}
</script>
