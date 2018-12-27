<template>
  <section class="content">
    <div class="row">
      <section class="col-xs-12 col-sm-12 col-lg-12 connectedSortable">

        <admin-lte-box-solid
          :header="false"
        >
          <!-- <div class="col-md-3 col-sm-6 col-xs-12"> -->
            <bootstrap-daterangepicker-wrapper
              @click="update_daterangepicker"
              @range="set_range"
              :options="daterangepicker"
            />
          <!-- </div> -->
        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Summary"
          :id="host+'_summary-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

        </admin-lte-box-solid>


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
    <!-- <input-vue-watcher></input-vue-watcher> -->
  </section>
</template>

<style>
</style>

<script>

import sourceStore from 'src/store/source'

import moment from 'moment/min/moment-with-locales'
import bootstrapDaterangepickerWrapper from 'components/wrappers/bootstrap.daterangepicker.vue'

let extract_data_os = require( 'node-mngr-docs' ).extract_data_os
let extract_data_os_historical = require( 'node-mngr-docs' ).extract_data_os_historical

import Vue from 'vue'
import { mapState } from 'vuex'

// import parallel from 'async/parallel'

// import sizeof from 'object-sizeof'

import Pipeline from 'js-pipeline'


// import HostTemplatePipeline from '@libs/pipelines/host.template'
import HostPipeline from '@libs/pipelines/host'

import HostHistoricalTemplatePipeline from '@libs/pipelines/host.historical.template'
import HostMuninTemplatePipeline from '@libs/pipelines/host.munin.template'


let host_pipelines_templates = [
  // HostTemplatePipeline,
  // HostMuninTemplatePipeline,
  // HostHistoricalTemplatePipeline
  HostPipeline
]

import AdminLteBoxSolid from 'components/admin-lte/boxSolid'
import AdminLteDashboardHostSummary from 'components/admin-lte/dashboard/host/summary'

import dashboard from 'components/mixins/dashboard'


// import uptime_chart from 'components/charts/uptime'
// import loadavg_chart from 'components/charts/loadavg'
// import cpus_times_chart from 'components/charts/cpus_times'
// import cpus_percentage_chart from 'components/charts/cpus_percentage'
// import freemem_chart from 'components/charts/freemem'
// import mounts_percentage_chart from 'components/charts/mounts_percentage'
// import blockdevices_stats_chart from 'components/charts/blockdevices_stats'
// import networkInterfaces_chart from 'components/charts/networkInterfaces'

// import cpusTimesDygraph from 'components/charts/os/cpus_times_dygraph'

import dygraph_line_chart from 'mngr-ui-admin-charts/defaults/dygraph.line'
import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'
import networkInterfaces_stats_chart from 'mngr-ui-admin-charts/os/networkInterfaces_stats'
// import procs_count_chart from 'mngr-ui-admin-charts/os/procs_count'
// import procs_top_chart from 'mngr-ui-admin-charts/os/procs_top'

import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'
import jqueryKnob from 'mngr-ui-admin-charts/defaults/jqueryKnob'

import * as Highcharts from 'highcharts'

let highchartsVueGauge = require('mngr-ui-admin-charts/defaults/highchartsVue.gauge')(Highcharts)

