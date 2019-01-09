<!-- <template>
  <section class="content">
    <div class="row">
      <section class="col-xs-12 col-sm-12 col-lg-12 connectedSortable">

        <admin-lte-box-solid
          :header="false"
        >

            <bootstrap-daterangepicker-wrapper
              @click="update_daterangepicker"
              @range="set_range"
              :options="daterangepicker"
            />

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Summary"
          :id="host+'_summary-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

        </admin-lte-box-solid>


        <template v-for="(chart, name) in available_charts">

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

          </admin-lte-box-solid>
        </template>


      </section>
    </div>

  </section>
</template> -->

<style>
</style>

<script>

// import sourceStore from 'src/store/source'

import moment from 'moment/moment'
import bootstrapDaterangepickerWrapper from 'components/wrappers/bootstrap.daterangepicker.vue'

// let extract_data_os = require( 'node-mngr-docs' ).extract_data_os
// let extract_data_os_historical = require( 'node-mngr-docs' ).extract_data_os_historical

import Vue from 'vue'
import { mapState } from 'vuex'

// import parallel from 'async/parallel'

// import sizeof from 'object-sizeof'

import Pipeline from 'js-pipeline'


// import HostTemplatePipeline from '@libs/pipelines/host.template'
import HostPipeline from '@libs/pipelines/host'

// import HostHistoricalTemplatePipeline from '@libs/pipelines/host.historical.template'
// import HostMuninTemplatePipeline from '@libs/pipelines/host.munin.template'

let host_pipelines_templates = [
  HostPipeline
]

import AdminLteBoxSolid from 'components/admin-lte/boxSolid'
import AdminLteDashboardHostSummary from 'components/admin-lte/dashboard/host/summary'

import dygraph_line_chart from 'mngr-ui-admin-charts/defaults/dygraph.line'
// import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
// import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
// import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
// import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
// import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
// import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'
import networkInterfaces_stats_chart from 'mngr-ui-admin-charts/os/networkInterfaces_stats'

// import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'
// import jqueryKnob from 'mngr-ui-admin-charts/defaults/jqueryKnob'

// import * as Highcharts from 'highcharts'

// let highchartsVueGauge = require('mngr-ui-admin-charts/defaults/highchartsVue.gauge')(Highcharts)

//import charts_payloads from '@etc/charts.payloads'
import host_charts_payloads from '@etc/host.charts.payloads'

import dashboard from 'components/mixins/dashboard'

