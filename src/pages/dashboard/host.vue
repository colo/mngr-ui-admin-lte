<template>
  <section class="content">
    <div class="row">
      <section class="col-lg-12 connectedSortable">

        <admin-lte-box-solid
          :header="false"
        >
          <div class="col-md-3 col-sm-6 col-xs-12">
            <bootstrap-daterangepicker-wrapper
              @click="update_daterangepicker"
              @range="set_range"
              :options="daterangepicker"
            />
          </div>
        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Summary"
          :id="host+'_summary-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >


        <!-- <div class="col-md-3 col-sm-6 col-xs-12"
        :id="host+'_os_freemem_pie-collapsible'"
        v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
        >
          <chart
            v-if="visibility[host+'_os_freemem_pie']"
            :type="'vue-easy-pie-chart'"
            :wrapper_props="{'decimals': 1}"
            :ref="host+'_os_freemem_pie'"
            :id="host+'_os_freemem_pie'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_freemem_pie']"
            :stat="stats[host+'_os_freemem_pie']"
          >
          </chart>
          <div class="description-block border-right">
            <span class="description-percentage text-blue"><i class="fa fa-caret-up"></i></span>
            <h5 class="description-header">free memory</h5>
          </div>
        </div> -->

        <!-- <div class="col-md-3 col-sm-6 col-xs-12"
        :id="host+'_os_cpus_percentage_pie-collapsible'"
        v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
        >
          <chart-tabular
           available_chartsty[host+'_os_cpus_percentage_pie']"
            :type="'vue-easy-pie-chart'"
            :wrapper_props="{'decimals': 1}"
            :ref="host+'_os_cpus_percentage_pie'"
            :id="host+'_os_cpus_percentage_pie'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_percentage_pie']"
            :stat="stats[host+'_os_cpus_percentage_pie']"
          >
          </chart-tabular>
          <div class="description-block border-right">
            <span class="description-percentage text-green"><i class="fa fa-caret-up"></i></span>
            <h5 class="description-header">cpus utilization</h5>
          </div>
        </div> -->

        <div class="col-md-3 col-sm-6 col-xs-12"
        :id="host+'_os_freemem_knob-collapsible'"
        v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
        >

          <div class="description-block border-right">
            <chart
              v-if="visibility[host+'_os_freemem_knob']"
              :type="'jquery-knob'"
              :wrapper_props="{'decimals': 1, 'animation': false}"
              :ref="host+'_os_freemem_knob'"
              :id="host+'_os_freemem_knob'"
              :EventBus="EventBus"
              :chart="charts[host+'_os_freemem_knob']"
              :stat="stats[host+'_os_freemem_knob']"
            >
            </chart>
            <!-- <span class="description-percentage text-green"><i class="fa fa-caret-up"></i></span>
            <h5 class="description-header">freemem</h5> -->
            <!-- <span class="description-text">CPUS Consumption</span> -->
          </div>
          <!-- /.description-block -->


        </div>

        <div class="col-md-3 col-sm-6 col-xs-12"
        :id="host+'_os_cpus_percentage_knob-collapsible'"
        v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
        >

          <div class="description-block border-right">
            <chart-tabular
              v-if="visibility[host+'_os_cpus_percentage_knob']"
              :type="'jquery-knob'"
              :wrapper_props="{'decimals': 1, 'animation': false}"
              :ref="host+'_os_cpus_percentage_knob'"
              :id="host+'_os_cpus_percentage_knob'"
              :EventBus="EventBus"
              :chart="charts[host+'_os_cpus_percentage_knob']"
              :stat="stats[host+'_os_cpus_percentage_knob']"
            >
            </chart-tabular>
            <!-- <span class="description-percentage text-green"><i class="fa fa-caret-up"></i></span>
            <h5 class="description-header">cpus utilization</h5> -->
            <!-- <span class="description-text">CPUS Consumption</span> -->
          </div>
          <!-- /.description-block -->


        </div>

        <div class="col-md-3 col-sm-6 col-xs-12"
        :id="host+'_os_cpus_percentage_gauge-collapsible'"
        v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
        >

          <div class="description-block border-right">
            <chart-tabular
              v-if="visibility[host+'_os_cpus_percentage_gauge']"
              :type="'highcharts-vue'"
              :wrapper_props="{'decimals': 1, 'gauge': true}"
              :ref="host+'_os_cpus_percentage_gauge'"
              :id="host+'_os_cpus_percentage_gauge'"
              :EventBus="EventBus"
              :chart="charts[host+'_os_cpus_percentage_gauge']"
              :stat="stats[host+'_os_cpus_percentage_gauge']"
            >
            </chart-tabular>
            <!-- <span class="description-percentage text-green"><i class="fa fa-caret-up"></i></span> -->
            <h5 class="description-header">cpus utilization</h5>
            <!-- <span class="description-text">CPUS Consumption</span> -->
          </div>
          <!-- /.description-block -->


        </div>

        </admin-lte-box-solid>



        <!-- <template v-for="(chart, name) in available_charts">
          <admin-lte-box-solid
            v-if="chart.wrapper && chart.wrapper.type == 'dygraph'"
            :title="name"
            :id="name+'-collapsible'"
            v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >
            <template v-if="chart.stat.tabular == true">
              <chart-tabular
                v-if="visibility[name]"
                :wrapper_props="chart.wrapper.props"
                :type="'dygraph'"
                :ref="name"
                :id="name"
                :EventBus="EventBus"
                :chart="charts[name]"
                :stat="stats[name]"
              >
              </chart-tabular>
              <chart-empty-container v-else></chart-empty-container>
            </template>

            <template v-else>
              <chart
                v-if="visibility[name]"
                :wrapper_props="chart.wrapper.props"
                :type="'dygraph'"
                :ref="name"
                :id="name"
                :EventBus="EventBus"
                :chart="charts[name]"
                :stat="stats[name]"
              >
              </chart>
              <chart-empty-container v-else></chart-empty-container>
            </template>

          </admin-lte-box-solid>
        </template> -->

        <admin-lte-box-solid
          title="merged"
          :id="host+'_merged-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            :type="'dygraph'"
            :ref="host+'_merged'"
            :id="host+'_merged'"
            :EventBus="EventBus"
            :chart="charts[host+'_merged']"
            :stat="stats[host+'_merged']"
          >
          </chart-tabular>
          <!-- v-if="visibility[host+'merged']"
          <chart-empty-container v-else></chart-empty-container> -->


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="CPU Times"
          :id="host+'_os_cpus_times-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="visibility[host+'_os_cpus_times']"
            :type="'dygraph'"
            :ref="host+'_os_cpus_times'"
            :id="host+'_os_cpus_times'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_times']"
            :stat="stats[host+'_os_cpus_times']"
          >
          </chart-tabular>
          <chart-empty-container v-else></chart-empty-container>


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="CPU Percentage"
          :id="host+'_os_cpus_percentage-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="visibility[host+'_os_cpus_percentage']"
            :type="'dygraph'"
            :ref="host+'_os_cpus_percentage'"
            :id="host+'_os_cpus_percentage'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_percentage']"
            :stat="stats[host+'_os_cpus_percentage']"
          >
          </chart-tabular>
          <chart-empty-container v-else></chart-empty-container>


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Freemem"
          :id="host+'_os_freemem-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="visibility[host+'_os_freemem']"
            :type="'dygraph'"
            :ref="host+'_os_freemem'"
            :id="host+'_os_freemem'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_freemem']"
            :stat="stats[host+'_os_freemem']"
          >
          </chart>
          <chart-empty-container v-else></chart-empty-container>


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Uptime"
          :id="host+'_os_uptime-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="visibility[host+'_os_uptime']"
            :type="'dygraph'"
            :ref="host+'_os_uptime'"
            :id="host+'_os_uptime'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_uptime']"
            :stat="stats[host+'_os_uptime']"
          >
          </chart-tabular>
          <chart-empty-container v-else></chart-empty-container>

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Load Average"
          :id="host+'_os_loadavg-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="visibility[host+'_os_loadavg']"
            :type="'dygraph'"
            :ref="host+'_os_loadavg'"
            :id="host+'_os_loadavg'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_loadavg']"
            :stat="stats[host+'_os_loadavg']"
          >
          </chart-tabular>
          <chart-empty-container v-else></chart-empty-container>

        </admin-lte-box-solid>


        <template v-for="(blockdevice, index) in blockdevices">
          <admin-lte-box-solid
            :key="'blockdevice_stats_'+index"
            :title="'Blockdevice stats['+index+']'"
            :id="host+'_os_blockdevices_stats_'+index+'-collapsible'"
            v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart-tabular
              v-if="visibility[host+'_os_blockdevices_stats_'+index]"
              :type="'dygraph'"
              :ref="host+'_os_blockdevices_stats_'+index"
              :id="host+'_os_blockdevices_stats_'+index"
              :EventBus="EventBus"
              :chart="charts[host+'_os_blockdevices_stats_'+index]"
              :stat="stats[host+'_os_blockdevices_stats_'+index]"
            >
            </chart-tabular>
            <chart-empty-container v-else></chart-empty-container>


          </admin-lte-box-solid>
        </template>

        <template v-for="(mount, index) in mounts">
          <admin-lte-box-solid
            :key="'mounts_percentage_'+index"
            :title="'Mounts Percetange usage '+index"
            :id="host+'_os_mounts_percentage_'+index+'-collapsible'"
            v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart-tabular
              v-if="visibility[host+'_os_mounts_percentage_'+index]"
              :type="'dygraph'"
              :ref="host+'_os_mounts_percentage_'+index"
              :id="host+'_os_mounts_percentage_'+index"
              :EventBus="EventBus"
              :chart="charts[host+'_os_mounts_percentage_'+index]"
              :stat="stats[host+'_os_mounts_percentage_'+index]"
            >
            </chart-tabular>
            <chart-empty-container v-else></chart-empty-container>


          </admin-lte-box-solid>
        </template>

        <template v-for="(iface, name) in networkInterfaces">
          <template v-for="(data, messure) in iface">
            <admin-lte-box-solid v-if="messure == 'bytes' || messure == 'packets' || messure == 'errs'"
              :key="'networkInterfaces_stats'+name+'_'+messure"
              :title="'Network Interface '+name+' : '+messure"
              :id="host+'_os_networkInterfaces_stats_'+name+'_'+messure+'-collapsible'"
              v-observe-visibility="{ callback: visibilityChanged, throttle: 50 }"
              v-on:show="el => showCollapsible(el)"
              v-on:hide="el => hideCollapsible(el)"
            >

              <chart
                v-if="host+'_os_networkInterfaces_stats_'+name+'_'+messure"
                :type="'dygraph'"
                :ref="host+'_os_networkInterfaces_stats_'+name+'_'+messure"
                :id="host+'_os_networkInterfaces_stats_'+name+'_'+messure"
                :EventBus="EventBus"
                :chart="charts[host+'_os_networkInterfaces_stats_'+name+'_'+messure]"
                :stat="stats[host+'_os_networkInterfaces_stats_'+name+'_'+messure]"
              >
              </chart>
              <chart-empty-container v-else></chart-empty-container>


            </admin-lte-box-solid>
          </template>
        </template>

      </section>
    </div>
    <!-- <input-vue-watcher></input-vue-watcher> -->
  </section>
