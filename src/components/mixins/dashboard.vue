<template>
  <section class="content">
    <div class="row">
      <section class="col-xs-12 col-sm-12 col-lg-12 connectedSortable">

        <template v-for="(chart, name) in available_charts">
          <!-- {{name}} -->
          <admin-lte-box-solid
            :title="chart.title || name"
            :id="name+'-collapsible'"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >
            <component
              :is="chart.tabular === false ? 'chart' : 'chart-tabular'"
              v-if="charts[name]"
              :dashboard="host"
              :wrapper="chart.wrapper"
              :ref="name"
              :id="name"
              :EventBus="EventBus"
              :chart="chart.chart"
              :stat="{
                range: chart.stat.range,
                length: chart.stat.length,
                merged: chart.stat.merged,
                data: chart.stat.sources ? chart.stat.sources.map(function(source){ return $store.state[source.type+'_sources'][source.path]}) : chart.stat.data
              }"
            >
            </component>
            <!-- data: chart.data.sources ? [$store.state[chart.data.sources[0].type][chart.data.sources[0].path], $store.state[chart.data.sources[1].type][chart.data.sources[1].path]] : chart.data.data -->
            <!-- :stat="{
              range: range,
              merged: true,
              data: [$store.state.tabulars_sources[host+'.os.cpus.times'],$store.state.tabulars_sources[host+'.os.uptime']]
            }" -->
            <!-- :stat="{
              range: chart.data.range,
              merged: chart.data.merged,
              /* data: data[name] */
            }" -->
          </admin-lte-box-solid>
        </template>


      </section>
    </div>

  </section>
</template>

<script>

import { mapState } from 'vuex'


import chart from 'components/chart'
import chartTabular from 'components/chart.tabular'

import chartEmptyContainer from 'components/chart.empty.container'

import admin_lte_mixin from 'components/mixins/admin-lte'

// import queue from 'async/queue'
import { debounce } from 'quasar'
import { throttle } from 'quasar'

import qrate from 'qrate'


import moment from 'moment/moment'

// import bootstrapDaterangepickerWrapper from 'components/wrappers/bootstrap.daterangepicker.vue'


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

import dashboardStore from 'src/store/dashboard'

/**
* https://stackoverflow.com/questions/33774592/dygraphs-live-trending-and-synchronization
* zoom: true, range: false -> https://github.com/danvk/dygraphs/issues/612
*/
import 'src/libs/synchronizer' //modified version
import Dygraph from 'dygraphs'

