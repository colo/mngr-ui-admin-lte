
<script>

import * as Debug from "debug"

const debug = Debug("mngr-ui-admin-lte:mngr-ui-admin-lte:pages:dashboard:host"),
      debug_internals = Debug("mngr-ui-admin-lte:mngr-ui-admin-lte:pages:dashboard:host:Internals"),
      debug_events = Debug("mngr-ui-admin-lte:mngr-ui-admin-lte:pages:dashboard:host:Events");


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
// // import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
// // import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
// // import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
// import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
// // import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
// // import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
// // import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
// // import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'
// import networkInterfaces_stats_chart from 'mngr-ui-admin-charts/os/networkInterfaces_stats'

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
  // stat_whitelist: /os_procs_stats|os_procs_cmd_stats|os_procs_uid_stats|freemem|totalmem|cpus/,
  stat_whitelist: /freemem|totalmem|cpus/,
  // tabular_blacklist: /multicast|packets|frame|compressed|fifo/i,
  tabular_whitelist: /^((?!multicast|frame|compressed|fifo).)*$/,

  // charts_stat_whitelist: /freemem/,
  charts_stat_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  charts_tabular_blacklist: /os_procs_stats_percentage_cpu|os_procs_cmd_stats_percentage_cpu|os_procs_uid_stats_percentage_cpu|os_networkInterfaces_stats_(.*?)_(drop|err|packets)|mounts/i,

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
    // 'host': function(newVal, oldVal) { this.create_pipelines(this.$store.state.app.paths) },
    'host': function(newVal, oldVal) { this.create_pipelines(newVal) },
    // '$store.state.app.paths': function(newVal, oldVal) { this.create_pipelines(newVal) }
  },
  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,


      hosts: state => state.hosts.all,

      // cpus: state => state.stat_sources.'+this.host+'_os_procs_stats_kernel'
      cpus: function(state){
        if(this.host && state.stat_sources[this.host+'_os_cpus']){
          return state.stat_sources[this.host+'_os_cpus'][0].value
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


  // updated: function(){
  //   debug_internals('updated', this.$route.params.host)
  //   this.$store.commit('hosts/current', this.$route.params.host || '')
  // },


  methods: {

    __clean_create: function(next){
      EventBus.$off('host')
      EventBus.$off('os')


      if(next)
        next()
    },
    /**
    * if remaining !== false => return os_mounts.1, else => os_mounts
    **/
    __match_source_paths: function(source, paths, remaining){
      debug_internals('__match_source_paths', source, paths)
      let path = undefined

      if(paths.contains(source) && paths.length > 0){
        path = paths[paths.indexOf(source)]
        if(remaining) path += '.'+remaining
      }
      else if (source.indexOf('_') && paths.length > 0){

        let new_source = source.substring(0, source.lastIndexOf('_'))
        if(remaining !== false){
          let new_remaining = source.substring(source.lastIndexOf('_') + 1)
          remaining = (remaining) ? new_remaining +'_'+ remaining : new_remaining
        }
        path = this.__match_source_paths(new_source, paths, remaining)
      }
      else{
        path = source
      }



      return path
    },
    __init_charts: function(next){
      this.$options.charts_payloads = host_charts_payloads({
        host: this.host,
        seconds: this.seconds,
        // seconds: 300,
        range: this.range,
      })

      let __create_from_tabular_sources = function(tabular_sources){

        debug_internals('__init_charts $store.state.tabular_sources', tabular_sources)
        let whitelist = this.$options.charts_tabular_whitelist
        let blacklist = this.$options.charts_tabular_blacklist

        Object.each(tabular_sources, function(tab, source){
          debug_internals('__init_charts $store.state.tabular_sources', source)

          if(
            !this.available_charts[source]
            && this.dashboard_instances[source]
            && this.$store.state['dashboard_'+this.host].paths.length > 0
            && this.__white_black_lists_filter(whitelist, blacklist, source)
          ){
            debug_internals('__init_charts $store.state.tabular_sources creating', source, this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false))

            this.$set(this.available_charts, source, Object.merge(
              Object.clone({
                name: source,
                chart: undefined,
                init: undefined,
                stop: undefined,
                wrapper: {
                  type: 'dygraph',
                  props: {}
                },
                stat: {
                  merged: false,
                  sources: [{type: 'tabular', path: source}],
                  events: [{
                    host: this.host,
                    path: this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false),
                    // key: 'cpus',
                    length: this.seconds,
                    tabular: true,
                    range: this.range
                  }],
                  length: this.seconds,
                  range: this.range,
                },
                /**
                * for __get_stat_for_chart
                **/
                pipeline: {
                  name: 'input.os',
                  // // path: 'os',
                  // range: true
                }
              }),
              {
                // chart: Object.merge(cpus_times_chart, this.dashboard_charts['os.cpus.times']),
                chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_instances[source]),

                // chart: this.dashboard_charts['os.cpus.times'],
              })
            )

            this.set_chart_visibility(source, true)
          }


        }.bind(this))

      }.bind(this)

      let __create_from_stat_sources = function(stat_sources){

        debug_internals('__init_charts $store.state.stat_sources', stat_sources)
        let whitelist = this.$options.charts_stat_whitelist
        let blacklist = this.$options.charts_stat_blacklist

        Object.each(stat_sources, function(stat, source){
          debug_internals('__init_charts $store.state.stat_sources', source)

          if(
            !this.available_charts[source]
            // && this.dashboard_instances[source]
            && this.$store.state['dashboard_'+this.host].paths.length > 0
            && this.__white_black_lists_filter(whitelist, blacklist, source)
          ){
            debug_internals('__init_charts $store.state.stat_sources creating', source, this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false))

            let chart_payload = this.$options.charts_payloads[source.replace(this.host+'_', '')]

            this.$set(this.available_charts, source, Object.merge(
              Object.clone({
                name: source,
                chart: undefined,
                init: undefined,
                stop: undefined,
                tabular: false,//this is for component, if not set, it's "chart-tabular"
                wrapper: {
                  type: 'dygraph',
                  props: {}
                },
                stat: {
                  merged: false,
                  sources: [{type: 'stat', path: source}],
                  events: [{
                    host: this.host,
                    path: this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false),
                    // key: 'cpus',
                    length: this.seconds,
                    tabular: false,
                    range: this.range
                  }],
                  length: this.seconds,
                  range: this.range,
                },
                /**
                * for __get_stat_for_chart
                **/
                pipeline: {
                  name: 'input.os',
                  // // path: 'os',
                  // range: true
                }
              }),
              {
                // chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_instances[source]),
                chart: Object.clone(dygraph_line_chart),

              },
              chart_payload
              )
            )

            this.set_chart_visibility(source, true)
          }


        }.bind(this))

      }.bind(this)

      let __create_freemem = function(stat_sources){
        debug_internals('__create_freemem', this.$options.charts_payloads['os_freemem'])
        let source = this.host+'_os_freemem'
        let chart_payload = this.$options.charts_payloads['os_freemem']
        if(
          !this.available_charts[source]
          && stat_sources[this.host+'_os_totalmem']
        ){
          this.$set(this.available_charts, source, Object.merge(
              Object.clone({
                name: source,
                chart: undefined,
                init: undefined,
                stop: undefined,
                tabular: false,//this is for component, if not set, it's "chart-tabular"
                wrapper: {
                  type: 'dygraph',
                  props: {}
                },
                stat: {
                  merged: false,
                  sources: [{type: 'stat', path: source}],
                  events: [{
                    host: this.host,
                    path: this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false),
                    // key: 'cpus',
                    length: this.seconds,
                    tabular: false,
                    range: this.range
                  }],
                  length: this.seconds,
                  range: this.range,
                },
                /**
                * for __get_stat_for_chart
                **/
                pipeline: {
                  name: 'input.os',
                  // // path: 'os',
                  // range: true
                }
              }),
              chart_payload,
              {
                chart: {totalmem: stat_sources[this.host+'_os_totalmem'][0].value}
              }
            )
          )

          this.set_chart_visibility(source, true)
        }
      }.bind(this)

      let __create_os_procs_percentage_cpu = function(tabular_sources){
        let percentage_cpu = [
          'os_procs_stats_percentage_cpu',
          'os_procs_cmd_stats_percentage_cpu',
          'os_procs_uid_stats_percentage_cpu'
        ]

        Array.each(percentage_cpu, function(source){

          debug_internals('__create_os_procs_percentage_cpu', source)
          source = this.host+'_'+source
          // let chart_payload = this.$options.charts_payloads['os_freemem']

          if(
            !this.available_charts[source]
            && this.dashboard_instances[source]
            // && this.$store.state['dashboard_'+this.host].paths.length > 0
            // && this.__white_black_lists_filter(whitelist, blacklist, source)
          ){
            debug_internals('__create_os_procs_percentage_cpu creating', source)

            this.$set(this.available_charts, source, Object.merge(
              Object.clone({
                name: source,
                chart: undefined,
                init: undefined,
                stop: undefined,
                wrapper: {
                  type: 'dygraph',
                  props: {}
                },
                stat: {
                  merged: false,
                  sources: [{type: 'tabular', path: source}],
                  events: [{
                    host: this.host,
                    path: this.__match_source_paths(source.replace(this.host+'_', ''), this.$store.state['dashboard_'+this.host].paths, false),
                    // key: 'cpus',
                    length: this.seconds,
                    tabular: true,
                    range: this.range
                  }],
                  length: this.seconds,
                  range: this.range,
                },
                /**
                * for __get_stat_for_chart
                **/
                pipeline: {
                  name: 'input.os',
                  // // path: 'os',
                  // range: true
                }
              }),
              {
                // chart: Object.merge(cpus_times_chart, this.dashboard_charts['os.cpus.times']),
                chart: Object.merge(
                  Object.clone(dygraph_line_chart),
                  this.dashboard_instances[source],
                  {
                    "options": {
                      valueRange: [0, this.cpus.length * 100],
                      stackedGraph: true,
                      // labels: ['Time'],
                    }
                  },
                ),

                // chart: this.dashboard_charts['os.cpus.times'],
              })
            )

            this.set_chart_visibility(source, true)
          }


        }.bind(this))

      }.bind(this)

      let __create_os_networkInterfaces_stats_packets_drop_err = function(tabular_sources){
        let __networkInterfaces_merge = ['packets', 'drop', 'errs']
        __networkInterfaces_merge.sort()
        let __networkInterfaces_merged_charts = {}
        let networkInterface = new RegExp(this.host+'_os_networkInterfaces_stats')

        Object.each(tabular_sources, function(stat, key){

          // if(networkInterface.test(key) && this.dashboard_charts['os_networkInterfaces_stats.properties']){
          if(
            networkInterface.test(key)
            // !this.available_charts[source]
            // && this.dashboard_instances[source]
            // && this.$store.state['dashboard_'+this.host].paths.length > 0
          ){

            let arr_key = key.split('_')
            let _name = arr_key[arr_key.length - 2]+'_'+arr_key[arr_key.length - 1] //last 2 items
            // let chart_name = this.host+'_os_networkInterfaces_stats_'+_name
            let iface_name = _name.substr(0, _name.indexOf('_'))
            let prop_name = _name.substr(_name.indexOf('_') + 1)

            // //console.log('IFACE', iface_name, prop_name)
            if(__networkInterfaces_merge.contains(prop_name)){
              let merged_chart_name = this.host+'_os_networkInterfaces_stats_'+iface_name+'_'+__networkInterfaces_merge.join('_')

              if(!this.available_charts[merged_chart_name]){
                /**
                * @removed
                **/
                // Array.each(__networkInterfaces_merge, function(name){
                //   merged_chart_name += '.'+name
                // })

                if(!__networkInterfaces_merged_charts[merged_chart_name]){

                  __networkInterfaces_merged_charts[merged_chart_name] = Object.clone({
                    name: merged_chart_name,
                    chart: Object.clone(dygraph_line_chart),
                    init: undefined,
                    stop: undefined,
                    wrapper: {
                      type: 'dygraph',
                      props: {}
                    },
                    stat: {
                      merged: true,
                      sources: [],
                      events: [{
                        host: this.host,
                        path: 'os_networkInterfaces_stats',
                        length: this.seconds,
                        tabular: true,
                        range: this.range
                      }],
                      length: this.seconds,
                      range: this.range,
                    },
                    /**
                    * for __get_stat_for_chart
                    **/
                    pipeline: {
                      name: 'input.os',
                      // // path: 'os',
                      // range: true
                    }
                  })

                  __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels = ['Time']

                }

                __networkInterfaces_merged_charts[merged_chart_name].stat.sources.push(
                  {type: 'tabular', path:this.host+'_os_networkInterfaces_stats_'+_name}
                )

                let __labels = Array.clone(this.dashboard_instances[this.host+'_os_networkInterfaces_stats_'+_name].options.labels)
                __labels.shift() //remove 'Time' column

                Array.each(__labels, function(label, index){
                  __networkInterfaces_merged_charts[merged_chart_name].chart.options.labels.push(prop_name+' '+label)
                })

                if(__networkInterfaces_merge.indexOf(prop_name) == __networkInterfaces_merge.length - 1){//last item
                  this.$set(this.available_charts, merged_chart_name, __networkInterfaces_merged_charts[merged_chart_name])

                  // if(this.available_charts[merged_chart_name].stat.sources.length == 1)
                  //   this.available_charts[merged_chart_name].stat.merged = false

                  this.set_chart_visibility(merged_chart_name, true)

                  delete __networkInterfaces_merged_charts[merged_chart_name]


                }

              }

            }


          }

        }.bind(this))



      }.bind(this)


      let __create_os_mounts = function(tabular_sources){

        if(!this.available_charts[this.host+'_mounts']){
          let mount = new RegExp(this.host+'_os_mounts')

          let _merge = []
          let _merged_charts = {}

          Object.each(tabular_sources, function(stat, key){
            if(mount.test(key)){
              let _name = key.substring(key.lastIndexOf('_') + 1)
              if(!_merge.contains(_name))
                _merge.push(_name)
            }
          })

          Object.each(tabular_sources, function(stat, key){
            // if(mount.test(key) && this.dashboard_charts['os_mounts.percentage']){
            if(mount.test(key)){

              let _name = key.substring(key.lastIndexOf('_') + 1)
              // let chart_name = this.host+'.os_mounts.'+_name

              if(_merge.contains(_name)){
                let merged_chart_name = this.host+'_os_mounts'

                if(!_merged_charts[merged_chart_name]){
                  _merged_charts[merged_chart_name] = Object.clone({
                    name: merged_chart_name,
                    chart: Object.clone(dygraph_line_chart),
                    init: undefined,
                    stop: undefined,
                    wrapper: {
                      type: 'dygraph',
                      props: {}
                    },
                    stat: {
                      merged: true,
                      sources: [],
                      events: [{
                        host: this.host,
                        path: 'os_mounts',
                        length: this.seconds,
                        tabular: true,
                        range: this.range
                      }],
                      length: this.seconds,
                      range: this.range,
                    },
                    /**
                    * for __get_stat_for_chart
                    **/
                    pipeline: {
                      name: 'input.os',
                      // // path: 'os',
                      // range: true
                    }
                  })

                  _merged_charts[merged_chart_name].chart.options.labels = ['Time']
                }

                _merged_charts[merged_chart_name].stat.sources.push(
                  {type: 'tabular', path:this.host+'_os_mounts_'+_name}
                )

                let __labels = Array.clone(this.dashboard_instances[this.host+'_os_mounts_'+_name].options.labels)
                __labels.shift() //remove 'Time' column

                Array.each(__labels, function(label, index){
                  _merged_charts[merged_chart_name].chart.options.labels.push(_name+' '+label)
                })

                if(_merge.indexOf(_name) == _merge.length - 1){//last item
                  this.$set(this.available_charts, merged_chart_name, _merged_charts[merged_chart_name])

                  //if there is only one mount
                  if(this.available_charts[merged_chart_name].stat.sources.length == 1)
                    this.available_charts[merged_chart_name].stat.merged = false

                  this.set_chart_visibility(merged_chart_name, true)

                  //console.log('MERGED MOUNT', _merged_charts[merged_chart_name])

                  delete _merged_charts[merged_chart_name]


                }

              }

            }

          }.bind(this))

        }

      }.bind(this)



      let __unwatch_tabular_sources = this.$watch('$store.state.tabular_sources', function(tabular_sources){
        //   __unwatch_tabular_sources()
        if(tabular_sources
          && this.available_charts
          && this.dashboard_instances
          && this.$store.state['dashboard_'+this.host].paths.length > 0
        ){
          __create_from_tabular_sources(tabular_sources)
          __create_os_procs_percentage_cpu(tabular_sources)
          __create_os_networkInterfaces_stats_packets_drop_err(tabular_sources)
          __create_os_mounts(tabular_sources)
        }


      }.bind(this), {deep: true})

      let __unwatch_stat_sources = this.$watch('$store.state.stat_sources', function(stat_sources){
        //   __unwatch_tabular_sources()
        if(stat_sources
          && this.available_charts
          && this.dashboard_instances
          && this.$store.state['dashboard_'+this.host].paths.length > 0
        ){
          __create_from_stat_sources(stat_sources)
          __create_freemem(stat_sources)
        }
        // }
      }.bind(this), {deep: true})

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


      // }
      //
      //

      // let blockdevice = new RegExp(this.host+'_os_blockdevices')
      // let networkInterface = new RegExp(this.host+'_os_networkInterfaces_stats')
      // let munin = new RegExp(this.host+'_munin_')
      // let munin_max_range_value = /max/
      //
      // let __unwacth_munin = this.$watch('$store.state.tabular_sources', function(val){
      //   let _merge = {}
      //   let _merged_charts = {}
      //
      //
      //   Object.each(val, function(stat, key){
      //     if(munin.test(key)){
      //       let munin_name = key.replace(munin, '')
      //       let _path = munin_name.substring(0, munin_name.lastIndexOf('_'))
      //       let _name = munin_name.substring(munin_name.lastIndexOf('_')+1)
      //
      //       if(!_merge[_path]) _merge[_path] = []
      //
      //       if(!_merge[_path].contains(_name))
      //         _merge[_path].push(_name)
      //
      //       // let _name = key.substring(key.lastIndexOf('_') + 1)
      //       // // let prop_name = _name.substr(_name.indexOf('_') + 1)
      //       // if(!_merge.contains(_name))
      //       //   _merge.push(_name)
      //
      //     }
      //   }.bind(this))
      //
      //   if(Object.getLength(_merge) > 0){
      //     // console.log('MUNIN',_merge)
      //      // && (this.dashboard_charts['munin'] || this.dashboard_charts['munin_'+path]){
      //     __unwacth_munin()
      //
      //     Object.each(_merge, function(names, _path){
      //       let merged_chart_name = this.host+'.munin_'+_path
      //       /**
      //       * @removed
      //       **/
      //       // Array.each(names, function(_name){
      //       //   merged_chart_name += '.'+_name
      //       // })
      //       debug_internals('this.dashboard_instances', this.dashboard_instances)
      //
      //       if(!_merged_charts[merged_chart_name]){
      //         _merged_charts[merged_chart_name] = Object.merge(
      //           Object.clone(this.$options.charts_payloads['munin']),
      //           {
      //             stat: {
      //               // sources: [],
      //               events: [{
      //                 host: this.host,
      //                 path: 'munin_'+_path,
      //                 tabular: true,
      //               }]
      //             },
      //             name: merged_chart_name,
      //             // chart: Object.clone(dygraph_line_chart),
      //
      //             chart: (this.dashboard_instances['munin_'+_path]) ? Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_instances['munin_'+_path][names[0]])) : Object.clone(dygraph_line_chart),
      //           }
      //         )
      //
      //         // _merged_charts[merged_chart_name].chart.interval = 5
      //         _merged_charts[merged_chart_name].chart.options.labels = ['Time']
      //         let options = Object.clone(_merged_charts[merged_chart_name].chart.options)
      //         _merged_charts[merged_chart_name].chart.options = undefined
      //
      //         this.$set(this.available_charts, merged_chart_name, Object.merge(_merged_charts[merged_chart_name]))
      //         this.$set(this.available_charts[merged_chart_name].chart, 'options', options)
      //
      //         this.$set(this.available_charts[merged_chart_name].chart.options, 'labels', ['Time'])
      //
      //       }
      //
      //       Array.each(names, function(_name, _name_index){
      //         this.available_charts[merged_chart_name].stat.sources.push(
      //           {type: 'tabular', path:this.host+'_munin_'+_path+'_'+_name}
      //         )
      //
      //         if(munin_max_range_value.test(_name))
      //           this.$set(this.available_charts[merged_chart_name].chart.options,
      //             'valueRange',
      //             [0, this.$store.state.tabular_sources[this.host+'_munin_'+_path+'_'+_name][1]]//[0] is timestamp
      //           )
      //
      //         this.available_charts[merged_chart_name].chart.options.labels.push(_name)
      //
      //         if(_name_index == names.length - 1){//last item
      //
      //           if(this.available_charts[merged_chart_name].stat.sources.length == 1)
      //             this.available_charts[merged_chart_name].stat.merged = false
      //
      //           /**
      //           * length : specify length (# of seconds / 5 seconds refresh)
      //           **/
      //           this.available_charts[merged_chart_name].stat.length = (this.seconds / 5)
      //
      //           this.set_chart_visibility(merged_chart_name, true)
      //
      //           console.log('MERGED MUNIN', this.available_charts[merged_chart_name])
      //
      //           delete _merged_charts[merged_chart_name]
      //
      //
      //         }
      //       }.bind(this))
      //
      //
      //
      //
      //     }.bind(this))
      //
      //
      //   }
      //
      //
      // }, {deep: true})
      //

      //
      // let __unwacth_blockdevices = this.$watch('$store.state.tabular_sources', function(val){
      //   Object.each(this.$store.state.tabular_sources, function(stat, key){
      //
      //     if(blockdevice.test(key) && this.dashboard_charts['os_blockdevices.stats']){
      //       __unwacth_blockdevices()
      //
      //       let _name = key.substring(key.lastIndexOf('_') + 1)
      //       let chart_name = this.host+'.os_blockdevices.stats.'+_name
      //
      //       // //console.log('BLK', chart_name)
      //
      //       if(!this.available_charts[chart_name]){
      //
      //         this.$set(this.available_charts, chart_name, Object.merge(
      //           Object.clone(this.$options.charts_payloads['os_blockdevices.stats']),
      //           {
      //             stat: {
      //               sources: [{type: 'tabular', path:this.host+'_os_blockdevices_stats_'+_name}],
      //             },
      //             name: chart_name,
      //             // chart: Object.merge(Object.clone(blockdevices_stats_chart), Object.clone(this.dashboard_charts['os_blockdevices.stats'])),
      //             chart: Object.merge(Object.clone(dygraph_line_chart), Object.clone(this.dashboard_charts['os_blockdevices.stats'])),
      //             // chart: Object.clone(this.dashboard_charts['os_blockdevices.stats']),
      //           })
      //         )
      //
      //         // this.$set(this.blockdevices, _name, 1)
      //         this.set_chart_visibility(chart_name, true)
      //       }
      //     }
      //   }.bind(this))
      //
      // },{deep:true})
      //

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
    create_pipelines: function (host, next) {
      debug_internals('create_pipelines', host)
      // paths = ['os.procs']
      //////////////////////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      host = host || this.$route.params.host || this.$store.state.hosts.current

      this.destroy_pipelines(host)

      if(host){
        // this.destroy_pipelines(host)

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
    destroy_pipelines: function (host) {
      debug_internals('destroy_pipelines', host)

      // host = host || this.$store.state.hosts.current || this.$route.params.host
      //
      // if(
      //   host
      //   && Object.getLength(this.$options.pipelines) > 0
      // ){
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

      // }
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
