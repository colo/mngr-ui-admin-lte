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


        <template v-for="(graph, name) in available_graphs">
          {{name}}
          <admin-lte-box-solid
            :title="graph.title"
            :id="name+'-collapsible'"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >
            <chart-tabular
              v-if="charts[name]"
              :wrapper="graph.wrapper"
              :ref="name"
              :id="name"
              :EventBus="EventBus"
              :chart="graph.chart"
              :stat="{
                range: range,
                merged: true,
                data: function(){
                  if(graph.data.data){ return graph.data.data }
                  else {
                    let data = []
                    Array.each(graph.data.sources, function(source){
                      data.push($store.state[source])
                    })
                    return data
                  }
                }
                /* data: [tabulars[host+'.os.cpus.times'], tabulars[host+'.os.uptime']] */
                /* data: [$store.state.tabulars_sources[host+'.os.cpus.times'],$store.state.tabulars_sources[host+'.os.uptime']] */
              }"


            >
            </chart-tabular>
            <!-- :stat="{
              range: graph.data.range,
              merged: graph.data.merged,
              /* data: data[name] */
            }" -->
          </admin-lte-box-solid>
        </template>

        <!-- <admin-lte-box-solid
          title="CPUS Times / Uptime"
          :id="host+'.cpus_times.uptime-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >
          <chart-tabular
            v-if="charts[host+'.cpus_times.uptime']"
            :wrapper="{type: 'dygraph'}"
            :ref="host+'.cpus_times.uptime'"
            :id="host+'.cpus_times.uptime'"
            :EventBus="EventBus"
            :chart="charts[host+'.cpus_times.uptime']"
            :stat="{
              range: range,
              merged: true,
              data: [tabulars[host+'.os.cpus.times'], tabulars[host+'.os.uptime']]
            }"
          >
          </chart-tabular>

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="CPUS Times"
          :id="host+'.os.cpus.times-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="charts[host+'.os.cpus.times']"
            :wrapper="{type: 'dygraph'}"
            :ref="host+'.os.cpus.times'"
            :id="host+'.os.cpus.times'"
            :EventBus="EventBus"
            :chart="charts[host+'.os.cpus.times']"
            :stat="{range: range, data: tabulars[host+'.os.cpus.times']}"
          >
          </chart-tabular>

        </admin-lte-box-solid>


        <admin-lte-box-solid
          title="CPUS Percentage"
          :id="host+'.os.cpus.percentage-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="charts[host+'.os.cpus.percentage']"
            :type="'dygraph'"
            :ref="host+'.os.cpus.percentage'"
            :id="host+'.os.cpus.percentage'"
            :EventBus="EventBus"
            :chart="charts[host+'.os.cpus.percentage']"
            :stat="{range: range, data: tabulars[host+'.os.cpus.percentage']}"
          >
          </chart-tabular>

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Freemem"
          :id="host+'.os.freemem-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="charts[host+'.os.freemem']"
            :type="'dygraph'"
            :ref="host+'.os.freemem'"
            :id="host+'.os.freemem'"
            :EventBus="EventBus"
            :chart="charts[host+'.os.freemem']"
            :stat="{range: range, data: stats[host+'.os.freemem']}"
          >
          </chart>

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Uptime"
          :id="host+'.os.uptime-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="charts[host+'.os.uptime']"
            :type="'dygraph'"
            :ref="host+'.os.uptime'"
            :id="host+'.os.uptime'"
            :EventBus="EventBus"
            :chart="charts[host+'.os.uptime']"
            :stat="{range: range, data: tabulars[host+'.os.uptime']}"
          >
          </chart-tabular>

        </admin-lte-box-solid>


        <admin-lte-box-solid
          title="Load Average"
          :id="host+'.os.loadavg-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart-tabular
            v-if="charts[host+'.os.loadavg']"
            :type="'dygraph'"
            :ref="host+'.os.loadavg'"
            :id="host+'.os.loadavg'"
            :EventBus="EventBus"
            :chart="charts[host+'.os.loadavg']"
            :stat="{range: range, data: tabulars[host+'.os.loadavg']}"
          >
          </chart-tabular>

        </admin-lte-box-solid>

        <template v-for="(blockdevice, index) in blockdevices">
          <admin-lte-box-solid
            :key="host+'.os_blockdevices.stats.'+index"
            :title="'Blockdevice stats['+index+']'"
            :id="host+'.os_blockdevices.stats.'+index+'-collapsible'"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart-tabular
              v-if="charts[host+'.os_blockdevices.stats.'+index]"
              :type="'dygraph'"
              :ref="host+'.os_blockdevices.stats.'+index"
              :id="host+'.os_blockdevices.stats.'+index"
              :EventBus="EventBus"
              :chart="charts[host+'.os_blockdevices.stats.'+index]"
              :stat="{range: range, data: tabulars[host+'.os_blockdevices.stats.'+index]}"
            >
            </chart-tabular>

          </admin-lte-box-solid>

        </template>

        <template v-for="(mount, index) in mounts">
          <admin-lte-box-solid
            :key="host+'.os_mounts.'+index"
            :title="'Mounts Percetange usage '+index"
            :id="host+'.os_mounts.'+index+'-collapsible'"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart-tabular
              v-if="charts[host+'.os_mounts.'+index]"
              :type="'dygraph'"
              :ref="host+'.os_mounts.'+index"
              :id="host+'.os_mounts.'+index"
              :EventBus="EventBus"
              :chart="charts[host+'.os_mounts.'+index]"
              :stat="{range: range, data: tabulars[host+'.os_mounts.percentage.'+index]}"
            >
            </chart-tabular>

          </admin-lte-box-solid>

        </template>

        <template v-for="(data, name) in networkInterfaces_properties">

            <admin-lte-box-solid
              :key="host+'.os_networkInterfaces_stats.properties.'+name"
              :title="'Network Interface '+name"
              :id="host+'.os_networkInterfaces_stats.properties.'+name+'-collapsible'"
              v-on:show="el => showCollapsible(el)"
              v-on:hide="el => hideCollapsible(el)"
            >

              <chart-tabular
                v-if="charts[host+'.os_networkInterfaces_stats.properties.'+name]"
                :type="'dygraph'"
                :ref="host+'.os_networkInterfaces_stats.properties.'+name"
                :id="host+'.os_networkInterfaces_stats.properties.'+name"
                :EventBus="EventBus"
                :chart="charts[host+'.os_networkInterfaces_stats.properties.'+name]"
                :stat="{range: range, data: tabulars[host+'.os_networkInterfaces_stats.properties.'+name]}"
              >
              </chart-tabular>

            </admin-lte-box-solid>

        </template> -->

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