//import charts_payloads from '@etc/charts.payloads'
import host_charts_payloads from '@etc/host.charts.payloads'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

  host_charts: {},
  collapsibles: {},
  charts_objects: {},
  // charts: {},
  pipelines: {},
  // pipelines_events: {},
  // __active_stats: {},

  /**
  * should be user session configs?
  **/
  // stats_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  // stats_whitelist: /os_procs_stats|os_procs_cmd_stats|os_procs_uid_stats|freemem|totalmem|cpus/,
  stats_whitelist: /freemem|totalmem|cpus/,
  // tabulars_blacklist: /multicast|packets|frame|compressed|fifo/i,
  tabulars_whitelist: /^((?!multicast|frame|compressed|fifo).)*$/,

  daterangepicker:{
    opens: 'right',
    timePicker: true,
    timePicker24Hour: true,
    timePickerSeconds: true,
    alwaysShowCalendars: true,
    startDate: moment().subtract(29, 'days'),
    endDate  : moment(),
    ranges: {
      'Last 5 mins': [function(){ return moment().subtract(5, 'minute')}, function(){ return moment() }],
      'Last 15 mins': [function(){ return moment().subtract(15, 'minute')}, function(){ return moment()}],
      'Last Hour': [function(){ return moment().subtract(1, 'hour')}, function(){ return moment() }],
    }
  },

  // range_started: false,
  // tabular_range_started: false,
  // props: {
  //   host: {
  //     type: [String],
  //     default: () => ('')
  //   }
  // },

  components: {
    AdminLteBoxSolid,
    AdminLteDashboardHostSummary,
    bootstrapDaterangepickerWrapper
    // cpusTimesDygraph
    // dygraphWrapper
  },

  // visible_paths:['os', 'os.procs'],

  breadcrumb () {
    return {
      label: this.host,
      parent: 'Dashboard'
    }
  },



  data () {
    return {
      charts_objects_init: false,
      stats_init: false,
      tabulars_init: false,
      reactive_data:{},//manually merged stats

      // mounts: {},
      // blockdevices: {},
      // networkInterfaces_properties: {},
      // stats_merged:{},
      visibility: {},
      daterangepicker:{
        opens: 'right',
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        alwaysShowCalendars: true,
        startDate: moment().subtract(29, 'days'),
        endDate  : moment(),
        ranges: {
          'Last 5 mins': [moment().subtract(5, 'minute'), moment()],
          'Last 15 mins': [moment().subtract(15, 'minute'), moment()],
          'Last Hour': [moment().subtract(1, 'hour'), moment()],
        }
      }
    }
  },
  // pouch: {
  //   host: {}
  // },

  watch: {
    'host': function(newVal, oldVal) { this.create_host_pipelines(this.$store.state.app.paths) },
    '$store.state.app.paths': function(newVal, oldVal) { this.create_host_pipelines(newVal) }
  },
  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,
      // reset: state => state.app.reset,
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

      hosts: state => state.hosts.all,

      // cpus: state => state.stats_sources.'+this.host+'_os_procs_stats_kernel'
      cpus: function(state){
        return state.stats_sources[this.host+'_os_cpus'][0].value
      },

      host: function(state){
        return state.hosts.current || this.$route.params.host
      },

      host_charts: function(state){
        let host = state.hosts.current || this.$route.params.host
        if(state['host_'+host].charts && Object.getLength(state['host_'+host].charts) > 0){
          // //console.log('host_charts', state['host_'+host].charts)
          return state['host_'+host].charts
        }
        else{
          return undefined
        }
      },


    }),
    {
      all_init: function(){
        if(
          this.host_charts != undefined
          && this.stats_init == true
          && this.tabulars_init == true
          && this.range.length > 0
          // && Object.getLength(this.$store.state.stats_sources) > 0
          // && Object.getLength(this.$store.state.tabulars_sources) > 0
        ){
        // if(this.host_charts != undefined){
          return true
        }
        else{
          return false
        }
      }
    }
  ),

  mounted: function(){
    //console.log('life cycle mounted')

    this.__mount()
  },




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
  // beforeCreate: function(){
  //   //console.log('life cycle beforeCreate')
  //   this.__clean_create()
  //
  // },
  created: function(){
    //console.log('life cycle created')
    this.__clean_create(
      this.__create.pass([this.$store.state.app.paths], this)
    )

  },
  beforeDestroy: function(){
    //console.log('life cycle beforeDestroy')
    this.__clean_destroy()
  },
  destroyed: function(){
    //console.log('life cycle destroyed')
    this.$off()
  },
  methods: {
    __create: function(paths, next){
      EventBus.$once('charts', this.__process_dashoard_charts)
      EventBus.$on('stats', this.__process_dashoard_stats)

      this.set_range(moment().subtract(5, 'minute'), moment())

      if(Object.getLength(this.$options.pipelines) == 0){
        this.create_host_pipelines(paths, next)
      }
      else if(next){
        next()
      }
    },
    __mount: function(next){
      //console.log('life cycle __mount')

      // //console.log('EventBus.$listeners', EventBus)
      if(this.all_init === true){
        this.__init_charts()
      }
      else{
        let unwatch_all_init = this.$watch('all_init', function(val){
          //console.log('all_init', val)
          if(val == true){
            //console.log('all_init', val, this.host_charts)

            ////console.log('all_init STATS',this['stats'])
            ////console.log('all_init TABULARS', this['tabulars'])
            ////console.log('all_init CHARTS', this.$options.charts_objects)

            unwatch_all_init()

            this.__init_charts()
          }
        })//watcher
      }


      /**
      * remove for testing
      **/


      /**
      * pie
      **/
      // this.available_charts[this.host+'_os_freemem_pie'] = {
      //   name: this.host+'_os_freemem_pie',
      //   chart: Object.merge(Object.clone(pie_chart), {
      //     totalmem: this.os_stats.totalmem.value.data,
      //     watch: {
      //       /**
      //       * @trasnform: diff between each value against its prev one
      //       */
      //       transform: function(values, caller, chart){
      //         let last = values[values.length - 1]
      //         last.value = last.value * 100 / chart.totalmem
      //         // //////////////console.log('_os_freemem_pie transform', values, chart.totalmem, last)
      //         return values
      //       }
      //     },
      //     options:{
      //       // 'track-color': false,
      //       size: 80,
      //       // animated: false,
      //       'font-size': '14px',
      //       "bar-color": function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#ff704d'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#86b300'
      //         }
      //       }
      //     }
      //   }),
      //   init: this.__get_stat_for_chart.bind(this),
      //   stop: function(payload){
      //     // //this.$store.dispatch('stats/flush', payload.stat)
      //   }.bind(this),
      //   stat: {
      //     host: this.host,
      //     path: 'os',
      //     key: 'freemem',
      //     length: 1,
      //     // tabular:true
      //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      //   },
      //   pipeline: {
      //     name: 'input.os',
      //     path: 'os',
      //     range: true
      //   }
      // }

      /**
      * knob
      */
      // this.available_charts[this.host+'_os_freemem_knob'] = {
      //   name: this.host+'_os_freemem_knob',
      //   chart: Object.merge(Object.clone(jqueryKnob), {
      //     totalmem: this.os_stats.totalmem.value.data,
      //     watch: {
      //       /**
      //       * @trasnform: diff between each value against its prev one
      //       */
      //       transform: function(values, caller, chart){
      //         let last = values[values.length - 1]
      //         last.value = last.value * 100 / chart.totalmem
      //         // //////////////console.log('_os_freemem_knob transform', values, chart.totalmem, last)
      //         return values
      //       }
      //     },
      //     options:{
      //       readOnly: true,
      //       displayPrevious: true,
      //       thickness: 0.1,
      //       width: 80,
      //       skin: 'tron',
      //       // bgColor: 'black',
      //       fgColor: function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#ff704d'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#86b300'
      //         }
      //       },
      //       inputColor: function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#ff704d'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#86b300'
      //         }
      //       }
      //     }
      //   }),
      //   init: this.__get_stat_for_chart.bind(this),
      //   stop: function(payload){
      //     // //this.$store.dispatch('stats/flush', payload.stat)
      //   }.bind(this),
      //   stat: {
      //     host: this.host,
      //     path: 'os',
      //     key: 'freemem',
      //     length: 1,
      //     // tabular:true
      //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      //   },
      //   pipeline: {
      //     name: 'input.os',
      //     path: 'os',
      //     range: true
      //   }
      // }


      /**
      * remove for testing
      **/

      if(next)
        next()
    },
    __clean_destroy: function(next){
      Object.each(this.charts, function(chart, name){
        this.set_chart_visibility(name, false)
      }.bind(this))

      EventBus.$off('charts', this.__process_dashoard_charts)
      EventBus.$off('stats', this.__process_dashoard_stats)

      this.stats_init = false
      this.tabulars_init = false

      this.$options.host_charts = {}

      this.destroy_host_pipelines()

      Object.each(this.$options.unwatchers, function(unwatcher, name){
        if(typeof unwatcher === 'function' )
          unwatcher()
      }.bind(this))
      this.$options.unwatchers = {}

      this.$set(this, 'reactive_data', {})
      this.$set(this, 'available_charts', {})

      this.$store.commit('tabulars_sources/clear')
      this.$store.commit('stats_sources/clear')

      // this.remove_charts()
      // this.remove_charts({
      //   // clean: true,
      //   unwatch: true,
      // })
      // this.remove_chart_stats()

      // this.$store.dispatch('stats/flush_all', {host: this.host})
      // this.$store.dispatch('stats_tabular/flush_all', {host: this.host})

      // this.$store.dispatch('stats/splice', {host: this.host, length: 300})
      // this.$store.dispatch('stats_tabular/splice', {host: this.host, length: 300})

      if(next)
        next()
    },
    __clean_create: function(next){
      EventBus.$off('host')
      EventBus.$off('os')


      if(next)
        next()
    },
    __init_charts: function(){
      this.$options.host_charts = host_charts_payloads({
        host: this.host,
        // seconds: this.seconds,
        seconds: 300,
        range: this.range,
      })


      // let merged_chart = Object.merge(
      //   Object.clone(cpus_times_chart),
      //   Object.merge(this.host_charts['os.cpus.times'])
      // )
      //
      // // let merged_chart = Object.merge(
      // //   Object.clone(cpus_percentage_chart),
      // //   Object.merge(this.host_charts['.os.cpus.percentage'])
      // // )
      //
      //
      // if(merged_chart.options.labels){
      //   Array.each(merged_chart.options.labels, function(label, index){
      //     merged_chart.options.labels[index] = 'cpus times '+label
      //   })
      //
      //   merged_chart.options.labels.push('uptime seconds')
      //   // merged_chart.options.labels.push('1 min load avg')
      //
      //
      //   this.$set(this.available_charts, this.host+'.merged', Object.merge(
      //     this.$options.host_charts['merged'],
      //     {
      //       chart: merged_chart,
      //     })
      //   )
      //   this.set_chart_visibility(this.host+'.merged', true)
      // }




      //console.log('this.$options.host_charts', this.$options.host_charts)

      this.$set(this.available_charts, this.host+'.os.cpus.times', Object.merge(
        this.$options.host_charts['os.cpus.times'],
        {
          chart: Object.merge(cpus_times_chart, this.host_charts['os.cpus.times']),
        })
      )

      this.set_chart_visibility(this.host+'.os.cpus.times', true)

      this.$set(this.available_charts, this.host+'.os.cpus.percentage', Object.merge(
        this.$options.host_charts['os.cpus.percentage'],
        {
          chart: Object.merge(cpus_percentage_chart, this.host_charts['.os.cpus.percentage']),
        })
      )

      this.set_chart_visibility(this.host+'.os.cpus.percentage', true)

      // //console.log('this.available_charts', this.available_charts)
      //
      // /**
      // * remove for testing
      // **/
      //
      // /**
      // * pie
      // **/
      // // this.available_charts[this.host+'_os_cpus_percentage_pie'] = {
      // //   name: this.host+'_os_cpus_percentage_pie',
      // //   chart: Object.merge(Object.clone(pie_chart), {
      // //     options:{
      // //       // 'track-color': false,
      // //       size: 120,
      // //       // animated: false,
      // //       'font-size': '24px',
      // //       "bar-color": function(percentage){
      // //         if(percentage > 0 && percentage < 33){
      // //           return '#86b300'
      // //         }
      // //         else if(percentage > 33 && percentage < 66){
      // //           return '#f6d95b'
      // //         }
      // //         else{
      // //           return '#ff704d'
      // //         }
      // //       }
      // //     }
      // //   }),
      // //   init: this.__get_stat_for_chart.bind(this),
      // //   stop: function(payload){
      // //     // //this.$store.dispatch('stats/flush', payload.stat)
      // //   }.bind(this),
      // //   stat: {
      // //     host: this.host,
      // //     path: 'cpus_percentage',
      // //     key: 'os_cpus',
      // //     length: 1,
      // //     tabular: true
      // //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      // //   },
      // //   pipeline: {
      // //     name: 'input.os',
      // //     path: 'os',
      // //     // range: true
      // //   }
      // // }
      //
      // // this.available_charts[this.host+'_os_cpus_percentage_knob'] = {
      // //   name: this.host+'_os_cpus_percentage_knob',
      // //   chart: Object.merge(Object.clone(jqueryKnob), {
      // //     options:{
      // //       readOnly: true,
      // //       displayPrevious: true,
      // //       // thickness: 0.1,
      // //       width: 120,
      // //       // skin: 'tron',
      // //       angleOffset: 235,
      // //       angleArc: 250,
      // //       // bgColor: 'black',
      // //       fgColor: function(percentage){
      // //         if(percentage > 0 && percentage < 33){
      // //           return '#86b300'
      // //         }
      // //         else if(percentage > 33 && percentage < 66){
      // //           return '#f6d95b'
      // //         }
      // //         else{
      // //           return '#ff704d'
      // //         }
      // //       },
      // //       inputColor: function(percentage){
      // //         if(percentage > 0 && percentage < 33){
      // //           return '#86b300'
      // //         }
      // //         else if(percentage > 33 && percentage < 66){
      // //           return '#f6d95b'
      // //         }
      // //         else{
      // //           return '#ff704d'
      // //         }
      // //       }
      // //     }
      // //   }),
      // //   init: this.__get_stat_for_chart.bind(this),
      // //   stop: function(payload){
      // //     // //this.$store.dispatch('stats/flush', payload.stat)
      // //   }.bind(this),
      // //   stat: {
      // //     host: this.host,
      // //     path: 'cpus_percentage',
      // //     key: 'os_cpus',
      // //     length: 1,
      // //     tabular: true
      // //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      // //   },
      // //   pipeline: {
      // //     name: 'input.os',
      // //     path: 'os',
      // //     // range: true
      // //   }
      // // }
      //
      // /**
      // * gauge
      // **/

      // /**
      // * remove for testing
      // **/
      // this.available_charts[this.host+'.os.cpus.percentage_gauge'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os.cpus.percentage',
      //     host: this.host,
      //     seconds: 1
      //   }),
      //   {
      //     name: this.host+'.os.cpus.percentage_gauge',
      //     chart: highchartsVueGauge,
      //     // init: this.__get_stat_for_chart.bind(this),
      //     stop: function(payload){
      //       //this.remove_watcher(payload.name)
      //       //this.$store.dispatch('stats/flush', payload.stat)
      //     }.bind(this),
      //     pipeline: {
      //       range: true
      //     }
      //   }
      // )
      //
      // this.set_chart_visibility(this.host+'.os.cpus.percentage_gauge', true)


      this.$set(this.available_charts, this.host+'.os.uptime', Object.merge(
        this.$options.host_charts['os.uptime'],
        {
          chart: Object.merge(uptime_chart, this.host_charts['os.uptime']),
        })
      )
      this.set_chart_visibility(this.host+'.os.uptime', true)

      this.$set(this.available_charts, this.host+'.os.loadavg', Object.merge(
        this.$options.host_charts['os.loadavg'],
        {
          chart: Object.merge(this.host_charts['os.loadavg'], loadavg_chart),
        })
      )

      this.set_chart_visibility(this.host+'.os.loadavg', true)

      /**
      * procs: kernel - user
      **/
      this.$set(this.reactive_data, 'os_procs_stats', [])
      this.$options.unwatchers['os_procs_stats'] = this.$watch('$store.state.stats_sources.'+this.host+'_os_procs_stats_kernel', function(val, old){

        // let data = [{
        //   timestamp: val[0].timestamp,
        //   value: {
        //     kernel: (Object.keys(val[0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value,
        //     user: (Object.keys(this.$store.state.stats_sources[this.host+'_os_procs_stats_user'][0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value
        //   }
        // }]
        let data = [
          val[0].timestamp,
          (Object.keys(val[0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value,//kernel
          (Object.keys(this.$store.state.stats_sources[this.host+'_os_procs_stats_user'][0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value//user
        ]

        this.$set(this.reactive_data['os_procs_stats'], 0, [data])
        // this.reactive_data['os_procs_stats'].push(data)

      }.bind(this),{deep:true})

      // //console.log('this.reactive_data.os_procs_stats', this.reactive_data.os_procs_stats)

      this.$set(this.available_charts, this.host+'.os_procs_stats', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_stats']),
        {
          tabular: true,//value watcher converts data to tabular
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            "options": {
              valueRange: [0, 100],
              labels: ['Time', 'kernel %', 'user %'],
            },
            // watch: {
            // }
          })

        })
      )

      this.$set(this.available_charts[this.host+'.os_procs_stats'].stat, 'data', this.reactive_data.os_procs_stats)

      this.set_chart_visibility(this.host+'.os_procs_stats', true)

      //console.log('os_procs_stats', this.available_charts[this.host+'.os_procs_stats'])

      /**
      * procs: kernel - user
      **/

      /**
      * @start reactive chart.options.labels
      * procs: %cpu top 5
      **/
      let self = this

      let os_procs_stats_percentage_cpu_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        valueRange: [0, self.cpus.length * 100],
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_cpu', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_percentage_cpu',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_stats_percentage_cpu'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            // "options": {
            //   valueRange: [0, self.cpus.length * 100],
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_percentage_cpu transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.push('pid['+data['pid']+']')
                        chart.top.pids.push(data['pid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.push('pid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['pid'])
                    if(_index > -1){
                      transform_value[_index] = data['%cpu']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )


      // this.available_charts[this.host+'.os_procs_stats_percentage_cpu'].chart.options = undefined
      this.$set(this.available_charts[this.host+'.os_procs_stats_percentage_cpu'].chart, 'options', os_procs_stats_percentage_cpu_options)

      //console.log('os_procs_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_stats_percentage_cpu'])

      this.set_chart_visibility(this.host+'.os_procs_stats_percentage_cpu', true)

      /**
      * @end reactive chart.options.labels
      * procs: %cpu top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs: %mem top 5
      **/
      /**
      * @todo tabular
      **/

      let os_procs_stats_percentage_mem_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        valueRange: [0, 100],
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_mem', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_percentage_mem',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_stats_percentage_mem'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            // "options": {
            //   valueRange: [0, 100],
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_percentage_mem transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.push('pid['+data['pid']+']')
                        chart.top.pids.push(data['pid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.push('pid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['pid'])
                    if(_index > -1){
                      transform_value[_index] = data['%mem']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )

      this.$set(this.available_charts[this.host+'.os_procs_stats_percentage_mem'].chart, 'options', os_procs_stats_percentage_mem_options)

      //console.log('os_procs_stats_percentage_mem', this.available_charts[this.host+'.os_procs_stats_percentage_mem'])

      this.set_chart_visibility(this.host+'.os_procs_stats_percentage_mem', true)

      /**
      * @end reactive chart.options.labels
      * procs: %mem top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs: elapsed top 5
      **/

      let os_procs_stats_elapsed_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_stats_elapsed', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_elapsed',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_stats_elapsed'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            // "options": {
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_elapsed transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.push('pid['+data['pid']+']')
                        chart.top.pids.push(data['pid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.push('pid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['pid'])
                    if(_index > -1){
                      transform_value[_index] = data['elapsed']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['elapsed'] : transform_value[_others_index] + data['elapsed']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )

      this.$set(this.available_charts[this.host+'.os_procs_stats_elapsed'].chart, 'options', os_procs_stats_elapsed_options)

      //console.log('os_procs_stats_elapsed', this.available_charts[this.host+'.os_procs_stats_elapsed'])

      this.set_chart_visibility(this.host+'.os_procs_stats_elapsed', true)

      /**
      * @end reactive chart.options.labels
      * procs: elapsed top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs: time top 5
      **/


      let os_procs_stats_time_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_stats_time', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_time',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_stats_time'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            // "options": {
            //   labels: ['Time'],
            // },
            "options": undefined,

            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_time transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_time'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.push('pid['+data['pid']+']')
                        chart.top.pids.push(data['pid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.push('pid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['pid'])
                    if(_index > -1){
                      transform_value[_index] = data['time']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )

      this.$set(this.available_charts[this.host+'.os_procs_stats_time'].chart, 'options', os_procs_stats_time_options)

      //console.log('os_procs_stats_time', this.available_charts[this.host+'.os_procs_stats_time'])

      this.set_chart_visibility(this.host+'.os_procs_stats_time', true)

      /**
      * @end reactive chart.options.labels
      * procs: time top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/


      let os_procs_cmd_stats_percentage_cpu_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        valueRange: [0, self.cpus.length * 100],
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_cpu', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_percentage_cpu',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_percentage_cpu'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            // "options": {
            //   valueRange: [0, self.cpus.length * 100],
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_percentage_cpu transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.push('cmd['+data['cmd']+']')
                        chart.top.pids.push(data['cmd'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.push('cmd[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['cmd'])
                    if(_index > -1){
                      transform_value[_index] = data['%cpu']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )

      //console.log('os_procs_cmd_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_cmd_stats_percentage_cpu'])
      this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_percentage_cpu'].chart, 'options', os_procs_cmd_stats_percentage_cpu_options)

      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_cpu', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/


      /**
      * @start reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      let os_procs_cmd_stats_percentage_mem_options = Object.merge(Object.clone(dygraph_line_chart.options), {
        valueRange: [0, 100],
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_mem', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_percentage_mem',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_percentage_mem'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              cmds: []
            },

            // "options": {
            //   valueRange: [0, 100],
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_cmd_stats_percentage_mem transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['cmd']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                        self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.push('cmd['+data['cmd']+']')
                        chart.top.cmds.push(data['cmd'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.push('cmd[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.cmds.indexOf(data['cmd'])
                    if(_index > -1){
                      transform_value[_index] = data['%mem']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )

      //console.log('os_procs_cmd_stats_percentage_mem', this.available_charts[this.host+'.os_procs_cmd_stats_percentage_mem'])
      this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_percentage_mem'].chart, 'options', os_procs_cmd_stats_percentage_mem_options)

      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_mem', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: time top 5
      **/


      let os_procs_cmd_stats_time_options = Object.merge(Object.clone(dygraph_line_chart.options),{
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_time', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_time',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_time'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              cmds: []
            },

            // "options": {
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_cmd_stats_time transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['cmd']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                        self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.push('cmd['+data['cmd']+']')
                        chart.top.cmds.push(data['cmd'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.push('cmd[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.cmds.indexOf(data['cmd'])
                    if(_index > -1){
                      transform_value[_index] = data['time']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )

      //console.log('os_procs_cmd_stats_time', this.available_charts[this.host+'.os_procs_cmd_stats_time'])
      this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_time'].chart, 'options', os_procs_cmd_stats_time_options)

      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_time', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: time top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: count top 5
      **/

      let os_procs_cmd_stats_count_options = Object.merge(Object.clone(dygraph_line_chart.options),{
        labels: ['Time'],
      })

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_count', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_count',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_count'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              cmds: []
            },

            // "options": {
            //   labels: ['Time'],
            // },
            "options": undefined,
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_cmd_stats_count transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['cmd']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                        self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.push('cmd['+data['cmd']+']')
                        chart.top.cmds.push(data['cmd'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.push('cmd[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.length - 1)
                  transform_value.fill(0)

                  let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.cmds.indexOf(data['cmd'])
                    if(_index > -1){
                      transform_value[_index] = data['count']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['count'] : transform_value[_others_index] + data['count']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )



      //console.log('os_procs_cmd_stats_count', this.available_charts[this.host+'.os_procs_cmd_stats_count'])
      this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_count'].chart, 'options', os_procs_cmd_stats_count_options)

      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_count', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: count top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.uid: %cpu top 5
      **/


      this.$set(this.available_charts, this.host+'.os_procs_uid_stats_percentage_cpu', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_percentage_cpu',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_percentage_cpu'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              pids: []
            },

            "options": {
              valueRange: [0, self.cpus.length * 100],
              labels: ['Time'],
            },
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_stats_percentage_cpu transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['pid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                        self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.push('uid['+data['uid']+']')
                        chart.top.pids.push(data['uid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.push('uid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.pids.indexOf(data['uid'])
                    if(_index > -1){
                      transform_value[_index] = data['%cpu']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )

      //console.log('os_procs_uid_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_uid_stats_percentage_cpu'])

      this.set_chart_visibility(this.host+'.os_procs_uid_stats_percentage_cpu', true)

      /**
      * @end reactive chart.options.labels
      * procs.uid: %cpu top 5
      **/


      /**
      * @start reactive chart.options.labels
      * procs.uid: %mem top 5
      **/


      this.$set(this.available_charts, this.host+'.os_procs_uid_stats_percentage_mem', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_percentage_mem',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_percentage_mem'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              uids: []
            },

            "options": {
              valueRange: [0, 100],
              labels: ['Time'],
            },
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_uid_stats_percentage_mem transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['uid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                        self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.push('uid['+data['uid']+']')
                        chart.top.uids.push(data['uid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.push('uid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.uids.indexOf(data['uid'])
                    if(_index > -1){
                      transform_value[_index] = data['%mem']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })

        })
      )

      //console.log('os_procs_uid_stats_percentage_mem', this.available_charts[this.host+'.os_procs_uid_stats_percentage_mem'])

      this.set_chart_visibility(this.host+'.os_procs_uid_stats_percentage_mem', true)

      /**
      * @end reactive chart.options.labels
      * procs.uid: %mem top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.uid: time top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_uid_stats_time', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_time',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_time'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              uids: []
            },

            "options": {
              labels: ['Time'],
            },
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_uid_stats_time transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['uid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                        self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.push('uid['+data['uid']+']')
                        chart.top.uids.push(data['uid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.push('uid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.uids.indexOf(data['uid'])
                    if(_index > -1){
                      transform_value[_index] = data['time']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )

      //console.log('os_procs_uid_stats_time', this.available_charts[this.host+'.os_procs_uid_stats_time'])

      this.set_chart_visibility(this.host+'.os_procs_uid_stats_time', true)

      /**
      * @end reactive chart.options.labels
      * procs.uid: time top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.uid: count top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_uid_stats_count', Object.merge(
        Object.clone(this.$options.host_charts['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_count',
          stat: {
            sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_count'}],
          },
          chart: Object.merge(Object.clone(dygraph_line_chart),{
            pre_process: function(chart, name, stat){
              // //console.log('os_procs_stats pre_process', chart, name, stat)
              return chart
            },
            top: {
              count: 5,
              uids: []
            },

            "options": {
              labels: ['Time'],
            },
            watch: {

              transform: function(values, caller, chart, cb){

                // //console.log('os_procs_uid_stats_count transform', values)
                let transformed = []

                for(let index = 0; index < values.length; index++){
                  // let transform_value = []
                  let val = values[index]


                  // let length = val.value.length
                  // val.value.splice(
                  //   (chart.top * -1) -1,
                  //   length - chart.top
                  // )
                  //
                  // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options, 'labels', ['Time'])
                  //
                  if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
                    Array.each(val.value, function(data, data_index){
                      // //console.log('pre transformed: ', data)
                      // if(index < chart.top)
                      //   transform_value.push(data['uid']*1)

                      if(chart.options.labels.length < chart.top.count){
                        // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                        self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.push('uid['+data['uid']+']')
                        chart.top.uids.push(data['uid'])
                      }

                    })

                    self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.push('uid[others]')
                  }

                  let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.length - 1)
                  transform_value.fill(0)


                  let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.length - 2 //remember, first label is Time
                  Array.each(val.value, function(data, data_index){
                    let _index = chart.top.uids.indexOf(data['uid'])
                    if(_index > -1){
                      transform_value[_index] = data['count']
                    }
                    else{
                      transform_value[_others_index] = (!transform_value[_others_index]) ? data['count'] : transform_value[_others_index] + data['count']
                    }
                  })

                  if(!transform_value[_others_index])
                    transform_value[_others_index] = 0

                  let transform = {timestamp: val.timestamp, value: transform_value}

                  transformed.push(transform)

                  if(index == values.length -1){
                    // //console.log('transformed: ', transformed)
                    cb( transformed )
                  }
                }
              }.bind(self)
            }
          })
        })
      )



      //console.log('os_procs_uid_stats_count', this.available_charts[this.host+'.os_procs_uid_stats_count'])

      this.set_chart_visibility(this.host+'.os_procs_uid_stats_count', true)

      /**
      * @end reactive chart.options.labels
      * procs.uid: count top 5
      **/

      // this.$set(this.available_charts, this.host+'.os_procs.count.pids', Object.merge(
      //   this.$options.host_charts['os_procs.count.pids'],
      //   {
      //     chart: Object.merge(this.host_charts['os_procs.count'], procs_count_chart),
      //   })
      // )
      //
      // this.set_chart_visibility(this.host+'.os_procs.count.pids', true)
      //
      // this.$set(this.available_charts, this.host+'.os_procs.count.cmd', Object.merge(
      //   this.$options.host_charts['os_procs.count.cmd'],
      //   {
      //     chart: Object.merge(this.host_charts['os_procs.count'], procs_count_chart),
      //   })
      // )
      //
      // this.set_chart_visibility(this.host+'.os_procs.count.cmd', true)
      //
      // this.$set(this.available_charts, this.host+'.os_procs.count.uids', Object.merge(
      //   this.$options.host_charts['os_procs.count.uids'],
      //   {
      //     chart: Object.merge(this.host_charts['os_procs.count'], procs_count_chart),
      //   })
      // )
      //
      // this.set_chart_visibility(this.host+'.os_procs.count.uids', true)


      // //console.log('this.host_charts', this.host_charts)

      // this.$set(this.available_charts, this.host+'.os_procs_stats.uids', Object.merge(
      //   this.$options.host_charts['os_procs_stats.uids'],
      //   {
      //     // stat:{
      //     //   sources: [{type: 'stats', path: this.host+'.os_procs.pids'}],
      //     // },
      //     chart: Object.clone(procs_top_chart),
      //   })
      // )
      // // //console.log('PROCS TOP', this.available_charts[this.host+'.os_procs.uids'])
      //
      // this.set_chart_visibility(this.host+'.os_procs_stats.uids', true)



      // if(!this.available_charts[this.host+'.os.freemem']){
      // this.available_charts[this.host+'.os.freemem'] = Object.merge(
      let __unwacth_freemem = this.$watch('$store.state.stats_sources', function(val){

        if(val[this.host+'_os_totalmem']){
          __unwacth_freemem()

          this.$set(this.available_charts, this.host+'.os.freemem', Object.merge(
            this.$options.host_charts['os.freemem'],
            {
              chart: Object.merge(Object.clone(freemem_chart), {totalmem: this.$store.state.stats_sources[this.host+'_os_totalmem'][0].value}),
            })
          )

          this.set_chart_visibility(this.host+'.os.freemem', true)
        }
      }, {deep: true})

      // }


      let mount = new RegExp(this.host+'_os_mounts')
      let blockdevice = new RegExp(this.host+'_os_blockdevices')
      let networkInterface = new RegExp(this.host+'_os_networkInterfaces_stats')

      let _merge = []
      let _merged_charts = {}

      let __unwacth_mounts = this.$watch('$store.state.tabulars_sources', function(val){
        Object.each(this.$store.state.tabulars_sources, function(stat, key){
          if(mount.test(key)){
            let _name = key.substring(key.lastIndexOf('_') + 1)
            // let prop_name = _name.substr(_name.indexOf('_') + 1)
            if(!_merge.contains(_name))
              _merge.push(_name)

          }
        })
        //console.log('MERGED MOUNT', _merge)

        Object.each(this.$store.state.tabulars_sources, function(stat, key){
          if(mount.test(key) && this.host_charts['os_mounts.percentage']){
            __unwacth_mounts()

            let _name = key.substring(key.lastIndexOf('_') + 1)
            let chart_name = this.host+'.os_mounts.'+_name

            // let merge_name = _name.substr(0, _name.indexOf('_'))
            // let prop_name = _name.substr(_name.indexOf('_') + 1)

            if(_merge.contains(_name)){
              let merged_chart_name = this.host+'.os_mounts'
              Array.each(_merge, function(name){
                merged_chart_name += '.'+name
              })

              if(!_merged_charts[merged_chart_name]){
                _merged_charts[merged_chart_name] = Object.merge(
                  Object.clone(this.$options.host_charts['os_mounts.percentage']),
                  {
                    stat: {
                      merged: true,
                      sources: [],
                    },
                    name: merged_chart_name,
                    chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.host_charts['os_mounts.percentage'])),
                  })

                  _merged_charts[merged_chart_name].chart.options.labels = ['Time']
                }

              _merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_mounts_percentage_'+_name}
              )

              let __labels = Array.clone(this.host_charts['os_mounts.percentage'].options.labels)
              __labels.shift() //remove 'Time' column

              Array.each(__labels, function(label, index){
                _merged_charts[merged_chart_name].chart.options.labels.push(_name+' '+label)
              })

              if(_merge.indexOf(_name) == _merge.length - 1){//last item
                this.$set(this.available_charts, merged_chart_name, _merged_charts[merged_chart_name])
                if(this.available_charts[merged_chart_name].stat.sources.length == 1)
                  this.available_charts[merged_chart_name].stat.merged = false

                this.set_chart_visibility(merged_chart_name, true)

                //console.log('MERGED MOUNT', _merged_charts[merged_chart_name])

                delete _merged_charts[merged_chart_name]


              }

            }
            else if(!this.available_charts[chart_name]){
              // //console.log('adding mount chart ',chart_name)

              this.$set(this.available_charts, chart_name, Object.merge(
                Object.clone(this.$options.host_charts['os_mounts.percentage']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'.os_mounts.percentage.'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.host_charts['os_mounts.percentage'])),
                })
              )

              // this.$set(this.mounts, _name, 1)
              this.set_chart_visibility(chart_name, true)
            }

          }

          }.bind(this))
      }, {deep:true})

      let __unwacth_blockdevices = this.$watch('$store.state.tabulars_sources', function(val){
        Object.each(this.$store.state.tabulars_sources, function(stat, key){

          if(blockdevice.test(key) && this.host_charts['os_blockdevices.stats']){
            __unwacth_blockdevices()

            let _name = key.substring(key.lastIndexOf('_') + 1)
            let chart_name = this.host+'.os_blockdevices.stats.'+_name

            // //console.log('BLK', chart_name)

            if(!this.available_charts[chart_name]){

              this.$set(this.available_charts, chart_name, Object.merge(
                Object.clone(this.$options.host_charts['os_blockdevices.stats']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'_os_blockdevices_stats_'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.host_charts['os_blockdevices.stats'])),
                })
              )

              // this.$set(this.blockdevices, _name, 1)
              this.set_chart_visibility(chart_name, true)
            }
          }
        }.bind(this))

      },{deep:true})

      // let __networkInterfaces_merge = /drop|errs/
      let __networkInterfaces_merge = ['packets', 'drop', 'errs']
      // __networkInterfaces_merge.sort(function(a,b) {return (a > b) ? 1 : ((b > a) ? -1 : 0);} )
      __networkInterfaces_merge.sort()
      let __networkInterfaces_merged_charts = {}

      let __unwacth_networkInterfaces = this.$watch('$store.state.tabulars_sources', function(val){
        Object.each(this.$store.state.tabulars_sources, function(stat, key){
          // //console.log('networkInterface KEY',key)

          if(networkInterface.test(key) && this.host_charts['os_networkInterfaces_stats.properties']){
            __unwacth_networkInterfaces()
            // let _name = key.substring(key.lastIndexOf('_') + 1)//not last '_'
            let arr_key = key.split('_')
            let _name = arr_key[arr_key.length - 2]+'_'+arr_key[arr_key.length - 1] //last 2 items
            let chart_name = this.host+'.os_networkInterfaces_stats.properties.'+_name
            let iface_name = _name.substr(0, _name.indexOf('_'))
            let prop_name = _name.substr(_name.indexOf('_') + 1)

            // //console.log('IFACE', iface_name, prop_name)
            if(__networkInterfaces_merge.contains(prop_name)){
              let merged_chart_name = this.host+'.os_networkInterfaces_stats.properties.'+iface_name
              Array.each(__networkInterfaces_merge, function(name){
                merged_chart_name += '.'+name
              })

              if(!__networkInterfaces_merged_charts[merged_chart_name]){
                __networkInterfaces_merged_charts[merged_chart_name] = Object.merge(
                  Object.clone(this.$options.host_charts['os_networkInterfaces_stats.properties']),
                  {
                    stat: {
                      merged: true,
                      sources: [],
                    },
                    name: merged_chart_name,
                    chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.host_charts['os_networkInterfaces_stats.properties'])),
                  })

                  __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels = ['Time']
                }

              __networkInterfaces_merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_networkInterfaces_stats_properties_'+_name}
              )

              let __labels = Array.clone(this.host_charts['os_networkInterfaces_stats.properties'].options.labels)
              __labels.shift() //remove 'Time' column

              Array.each(__labels, function(label, index){
                __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels.push(prop_name+' '+label)
              })

              if(__networkInterfaces_merge.indexOf(prop_name) == __networkInterfaces_merge.length - 1){//last item
                this.$set(this.available_charts, merged_chart_name, __networkInterfaces_merged_charts[merged_chart_name])

                if(this.available_charts[merged_chart_name].stat.sources.length == 1)
                  this.available_charts[merged_chart_name].stat.merged = false

                this.set_chart_visibility(merged_chart_name, true)

                //console.log('MERGED NET', __networkInterfaces_merged_charts[merged_chart_name])

                delete __networkInterfaces_merged_charts[merged_chart_name]


              }

            }
            else if(!this.available_charts[chart_name]){

              this.$set(this.available_charts, chart_name, Object.merge(
                Object.clone(this.$options.host_charts['os_networkInterfaces_stats.properties']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'_os_networkInterfaces_stats_properties_'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.host_charts['os_networkInterfaces_stats.properties'])),
                })
              )
              // this.$set(this.networkInterfaces_properties, _name, 1)
              this.set_chart_visibility(chart_name, true)
            }



          }

        }.bind(this))

      }, {deep:true})


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

      this.$store.commit('host_'+this.host+'/charts', charts_objects)
    },
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
            this.$store.commit(type+'_sources/add', {key: payload.host+'_'+path, value: data})
        }
        else{

          Object.each(data, function(value, key){
            if(Array.isArray(value)){

              // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))


              if(this.__white_black_lists_filter(whitelist, blacklist, path+'_'+key))
                this.$store.commit(type+'_sources/add', {key: payload.host+'_'+path+'_'+key, value: value})

            }
            else{
              //3rd level, there is no need for more
              Object.each(value, function(val, sub_key){

                if(this.__white_black_lists_filter(whitelist, blacklist, path+'_'+key+'_'+sub_key))
                  this.$store.commit(type+'_sources/add', {key: payload.host+'_'+path+'_'+key+'_'+sub_key, value: val})

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
    update_daterangepicker: function(){
      ////////////console.log('update_daterangepicker')
      Object.each(this.$options.daterangepicker.ranges, function(range, key){
        // range[1] = moment(new Date())
        // this.$set(this.daterangepicker.ranges[key], 1, moment(Date.now()))
        Array.each(range, function(start_or_end, index){
          if(typeof this.$options.daterangepicker.ranges[key][index] == 'function')
            this.$set(this.daterangepicker.ranges[key], index, this.$options.daterangepicker.ranges[key][index]())

        }.bind(this))
        //////////////console.log('update_daterangepicker', this.daterangepicker.ranges[key])
      }.bind(this))

    },
    set_range: function(start, end){
      // ////////console.log('set_range', start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf())
      let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      this.$store.commit('app/range', range)

      // let counter = 0
      // Object.each(this.available_charts, function(payload, name){
      //   let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      //   let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      //   this.$store.commit('app/range', Array.clone(range))
      //   // if(Array.isArray(this.available_charts[name].stat)){
      //   //   Array.each(this.available_charts[name].stat, function(stat, index){
      //   //     this.available_charts[name].stat[index].range = Array.clone(range)//clone it, as each one may modify range
      //   //     this.available_charts[name].stat[index].length = length
      //   //
      //   //     let indexed_name = name +'_'+index
      //   //     this.remove_watcher(indexed_name)
      //   //   }.bind(this))
      //   // }
      //   // else{
      //   //   this.available_charts[name].stat.range = Array.clone(range)
      //   //   this.available_charts[name].stat.length = length
      //   //   this.remove_watcher(name)
      //   // }
      //
      //   // this.remove_chart(name, {unwatch: true})
      //
      //
      //   // // if(name.indexOf('networkInterface') == -1)
      //   // if(!payload.init || typeof payload.init != 'function'){
      //   //   this.__get_stat_for_chart(this.available_charts[name])
      //   //   //////////////console.log('set_range __get_stat_for_chart', this.available_charts[name])
      //   // }
      //
      //   // if(counter == Object.getLength(this.available_charts) - 1)
      //   //   this.$nextTick(this.fire_pipelines_events())
      //
      //   counter++
      // }.bind(this))


    },
    get_payload: function(payloads, payload){
      let {name, host, seconds, range} = payload
      let result = Object.clone(payloads[name])

      result.name = host+'.'+result.name
      result.stat.host = host
      result.stat.length = seconds || result.stat.length
      result.stat.range = range || result.stat.range

      return result
    },

    process_os_tabular: function(doc){
      //////////////////console.log('process_os_tabular', doc)
      if(doc.metadata != null && doc.metadata.host == this.host){
        Object.each(doc.data, function(row, path){
          Object.each(row, function(data, key){

            if(data.length > 0){
              if(Array.isArray(data[0])){//array of array, range data
                let result = []
                Array.each(data, function(value) {

                  result.push({
                    timestamp: value[0],
                    value: value
                  })



                }.bind(this))

                //////////////////console.log('process_os_tabular', path, key, result)

                this.$store.dispatch('stats_tabular/add', {
                  host: this.host,
                  path: path,
                  key: key,
                  data: result
                })
              }
              else{
                this.$store.dispatch('stats_tabular/add', {
                  host: this.host,
                  path: path,
                  key: key,
                  data: {
                    timestamp: data[0],
                    value: data
                  }
                })
              }
            }

          }.bind(this))
        }.bind(this))
      }
    },
    /**
    * copied to mngr-ui-admin-app/os
    **/
    process_os_doc: function(doc, cb){

      let paths = {}

      if(Array.isArray(doc)){
        Array.each(doc, function(row){

          if(row.doc != null && row.doc.metadata.host == this.host){
            let {keys, path, host} = extract_data_os(row.doc)

            // ////////////////////console.log('ROW', keys, path)

            if(!paths[path])
              paths[path] = {}


            Object.each(keys, function(data, key){
              // ////////////////////console.log('ROW', key, data)
              if(!paths[path][key])
                paths[path][key] = []

              paths[path][key].push(data)
            })
          }
        }.bind(this))
      }
      else if(doc.metadata.host == this.host){
        let {keys, path, host} = extract_data_os(doc)
        if(!paths[path])
          paths[path] = {}

        paths[path] = keys
      }

      cb(paths)


    },
    __add_os_doc_stats_tabular(paths){
      ////////////console.log('__add_os_doc_stats_tabular', paths)
      Object.each(paths, function(keys, path){
        ////////////console.log('__add_os_doc_stats_tabular PATH', path)

        Object.each(keys, function(data, key){
          ////////////console.log('__add_os_doc_stats_tabular KEY', key, data)
          // this.$store.dispatch('stats/add', {
          //   host: this.host,
          //   path: path,
          //   key: key,
          //   data: data
          // })
          let stat = {}

          if(Array.isArray(data[0])){//array of array, range data
            let result = []
            Array.each(data, function(value) {

              result.push({
                timestamp: value[0],
                value: value
              })


            }.bind(this))

            // result.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

            //////////////////console.log('process_os_tabular', path, key, result)
            stat = {
              tabular:true,
              host: this.host,
              path: path,
              key: key,
              data: result
            }


          }
          else{
            stat = {
              tabular:true,
              host: this.host,
              path: path,
              key: key,
              data: {
                timestamp: data[0],
                value: data
              }
            }
          }

          if(this.check_active_stat(stat) == true)
            this.$store.dispatch('stats/add', stat)

        }.bind(this))

      }.bind(this))
    },
    __add_os_doc_stats(paths){
      ////////////console.log('__add_os_doc_stats', paths)
      Object.each(paths, function(keys, path){
        ////////////console.log('__add_os_doc_stats PATH', path)

        Object.each(keys, function(data, key){
          ////////////console.log('__add_os_doc_stats KEY', key, data)
          let stat = {
            tabular:false,
            host: this.host,
            path: path,
            key: key,
            data: data
          }

          if(this.check_active_stat(stat) == true)
            this.$store.dispatch('stats/add', stat)

        }.bind(this))

      }.bind(this))
    },

    /**
    * @start pipelines
    **/
    create_host_pipelines: function (paths, next) {
      // paths = ['os.procs']
      //////////////////////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$route.params.host || this.$store.state.hosts.current

      //console.log('life cycle create_host_pipelines', host)

      // let range = Object.clone(this.$store.state.app.range)


      if(paths.length > 0){
        this.destroy_host_pipelines()

        // Array.each(hosts, function(host){
        Array.each(host_pipelines_templates, function(pipeline_template){

          // Array.each(paths, function(path){//one pipeline per used/visible path
          //   if(this.$options.visible_paths.contains(path)){

              let template = Object.clone(pipeline_template)

              template.input[0].poll.conn[0].stat_host = host
              // template.input[0].poll.conn[0].paths = paths
              // template.input[0].poll.conn[0].paths = [path]
              let pipeline_id = template.input[0].poll.id
              template.input[0].poll.id += '-'+host
              template.input[0].poll.conn[0].id = template.input[0].poll.id

              let pipe = new Pipeline(template)

              //////////////////////////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                ////////////////////////////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  //////////////////////////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  //////////////////////////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

                  this.$store.commit('app/suspend', false)//

                  /** manually resume **/
                  pipe.fireEvent('onResume')

                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', false)
                }
              }.bind(this))

              // this.hosts_pipelines.push(pipe)
              // this.$store.commit('host_'+host+'/add', {id: pipeline_id, pipeline: pipe})
              this.$options.pipelines[pipeline_id] = pipe

              // if(range[1] == null){
              //   range[1] = new Date().getTime()
              // }

              // pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

              if(this.$store.state.app.suspend != true){
                //////////////////////////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

                /** manually resume **/
                // pipe.fireEvent('onResume')
              }
            // }
          // }.bind(this))
        }.bind(this))

        // }.bind(this))
      }

      // //console.log('NEXT', next)
      if(next)
        next()
    },
    destroy_host_pipelines () {
      let host = this.$store.state.hosts.current || this.$route.params.host

      if(
        host
        && Object.getLength(this.$options.pipelines) > 0
      ){
        Object.each(this.$options.pipelines, function(pipe, id){//destroy old ones
          pipe.fireEvent('onSuspend')
          pipe.fireEvent('onExit')
          pipe.removeEvents()
          // delete pipe
          // delete this.hosts_pipelines[index]
          // // this.hosts_pipelines.shift()
          delete this.$options.pipelines[id]
        }.bind(this))

        // this.$set(this.hosts_pipelines, [])
        // this.$store.commit('host_'+host+'/clear')

      }
    },
    /**
    * @end pipelines
    **/

    /**
    * @start UI related
    **/
    visibilityChanged (isVisible, entry) {
      // let {path, list} = this.name_to_module(entry.target.id.replace('-card',''))
      if(this.$options.collapsibles[entry.target.id] == undefined || this.$options.collapsibles[entry.target.id] == true){
        let id = entry.target.id.replace('-collapsible', '')
        this.set_chart_visibility(id, isVisible)
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
    /**
    * @end UI related
    **/
  },



}


</script>

<style>
/* .highcharts-background {
	fill: #efefef;
	stroke: #a4edba;
	stroke-width: 2px;
} */
/* .highcharts-yaxis-grid .highcharts-grid-line {
	display: none;
} */
/* .highcharts-background {
	fill: #FFFFFF;
	stroke: #a4edba;
	stroke-width: 0px;
} */
.highcharts-yaxis-grid .highcharts-grid-line {
	display: none;
  stroke-width: 0px;
}
.highcharts-axis.highcharts-color-0 .highcharts-axis-line {
  display: none;
  stroke-width: 0px;
}
</style>