</template>

<style>
</style>

<script>

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

import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'

import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'
import jqueryKnob from 'mngr-ui-admin-charts/defaults/jqueryKnob'

import * as Highcharts from 'highcharts'

let highchartsVueGauge = require('mngr-ui-admin-charts/defaults/highchartsVue.gauge')(Highcharts)

import charts_payloads from '@etc/charts.payloads'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

  charts_objects: {},
  // charts: {},
  pipelines: {},

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
    '$store.state.app.paths': (newVal, oldVal) => { this.create_host_pipelines(newVal) }
  },
  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,
      // reset: state => state.app.reset,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // //////console.log('state.app.range', state.app.range)

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

      host: function(state){
        return state.hosts.current || this.$route.params.host
      },

      os_stats: function(state){
        if(state.stats && state.stats[this.host]){
          return state.stats[this.host].os
        }
        else{
          return {}
        }
      },

      mounts: function(state){
        // let host = this.$route.params.host || this.$store.state.hosts.current
        if(state.stats && state.stats[this.host]){
          return state.stats[this.host].os_mounts
        }
        else{
          return {}
        }
      },

      blockdevices: function(state){
        // let host = this.$route.params.host || this.$store.state.hosts.current
        if(state.stats && state.stats[this.host]){
          return state.stats[this.host].os_blockdevices
        }
        else{
          return {}
        }
      },

      networkInterfaces: function(state){
        // let host = this.$route.params.host || state.hosts.current
        if(state.stats && state.stats[this.host]){
          // return state.stats[this.host].os_networkInterfaces
          let networkInterfaces = {}
          let val = state.stats[this.host].os.networkInterfaces.value.data
          let ifaces = Object.keys(val)
          let properties = Object.keys(val[ifaces[0]])

          /**
          * properties[0] is "if", we want recived | transmited only
          **/
          let messures = Object.keys(val[ifaces[0]][properties[1]])

          Array.each(ifaces, function(iface){
            if(!networkInterfaces[iface])
              networkInterfaces[iface] = {}
            /**
            * turn data property->messure (ex: transmited { bytes: .. }),
            * to: messure->property (ex: bytes {transmited:.., recived: ... })
            **/
            Array.each(messures, function(messure){// "bytes" | "packets"
              if(!networkInterfaces[iface][messure])
                networkInterfaces[iface][messure] = {}

              Array.each(properties, function(property, index){
                /**
                * properties[0] is "if", we want recived | transmited only
                **/
                if(index != 0){
                  networkInterfaces[iface][messure][property] = val[iface][property][messure] * 1
                }

              })

            })

          })

          ////////console.log('networkInterfaces', networkInterfaces)
          return networkInterfaces
        }
        else{
          return {}
        }
      }
    }),

  ),

  created: function(){
    // //////console.log('life cycle created')

    EventBus.$once('host', doc => {
      console.log('recived doc via Event host', doc)
      Object.each(doc.charts, function(data, name){
        this.$options.charts_objects[name] = data.chart
      }.bind(this))

      // //////console.log('recived doc via Event host', doc, this.$options.charts_objects)
      /**
      * remove for testing
      **/
      // let merged_chart = Object.merge(Object.clone(cpus_times_chart), Object.merge(this.$options.charts_objects['cpus_times']))
      // Array.each(merged_chart.options.labels, function(label, index){
      //   merged_chart.options.labels[index] = 'cpus times '+label
      // })
      // merged_chart.options.labels.push('uptime seconds')
      //
      // this.available_charts[this.host+'_merged'] = {
      //   name: this.host+'_merged',
      //   // chart: [
      //   //   Object.merge(cpus_times_chart, this.$options.charts_objects['cpus_times']),
      //   //   Object.merge(uptime_chart, this.$options.charts_objects['uptime']),
      //   // ],
      //   chart: merged_chart,
      //   stop: function(payload){
      //     Array.each(payload.stat, function(stat){
      //       this.$store.dispatch('stats_tabular/flush', stat)
      //     }.bind(this))
      //
      //     // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //   }.bind(this),
      //   stat: [
      //     {
      //       host: this.host,
      //       path: 'cpus_times',
      //       key: 'os_cpus',
      //       length: this.seconds || 300,
      //       tabular: true
      //       // range: [Date.now() - this.seconds * 1000, Date.now()]
      //     },
      //     {
      //       host: this.host,
      //       path: 'uptime',
      //       key: 'os_uptime',
      //       length: this.seconds || 300,
      //       tabular: true
      //       // range: [Date.now() - this.seconds * 1000, Date.now()]
      //     }
      //   ],
      //   /**
      //   * for __get_stat_for_chart
      //   **/
      //   pipeline: {
      //     name: 'input.os',
      //     path: 'os',
      //     range: true
      //   }
      // }
      //
      // this.__get_stat_for_chart(this.available_charts[this.host+'_merged'])

      // this.available_charts[this.host+'_os_cpus_times'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os_cpus_times',
      //     host: this.host,
      //     seconds: this.seconds
      //   }),
      //   {
      //     wrapper: {
      //       type: 'dygraph',
      //       props: {}
      //     },
      //     chart: Object.merge(cpus_times_chart, this.$options.charts_objects['cpus_times']),
      //     stop: function(payload){
      //       //////console.log('stoping _os_cpus_times', payload.stat)
      //       this.$store.dispatch('stats_tabular/flush', payload.stat)
      //
      //       // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //     }.bind(this),
      //     pipeline: {
      //       range: true
      //     }
      //   }
      // )
      // this.__get_stat_for_chart(this.available_charts[this.host+'_os_cpus_times'])


      // this.available_charts[this.host+'_os_cpus_percentage'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os_cpus_percentage',
      //     host: this.host,
      //     seconds: this.seconds
      //   }),
      //   {
      //     wrapper: {
      //       type: 'dygraph',
      //       props: {}
      //     },
      //     chart: Object.merge(cpus_percentage_chart, this.$options.charts_objects['cpus_percentage']),
      //     stop: function(payload){
      //       this.$store.dispatch('stats_tabular/flush', payload.stat)
      //       // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //     }.bind(this),
      //   }
      // )
      //
      //
      // this.__get_stat_for_chart(this.available_charts[this.host+'_os_cpus_percentage'])

      /**
      * remove for testing
      **/

      /**
      * pie
      **/
      // this.available_charts[this.host+'_os_cpus_percentage_pie'] = {
      //   name: this.host+'_os_cpus_percentage_pie',
      //   chart: Object.merge(Object.clone(pie_chart), {
      //     options:{
      //       // 'track-color': false,
      //       size: 120,
      //       // animated: false,
      //       'font-size': '24px',
      //       "bar-color": function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#86b300'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#ff704d'
      //         }
      //       }
      //     }
      //   }),
      //   init: this.__get_stat_for_chart.bind(this),
      //   stop: function(payload){
      //     // this.$store.dispatch('stats_tabular/flush', payload.stat)
      //   }.bind(this),
      //   stat: {
      //     host: this.host,
      //     path: 'cpus_percentage',
      //     key: 'os_cpus',
      //     length: 1,
      //     tabular: true
      //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      //   },
      //   pipeline: {
      //     name: 'input.os',
      //     path: 'os',
      //     // range: true
      //   }
      // }

      // this.available_charts[this.host+'_os_cpus_percentage_knob'] = {
      //   name: this.host+'_os_cpus_percentage_knob',
      //   chart: Object.merge(Object.clone(jqueryKnob), {
      //     options:{
      //       readOnly: true,
      //       displayPrevious: true,
      //       // thickness: 0.1,
      //       width: 120,
      //       // skin: 'tron',
      //       angleOffset: 235,
      //       angleArc: 250,
      //       // bgColor: 'black',
      //       fgColor: function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#86b300'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#ff704d'
      //         }
      //       },
      //       inputColor: function(percentage){
      //         if(percentage > 0 && percentage < 33){
      //           return '#86b300'
      //         }
      //         else if(percentage > 33 && percentage < 66){
      //           return '#f6d95b'
      //         }
      //         else{
      //           return '#ff704d'
      //         }
      //       }
      //     }
      //   }),
      //   init: this.__get_stat_for_chart.bind(this),
      //   stop: function(payload){
      //     // this.$store.dispatch('stats_tabular/flush', payload.stat)
      //   }.bind(this),
      //   stat: {
      //     host: this.host,
      //     path: 'cpus_percentage',
      //     key: 'os_cpus',
      //     length: 1,
      //     tabular: true
      //     // range: [Date.now() - this.seconds * 1000, Date.now()]
      //   },
      //   pipeline: {
      //     name: 'input.os',
      //     path: 'os',
      //     // range: true
      //   }
      // }

      /**
      * gauge
      **/
      /**
      * remove for testing
      **/
      // this.available_charts[this.host+'_os_cpus_percentage_gauge'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os_cpus_percentage',
      //     host: this.host,
      //     seconds: 1
      //   }),
      //   {
      //     name: this.host+'_os_cpus_percentage_gauge',
      //     chart: highchartsVueGauge,
      //     init: this.__get_stat_for_chart.bind(this),
      //     stop: function(payload){
      //       this.$store.dispatch('stats_tabular/flush', payload.stat)
      //     }.bind(this),
      //     pipeline: {
      //       range: true
      //     }
      //   }
      // )



      // this.available_charts[this.host+'_os_uptime'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os_uptime',
      //     host: this.host,
      //     seconds: this.seconds
      //   }),
      //   {
      //     wrapper: {
      //       type: 'dygraph',
      //       props: {}
      //     },
      //     chart: Object.merge(uptime_chart, this.$options.charts_objects['uptime']),
      //     stop: function(payload){
      //       this.$store.dispatch('stats_tabular/flush', payload.stat)
      //       // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //     }.bind(this),
      //   }
      // )
      //
      // this.__get_stat_for_chart(this.available_charts[this.host+'_os_uptime'])

      //
      // this.available_charts[this.host+'_os_loadavg'] = Object.merge(
      //   this.get_payload(charts_payloads,{
      //     name: 'os_loadavg',
      //     host: this.host,
      //     seconds: this.seconds
      //   }),
      //   {
      //     wrapper: {
      //       type: 'dygraph',
      //       props: {}
      //     },
      //     chart: Object.merge(loadavg_chart, this.$options.charts_objects['loadavg']),
      //     stop: function(payload){
      //       this.$store.dispatch('stats_tabular/flush', payload.stat)
      //       // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //     }.bind(this),
      //   }
      // )
      // this.__get_stat_for_chart(this.available_charts[this.host+'_os_loadavg'])
      //
      // let unwatch_blockdevices = this.$watch('blockdevices', function(val, old){
      //
      //   // ////////console.log('$watch blockdevices ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
      //
      //   if(val !== undefined && Object.getLength(val) > 0){
      //
      //     let dev_counter = 0
      //     Object.each(val, function(dev, key){
      //       ////////console.log('adding blockdevice chart '+this.host+'_os_blockdevices_stats_'+key)
      //       let chart_name = this.host+'_os_blockdevices_stats_'+key
      //
      //       this.available_charts[chart_name] = Object.merge(
      //         Object.clone(this.get_payload(charts_payloads,{
      //           name: 'os_blockdevices_stats',
      //           host: this.host,
      //           seconds: this.seconds
      //         })),
      //         Object.clone({
      //           wrapper: {
      //             type: 'dygraph',
      //             props: {}
      //           },
      //           name: chart_name,
      //           chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.$options.charts_objects['blockdevices_stats'])),
      //           stop: function(payload){
      //             this.$store.dispatch('stats_tabular/flush', payload.stat)
      //             // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //           }.bind(this),
      //           stat: {
      //             key: 'os_blockdevices_'+key,
      //           },
      //           pipeline: {
      //             range: (dev_counter == Object.getLength(val) -1 ) ? true : false
      //           }
      //         })
      //       )
      //
      //       this.__get_stat_for_chart(this.available_charts[chart_name])
      //       dev_counter++
      //
      //     }.bind(this))
      //
      //     unwatch_blockdevices()
      //   }
      // }.bind(this),{
      //   deep:true
      // })
      //

      // let unwatch_mounts = this.$watch('mounts', function(val, old){
      //
      //   // ////////console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
      //
      //   if(val !== undefined && Object.getLength(val) > 0){
      //
      //     let mount_counter = 0
      //     Object.each(val, function(mount, key){
      //       ////////console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
      //       let chart_name = this.host+'_os_mounts_percentage_'+key
      //
      //       this.available_charts[chart_name] = Object.clone(Object.merge(
      //         this.get_payload(charts_payloads,{
      //           name: 'os_mounts_percentage',
      //           host: this.host,
      //           seconds: this.seconds
      //         }),
      //         {
      //           wrapper: {
      //             type: 'dygraph',
      //             props: {}
      //           },
      //           name: chart_name,
      //           chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.$options.charts_objects['mounts_percentage'])),
      //           stop: function(payload){
      //             this.$store.dispatch('stats_tabular/flush', payload.stat)
      //             // this.$store.dispatch('stats_tabular/splice', payload.stat)
      //           }.bind(this),
      //           stat: {
      //             key: 'os_mounts_'+key,
      //           },
      //           pipeline: {
      //             range: (mount_counter == Object.getLength(val) -1 ) ? true : false
      //           }
      //         }
      //       ))
      //       this.__get_stat_for_chart(this.available_charts[chart_name])
      //
      //       mount_counter++
      //     }.bind(this))
      //
      //     unwatch_mounts()
      //   }
      // }.bind(this),{
      //   deep:true
      // })

      // Object.each(this.$options.charts, function(chart, id){
      //   this.add_chart(chart, id)
      // }.bind(this))

      /**
      * remove for testing
      **/
    })

    EventBus.$on('os', payload => {
      // //////console.log('recived doc via Event os', payload)
        // if(this.$options.tabular_range_started === true && payload.tabular == true){
        if(payload.tabular == true){
          this.process_os_tabular(payload.doc)
        }
        // else if(this.$options.range_started === true && payload.tabular != true){
        else{
          this.process_os_doc(payload.doc, this.__add_os_doc_stats.bind(this))
        }

        // if(payload.type == 'range')
        //   //////console.log('RANGE', payload)

        if(
          payload.type == 'range'
          && payload.tabular != true
          // && this.$options.range_started === false
        ){
          // this.$options.range_started = true
          EventBus.$emit(payload.doc[0].doc.metadata.path+'Range')
          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')
          // ////////console.log('RANGE', payload.doc[0].doc.metadata.path+'Range')
        }
        else if(
          payload.type == 'range'
          // && this.$options.tabular_range_started === false
        ){
          //////console.log('recived doc via Event os', payload)
          // this.$options.tabular_range_started = true
          EventBus.$emit('tabularRange')
        }
    })



    /**
    * remove for testing
    **/
    // let unwatch_freemem = this.$watch('os_stats', (val, old) => {
    //
    //   if(this.os_stats.totalmem && this.os_stats.totalmem.value){
    //   //console.log('this.os_stats.totalmem', this.os_stats.totalmem)
    //     this.available_charts[this.host+'_os_freemem'] = Object.merge(
    //       this.get_payload(charts_payloads,{
    //         name: 'os_freemem',
    //         host: this.host,
    //         seconds: this.seconds
    //       }),
    //       {
    //         wrapper: {
    //           type: 'dygraph',
    //           props: {}
    //         },
    //         chart: Object.merge(Object.clone(freemem_chart), {totalmem: this.os_stats.totalmem.value.data}),
    //         stop: function(payload){
    //           this.$store.dispatch('stats_tabular/flush', payload.stat)
    //           // this.$store.dispatch('stats_tabular/splice', payload.stat)
    //         }.bind(this),
    //         pipeline: {
    //           range: true
    //         }
    //       }
    //     )
    //     this.__get_stat_for_chart(this.available_charts[this.host+'_os_freemem'])
    //
    //     /**
    //     * pie
    //     **/
    //     // this.available_charts[this.host+'_os_freemem_pie'] = {
    //     //   name: this.host+'_os_freemem_pie',
    //     //   chart: Object.merge(Object.clone(pie_chart), {
    //     //     totalmem: this.os_stats.totalmem.value.data,
    //     //     watch: {
    //     //       /**
    //     //       * @trasnform: diff between each value against its prev one
    //     //       */
    //     //       transform: function(values, caller, chart){
    //     //         let last = values[values.length - 1]
    //     //         last.value = last.value * 100 / chart.totalmem
    //     //         // //console.log('_os_freemem_pie transform', values, chart.totalmem, last)
    //     //         return values
    //     //       }
    //     //     },
    //     //     options:{
    //     //       // 'track-color': false,
    //     //       size: 80,
    //     //       // animated: false,
    //     //       'font-size': '14px',
    //     //       "bar-color": function(percentage){
    //     //         if(percentage > 0 && percentage < 33){
    //     //           return '#ff704d'
    //     //         }
    //     //         else if(percentage > 33 && percentage < 66){
    //     //           return '#f6d95b'
    //     //         }
    //     //         else{
    //     //           return '#86b300'
    //     //         }
    //     //       }
    //     //     }
    //     //   }),
    //     //   init: this.__get_stat_for_chart.bind(this),
    //     //   stop: function(payload){
    //     //     // this.$store.dispatch('stats_tabular/flush', payload.stat)
    //     //   }.bind(this),
    //     //   stat: {
    //     //     host: this.host,
    //     //     path: 'os',
    //     //     key: 'freemem',
    //     //     length: 1,
    //     //     // tabular:true
    //     //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //     //   },
    //     //   pipeline: {
    //     //     name: 'input.os',
    //     //     path: 'os',
    //     //     range: true
    //     //   }
    //     // }
    //
    //     /**
    //     * knob
    //     */
    //     // this.available_charts[this.host+'_os_freemem_knob'] = {
    //     //   name: this.host+'_os_freemem_knob',
    //     //   chart: Object.merge(Object.clone(jqueryKnob), {
    //     //     totalmem: this.os_stats.totalmem.value.data,
    //     //     watch: {
    //     //       /**
    //     //       * @trasnform: diff between each value against its prev one
    //     //       */
    //     //       transform: function(values, caller, chart){
    //     //         let last = values[values.length - 1]
    //     //         last.value = last.value * 100 / chart.totalmem
    //     //         // //console.log('_os_freemem_knob transform', values, chart.totalmem, last)
    //     //         return values
    //     //       }
    //     //     },
    //     //     options:{
    //     //       readOnly: true,
    //     //       displayPrevious: true,
    //     //       thickness: 0.1,
    //     //       width: 80,
    //     //       skin: 'tron',
    //     //       // bgColor: 'black',
    //     //       fgColor: function(percentage){
    //     //         if(percentage > 0 && percentage < 33){
    //     //           return '#ff704d'
    //     //         }
    //     //         else if(percentage > 33 && percentage < 66){
    //     //           return '#f6d95b'
    //     //         }
    //     //         else{
    //     //           return '#86b300'
    //     //         }
    //     //       },
    //     //       inputColor: function(percentage){
    //     //         if(percentage > 0 && percentage < 33){
    //     //           return '#ff704d'
    //     //         }
    //     //         else if(percentage > 33 && percentage < 66){
    //     //           return '#f6d95b'
    //     //         }
    //     //         else{
    //     //           return '#86b300'
    //     //         }
    //     //       }
    //     //     }
    //     //   }),
    //     //   init: this.__get_stat_for_chart.bind(this),
    //     //   stop: function(payload){
    //     //     // this.$store.dispatch('stats_tabular/flush', payload.stat)
    //     //   }.bind(this),
    //     //   stat: {
    //     //     host: this.host,
    //     //     path: 'os',
    //     //     key: 'freemem',
    //     //     length: 1,
    //     //     // tabular:true
    //     //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //     //   },
    //     //   pipeline: {
    //     //     name: 'input.os',
    //     //     path: 'os',
    //     //     range: true
    //     //   }
    //     // }
    //
    //     unwatch_freemem()
    //   }
    // },{
    //   deep: true
    // })
    /**
    * remove for testing
    **/
  },



  mounted: function(){

    //////console.log('life cycle mounted')

    this.create_host_pipelines(this.$store.state.app.paths)



    let unwatch_networkInterfaces = this.$watch('networkInterfaces', function(val, old){

      // ////////console.log('$watch networkInterfaces ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        // let iface_index = 0
        Object.each(val, function(iface, name){

          Object.each(iface, function(data, messure){
            // if(name == 'lo' && messure == 'bytes'){
            if(messure == 'bytes' || messure == 'packets' || messure == 'errs'){
              ////////console.log('adding networkInterface chart '+this.host+'_os_networkInterfaces_stats_'+name+'_'+messure)
              let chart_name = this.host+'_os_networkInterfaces_stats_'+name+'_'+messure

              this.available_charts[chart_name] = Object.merge(
                Object.clone(this.get_payload(charts_payloads,{
                  name: 'os_networkInterfaces_stats',
                  host: this.host,
                  seconds: this.seconds
                })),
                Object.clone({
                  wrapper: {
                    type: 'dygraph',
                    props: {}
                  },
                  name: chart_name,
                  chart: Object.clone(networkInterfaces_chart),
                  init: this.__get_stat_for_chart.bind(this),
                  // init: function(payload){
                  //   console.log('init ', payload.name, payload)
                  //   this.__get_stat_for_chart(payload)
                  // }.bind(this),
                  stop: function(payload){
                    // this.remove_watcher(payload.name)
                    // this.__update_chart_stat(payload.name, [], 1)
                    this.$store.dispatch('stats_tabular/flush', payload.stat)
                    // this.remove_chart(payload.name, {unwatch: true})
                    // this.$store.dispatch('stats_tabular/splice', payload.stat)
                  }.bind(this),
                  watcher: {
                    name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
                    deep:true,
                    // cb: this.__watcher_callback.bind(this)
                    cb: (doc, old, payload) => {
                      // if(this.visibility[payload.name] === true)
                      console.log('WATCHER', payload.stat)
                      // let range = payload.stat.range || [Date.now() - payload.stat.length * 1000, Date.now()]
                      //
                      // let range_length = (range) ? Math.trunc((range[1] - range[0] / 1000)) : undefined

                      this.__update_chart_stat(payload.name, doc.value, payload.stat.length)
                    }
                  },

                })
              )

            }
          }.bind(this))
        }.bind(this))

        unwatch_networkInterfaces()
      }
    }.bind(this),{
      deep:true
    })

    /**
    * remove for testing
    **/


  },

  beforeCreate: function(){
    //////console.log('life cycle beforeCreate')
    EventBus.$off('host')
    EventBus.$off('os')
  },
  beforeDestroy: function(){

    this.destroy_host_pipelines()


    this.remove_charts({
      // clean: true,
      unwatch: true,
    })
    this.remove_chart_stats()

    this.$store.dispatch('stats/flush_all', {host: this.host})
    this.$store.dispatch('stats_tabular/flush_all', {host: this.host})

    // this.$store.dispatch('stats/splice', {host: this.host, length: 300})
    // this.$store.dispatch('stats_tabular/splice', {host: this.host, length: 300})
  },
  destroyed: function(){
    this.$off()
  },
  methods: {
    update_daterangepicker: function(){
      Object.each(this.$options.daterangepicker.ranges, function(range, key){
        // range[1] = moment(new Date())
        // this.$set(this.daterangepicker.ranges[key], 1, moment(Date.now()))
        Array.each(range, function(start_or_end, index){
          if(typeof this.$options.daterangepicker.ranges[key][index] == 'function')
            this.$set(this.daterangepicker.ranges[key], index, this.$options.daterangepicker.ranges[key][index]())

        }.bind(this))
        //console.log('update_daterangepicker', this.daterangepicker.ranges[key])
      }.bind(this))

    },
    set_range: function(start, end){
      //console.log('set_range daterangepicker', start.utc().valueOf(), end.utc().valueOf())
      Object.each(this.available_charts, function(payload, name){
        let range = [start.utc().valueOf(), end.utc().valueOf()]
        let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
        if(Array.isArray(this.available_charts[name].stat)){
          Array.each(this.available_charts[name].stat, function(stat, index){
            this.available_charts[name].stat[index].range = Array.clone(range)//clone it, as each one may modify range
            this.available_charts[name].stat[index].length = length

            let indexed_name = name +'_'+index
            this.remove_watcher(indexed_name)
          }.bind(this))
        }
        else{
          this.available_charts[name].stat.range = range
          this.available_charts[name].stat.length = length
          this.remove_watcher(name)
        }

        // this.remove_chart(name, {unwatch: true})


        // if(name.indexOf('networkInterface') == -1)
        if(!payload.init || typeof payload.init != 'function'){
          this.__get_stat_for_chart(this.available_charts[name])
          //console.log('set_range __get_stat_for_chart', this.available_charts[name])
        }

      }.bind(this))


    },
    get_payload: function(payloads, payload){
      let {name, host, seconds, range} = payload
      let result = Object.clone(payloads[name])

      result.name = host+'_'+result.name
      result.stat.host = host
      result.stat.length = seconds || result.stat.length
      result.stat.range = range || result.stat.range

      return result
    },

    __get_stat_for_chart: function(payload){

      let {name, stat, pipeline} = payload

      /**
      * if stat is not array convert it, so we can manage both cases with the same code
      **/
      if(!Array.isArray(stat))
        stat = [stat]

      // if(!Array.isArray(pipeline))
      //   pipeline = [pipeline]

      this.add_chart_stat(name)

      /**
      * buffer for _merge_stats
      **/
      let buffer = {}
      let buffer_length = stat.length
      let _original_payload = Object.clone(payload)

      // let count_events = 0
      Array.each(stat, function(stat, index){
        // //console.log('__get_stat_for_chart', stat)

        let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]
        let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined
        let tabular = (stat.tabular) ? stat.tabular : false
        let watch_name = (tabular == true) ? '_tabular' : ''
        stat.range = range


        let indexed_name = name+'_'+index
        let indexed_payload = Object.clone(_original_payload)
        indexed_payload.name = (Array.isArray(_original_payload.stat)) ? indexed_name : _original_payload.name
        indexed_payload.stat = stat
        if(_original_payload.watcher && Array.isArray(_original_payload.watcher)){
          indexed_payload.watcher = _original_payload.watcher[index]
        }
        else if (_original_payload.watcher){
          indexed_payload.watcher = _original_payload.watcher
        }

        //console.log('_original_payload.watcher', indexed_payload.watcher)

        this.remove_watcher(indexed_name)


        indexed_payload.watcher = indexed_payload.watcher ||  {
          name: '$store.state.stats'+ watch_name +'.'+stat.host+'.'+stat.path+'.'+stat.key,
          deep:true,
          // cb: this.__watcher_callback.bind(this)
          cb: (doc, old, payload) => {
            // if(this.visibility[payload.name] === true)

            // //console.log('_original_payload', _original_payload)
            /**
            * check original stat, if it's not array, just update as there is nothing to merge
            **/
            if(!Array.isArray(_original_payload.stat)){
              this.__update_chart_stat(name, doc.value, payload.stat.length)
            }
            else{
              buffer = this._merge_stats({
                buffer: buffer,
                length: buffer_length,
                stat_name: name,
                data_name: indexed_name,
                data: doc.value,
                splice: payload.stat.length
              })
            }
          }
        }



        this.__get_stat(stat, function(docs){


          let new_docs_range = this.__get_new_docs_range(docs, range)
          docs = new_docs_range.docs
          range = new_docs_range.range

          /**
          * why not encapsulate al this code under if(pipeline.range == true)??
          * becasue we may want, for example, only one chart fire "osRange" and
          * multiple ones reacting to it
          **/
          let pipe = undefined
          let eventRange = undefined
          if(Array.isArray(pipeline)){
            pipe = this.$options.pipelines[pipeline[index].name]
            pipe.inputs[0].options.conn[0].module.options.paths = [pipeline[index].path]
            eventRange = (tabular == true) ? 'tabularRange' : pipeline[index].path+'Range'
          }
          else{
            pipe = this.$options.pipelines[pipeline.name]
            pipe.inputs[0].options.conn[0].module.options.paths = [pipeline.path]
            eventRange = (tabular == true) ? 'tabularRange' : pipeline.path+'Range'
          }


          EventBus.$once(eventRange, () => this.__get_stat(stat, function(docs_range){

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              // //console.log('__get_stat_for_chart __update_chart_stat', indexed_payload, range, all_stats.length, range_length)
              // console.log('__get_stat_for_chart __update_chart_stat', payload.stat, range_length, all_stats)

              /**
              * check original stat, if it's not array, just update as there is nothing to merge
              **/
              if(!Array.isArray(_original_payload.stat)){
                //console.log('_original_payload.stat', _original_payload)
                this.__update_chart_stat(name, all_stats, range_length)
              }
              else{
                buffer = this._merge_stats({
                  buffer: buffer,
                  length: buffer_length,
                  stat_name: name,
                  data_name: indexed_name,
                  data: all_stats,
                  splice: range_length,
                  range: true
                })
              }

              Vue.nextTick(this.add_watcher(indexed_payload))


            }.bind(this))
          )

          // let eventHandler = this.__get_stat.pass([
          // 	stat,
          // 	function(docs_range){
          //
          // 			let all_stats = docs.append(docs_range)
          // 			all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )
          //
          // 			// //console.log('__get_stat_for_chart __update_chart_stat', indexed_payload, range, all_stats.length, range_length)
          // 			// //console.log('__get_stat_for_chart __update_chart_stat', payload.stat)
          //
          // 			/**
          // 			* check original stat, if it's not array, just update as there is nothing to merge
          // 			**/
          // 			if(!Array.isArray(_original_payload.stat)){
          // 				//console.log('_original_payload.stat', _original_payload)
          // 				this.__update_chart_stat(name, all_stats, range_length)
          // 			}
          // 			else{
          // 				buffer = this._merge_stats({
          // 					buffer: buffer,
          // 					length: buffer_length,
          // 					stat_name: name,
          // 					data_name: indexed_name,
          // 					data: all_stats,
          // 					splice: range_length,
          // 					range: true
          // 				})
          // 			}
          //
          // 			Vue.nextTick(this.add_watcher(indexed_payload))
          //
          //
          // 		}.bind(this)
          // ],this)
          //
          //
          // EventBus.$on(eventRange, () => {
          // 	eventHandler()
          // 	//console.log('$off', indexed_name, eventRange, eventHandler)
          // 	if(
          // 		!Array.isArray(_original_payload.stat)
          // 		|| count_events == _original_payload.stat.length -1
          // 	){
          // 		EventBus.$off([eventRange, eventHandler])
          // 	}
          //
          // 	count_events++
          // })

          if(Array.isArray(pipeline)){
            if(pipeline[index].range && pipeline[index].range == true)
              pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          }
          else{
            if(pipeline.range && pipeline.range == true)
              pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          }




        }.bind(this))

      }.bind(this))



    },
    /**
    * based on docs (obtained from local DB) and range, defined if we can update stat with this
    * plus a shorter remote range, or we need to clear and obtain all new data from remote
    */
    __get_new_docs_range(docs, range){
      if(
        docs.length != 0
        && docs[docs.length - 1].metadata
        && docs[0].metadata.timestamp > range[0] - 10000
        && docs[0].metadata.timestamp < range[0] + 10000
      ){

        let prev = undefined
        let missing = false

        docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

        Array.each(docs, function(doc){
          if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){

            missing = true
          }
          prev = doc
        })

        if(missing == false){
          range[0] = docs[docs.length - 1].metadata.timestamp

        }
        else{
          docs = []
        }

      }
      else{
        docs = []
      }

      return {docs: docs, range: range}
    },
    _merge_stats: function(payload){
      let {buffer, length, stat_name, data_name, data, splice, range} = payload
      //console.log('_merge_stats', stat_name, buffer, range, data)

      if(range == true)
        buffer._range = true

      if(
        (
          buffer._range && buffer._range == true
          && data.length > 0
        )
        || ( ! buffer._range && Object.getLength(data) > 0 )
      ){
        buffer[data_name] = data
      }

      if(Object.getLength(buffer) >= length){
        let merged = undefined
        // let counter = 0
        Object.each(buffer, function(doc, name){
          if(name.indexOf('0') > -1)
            if(Array.isArray(doc)){
              merged = Array.clone(doc)
            }
            else{
              merged = Object.clone(doc)
            }
        })

        let _merged = false
        Object.each(buffer, function(doc, name){
          if(name.indexOf('0') == -1 && name != '_range'){
            if(Array.isArray(merged)){

              let to_merge = []
              if(!Array.isArray(doc)){
                to_merge = [doc]
              }
              else{
                to_merge = Array.clone(doc)
              }

              Array.each(merged, function(row, index){

                let found = false
                Array.each(to_merge, function(to_merge_row){
                  if(found == false && row.metadata.timestamp == to_merge_row.metadata.timestamp){
                    merged[index].data = this._merge_tabular_data(row.data, to_merge_row.data)
                    found = true
                    _merged = true
                  }

                }.bind(this))
                // if(found == false){
                //   merged[index].data = this._merge_tabular_data(row.data, [0, 0])
                // }

              }.bind(this))

            }
            else if(doc.data){

              merged.data = this._merge_tabular_data(merged.data, doc.data)
              _merged = true
            }
          }
          // counter++
          // delete buffer[name]
        }.bind(this))

        if(_merged == true){
          buffer = {}

          this.__update_chart_stat(stat_name, merged, splice)
        }
        // //console.log('_merge_stats', stat_name, merged)
      }

      return buffer
    },
    /**
    * merge second doc.data (ommiting [0] possition, timestamp) on first one
    **/
    _merge_tabular_data: function(a, b){

      let merged = Array.clone(a)
      for(let i = 1; i < b.length; i++){//ommit timestamp
          merged.push(b[i])
      }
      return merged
    },
    // __get_stat_for_chart: function(payload){
    //   //console.log('__get_stat_for_chart', payload)
    //
    //   let {name, stat, pipeline} = payload
    //   let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]
    //   let tabular = (stat.tabular) ? stat.tabular : false
    //
    //   this.remove_watcher(name)
    //
    //   let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined
    //
    //   let watch_name = (tabular == true) ? '_tabular' : ''
    //
    //   payload.watcher = payload.watcher ||  {
    //     name: '$store.state.stats'+ watch_name +'.'+stat.host+'.'+stat.path+'.'+stat.key,
    //     deep:true,
    //     // cb: this.__watcher_callback.bind(this)
    //     cb: (doc, old, payload) => {
    //       // if(this.visibility[payload.name] === true)
    //       // let range = payload.stat.range || [Date.now() - payload.stat.length * 1000, Date.now()]
    //       // let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined
    //       this.__update_chart_stat(payload.name, doc.value, payload.stat.length)
    //     }
    //   },
    //   // ////console.log('__get_stat_for_chart', payload.watcher)
    //
    //   stat.range = range
    //
    //   this.add_chart_stat(name)
    //
    //   this.__get_stat(stat, function(docs){
    //
    //     let pipe = this.$options.pipelines[pipeline.name]
    //     pipe.inputs[0].options.conn[0].module.options.paths = [pipeline.path]
    //
    //
    //     if(
    //       docs.length != 0
    //       && docs[docs.length - 1].metadata
    //       && docs[0].metadata.timestamp > range[0] - 10000
    //       && docs[0].metadata.timestamp < range[0] + 10000
    //     ){
    //
    //       let prev = undefined
    //       let missing = false
    //
    //       docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )
    //
    //       Array.each(docs, function(doc){
    //         if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
    //
    //           missing = true
    //         }
    //         prev = doc
    //       })
    //
    //       if(missing == false){
    //         range[0] = docs[docs.length - 1].metadata.timestamp
    //
    //       }
    //       else{
    //         docs = []
    //       }
    //
    //     }
    //     else{
    //       docs = []
    //     }
    //
    //     let eventRange = (tabular == true) ? 'tabularRange' : pipeline.path+'Range'
    //
    //     EventBus.$once(eventRange, () =>
    //       this.__get_stat(stat, function(docs_range){
    //
    //         let all_stats = docs.append(docs_range)
    //         all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )
    //
    //         // let length = all_stats.length
    //         // all_stats.splice(
    //         //   range_length -1,
    //         //   length - range_length
    //         // )
    //
    //         // this.__update_chart_stat(name, all_stats, stat.length)
    //         //console.log('__get_stat_for_chart __update_chart_stat', name, range, all_stats.length, range_length)
    //         this.__update_chart_stat(name, all_stats, range_length)
    //
    //         Vue.nextTick(this.add_watcher(payload))
    //
    //
    //       }.bind(this))
    //     )
    //
    //     if(pipeline.range && pipeline.range == true)
    //       pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
    //
    //
    //   }.bind(this))
    // },

    process_os_tabular: function(doc){
      //////console.log('process_os_tabular', doc)
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

                //////console.log('process_os_tabular', path, key, result)

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

            // ////////console.log('ROW', keys, path)

            if(!paths[path])
              paths[path] = {}


            Object.each(keys, function(data, key){
              // ////////console.log('ROW', key, data)
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
    __add_os_doc_stats(paths){
      // //////console.log('__add_os_doc_stats', paths)
      Object.each(paths, function(keys, path){
        // ////////console.log('stat process_os_doc', path)

        Object.each(keys, function(data, key){
          //////console.log('stat process_os_doc', path, key, data)
          this.$store.dispatch('stats/add', {
            host: this.host,
            path: path,
            key: key,
            data: data
          })

        }.bind(this))

      }.bind(this))
    },

    /**
    * @start pipelines
    **/
    create_host_pipelines (paths) {
      // paths = ['os.procs']
      //////////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$store.state.hosts.current || this.$route.params.host

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

              //////////////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                ////////////////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  //////////////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  //////////////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

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
                //////////////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

                /** manually resume **/
                // pipe.fireEvent('onResume')
              }
            // }
          // }.bind(this))
        }.bind(this))

        // }.bind(this))
      }
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

      let id = entry.target.id.replace('-collapsible', '')
      // let name = id.replace(this.host+'_', '')

      // //console.log('visibilityChanged', isVisible, id, name, this.available_charts[id])

      if(
        isVisible == false
        && this.available_charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == true)
      ){
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
        // this.$store.dispatch('stats/splice', this.available_charts[id].stat)
        // this.$store.dispatch('stats_tabular/splice', this.available_charts[id].stat)
      }
      else if (
        isVisible == true
        && this.available_charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == false)
      ){

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
