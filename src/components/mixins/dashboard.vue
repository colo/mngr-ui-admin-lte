<script>

import { mapState } from 'vuex'



// import { createNamespacedHelpers } from 'vuex'
// const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')


import chart from 'components/chart'
import chartTabular from 'components/chart.tabular'

import chartEmptyContainer from 'components/chart.empty.container'

import admin_lte_mixin from 'components/mixins/admin-lte'

// import queue from 'async/queue'
import { debounce } from 'quasar'
import { throttle } from 'quasar'

import qrate from 'qrate'

// let __events_queue = queue(function(task, callback) {
//   let {pipeline, event} = task
//   let event_name = Object.keys(event)[0]
//   let __callback = function(){
//     pipeline.removeEvent(event_name, __callback)
//     callback(event)
//   }
//
//   let __debounced_event = debounce(function(){
//     pipeline.addEvent(event_name, __callback)
//     pipeline.fireEvent(event_name, event[event_name])
//   }, 100)
//
//   __debounced_event()
//   // task.db.bulkDocs(task.docs)
//   // .then(function (status) {
//   //   callback(undefined, status);
//   // }).catch(function (err) {
//   //   callback(err);
//   // })
//
// }, 1)

let __events_queue = qrate(function(task, callback) {
  let {pipeline, event} = task
  // let {options, event} = obj
  // eval('pipeline.'+options)

  let event_name = Object.keys(event)[0]
  let __callback = function(){
    pipeline.removeEvent(event_name, __callback)
    callback(event)
  }


  pipeline.addEvent(event_name, __callback)
  pipeline.fireEvent(event_name, event[event_name])

}, 1, 1)