import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'
import networkInterfaces_stats_chart from 'mngr-ui-admin-charts/os/networkInterfaces_stats'

import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'
import jqueryKnob from 'mngr-ui-admin-charts/defaults/jqueryKnob'

import * as Highcharts from 'highcharts'

let highchartsVueGauge = require('mngr-ui-admin-charts/defaults/highchartsVue.gauge')(Highcharts)

import charts_payloads from '@etc/charts.payloads'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

  collapsibles: {},
  charts_objects: {},
  // charts: {},
  pipelines: {},
  // pipelines_events: {},
  // __active_stats: {},

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


      mounts: {},
      blockdevices: {},
      networkInterfaces_properties: {},
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
      range: state => state.app.range,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // ////////////////console.log('state.app.range', state.app.range)

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

      host_charts: function(state){
        let host = state.hosts.current || this.$route.params.host
        return state['host_'+host].charts
      },


    }),
    {
      all_init: function(){
        if(this.host_charts != undefined && this.stats_init == true && this.tabulars_init == true){
          return true
        }
        else{
          return false
        }
      }
    }
  ),

  created: function(){
    // ////////////////console.log('life cycle created')

    EventBus.$once('charts', doc => {
      //console.log('recived doc via Event charts', doc)
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
    })

    EventBus.$on('stats', payload => {

      if(payload.range == true)
        console.log('recived doc via Event stats', payload)

      let type = (payload.tabular == true) ? 'tabulars' : 'stats'
      let init = (payload.tabular == true) ? 'tabulars_init' : 'stats_init'
      // let iterate = (type == 'tabulars') ? payload.stats : payload.stats.data

      let counter = 0
      Object.each(payload.stats, function(data, path){
        if(Array.isArray(data)){
          // // if(!this[type][payload.host+'.'+path]){
          // if(!this.$store.state[type+'_sources'][payload.host+'.'+path]){
          //   // this.$set(this[type],payload.host+'.'+path, data)
          //   console.log('registering.... ', type, payload.host+'.'+path)
          //   this.$store.registerModule([type+'_sources', payload.host+'.'+path], Object.clone(sourceStore))
          // }
          // // else{
          // //   this[type][payload.host+'.'+path] = data
          // // }
          this.$store.commit(type+'_sources/add', {key: payload.host+'.'+path, value: data})
        }
        else{
          // if(type == 'stats')
          //   ////console.log('DATA', data)

          Object.each(data, function(value, key){
            if(Array.isArray(value)){
              // // if(!this[type][payload.host+'.'+path+'.'+key]){
              // //   this.$set(this[type],payload.host+'.'+path+'.'+key, value)
              // // }
              // // else{
              // //   this[type][payload.host+'.'+path+'.'+key] = value
              // // }
              // if(!this.$store.state[type+'_sources'][payload.host+'.'+path+'.'+key]){
              //   console.log('registering.... ', type, payload.host+'.'+path+'.'+key)
              //   this.$store.registerModule([type+'_sources', payload.host+'.'+path+'.'+key], Object.clone(sourceStore))
              // }

              this.$store.commit(type+'_sources/add', {key: payload.host+'.'+path+'.'+key, value: value})

            }
            else{
              //3rd level, there is no need for more
              Object.each(value, function(val, sub_key){
                // // if(!this[type][payload.host+'.'+path+'.'+key+'.'+sub_key]){
                // //   this.$set(this[type],payload.host+'.'+path+'.'+key+'.'+sub_key, val)
                // // }
                // // else{
                // //   this[type][payload.host+'.'+path+'.'+key+'.'+sub_key] = val
                // // }
                //
                // if(!this.$store.state[type+'_sources'][payload.host+'.'+path+'.'+key+'.'+sub_key]){
                //   console.log('registering.... ', type, payload.host+'.'+path+'.'+key+'.'+sub_key)
                //   this.$store.registerModule([type+'_sources', payload.host+'.'+path+'.'+key+'.'+sub_key], Object.clone(sourceStore))
                // }

                this.$store.commit(type+'_sources/add', {key: payload.host+'.'+path+'.'+key+'.'+sub_key, value: val})
              }.bind(this))
            }

          }.bind(this))
        }

        if(counter == Object.getLength(payload.stats) - 1)
          this.$set(this, init, true)

        counter++
      }.bind(this))


    })


    let unwatch_all_init = this.$watch('all_init', function(val){
      //console.log('all_init', val)
      if(val == true){
        console.log('all_init', val, this.host_charts)

        this.set_range(moment().subtract(5, 'minute'), moment())

        //console.log('all_init STATS',this['stats'])
        //console.log('all_init TABULARS', this['tabulars'])
        //console.log('all_init CHARTS', this.$options.charts_objects)

        unwatch_all_init()

        let merged_chart = Object.merge(Object.clone(cpus_times_chart), Object.merge(this.host_charts['os.cpus.times']))
        if(merged_chart.options.labels){
          Array.each(merged_chart.options.labels, function(label, index){
            merged_chart.options.labels[index] = 'cpus times '+label
          })
          merged_chart.options.labels.push('uptime seconds')

          // this.available_graphs[this.host+'.cpus_times.uptime'] = {
          this.$set(this.available_graphs, this.host+'.cpus_times.uptime', {
            name: this.host+'.cpus_times.uptime',

            chart: merged_chart,
            wrapper: {
              type: 'dygraph',
              props: {}
            },
            stop: function(payload){
            }.bind(this),
            data: {
              range: this.range,
              merged: true,
              sources: ['tabulars_sources/'+this.host+'.os.cpus.times','tabulars_sources/'+this.host+'.os.uptime']
              // data: [this.tabulars[this.host+'.os.cpus.times'], this.tabulars[this.host+'.os.uptime']]
              // data: []
              // sources: [{'tabulars': this.host+'.os.cpus.times'}, {'tabulars': this.host+'.os.uptime'}]
            },
            stat: [
              {
                host: this.host,
                path: 'os.cpus',
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              },
              {
                host: this.host,
                path: 'os.uptime',
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              }
            ],
            /**
            * for __get_stat_for_chart
            **/
            pipeline: {
              name: 'input.os',
            }
          })

          // this.$set(this.available_graphs[this.host+'.cpus_times.uptime'].data, 'data', [])
          // this.available_graphs[this.host+'.cpus_times.uptime'].data.data.push(this.tabulars[this.host+'.os.cpus.times'])
          // this.available_graphs[this.host+'.cpus_times.uptime'].data.data.push(this.tabulars[this.host+'.os.uptime'])

          this.set_chart_visibility(this.host+'.cpus_times.uptime', true)
        }

        // this.available_graphs[this.host+'.os.cpus.times'] = Object.merge(
        //   this.get_payload(charts_payloads,{
        //     name: 'os.cpus.times',
        //     host: this.host,
        //     seconds: this.seconds
        //   }),
        //   {
        //     wrapper: {
        //       type: 'dygraph',
        //       props: {}
        //     },
        //     chart: Object.merge(cpus_times_chart, this.host_charts['os.cpus.times']),
        //     stop: function(payload){
        //     }.bind(this),
        //   }
        // )
        // this.set_chart_visibility(this.host+'.os.cpus.times', true)
        //
        // this.available_graphs[this.host+'.os.cpus.percentage'] = Object.merge(
        //   this.get_payload(charts_payloads,{
        //     name: 'os.cpus.percentage',
        //     host: this.host,
        //     seconds: this.seconds
        //   }),
        //   {
        //     wrapper: {
        //       type: 'dygraph',
        //       props: {}
        //     },
        //     chart: Object.merge(cpus_percentage_chart, this.host_charts['.os.cpus.percentage']),
        //     stop: function(payload){
        //     }.bind(this),
        //   }
        // )
        //
        // this.set_chart_visibility(this.host+'.os.cpus.percentage', true)

        console.log('this.available_graphs', this.available_graphs)
        //
        // /**
        // * remove for testing
        // **/
        //
        // /**
        // * pie
        // **/
        // // this.available_graphs[this.host+'_os_cpus_percentage_pie'] = {
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
        // // this.available_graphs[this.host+'_os_cpus_percentage_knob'] = {
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
        // this.available_graphs[this.host+'.os.cpus.percentage_gauge'] = Object.merge(
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

        //
        // this.available_graphs[this.host+'.os.uptime'] = Object.merge(
        //   this.get_payload(charts_payloads,{
        //     name: 'os.uptime',
        //     host: this.host,
        //     seconds: this.seconds
        //   }),
        //   {
        //     wrapper: {
        //       type: 'dygraph',
        //       props: {}
        //     },
        //     chart: Object.merge(uptime_chart, this.host_charts['os.uptime']),
        //     stop: function(payload){
        //     }.bind(this),
        //   }
        // )
        //
        // this.set_chart_visibility(this.host+'.os.uptime', true)
        //

        // this.available_graphs[this.host+'.os.loadavg'] = Object.merge(
        //   this.get_payload(charts_payloads,{
        //     name: 'os.loadavg',
        //     host: this.host,
        //     seconds: this.seconds
        //   }),
        //   {
        //     wrapper: {
        //       type: 'dygraph',
        //       props: {}
        //     },
        //     chart: Object.merge(this.host_charts['os.loadavg'], loadavg_chart),
        //     stop: function(payload){
        //     }.bind(this),
        //   }
        // )
        //
        // this.set_chart_visibility(this.host+'.os.loadavg', true)


        // // if(!this.available_graphs[this.host+'.os.freemem']){
        //   this.available_graphs[this.host+'.os.freemem'] = Object.merge(
        //     this.get_payload(charts_payloads,{
        //       name: 'os.freemem',
        //       host: this.host,
        //       seconds: this.seconds
        //     }),
        //     {
        //       wrapper: {
        //         type: 'dygraph',
        //         props: {}
        //       },
        //       chart: Object.merge(Object.clone(freemem_chart), {totalmem: this.stats[this.host+'.os.totalmem'][0].value}),
        //       stop: function(payload){
        //       }.bind(this),
        //       pipeline: {
        //         range: true
        //       }
        //     }
        //   )
        //
        //   this.set_chart_visibility(this.host+'.os.freemem', true)
        // // }


        // let mount = /os_mounts/g
        // let blockdevice = /os_blockdevices/g
        // let networkInterface = /os_networkInterfaces_stats/g
        //
        // Object.each(this.tabulars, function(stat, key){
        //   if(mount.test(key) && this.host_charts['os_mounts.percentage']){
        //
        //
        //     let _name = key.substring(key.lastIndexOf('.') + 1)
        //     let chart_name = this.host+'.os_mounts.'+_name
        //
        //     if(!this.available_graphs[chart_name]){
        //       ////console.log('adding mount chart ',chart_name)
        //       this.available_graphs[chart_name] = Object.clone(Object.merge(
        //         this.get_payload(charts_payloads,{
        //           name: 'os_mounts.percentage',
        //           host: this.host,
        //           seconds: this.seconds
        //         }),
        //         {
        //           wrapper: {
        //             type: 'dygraph',
        //             props: {}
        //           },
        //           name: chart_name,
        //           chart: Object.merge(Object.clone(mounts_percentage_chart), Object.clone(this.host_charts['os_mounts.percentage'])),
        //           stop: function(payload){
        //
        //           }.bind(this),
        //
        //         }
        //       ))
        //       this.$set(this.mounts, _name, 1)
        //       this.set_chart_visibility(chart_name, true)
        //     }
        //
        //   }
        //
        //   if(blockdevice.test(key) && this.host_charts['os_blockdevices.stats']){
        //
        //     let _name = key.substring(key.lastIndexOf('.') + 1)
        //     let chart_name = this.host+'.os_blockdevices.stats.'+_name
        //
        //       this.available_graphs[chart_name] = Object.merge(
        //         Object.clone(this.get_payload(charts_payloads,{
        //           name: 'os_blockdevices.stats',
        //           host: this.host,
        //           seconds: this.seconds
        //         })),
        //         Object.clone({
        //           wrapper: {
        //             type: 'dygraph',
        //             props: {}
        //           },
        //           name: chart_name,
        //           chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.host_charts['os_blockdevices.stats'])),
        //           stop: function(payload){
        //           }.bind(this),
        //
        //         })
        //       )
        //
        //       this.$set(this.blockdevices, _name, 1)
        //       this.set_chart_visibility(chart_name, true)
        //   }
        //
        //   if(networkInterface.test(key) && this.host_charts['os_networkInterfaces_stats.properties']){
        //     let _name = key.substring(key.lastIndexOf('.') + 1)
        //     let chart_name = this.host+'.os_networkInterfaces_stats.properties.'+_name
        //
        //     if(!this.available_graphs[chart_name]){
        //
        //       this.available_graphs[chart_name] = Object.merge(
        //         Object.clone(this.get_payload(charts_payloads,{
        //           name: 'os_networkInterfaces_stats.properties',
        //           host: this.host,
        //           seconds: this.seconds
        //         })),
        //         Object.clone({
        //           wrapper: {
        //             type: 'dygraph',
        //             props: {}
        //           },
        //           name: chart_name,
        //           chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.host_charts['os_networkInterfaces_stats.properties'])),
        //           stop: function(payload){
        //           }.bind(this),
        //         })
        //       )
        //
        //       this.$set(this.networkInterfaces_properties, _name, 1)
        //       this.set_chart_visibility(chart_name, true)
        //     }
        //
        //   }
        //
        //
        // }.bind(this))

      }
    })
    /**
    * remove for testing
    **/


    /**
    * pie
    **/
    // this.available_graphs[this.host+'_os_freemem_pie'] = {
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
    //         // ////////////console.log('_os_freemem_pie transform', values, chart.totalmem, last)
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
    // this.available_graphs[this.host+'_os_freemem_knob'] = {
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
    //         // ////////////console.log('_os_freemem_knob transform', values, chart.totalmem, last)
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
  },



  mounted: function(){

    this.create_host_pipelines(this.$store.state.app.paths)

  },

  beforeCreate: function(){
    ////////////////console.log('life cycle beforeCreate')
    EventBus.$off('host')
    EventBus.$off('os')
  },
  beforeDestroy: function(){

    this.destroy_host_pipelines()

    this.remove_charts()
    // this.remove_charts({
    //   // clean: true,
    //   unwatch: true,
    // })
    // this.remove_chart_stats()

    // this.$store.dispatch('stats/flush_all', {host: this.host})
    // this.$store.dispatch('stats_tabular/flush_all', {host: this.host})

    // this.$store.dispatch('stats/splice', {host: this.host, length: 300})
    // this.$store.dispatch('stats_tabular/splice', {host: this.host, length: 300})
  },
  // destroyed: function(){
  //   this.$off()
  // },
  methods: {
    update_daterangepicker: function(){
      //////////console.log('update_daterangepicker')
      Object.each(this.$options.daterangepicker.ranges, function(range, key){
        // range[1] = moment(new Date())
        // this.$set(this.daterangepicker.ranges[key], 1, moment(Date.now()))
        Array.each(range, function(start_or_end, index){
          if(typeof this.$options.daterangepicker.ranges[key][index] == 'function')
            this.$set(this.daterangepicker.ranges[key], index, this.$options.daterangepicker.ranges[key][index]())

        }.bind(this))
        ////////////console.log('update_daterangepicker', this.daterangepicker.ranges[key])
      }.bind(this))

    },
    set_range: function(start, end){
      // //////console.log('set_range', start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf())
      let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      this.$store.commit('app/range', range)

      // let counter = 0
      // Object.each(this.available_graphs, function(payload, name){
      //   let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      //   let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      //   this.$store.commit('app/range', Array.clone(range))
      //   // if(Array.isArray(this.available_graphs[name].stat)){
      //   //   Array.each(this.available_graphs[name].stat, function(stat, index){
      //   //     this.available_graphs[name].stat[index].range = Array.clone(range)//clone it, as each one may modify range
      //   //     this.available_graphs[name].stat[index].length = length
      //   //
      //   //     let indexed_name = name +'_'+index
      //   //     this.remove_watcher(indexed_name)
      //   //   }.bind(this))
      //   // }
      //   // else{
      //   //   this.available_graphs[name].stat.range = Array.clone(range)
      //   //   this.available_graphs[name].stat.length = length
      //   //   this.remove_watcher(name)
      //   // }
      //
      //   // this.remove_chart(name, {unwatch: true})
      //
      //
      //   // // if(name.indexOf('networkInterface') == -1)
      //   // if(!payload.init || typeof payload.init != 'function'){
      //   //   this.__get_stat_for_chart(this.available_graphs[name])
      //   //   ////////////console.log('set_range __get_stat_for_chart', this.available_graphs[name])
      //   // }
      //
      //   // if(counter == Object.getLength(this.available_graphs) - 1)
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
      ////////////////console.log('process_os_tabular', doc)
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

                ////////////////console.log('process_os_tabular', path, key, result)

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

            // //////////////////console.log('ROW', keys, path)

            if(!paths[path])
              paths[path] = {}


            Object.each(keys, function(data, key){
              // //////////////////console.log('ROW', key, data)
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
      //////////console.log('__add_os_doc_stats_tabular', paths)
      Object.each(paths, function(keys, path){
        //////////console.log('__add_os_doc_stats_tabular PATH', path)

        Object.each(keys, function(data, key){
          //////////console.log('__add_os_doc_stats_tabular KEY', key, data)
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

            ////////////////console.log('process_os_tabular', path, key, result)
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
      //////////console.log('__add_os_doc_stats', paths)
      Object.each(paths, function(keys, path){
        //////////console.log('__add_os_doc_stats PATH', path)

        Object.each(keys, function(data, key){
          //////////console.log('__add_os_doc_stats KEY', key, data)
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
    create_host_pipelines (paths) {
      // paths = ['os.procs']
      ////////////////////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
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

              ////////////////////////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                //////////////////////////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  ////////////////////////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  ////////////////////////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

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
                ////////////////////////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

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
      if(this.$options.collapsibles[entry.target.id] == undefined || this.$options.collapsibles[entry.target.id] == true){
        let id = entry.target.id.replace('-collapsible', '')
        this.set_chart_visibility(id, isVisible)
      }
    },

    showCollapsible (collapsible){
      //////////console.log('showCollapsible', $(collapsible).attr('id'))
      this.$options.collapsibles[$(collapsible).attr('id')] = true
      // this.$options.has_no_data[collapsible.replace('-collapsible', '')] = 0
      // this.$set(this.hide, collapsible.replace('-collapsible', ''), false)
      let id = $(collapsible).attr('id').replace('-collapsible', '')

      this.set_chart_visibility(id, true)
    },
    hideCollapsible (collapsible){
      //////////console.log('hideCollapsible', $(collapsible).attr('id'))
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
        && this.available_graphs[id]
        && (this.visibility[id] == undefined || this.visibility[id] == true)
      ){
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
        //////////console.log('set_chart_visibility REMOVE', id, isVisible, this.visibility[id])
        // this.$store.dispatch('stats/splice', this.available_graphs[id].stat)
        // this.$store.dispatch('stats_tabular/splice', this.available_graphs[id].stat)
      }
      else if (
        isVisible == true
        && this.available_graphs[id]
        && (this.visibility[id] == undefined || this.visibility[id] == false)
      ){
        //////console.log('set_chart_visibility ADD', id, isVisible, this.available_graphs[id])
        this.$set(this.visibility, id, true)
        this.add_chart(this.available_graphs[id], id)
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
