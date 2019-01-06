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

  charts_payloads: {},
  collapsibles: {},
  charts_objects: {},

  pipelines: {},


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


  components: {
    AdminLteBoxSolid,
    AdminLteDashboardHostSummary,
    bootstrapDaterangepickerWrapper
  },

  breadcrumb () {
    return {
      label: this.host,
      parent: 'Dashboard'
    }
  },



  data () {
    return {
      // charts_objects_init: false,
      stats_init: false,
      tabulars_init: false,
      reactive_data:{},//manually merged stats

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


  watch: {
    'host': function(newVal, oldVal) { this.create_pipelines(this.$store.state.app.paths) },
    '$store.state.app.paths': function(newVal, oldVal) { this.create_pipelines(newVal) }
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

      charts_payloads: function(state){
        let host = state.hosts.current || this.$route.params.host
        if(state['host_'+host].charts && Object.getLength(state['host_'+host].charts) > 0){
          // //console.log('charts_payloads', state['host_'+host].charts)
          return state['host_'+host].charts
        }
        else{
          return undefined
        }
      },
      host_instances: function(state){
        let host = state.hosts.current || this.$route.params.host
        if(state['host_'+host].instances && Object.getLength(state['host_'+host].instances) > 0){
          // //console.log('host_instances', state['host_'+host].instances)
          return state['host_'+host].instances
        }
        else{
          return undefined
        }
      },

    }),
    {
      all_init: function(){
        if(
          this.charts_payloads != undefined
          && this.host_instances != undefined
          && this.stats_init == true
          && this.tabulars_init == true
          && this.range.length > 0
          // && Object.getLength(this.$store.state.stats_sources) > 0
          // && Object.getLength(this.$store.state.tabulars_sources) > 0
        ){
        // if(this.charts_payloads != undefined){
          return true
        }
        else{
          return false
        }
      }
    }
  ),

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

  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  },

  created: function(){
    //console.log('life cycle created')
    this.__clean_create(
      this.__create.pass([this.$store.state.app.paths], this)
    )

  },


  methods: {

    __clean_create: function(next){
      EventBus.$off('host')
      EventBus.$off('os')


      if(next)
        next()
    },
    __init_charts: function(){
      this.$options.charts_payloads = host_charts_payloads({
        host: this.host,
        // seconds: this.seconds,
        seconds: 300,
        range: this.range,
      })


      this.$set(this.available_charts, this.host+'.os.cpus.times', Object.merge(
        this.$options.charts_payloads['os.cpus.times'],
        {
          chart: Object.merge(cpus_times_chart, this.charts_payloads['os.cpus.times']),
        })
      )

      this.set_chart_visibility(this.host+'.os.cpus.times', true)

      this.$set(this.available_charts, this.host+'.os.cpus.percentage', Object.merge(
        this.$options.charts_payloads['os.cpus.percentage'],
        {
          chart: Object.merge(cpus_percentage_chart, this.charts_payloads['.os.cpus.percentage']),
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
        this.$options.charts_payloads['os.uptime'],
        {
          chart: Object.merge(uptime_chart, this.charts_payloads['os.uptime']),
        })
      )
      this.set_chart_visibility(this.host+'.os.uptime', true)

      this.$set(this.available_charts, this.host+'.os.loadavg', Object.merge(
        this.$options.charts_payloads['os.loadavg'],
        {
          chart: Object.merge(this.charts_payloads['os.loadavg'], loadavg_chart),
        })
      )

      this.set_chart_visibility(this.host+'.os.loadavg', true)


      /**
      * procs: kernel - user
      **/

      let self = this

      /**
      * @start reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_cpu', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_percentage_cpu',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_stats_top_percentage_cpu'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_stats_percentage_cpu', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/


      /**
      * @start reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_mem', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_percentage_mem',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_stats_top_percentage_mem'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_stats_percentage_mem', true)


      /**
      * @end reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: time top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_stats_time', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_time',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_stats_top_time'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_stats_top']['time'],
            {"options": {
              valueRange: undefined,
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_stats_time', true)


      /**
      * @end reactive chart.options.labels
      * procs.cmd: time top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: count top 5
      **/


      this.$set(this.available_charts, this.host+'.os_procs_stats_elapsed', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_stats']),
        {
          name: this.host+'.os_procs_stats_elapsed',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_stats_top_elapsed'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_stats_top']['elapsed'],
            {"options": {
              valueRange: undefined,
              // labels: ['elapsed'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_stats_elapsed', true)


      /**
      * @end reactive chart.options.labels
      * procs.cmd: count top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_cpu', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_percentage_cpu',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_cmd_stats_top_percentage_cpu'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_cmd_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_cpu', true)

      /**
      * @end reactive chart.options.labels
      * procs.cmd: %cpu top 5
      **/


      /**
      * @start reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_mem', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_percentage_mem',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_cmd_stats_top_percentage_mem'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_cmd_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_mem', true)


      /**
      * @end reactive chart.options.labels
      * procs.cmd: %mem top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: time top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_time', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_time',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_cmd_stats_top_time'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_cmd_stats_top']['time'],
            {"options": {
              valueRange: undefined,
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_cmd_stats_time', true)


      /**
      * @end reactive chart.options.labels
      * procs.cmd: time top 5
      **/

      /**
      * @start reactive chart.options.labels
      * procs.cmd: count top 5
      **/

      this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_count', Object.merge(
        Object.clone(this.$options.charts_payloads['os_procs_cmd_stats']),
        {
          name: this.host+'.os_procs_cmd_stats_count',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_cmd_stats_top_count'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_cmd_stats_top']['count'],
            {"options": {
              valueRange: undefined,
              // labels: ['Time'],
            }},
          )
        })
      )
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
        Object.clone(this.$options.charts_payloads['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_percentage_cpu',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_uid_stats_top_percentage_cpu'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_uid_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              // labels: ['Time'],
            }},
          )
        })
      )
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
        Object.clone(this.$options.charts_payloads['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_percentage_mem',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_uid_stats_top_percentage_mem'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_uid_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              // labels: ['Time'],
            }},
          )
        })
      )
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
        Object.clone(this.$options.charts_payloads['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_time',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_uid_stats_top_time'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_uid_stats_top']['time'],
            {"options": {
              valueRange: undefined,
              // labels: ['Time'],
            }},
          )
        })
      )
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
        Object.clone(this.$options.charts_payloads['os_procs_uid_stats']),
        {
          name: this.host+'.os_procs_uid_stats_count',
          stat: {
            sources: [{type: 'tabulars', path: this.host+'_os_procs_uid_stats_top_count'}],
          },
          chart: Object.merge(
            this.host_instances['os_procs_uid_stats_top']['count'],
            {"options": {
              valueRange: undefined,
              // labels: ['Time'],
            }},
          )
        })
      )
      this.set_chart_visibility(this.host+'.os_procs_uid_stats_count', true)



      /**
      * @end reactive chart.options.labels
      * procs.uid: count top 5
      **/


      let __unwacth_freemem = this.$watch('$store.state.stats_sources', function(val){

        if(val[this.host+'_os_totalmem']){
          __unwacth_freemem()

          this.$set(this.available_charts, this.host+'.os.freemem', Object.merge(
            this.$options.charts_payloads['os.freemem'],
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
      let munin = new RegExp(this.host+'_munin_')
      let munin_max_range_value = /max/

      let __unwacth_munin = this.$watch('$store.state.tabulars_sources', function(val){
        let _merge = {}
        let _merged_charts = {}


        Object.each(val, function(stat, key){
          if(munin.test(key)){
            let munin_name = key.replace(munin, '')
            let _path = munin_name.substring(0, munin_name.lastIndexOf('_'))
            let _name = munin_name.substring(munin_name.lastIndexOf('_')+1)

            if(!_merge[_path]) _merge[_path] = []

            if(!_merge[_path].contains(_name))
              _merge[_path].push(_name)

            // let _name = key.substring(key.lastIndexOf('_') + 1)
            // // let prop_name = _name.substr(_name.indexOf('_') + 1)
            // if(!_merge.contains(_name))
            //   _merge.push(_name)

          }
        }.bind(this))

        if(Object.getLength(_merge) > 0){
          // console.log('MUNIN',_merge)
           // && (this.charts_payloads['munin'] || this.charts_payloads['munin_'+path]){
          __unwacth_munin()

          Object.each(_merge, function(names, _path){
            let merged_chart_name = this.host+'.munin_'+_path
            /**
            * @removed
            **/
            // Array.each(names, function(_name){
            //   merged_chart_name += '.'+_name
            // })

            if(!_merged_charts[merged_chart_name]){
              _merged_charts[merged_chart_name] = Object.merge(
                Object.clone(this.$options.charts_payloads['munin']),
                {
                  stat: {
                    // sources: [],
                    events: [{
                      host: this.host,
                      path: 'munin_'+_path,
                      tabular: true,
                    }]
                  },
                  name: merged_chart_name,
                  chart: Object.merge(Object.clone(dygraph_line_chart)),
                }
              )

              _merged_charts[merged_chart_name].chart.options.labels = ['Time']
              let options = Object.clone(_merged_charts[merged_chart_name].chart.options)
              _merged_charts[merged_chart_name].chart.options = undefined

              this.$set(this.available_charts, merged_chart_name, Object.merge(_merged_charts[merged_chart_name]))
              this.$set(this.available_charts[merged_chart_name].chart, 'options', options)

              this.$set(this.available_charts[merged_chart_name].chart.options, 'labels', ['Time'])

            }

            Array.each(names, function(_name, _name_index){
              this.available_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_munin_'+_path+'_'+_name}
              )

              if(munin_max_range_value.test(_name))
                this.$set(this.available_charts[merged_chart_name].chart.options,
                  'valueRange',
                  [0, this.$store.state.tabulars_sources[this.host+'_munin_'+_path+'_'+_name][1]]//[0] is timestamp
                )

              this.available_charts[merged_chart_name].chart.options.labels.push(_name)

              if(_name_index == names.length - 1){//last item

                if(this.available_charts[merged_chart_name].stat.sources.length == 1)
                  this.available_charts[merged_chart_name].stat.merged = false


                this.set_chart_visibility(merged_chart_name, true)

                console.log('MERGED MUNIN', this.available_charts[merged_chart_name])

                delete _merged_charts[merged_chart_name]


              }
            }.bind(this))




          }.bind(this))


        }


      }, {deep: true})

      let __unwacth_mounts = this.$watch('$store.state.tabulars_sources', function(val){
        let _merge = []
        let _merged_charts = {}

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
          if(mount.test(key) && this.charts_payloads['os_mounts.percentage']){
            __unwacth_mounts()

            let _name = key.substring(key.lastIndexOf('_') + 1)
            let chart_name = this.host+'.os_mounts.'+_name

            // let merge_name = _name.substr(0, _name.indexOf('_'))
            // let prop_name = _name.substr(_name.indexOf('_') + 1)

            if(_merge.contains(_name)){
              let merged_chart_name = this.host+'.os_mounts'
              /**
              * @removed
              **/
              // Array.each(_merge, function(name){
              //   merged_chart_name += '.'+name
              // })

              if(!_merged_charts[merged_chart_name]){
                _merged_charts[merged_chart_name] = Object.merge(
                  Object.clone(this.$options.charts_payloads['os_mounts.percentage']),
                  {
                    stat: {
                      merged: true,
                      sources: [],
                    },
                    name: merged_chart_name,
                    chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.charts_payloads['os_mounts.percentage'])),
                  }
                )

                _merged_charts[merged_chart_name].chart.options.labels = ['Time']
              }

              _merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_mounts_percentage_'+_name}
              )

              let __labels = Array.clone(this.charts_payloads['os_mounts.percentage'].options.labels)
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
                Object.clone(this.$options.charts_payloads['os_mounts.percentage']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'.os_mounts.percentage.'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.charts_payloads['os_mounts.percentage'])),
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

          if(blockdevice.test(key) && this.charts_payloads['os_blockdevices.stats']){
            __unwacth_blockdevices()

            let _name = key.substring(key.lastIndexOf('_') + 1)
            let chart_name = this.host+'.os_blockdevices.stats.'+_name

            // //console.log('BLK', chart_name)

            if(!this.available_charts[chart_name]){

              this.$set(this.available_charts, chart_name, Object.merge(
                Object.clone(this.$options.charts_payloads['os_blockdevices.stats']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'_os_blockdevices_stats_'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.charts_payloads['os_blockdevices.stats'])),
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

          if(networkInterface.test(key) && this.charts_payloads['os_networkInterfaces_stats.properties']){
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
              /**
              * @removed
              **/
              // Array.each(__networkInterfaces_merge, function(name){
              //   merged_chart_name += '.'+name
              // })

              if(!__networkInterfaces_merged_charts[merged_chart_name]){
                __networkInterfaces_merged_charts[merged_chart_name] = Object.merge(
                  Object.clone(this.$options.charts_payloads['os_networkInterfaces_stats.properties']),
                  {
                    stat: {
                      merged: true,
                      sources: [],
                    },
                    name: merged_chart_name,
                    chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.charts_payloads['os_networkInterfaces_stats.properties'])),
                  })

                  __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels = ['Time']
                }

              __networkInterfaces_merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_networkInterfaces_stats_properties_'+_name}
              )

              let __labels = Array.clone(this.charts_payloads['os_networkInterfaces_stats.properties'].options.labels)
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
                Object.clone(this.$options.charts_payloads['os_networkInterfaces_stats.properties']),
                {
                  stat: {
                    sources: [{type: 'tabulars', path:this.host+'_os_networkInterfaces_stats_properties_'+_name}],
                  },
                  name: chart_name,
                  chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.charts_payloads['os_networkInterfaces_stats.properties'])),
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

      this.$store.commit('host_'+this.host+'/instances', instances_objects)
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


    /**
    * @start pipelines
    **/
    create_pipelines: function (paths, next) {
      // paths = ['os.procs']
      //////////////////////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$route.params.host || this.$store.state.hosts.current

      //console.log('life cycle create_pipelines', host)

      // let range = Object.clone(this.$store.state.app.range)


      if(paths.length > 0){
        this.destroy_pipelines()

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
    destroy_pipelines () {
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