export default {
  mixins: [admin_lte_mixin],

  __events_watcher: undefined,
  __pipelines_events: {},

  components: {
    chart,
    chartTabular,
    chartEmptyContainer
  },

  // __unwatchers__: {},

  data () {
    return {
      EventBus: EventBus,
      stats: {},
      tabulars: {},
      charts: {},
      available_charts: {}
    }
  },

  computed: Object.merge(
    mapState({
      events: state => state.dashboard.events.list,
      paths: state => state.app.paths
    }),

  ),
  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  },
  created: function(){
    this.$options.__events_watcher = this.$watch('events', debounce(function(val, old){
    // this.$options.__events_watcher = this.$watch('events', function(val){

      // if(val && val.length > 0 && val.length > old.length){
      if(val && val.length > 0){
        // console.log('this.$watch events', val)

        Array.each(val, function(event, index){
          if(event.id && this.available_charts[event.id]){

            let {id} = event
            let {stat, pipeline} = this.available_charts[id]

            // event = this.__parse_event(event)

            if(!Array.isArray(stat.events))
              stat.events = [stat.events]

            //////// console.log('this.$watch events chart', pipeline, stat)

            Array.each(stat.events, function(stat_data, index){
              let p = undefined
              if(Array.isArray(pipeline)){
                p = pipeline[index]
              }
              else{
                p = pipeline
              }

              // let __pipeline = this.__parse_pipeline_opts(p, stat_data)

              // if(id == 'colo.cpus_times.uptime')
                // console.log('PRE __parse_event', id, stat_data, event)

              let parsed_event = this.__parse_event(event, stat_data)

              // if(id == 'colo.cpus_times.uptime')
                // console.log('PRE __parse_event', id, stat_data,parsed_event)

              this.__set_pipeline_event({
                pipeline: p.name,
                event: parsed_event
              })

            }.bind(this))

          }

          // if(index == val.length -1)
          //   this.fire_pipelines_events()

        }.bind(this))

        // this.$nextTick(this.fire_pipelines_events())
        this.fire_pipelines_events()

      }
    }, 100))
    // })
  },
  beforeDestroy: function(){
    if(!this.$options.__events_watcher)
      this.$options.__events_watcher()


  },
  destroyed: function(){
    this.$off()
  },
  methods: {
    __build_biggest_range: function(first, second){
      let event = Object.clone(first)
      let start = 0
      let end = 0

      if(first.onRange && first.onRange.Range){
        start = (first.onRange.Range.substring(first.onRange.Range.indexOf(' ')+1, first.onRange.Range.indexOf('-'))) * 1
        end = (first.onRange.Range.substring(first.onRange.Range.indexOf('-')+1, first.onRange.Range.indexOf('/'))) * 1
      }

      if(second.onRange && second.onRange.Range){
        let second_start = (first.onRange.Range.substring(first.onRange.Range.indexOf(' ')+1, first.onRange.Range.indexOf('-'))) * 1
        let second_end = (first.onRange.Range.substring(first.onRange.Range.indexOf('-')+1, first.onRange.Range.indexOf('/'))) * 1

        start = (start < second_start) ? start : second_start
        end = (end > second_end) ? end : second_end
      }

      event.onRange.Range = 'posix '+start+'-'+end+'/*'

      console.log('__build_biggest_range', first, second, start, end, event)

      return event
    },
    __parse_pipeline_opts: function(pipeline, stat){
      let {name} = pipeline
      let {path} = stat
      return {
        name: name,
        options: "inputs[0].options.conn[0].module.options.paths = ['"+path+"']"
      }
    },
    __parse_event: function(event, stat){
      let {type, opts} = event
      let {path, tabular} = stat
      let e = {}
      e[type] = {}

      if(type == 'onRange'){

        Object.each(opts, function(opt, name){
          if(name == 'range'){
            e[type].Range = 'posix '+ opt[0] +'-'+ opt[1] +'/*'
          }
          else{
            e[type][name] = opt
          }

        })

      }
      else if(opts){
        e[type] = opts
      }

      e[type]['path'] = path
      e[type]['tabular'] = tabular

      return e
    },
    // fire_pipelines_events: throttle(function(){
    fire_pipelines_events: debounce(function(){
    // fire_pipelines_events: function(){
      if(this.all_init){
        // console.log('fire_pipelines_events',this.$options.__pipelines_events, this.paths)
        console.log('fire_pipelines_events',JSON.parse(JSON.stringify(this.$options.__pipelines_events['input.os'])), this.paths)

        /**
        * first match app.paths with options path, if all matched, remove'em,
        * so the range event is fired for host instead of each path
        */
        // let all_path_matched = false

        // if(all_path_matched == false){
          Object.each(this.$options.__pipelines_events, function(pipeline, name){
            let pipe = this.$options.pipelines[name]
            while(pipeline.length > 0){
              let event = pipeline.shift()
              // let {options, event} = obj
              // eval('pipe.'+options)
              // console.log('firing pipe', name)
              let event_name = Object.keys(event)[0]
              pipe.fireEvent(event_name, event[event_name])

              /**
              * removed queue, works better with rethinkdb lauching all events at once
              */
              // __events_queue.push({pipeline: pipe, event: event}, function(event){
              //   //// console.log('EVENT fired', event, new Date())
              // })
            }

            delete this.$options.__pipelines_events[name]
            // Array.each(pipeline, function(obj, index){
            //   let {options, event} = obj
            //   eval('pipe.'+options)
            //   let event_name = Object.keys(event)[0]
            //   pipe.fireEvent(event_name, event[event_name])
            //   __events_queue.push({pipeline: pipe, event}, function(event){
            //     //// console.log('EVENT fired', options, new Date())
            //
            //   })
            //   // //////////// console.log('fire_pipelines_events', pipe.inputs[0].options.conn[0].module.options.paths)
            //
            //
            // })
          }.bind(this))

      }

    }, 1000),
    // },
    __set_pipeline_event: function (payload){
      let {pipeline, event} = payload

      // //// console.log('__set_pipeline_event', payload)
      if(!this.$options.__pipelines_events[pipeline])
        this.$options.__pipelines_events[pipeline] = []

      // let obj = {options: pipeline.options, event}
      // if(this.$options.__pipelines_events[pipeline].length == 0){
      //   this.$options.__pipelines_events[pipeline].push(event)
      // }
      // else{
        let found = false
        Array.each(this.$options.__pipelines_events[pipeline], function(pipe_event, index){
          // found = false
          // if(pipe_event == event){
            // found = true

            let pipe_event_name = Object.keys(pipe_event)[0]
            let event_name = Object.keys(event)[0]

            // let prop_matched = true
            if(pipe_event_name == event_name){
              // Object.each(event[event_name], function(val, prop){
              //   if(prop != 'Range' || prop != 'opt'){
              //      if(!pipe_event[pipe_event_name][prop] || pipe_event[pipe_event_name][prop] != val)
              //       prop_matched = false
              //   }
              // })
              // if(pipe_event[pipe_event_name]['path'] && pipe_event[pipe_event_name]['path'] == event[event_name]['path']){
              if(
                pipe_event[pipe_event_name]['path'] == event[event_name]['path']
                && pipe_event[pipe_event_name]['tabular'] == event[event_name]['tabular']
              ){
               found = index
               // console.log('_set_pipelines_events FOUND', pipe_event, event, index)
             }

              // if(prop_matched == true){
              //   found = index
              //   // console.log('_set_pipelines_events FOUND', pipe_event, event, index)
              // }
            }
          // }


        }.bind(this))

        if(found === false ){
          this.$options.__pipelines_events[pipeline].push(event)
        }
        else{//replace it as ranges get updated
          this.$options.__pipelines_events[pipeline][found] = this.__build_biggest_range(event, this.$options.__pipelines_events[pipeline][found])
        }
      // }

      // console.log('_set_pipelines_events', JSON.parse(JSON.stringify(this.$options.__pipelines_events[pipeline])))
    },
    /**
    * @start -charting
    **/
    add_chart: function (payload){
      let {name, chart, init, watch, watcher} = payload

      // this.available_charts[name] = payload
      this.$set(this.charts, name, chart)

      // if(!this.stats[name])
      //   this.$set(this.stats, name, {lastupdate: 0, 'data': [] })

      if(init && typeof init == 'function')
        init(payload)

      // if(watch == true && watcher)
      //   this.add_watcher(payload)

      ////////////// console.log('add_chart', name)

      // if(this.$refs[name] && typeof this.$refs[name].create == 'function' ) this.$refs[name].create()

      // if(finish && typeof finish == 'function')
      //   finish(payload)

    },
    remove_chart: function (name, options){
      options = options || {}

      if(this.available_charts[name] && this.available_charts[name].stop && typeof this.available_charts[name].stop == 'function')
        this.available_charts[name].stop(this.available_charts[name])

      this.$delete(this.charts, name)

      // if(options.clean && options.clean == true)
      //   this.$set(this.stats, name, undefined)

      // if(options.unwatch && options.unwatch == true){
      //   if(Array.isArray(this.available_charts[name].stat)){
      //     Array.each(this.available_charts[name].stat, function(stat, index){
      //       let indexed_name = name+'_'+index
      //       this.remove_watcher(indexed_name)
      //     }.bind(this))
      //   }
      //   else{
      //     this.remove_watcher(name)
      //   }
      // }

      // if(this.$refs[name] && typeof this.$refs[name].reset == 'function'){
      //    this.$refs[name].reset()
      // }
      // else if (this.$refs[name] && this.$refs[name][0] && typeof this.$refs[name][0].reset == 'function' ){
      //   this.$refs[name][0].reset()
      // }

      ////////// console.log('remove_chart', name, this.$refs[name])
    },
    remove_charts: function(options){
      Object.each(this.charts, function(chart, name){
        this.remove_chart(name, options)
      }.bind(this))
    },
    // remove_watcher: function(name){
    //   ////////////// console.log('remove_watcher', name)
    //
    //   if(this.$options.__unwatchers__[name]){
    //     this.$options.__unwatchers__[name]()
    //     delete this.$options.__unwatchers__[name]
    //   }
    // },
    // add_chart_stat: function (name){
    //   // if(!this.stats[name])
    //   this.$set(this.stats, name, {lastupdate: 0, 'data': [] })
    // },
    // remove_chart_stat: function (name){
    //   this.$delete(this.stats, name)
    // },
    // remove_chart_stats: function(){
    //   // Object.each(this.stats, function(stat, name){
    //   //   this.remove_chart_stat(name)
    //   // }.bind(this))
    //   // this.$delete(this, 'stats')
    //   this.$set(this, 'stats', {})
    // },
    // add_watcher: function(payload){
    //   let {name, watcher} = payload
    //   // ////////////// console.log('add_watcher', name, watch)
    //
    //   this.remove_watcher(name)
    //   // if(!this.$options.__unwatchers__[name]){
    //     this.$options.__unwatchers__[name] = this.$watch(watcher.name, function (doc, old) {
    //       // ////////////// console.log('add_watcher', name)
    //       if(watcher.cb)
    //         watcher.cb(doc, old, payload)
    //
    //     }.bind(this),{
    //       deep: watcher.deep || false
    //     })
    //   // }
    // },
    /**
    * @move to stat mixin
    **/
    // __get_stat: function(payload, cb){
    //   //////////////// console.log('__get_stat', payload)
    //   // if(payload.tabular == true){
    //   //   this.$store.dispatch('stats_tabular/get', payload).then((docs) => cb(docs))
    //   // }
    //   // else{
    //     this.$store.dispatch('stats/get', payload).then((docs) => cb(docs))
    //   // }
    // },
    // __update_chart_stat: function(name, doc, splice){
    //   //////// console.log('__update_chart_stat', name, doc, splice)
    //
    //   /**
    //   * @config option this.visibility
    //   **/
    //   if(this.stats[name] && this.visibility[name] == true){
    //
    //     if(Array.isArray(doc) && doc.length > 0){
    //       let data = []
    //
    //       // doc.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
    //
    //       Array.each(doc, function(d, index){
    //         data.push({ timestamp: d.metadata.timestamp, value: d.data })
    //
    //         if(index == doc.length -1){
    //
    //           // let old_data = Array.clone(this.stats[name].data)
    //           // data = old_data.combine(data)
    //           // data = this.stats[name].data.combine(data)
    //           data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
    //           this.$set(this.stats[name], 'data', data)
    //         }
    //       }.bind(this))
    //
    //       // splice = splice || this.seconds
    //       // let length = this.stats[name].data.length
    //       // this.stats[name].data.splice(
    //       //   (splice * -1) -1,
    //       //   length - splice
    //       // )
    //     }
    //     else if(doc && !Array.isArray(doc)){
    //       let data = { timestamp: doc.metadata.timestamp, value: doc.data }
    //       this.stats[name].data.push(data)
    //
    //
    //       // if(length > this.seconds)
    //       //   this.stats[name].data.shift()
    //     }
    //
    //     splice = (isNaN(splice)) ? this.seconds : splice
    //
    //     let length = this.stats[name].data.length
    //     // if(splice == 1){
    //     //   let last = this.stats[name].data[this.stats[name].data.length -1]
    //     //   this.$set(this.stats[name], 'data', [last])
    //     // }
    //     // else{
    //       splice = (splice == 1) ? 2 : splice
    //
    //       if(splice == 0){
    //         this.$set(this.stats[name], 'data', [])
    //       }
    //       else{
    //         this.stats[name].data.splice(
    //           (splice * -1) -1,
    //           length - splice
    //         )
    //       }
    //     // }
    //
    //     //////////// console.log('__update_chart_stat',name, doc, splice, this.stats[name].data)
    //
    //     this.stats[name].lastupdate = Date.now()
    //   }
    // },
    /**
    * @end - charting
    **/

    /**
    * UI
    **/
    showCollapsible (collapsible){
      //////////////// console.log('showCollapsible', collapsible)
      // this.$options.has_no_data[collapsible.replace('-collapsible', '')] = 0
      // this.$set(this.hide, collapsible.replace('-collapsible', ''), false)

    },
    hideCollapsible (collapsible){
      //////////////// console.log('hideCollapsible', collapsible)
      // let name = collapsible.replace('-collapsible', '')
      // this.$options.has_no_data[name] = 61
      // this.$set(this.hide, name, true)
      //
      // // delete this.stats[name].data
      // // this.$set(this.stats[name], 'data', [])

    },


  }
}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-dygraph-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-legend {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-axis-label {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}
</style>
