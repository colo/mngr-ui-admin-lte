<template>
  <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
    :style="chart.style"
  >
  <!-- v-observe-visibility="visibilityChanged" -->
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

import chartWrapper from 'components/mixins/chart.wrapper'

import Dygraph from 'dygraphs'
// import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

export default {
  mixins: [chartWrapper],

  name: 'dygraph-wrapper',

  created () {

    if(EventBus && typeof(EventBus.$on) == 'function'){
      EventBus.$on('highlightCallback', params => {
        this.highlighted = true
        // //////////////console.log('event highlightCallback', params)
  		})
      EventBus.$on('unhighlightCallback', event => {
        this.highlighted = false
        // //////////////console.log('event unhighlightCallback', event)
  		})
    }

  },
  // mounted () {
  //
  //   // if(this.$options.graph == null && this.data && this.data.length > 1){
  //   //
  //   //   this.__create_chart()
  //   //
  //   // }
  //   // this.__watcher()
  //
  //   this.create()
  //   // if(this.chart && this.chart.options){
  //   //   //console.log('mounted dygraph', this.id, this.chart)
  //   //   this.create()
  //   // }
  //   // else{
  //   //   let unwatch = this.$watch('chart', function(val){
  //   //     if(val && Object.getLength(val) > 0 && val.options){
  //   //       // this.__create_chart()
  //   //       this.create()
  //   //       unwatch()
  //   //     }
  //   //
  //   //   })
  //   // }
  // },
  // updated () {
  // //
  // //   // if(this.$options.graph == null && this.data && this.data.length > 1){
  // //   //
  // //   //   this.__create_chart()
  // //   //
  // //   // }
  // //   // this.__watcher()
  // //
  //   this.create()
  // },
  // destroyed (){
  //   this.destroy()
  //   if(this.$options.graph && typeof this.$options.graph.destroy == 'function'){
  //     this.$options.graph.destroy()
  //
  //   }
  //
  //   this.$options.graph = undefined
  //   this.$off()
  // },
  methods: {

    /**
    * UI related
    **/
    // reset: function(){
    //   this.destroy()
    //   this.create()
    // },
    destroy: function(){
      ////////console.log('dygraph destroy', this.id)

      if(this.$options.graph && typeof this.$options.graph.destroy == 'function'){
        // //////////console.log('destroying ...', this.id)
        this.$options.graph.destroy()

      }

      this.$options.graph = undefined
      this.ready = false

      if(this.$options.__unwatcher){
        this.$options.__unwatcher()
        this.$options.__unwatcher = undefined
      }

    },
    create (){
      // this.__create_chart()
      if(this.chart && this.chart.options){
        //console.log('create dygraph', this.id, this.chart)
        // this.create()
        this.__create_chart()
      }
      else{
        let unwatch_options = this.$watch('chart.options', function(val){
          // if(val && Object.getLength(val) > 0 && val.options){
          //   this.__create_chart()
          //   // this.create()
          //   unwatch()
          // }
          console.log('dygraph chart.options watcher', val)
        }, {deep: true})

        let unwatch = this.$watch('chart', function(val){
          if(val && Object.getLength(val) > 0 && val.options){
            this.__create_chart()
            // this.create()
            unwatch()
          }

        })
      }

    },
    __create_chart (){
      let options = Object.clone(this.chart.options)

      //console.log('__create_chart', this.id, options)

      if(options.labels && document.getElementById(this.id)){
        if(options.labelsDiv)
          options.labelsDiv = this.id+'-'+options.labelsDiv

        let data = []
        if(this.data[0] && this.data[0].length == 0){

          let row = []
          Array.each(options.labels, function(label){
            row.push(0)
          })
          data.push(row)
        }
        else{
          data = this.get_data()
          // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // data = []
        }

        // Array.each(this.data, function(row){
        //   row[0] = new Date(row[0])
        //   data.push(row)
        // })

        console.log('__create_chart', this.id, options)

        this.$options.graph = new Dygraph(
          document.getElementById(this.id),  // containing div
          data,
          options
        )

        this.$options.graph.ready(function(){
          // //////////////console.log('chart '+this.id+' ready')
          this.ready = true
          // this.update()
        }.bind(this))

        if(this.chart.init)
          this.chart.init(this, this.$options.graph, 'dygraph')

        // this.update()
      }
    },
    get_data: function(data){
      data = data || Array.clone(this.data)

      data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

      Array.each(data, function(row){
        if(row)
          row[0] = new Date(row[0])
        // data.push(row)
      })

      return data
    },
    update (data){
      // ////console.log('dygraph update', this.id, data, this.$options.graph.numRows())
      data = this.get_data(data)
      // let options = (this.ready == true && this.$options.graph.numRows() > 1) ? { 'dateWindow': this.$options.graph.xAxisExtremes() } : {}
      // if(this.$options.visible == true && this.ready == true){
      if(this.ready == true && data && data[0]){

        // //console.log('updateOptions', this.id, data)

        this.updateOptions(
          data,
          // options,
          // {},
          { 'dateWindow': this.$options.graph.xAxisExtremes() },
          false
        )


      }
    },
    updateOptions (data, options, block_redraw){

      // let self = this

      if(
        this.highlighted == false
        && this.ready == true
        // && this.data.length > 1
        // && this.data[0].length > 1
        // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
        // && this.freezed == false
      ){

        // if(self.data[0][0] == undefined && self.chart.options && self.chart.options.labels)//dygraph code, should be would
        //   Array.each(self.chart.options.labels, function(label, index){
        //     if(index == 0){
        //       self.data[0].push(Date.now())
        //     }
        //     else{
        //       // data[0].push(0)
        //       self.data[0].push(null)
        //     }
        //
        //   })

          /**
          * should be sorted already
          **/
          // if(this.chart.skip > 0)
          //   data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )


          // let data = []
          // console.log('updateOptions', data, options)

          this.$options.graph.updateOptions(
            Object.merge(
              {
                'file': data
              },
              options
            ),
            block_redraw
          );

          // this.$options.graph.updateOptions(
          //   { 'dateWindow': this.$options.graph.xAxisExtremes() },
          //   block_redraw
          // );
          // let selection = (this.chart.skip && this.chart.skip > 0) ? 0 : 1

          this.$options.graph.setSelection(this.$options.graph.numRows() - 1, {}, false)


      }

    }
  }
}
</script>