export default {
  mixins: [admin_lte_mixin],
  components: {
    chart,
    chartTabular,
    chartEmptyContainer
  },

  __sync: undefined,
  highlighted: false,

  __events_watcher: undefined,
  __pipelines_events: {},
  /**
  * should be user session configs?
  **/
  // stats_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  stats_whitelist: undefined,
  tabulars_whitelist: undefined,

  charts_payloads: {},
  collapsibles: {},
  pipelines: {},


  // __unwatchers__: {},
  unwatchers: {},

  data () {
    return {
      EventBus: EventBus,
      // stats: {},
      // tabulars: {},
      charts: {},
      available_charts: {},

      stats_init: false,
      tabulars_init: false,
      reactive_data:{},//manually merged stats

      visibility: {},
      id: undefined
    }
  },

  computed: Object.merge(
    mapState({
      // events: state => state.dashboard.events.list,
      events: function(state){
        console.log('EVENTS', this.id)
        if(this.id && !state['dashboard_'+this.id])
          this.$store.registerModule('dashboard_'+this.id, Object.clone(dashboardStore))

        return (this.id) ? state['dashboard_'+this.id].events.list : undefined
      },

      paths: state => state.app.paths,
      reset: state => state.app.reset,
      range: state => state.app.range,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // //////////////////console.log('state.app.range', state.app.range)

        let end = Date.now()
        if(state.app.range[1] && state.app.range[1] != null)
          end = state.app.range[1]

        let start = Date.now() - (300 * 1000) //5 mins default
        if(state.app.range[0] && state.app.range[0] != null)
          start = state.app.range[0]

        let seconds = Math.trunc( (end - start) / 1000 )

        return seconds
        // return 300
      },

      dashboard_charts: function(state){
        // let host = state.hosts.current || this.$route.params.host
        if(this.id && state['dashboard_'+this.id].charts && Object.getLength(state['dashboard_'+this.id].charts) > 0){
          // //console.log('dashboard_charts', state['dashboard_'+host].charts)
          return state['dashboard_'+this.id].charts
        }
        else{
          return undefined
        }
      },
      dashboard_instances: function(state){
        // let host = state.hosts.current || this.$route.params.host
        if(this.id && state['dashboard_'+this.id].instances && Object.getLength(state['dashboard_'+this.id].instances) > 0){
          // //console.log('dashboard_instances', state['dashboard_'+host].instances)
          return state['dashboard_'+this.id].instances
        }
        else{
          return undefined
        }
      },
    }),
    {
      all_init: function(){
        if(
          this.dashboard_charts != undefined
          && this.dashboard_instances != undefined
          && this.stats_init == true
          && this.tabulars_init == true
          && this.range.length > 0
          // && Object.getLength(this.$store.state.stats_sources) > 0
          // && Object.getLength(this.$store.state.tabulars_sources) > 0
        ){
        // if(this.dashboard_charts != undefined){
          return true
        }
        else{
          return false
        }
      }
    }
  ),

  /**
  * @start - lifecycle
  **/
  beforeRouteUpdate: function (to, from, next) {
    //console.log('life cycle beforeRouteUpdate')

    // react to route changes...
    // don't forget to call next()
    this.__clean_destroy(
      this.__clean_create.pass(
        this.__create.pass([
          this.$store.state.app.paths,
          this.__mount.pass(next, this)
        ], this),
        this
      )
    )


    next()
  },

  created: function(){
    //console.log('life cycle created')
    this.$options.__events_watcher = this.$watch('events', debounce(function(val, old){
    // this.$options.__events_watcher = this.$watch('events', function(val){

      // if(val && val.length > 0 && val.length > old.length){
      if(val && val.length > 0){
        // console.log('this.$watch events', val)

        Array.each(val, function(event, e_index){
          if(event.id && this.available_charts[event.id]){

            let {id} = event
            let {stat, pipeline} = this.available_charts[id]

            // event = this.__parse_event(event)

            if(!Array.isArray(stat.events))
              stat.events = [stat.events]

            //////// console.log('this.$watch events chart', pipeline, stat)

            Array.each(stat.events, function(stat_data, s_index){
              let p = undefined
              if(Array.isArray(pipeline)){
                p = pipeline[index]
              }
              else{
                p = pipeline
              }

              // let __pipeline = this.__parse_pipeline_opts(p, stat_data)

              // if(id == 'colo.cpus_times.uptime')
                console.log('PRE __parse_event', id, stat_data, event, s_index)

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
    let self = this
    EventBus.$on('highlightCallback', function(params) {
      self.$options.highlighted = true
      //////////////////////////////////console.log('event OS.DASHBOARD highlightCallback', self.$refs)
      self.sync_charts()
		})

    EventBus.$on('unhighlightCallback', event => {
      self.$options.highlighted = false
      ////////////////////////////////////console.log('event OS.DASHBOARD unhighlightCallback', event)
      self.unsync_charts()
		})

    this.__clean_create(
      this.__create.pass([this.$store.state.app.paths], this)
    )

  },
  // created: function(){
  //   this.$options.__events_watcher = this.$watch('events', debounce(function(val, old){
  //   // this.$options.__events_watcher = this.$watch('events', function(val){
  //
  //     // if(val && val.length > 0 && val.length > old.length){
  //     if(val && val.length > 0){
  //       // console.log('this.$watch events', val)
  //
  //       Array.each(val, function(event, e_index){
  //         if(event.id && this.available_charts[event.id]){
  //
  //           let {id} = event
  //           let {stat, pipeline} = this.available_charts[id]
  //
  //           // event = this.__parse_event(event)
  //
  //           if(!Array.isArray(stat.events))
  //             stat.events = [stat.events]
  //
  //           //////// console.log('this.$watch events chart', pipeline, stat)
  //
  //           Array.each(stat.events, function(stat_data, s_index){
  //             let p = undefined
  //             if(Array.isArray(pipeline)){
  //               p = pipeline[index]
  //             }
  //             else{
  //               p = pipeline
  //             }
  //
  //             // let __pipeline = this.__parse_pipeline_opts(p, stat_data)
  //
  //             // if(id == 'colo.cpus_times.uptime')
  //               console.log('PRE __parse_event', id, stat_data, event, s_index)
  //
  //             let parsed_event = this.__parse_event(event, stat_data)
  //
  //             // if(id == 'colo.cpus_times.uptime')
  //               // console.log('PRE __parse_event', id, stat_data,parsed_event)
  //
  //             this.__set_pipeline_event({
  //               pipeline: p.name,
  //               event: parsed_event
  //             })
  //
  //           }.bind(this))
  //
  //         }
  //
  //         // if(index == val.length -1)
  //         //   this.fire_pipelines_events()
  //
  //       }.bind(this))
  //
  //       // this.$nextTick(this.fire_pipelines_events())
  //       this.fire_pipelines_events()
  //
  //     }
  //   }, 100))
  //   // })
  // },

  mounted: function(){
    this.__mount()
  },

  beforeDestroy: function(){

    this.$store.unregisterModule('dashboard_'+this.id)

    if(!this.$options.__events_watcher)
      this.$options.__events_watcher()

    this.__clean_destroy()
  },

  destroyed: function(){
    this.$off()
  },
  /**
  * @start - lifecycle
  **/
  watch: {
    'id': function(newVal, oldVal) { this.$store.registerModule('dashboard_'+newVal, Object.clone(dashboardStore)) },
  },
  methods: {
    /**
    * @start - events
    **/
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

      // console.log('__build_biggest_range', first, second, start, end, event)

      return event
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
            let events = {}
            let pipe = this.$options.pipelines[name]

            while(pipeline.length > 0){
              let event = pipeline.shift()
              // let {options, event} = obj
              // eval('pipe.'+options)
              // console.log('firing pipe', event_name, event)
              let event_name = Object.keys(event)[0]

              if(!events[event_name]) events[event_name] = []
              events[event_name].push(Object.clone(event[event_name]))

              // pipe.fireEvent(event_name, event[event_name])

              /**
              * removed queue, works better with rethinkdb lauching all events at once
              */
              // __events_queue.push({pipeline: pipe, event: event}, function(event){
              //   //// console.log('EVENT fired', event, new Date())
              // })
            }
            Object.each(events, function(arr_events, type){
              console.log('firing...', type, arr_events)
              pipe.fireEvent(type, [arr_events])
            })

            delete this.$options.__pipelines_events[name]



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
    * @end - events
    **/
    /**
    * @start - charts
    **/
    add_chart: function (payload){
      let {name, chart, init, watch, watcher} = payload

      this.$set(this.charts, name, chart)

      if(init && typeof init == 'function')
        init(payload)


    },
    remove_chart: function (name, options){
      options = options || {}

      if(this.charts[name] && this.charts[name].stop && typeof this.charts[name].stop == 'function')
        this.charts[name].stop(this.charts[name])


      this.$delete(this.charts, name)

    },
    remove_charts: function(options){
      Object.each(this.charts, function(chart, name){
        this.remove_chart(name, options)
      }.bind(this))
    },
    sync_charts: function(){
      if(this.$options.__sync == null){
        let gs = []
        // let sync = []

        //////////////////////////////////console.log(this.$refs, this.host)
        Object.each(this.$refs, function(ref, name){
          if(this.visibility[name] === true)
            Array.each(ref, function(_ref){
              if(_ref.$children && _ref.$options.visible === true)
                Array.each(_ref.$children, function(child){
                  if(child.$options.graph instanceof Dygraph){
                    console.log('sync charts', name, ref)
                    gs.push(child.$options.graph)
                  }
                })
            })
          // if(ref[0] && ref[0].$children)
          //
          //   && (this.visibles[name] != false || this.freezed == true ))
          // {
          //   ////////////////////////////////console.log('charts', name, ref[0].chart, ref[0].chart instanceof Dygraph)
          //
          // // if(ref[0].chart instanceof Dygraph){
          //
          //   gs.push(ref[0].chart)
          //   // sync.push(ref[0])
          // }
        }.bind(this))

        this.unsync_charts()

        console.log('GS', gs)

        if(gs.length > 1){
          this.$options.__sync = synchronize(gs, {
            zoom: true,
            // selection: true,
            range: false
          })


        }
      }
    },
    unsync_charts: function(){
      if(this.$options.__sync){
        // ////////console.log('detaching', this.$options.sync)
        this.$options.__sync.detach()
        this.$options.__sync = undefined
      }
    },
    __init_charts: function(){
    },

    __process_dashoard_charts: function(doc){
      ////console.log('recived doc via Event charts', doc)
      // let counter = 0
      let charts_objects = {}
      Object.each(doc.charts, function(data, name){
        if(data.chart){
          // this.$options.charts_objects[name] = data.chart
          charts_objects[name] = data.chart
        }
        else{//named chart like os.cpus->times os.cpus->percentage

          Object.each(data, function(chart_data, chart_name){
            // this.$options.charts_objects[name+'.'+chart_name] = chart_data.chart
            charts_objects[name+'.'+chart_name] = chart_data.chart
          }.bind(this))

        }

        // if(counter == Object.getLength(doc.charts) - 1)
        //   this.charts_objects_init = true
        //
        // counter++
      }.bind(this))

      this.$store.commit('dashboard_'+this.id+'/charts', charts_objects)
    },
    __process_dashoard_instances: function(doc){
      ////console.log('recived doc via Event instances', doc)
      // let counter = 0
      let instances_objects = {}
      Object.each(doc.instances, function(data, name){
        // if(data.instance){
        //   // this.$options.instances_objects[name] = data.instance
        //   instances_objects[name] = data.instance
        // }
        // else{//named instance like os.cpus->times os.cpus->percentage

          Object.each(data, function(instance_data, instance_name){
            // this.$options.instances_objects[name+'.'+instance_name] = instance_data.instance
            let path = name+'_'+instance_name
            path = path.replace(/\./g, '_')
            Object.each(instance_data, function(value, key){
              let new_key = key.replace(/\%/g, 'percentage_')
              delete instance_data[key]
              instance_data[new_key] = value
            })
            instances_objects[path] = instance_data
          }.bind(this))

        // }

        // if(counter == Object.getLength(doc.instances) - 1)
        //   this.instances_objects_init = true
        //
        // counter++
      }.bind(this))

      this.$store.commit('dashboard_'+this.id+'/instances', instances_objects)
    },
    /**
    * @end - charts
    **/

    /**
    * @start - STATS
    **/
    __process_dashoard_stats: function(payload){

      // if(payload.range == true)
        // //console.log('recived doc via Event stats', payload)

      let type = (payload.tabular == true) ? 'tabulars' : 'stats'
      let init = (payload.tabular == true) ? 'tabulars_init' : 'stats_init'
      // let iterate = (type == 'tabulars') ? payload.stats : payload.stats.data
      let whitelist = (type == 'tabulars') ? this.$options.tabulars_whitelist : this.$options.stats_whitelist
      let blacklist = (type == 'tabulars') ? this.$options.tabulars_blacklist : this.$options.stats_blacklist

      let counter = 0
      Object.each(payload.stats, function(data, path){
        let new_path = undefined
        let new_val = undefined
        if(Array.isArray(data)){

          // if((whitelist && whitelist.test(path)) || (blacklist && !blacklist.test(path)))

          if(this.__white_black_lists_filter(whitelist, blacklist, path))
            this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path, value: data})
        }
        else{

          Object.each(data, function(value, key){
            if(Array.isArray(value)){

              // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))


              if(this.__white_black_lists_filter(whitelist, blacklist, path+'_'+key))
                this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path+'_'+key, value: value})

            }
            else{
              //3rd level, there is no need for more
              Object.each(value, function(val, sub_key){

                if(this.__white_black_lists_filter(whitelist, blacklist, path+'_'+key+'_'+sub_key))
                  this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path+'_'+key+'_'+sub_key, value: val})

              }.bind(this))
            }



          }.bind(this))
        }


        if(counter == Object.getLength(payload.stats) - 1)
          this.$set(this, init, true)

        counter++
      }.bind(this))


    },
    __white_black_lists_filter: function(whitelist, blacklist, str){
      let filtered = false
      if(!blacklist && !whitelist){
        filtered = true
      }
      else if(blacklist && !blacklist.test(str)){
        filtered = true
      }
      else if(blacklist && blacklist.test(str) && (whitelist && whitelist.test(str))){
        filtered = true
      }
      else if(!blacklist && (whitelist && whitelist.test(str))){
        filtered = true
      }

      return filtered
    },
    /**
    * @end - STATS
    **/

    /**
    * @start life cycle
    **/
    __clean_create: function(next){
      if(next)
        next()
    },

    __create: function(paths, next){
      EventBus.$once('charts', this.__process_dashoard_charts)
      EventBus.$once('instances', this.__process_dashoard_instances)
      EventBus.$on('stats', this.__process_dashoard_stats)

      this.set_range(moment().subtract(5, 'minute'), moment())

      if(Object.getLength(this.$options.pipelines) == 0){
        this.create_pipelines(paths, next)
      }
      else if(next){
        next()
      }
    },
    __mount: function(next){
      //console.log('life cycle __mount')

      if(this.all_init === true){
        this.__init_charts()
      }
      else{
        let unwatch_all_init = this.$watch('all_init', function(val){
          //console.log('all_init', val)
          if(val == true){

            unwatch_all_init()

            this.__init_charts()
          }
        })//watcher
      }


      if(next)
        next()
    },
    __clean_destroy: function(next){
      Object.each(this.charts, function(chart, name){
        this.set_chart_visibility(name, false)
      }.bind(this))


      EventBus.$off('highlightCallback')
      EventBus.$on('unhighlightCallback')

      EventBus.$off('charts', this.__process_dashoard_charts)
      EventBus.$off('instances', this.__process_dashoard_instances)
      EventBus.$off('stats', this.__process_dashoard_stats)

      this.stats_init = false
      this.tabulars_init = false

      this.$options.charts_payloads = {}

      this.destroy_pipelines()

      Object.each(this.$options.unwatchers, function(unwatcher, name){
        if(typeof unwatcher === 'function' )
          unwatcher()
      }.bind(this))
      this.$options.unwatchers = {}

      this.$set(this, 'reactive_data', {})
      this.$set(this, 'available_charts', {})

      this.$store.commit('tabulars_sources/clear')
      this.$store.commit('stats_sources/clear')

      // this.$store.dispatch('stats/flush_all', {host: this.host})
      // this.$store.dispatch('stats_tabular/flush_all', {host: this.host})

      // this.$store.dispatch('stats/splice', {host: this.host, length: 300})
      // this.$store.dispatch('stats_tabular/splice', {host: this.host, length: 300})

      if(next)
        next()
    },
    /**
    * @end life cycle
    **/

    /**
    * @start - UI
    **/
    set_chart_visibility: function (id, isVisible){

      if(
        isVisible == false
        && this.available_charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == true)
      ){
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
        ////////////console.log('set_chart_visibility REMOVE', id, isVisible, this.visibility[id])
        // this.$store.dispatch('stats/splice', this.available_charts[id].stat)
        // this.$store.dispatch('stats_tabular/splice', this.available_charts[id].stat)
      }
      else if (
        isVisible == true
        && this.available_charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == false)
      ){
        ////////console.log('set_chart_visibility ADD', id, isVisible, this.available_charts[id])
        this.$set(this.visibility, id, true)
        this.add_chart(this.available_charts[id], id)
      }

    },
    showCollapsible (collapsible){
      ////////////console.log('showCollapsible', $(collapsible).attr('id'))
      this.$options.collapsibles[$(collapsible).attr('id')] = true
      // this.$options.has_no_data[collapsible.replace('-collapsible', '')] = 0
      // this.$set(this.hide, collapsible.replace('-collapsible', ''), false)
      let id = $(collapsible).attr('id').replace('-collapsible', '')

      this.set_chart_visibility(id, true)
    },
    hideCollapsible (collapsible){
      ////////////console.log('hideCollapsible', $(collapsible).attr('id'))
      this.$options.collapsibles[$(collapsible).attr('id')] = false

      let id = $(collapsible).attr('id').replace('-collapsible', '')

      this.set_chart_visibility(id, false)

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