export default {
  mixins: [dashboard],
  components: {
    AdminLteBoxSolid,
    AdminLteDashboardHostSummary,
    bootstrapDaterangepickerWrapper
  },

  // stats_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  // stats_whitelist: /os_procs_stats|os_procs_cmd_stats|os_procs_uid_stats|freemem|totalmem|cpus/,
  stats_whitelist: /freemem|totalmem|cpus/,
  // tabulars_blacklist: /multicast|packets|frame|compressed|fifo/i,
  tabulars_whitelist: /^((?!multicast|frame|compressed|fifo).)*$/,

  name: 'admin-lte-dashboard-host',

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


  breadcrumb () {
    return {
      label: this.host,
      parent: 'Dashboard'
    }
  },



  data () {
    return {

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


      hosts: state => state.hosts.all,

      // cpus: state => state.stats_sources.'+this.host+'_os_procs_stats_kernel'
      cpus: function(state){
        if(this.host && state.stats_sources[this.host+'_os_cpus']){
          return state.stats_sources[this.host+'_os_cpus'][0].value
        }
        else{
          return undefined
        }
      },

      host: function(state){
        if(state.hosts.current || this.$route.params.host){
          let host = state.hosts.current || this.$route.params.host
          this.id = host
          return host
        }
        else{
          undefined
        }


      },

    }),

  ),


  updated: function(){
    this.$store.commit('hosts/current', this.$route.params.host || '')
  },


  methods: {

    __clean_create: function(next){
      EventBus.$off('host')
      EventBus.$off('os')


      if(next)
        next()
    },
    __init_charts: function(next){
      this.$options.charts_payloads = host_charts_payloads({
        host: this.host,
        seconds: this.seconds,
        // seconds: 300,
        range: this.range,
      })


      this.$set(this.available_charts, this.host+'.os.cpus.times', Object.merge(
        this.$options.charts_payloads['os.cpus.times'],
        {
          // chart: Object.merge(cpus_times_chart, this.dashboard_charts['os.cpus.times']),
          chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_charts['os.cpus.times']),

          // chart: this.dashboard_charts['os.cpus.times'],
        })
      )

      this.set_chart_visibility(this.host+'.os.cpus.times', true)

      this.$set(this.available_charts, this.host+'.os.cpus.percentage', Object.merge(
        this.$options.charts_payloads['os.cpus.percentage'],
        {
          chart: Object.merge(cpus_percentage_chart, this.dashboard_charts['.os.cpus.percentage']),
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
          // chart: Object.merge(uptime_chart, this.dashboard_charts['os.uptime']),
          chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_charts['os.uptime']),
          // chart: this.dashboard_charts['os.uptime'],
        })
      )
      this.set_chart_visibility(this.host+'.os.uptime', true)

      this.$set(this.available_charts, this.host+'.os.loadavg', Object.merge(
        this.$options.charts_payloads['os.loadavg'],
        {
          // chart: Object.merge(this.dashboard_charts['os.loadavg'], loadavg_chart),
          chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_charts['os.loadavg']),
          // chart: this.dashboard_charts['os.loadavg'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_stats_top']['time'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_stats_top']['elapsed'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_cmd_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_cmd_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_cmd_stats_top']['time'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_cmd_stats_top']['count'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_uid_stats_top']['percentage_cpu'],
            {"options": {
              valueRange: [0, self.cpus.length * 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_uid_stats_top']['percentage_mem'],
            {"options": {
              valueRange: [0, 100],
              stackedGraph: true,
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_uid_stats_top']['time'],
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
            Object.clone(dygraph_line_chart),
            this.dashboard_instances['os_procs_uid_stats_top']['count'],
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
              chart: Object.merge(Object.clone(dygraph_line_chart), freemem_chart, {totalmem: this.$store.state.stats_sources[this.host+'_os_totalmem'][0].value}),
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
           // && (this.dashboard_charts['munin'] || this.dashboard_charts['munin_'+path]){
          __unwacth_munin()

          Object.each(_merge, function(names, _path){
            let merged_chart_name = this.host+'.munin_'+_path
            /**
            * @removed
            **/
            // Array.each(names, function(_name){
            //   merged_chart_name += '.'+_name
            // })
            console.log('this.dashboard_instances', this.dashboard_instances)

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
                  // chart: Object.clone(dygraph_line_chart),

                  chart: (this.dashboard_instances['munin_'+_path]) ? Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_instances['munin_'+_path][names[0]])) : Object.clone(dygraph_line_chart),
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
          if(mount.test(key) && this.dashboard_charts['os_mounts.percentage']){
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
                    // chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.dashboard_charts['os_mounts.percentage'])),
                    chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_mounts.percentage'])),
                    // chart: Object.clone(this.dashboard_charts['os_mounts.percentage']),
                  }
                )

                _merged_charts[merged_chart_name].chart.options.labels = ['Time']
              }

              _merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_mounts_percentage_'+_name}
              )

              let __labels = Array.clone(this.dashboard_charts['os_mounts.percentage'].options.labels)
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
                  // chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.dashboard_charts['os_mounts.percentage'])),
                  chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_mounts.percentage'])),
                  // chart: Object.clone(this.dashboard_charts['os_mounts.percentage']),
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

          if(blockdevice.test(key) && this.dashboard_charts['os_blockdevices.stats']){
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
                  // chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.dashboard_charts['os_blockdevices.stats'])),
                  chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_blockdevices.stats'])),
                  // chart: Object.clone(this.dashboard_charts['os_blockdevices.stats']),
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

          if(networkInterface.test(key) && this.dashboard_charts['os_networkInterfaces_stats.properties']){
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
                    // chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties'])),
                    chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties'])),
                    // chart: Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties']),
                  })

                  __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels = ['Time']
                }

              __networkInterfaces_merged_charts[merged_chart_name].stat.sources.push(
                {type: 'tabulars', path:this.host+'_os_networkInterfaces_stats_properties_'+_name}
              )

              let __labels = Array.clone(this.dashboard_charts['os_networkInterfaces_stats.properties'].options.labels)
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
                  // chart: Object.merge(Object.clone(networkInterfaces_stats_chart), Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties'])),
                  chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties'])),
                  // chart: Object.clone(this.dashboard_charts['os_networkInterfaces_stats.properties']),
                })
              )
              // this.$set(this.networkInterfaces_properties, _name, 1)
              this.set_chart_visibility(chart_name, true)
            }



          }

        }.bind(this))

      }, {deep:true})


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
