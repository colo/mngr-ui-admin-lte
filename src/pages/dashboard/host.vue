<template>
  <section class="content">
    <div class="row">
      <section class="col-lg-12 connectedSortable">
        <admin-lte-box-solid
          title="Summary"
          :id="host+'_summary-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >
          <admin-lte-dashboard-host-summary>
          </admin-lte-dashboard-host-summary>
        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="CPU Times"
          :id="host+'_os_cpus_times-collapsible'"
          v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
          v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
          v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
          v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
          v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
            v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
            v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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
              v-observe-visibility="{ callback: visibilityChanged, throttle: 200 }"
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

import uptime_chart from 'mngr-ui-admin-charts/os/uptime'
import loadavg_chart from 'mngr-ui-admin-charts/os/loadavg'
import cpus_times_chart from 'mngr-ui-admin-charts/os/cpus_times'
import cpus_percentage_chart from 'mngr-ui-admin-charts/os/cpus_percentage'
import freemem_chart from 'mngr-ui-admin-charts/os/freemem'
import mounts_percentage_chart from 'mngr-ui-admin-charts/os/mounts_percentage'
import blockdevices_stats_chart from 'mngr-ui-admin-charts/os/blockdevices_stats'
import networkInterfaces_chart from 'mngr-ui-admin-charts/os/networkInterfaces'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

  charts_objects: {},
  charts: {},
  pipelines: {},

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
    // dygraphWrapper
  },

  // visible_paths:['os', 'os.procs'],

  breadcrumb () {
    return {
      label: this.$route.params.host,
      parent: 'Dashboard'
    }
  },



  data () {
    return {
      visibility: {},
    }
  },
  // pouch: {
  //   host: {}
  // },

  watch: {
    // '$store.state.app.docs.os': function(oldVal, newVal){
    //   //////console.log('recived doc via Event os', newVal)
    //   this.process_os_doc(newVal)
    // },
    '$store.state.app.paths': function(oldVal, newVal){ this.create_host_pipelines(newVal) }
  },
  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,
      // reset: state => state.app.reset,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // //////////////////console.log('seconds to splice', state.app.range)

        let end = new Date().getTime()
        if(state.app.range[1] != null)
          end = state.app.range[1]

        let seconds = Math.trunc( (end - state.app.range[0]) / 1000 )


        // return seconds
        return 300
      },
      hosts: state => state.hosts.all,
      // currentHost: state => state.hosts.current,
      // mounts: function(state){
      //   let host = state.hosts.current || this.$route.params.host
      //   return state.stats[host].os_mounts
      // }
    }),
    {
      host: function(){
        return this.$store.state.hosts.current || this.$route.params.host
      },
      mounts: function(){
        // let host = this.$route.params.host || this.$store.state.hosts.current
        if(this.$store.state.stats && this.$store.state.stats[this.host]){
          return this.$store.state.stats[this.host].os_mounts
        }
        else{
          return {}
        }
      },
      blockdevices: function(){
        // let host = this.$route.params.host || this.$store.state.hosts.current
        if(this.$store.state.stats && this.$store.state.stats[this.host]){
          return this.$store.state.stats[this.host].os_blockdevices
        }
        else{
          return {}
        }
      },
      networkInterfaces: function(){
        // let host = this.$route.params.host || this.$store.state.hosts.current
        if(this.$store.state.stats && this.$store.state.stats[this.host]){
          // return this.$store.state.stats[this.host].os_networkInterfaces
          let networkInterfaces = {}
          let val = this.$store.state.stats[this.host].os.networkInterfaces.value.data
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

          //console.log('networkInterfaces', networkInterfaces)
          return networkInterfaces
        }
        else{
          return {}
        }
      }
    }

  ),

  created: function(){
    console.log('life cycle created')

    EventBus.$once('host', doc => {
      // console.log('recived doc via Event host', doc)
      Object.each(doc.charts, function(data, name){
        this.$options.charts_objects[name] = data.chart
      }.bind(this))

      console.log('recived doc via Event host', doc, this.$options.charts_objects)

      this.__cpus_time_get_stat({
        name: this.host+'_os_cpus_times',
        stat: {
          host: this.host,
          path: 'cpus_times',
          key: 'os_cpus',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]

        }

      })

      this.__cpus_percentage_get_stat({
        name: this.host+'_os_cpus_percentage',
        stat: {
          host: this.host,
          path: 'cpus_percentage',
          key: 'os_cpus',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      })

      this.__uptime_get_stat({
        name: this.host+'_os_uptime',
        stat: {
          host: this.host,
          path: 'uptime',
          key: 'os_uptime',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      })

      this.__loadavg_get_stat({
        name: this.host+'_os_loadavg',
        stat: {
          host: this.host,
          path: 'loadavg',
          key: 'os_loadavg',
          length: this.seconds || 300,
          tabular:true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      })

      this.$options.charts[this.host+'_os_cpus_times'] = {
        name: this.host+'_os_cpus_times',
        chart: Object.merge(cpus_times_chart, this.$options.charts_objects['cpus_times']),
        // init: this.__cpus_time_get_stat.bind(this),
        stop: function(payload){
          console.log('stoping _os_cpus_times', payload.stat)
          this.$store.dispatch('stats_tabular/flush', payload.stat)

          // this.$store.dispatch('stats_tabular/splice', payload.stat)
        }.bind(this),
        // watch: {
        //   name: '$store.state.stats_tabular.'+this.host+'.cpus_times.os_cpus',
        //   deep: true,
        //   cb: (doc, old, payload) => {
        //     console.log('__cpus_time_get_stat watcher ', doc, old, payload)
        //     // if(this.visibility[payload.name] === true)
        //     if(doc && doc.value)
        //       this.__update_chart_stat(payload.name, doc.value)
        //   }
        // },
        // watch: {
        //   name: '$store.state.stats.'+this.host+'.os.cpus',
        //   deep: true,
        //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
        // },
        stat: {
          host: this.host,
          path: 'cpus_times',
          key: 'os_cpus',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]

        }
      }

      /**
      * remove for testing
      */
      this.$options.charts[this.host+'_os_cpus_percentage'] = {
        name: this.host+'_os_cpus_percentage',
        chart: Object.merge(cpus_percentage_chart, this.$options.charts_objects['cpus_percentage']),
        // init: this.__cpus_percentage_get_stat.bind(this),
        stop: function(payload){
          // console.log('stoping _os_cpus_times', payload.stat)
          this.$store.dispatch('stats_tabular/flush', payload.stat)
          // this.$store.dispatch('stats_tabular/splice', payload.stat)
        }.bind(this),
        // watch: {
        //   name: '$store.state.stats.'+this.host+'.os.cpus',
        //   // cb: this.__watcher_callback.bind(this)
        //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
        // },
        stat: {
          host: this.host,
          path: 'cpus_percentage',
          key: 'os_cpus',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      }


      this.$options.charts[this.host+'_os_uptime'] = {
        name: this.host+'_os_uptime',
        chart: Object.merge(uptime_chart, this.$options.charts_objects['uptime']),
        // init: this.__uptime_get_stat.bind(this),
        stop: function(payload){
          // console.log('stoping _os_cpus_times', payload.stat)
          this.$store.dispatch('stats_tabular/flush', payload.stat)
          // this.$store.dispatch('stats_tabular/splice', payload.stat)
        }.bind(this),
        // watch: {
        //   name: '$store.state.stats.'+this.host+'.os.uptime',
        //   // cb: (doc, old, payload) => this.__update_chart_stat(payload.name, doc.value)
        //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
        // },
        stat: {
          host: this.host,
          path: 'uptime',
          key: 'os_uptime',
          length: this.seconds || 300,
          tabular: true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      }

      this.$options.charts[this.host+'_os_loadavg'] = {
        name: this.host+'_os_loadavg',
        chart: Object.merge(loadavg_chart, this.$options.charts_objects['loadavg']),
        // init: this.__loadavg_get_stat.bind(this),
        stop: function(payload){
          // console.log('stoping _os_cpus_times', payload.stat)
          this.$store.dispatch('stats_tabular/flush', payload.stat)
          // this.$store.dispatch('stats_tabular/splice', payload.stat)
        }.bind(this),
        // watch: {
        //   name: '$store.state.stats.'+this.host+'.os.loadavg',
        //   // cb: this.__watcher_callback.bind(this)
        //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
        // },
        stat: {
          host: this.host,
          path: 'loadavg',
          key: 'os_loadavg',
          length: this.seconds || 300,
          tabular:true
          // range: [Date.now() - this.seconds * 1000, Date.now()]
        }
      }


      let unwatch_blockdevices = this.$watch('blockdevices', function(val, old){

        // //console.log('$watch blockdevices ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

        if(val !== undefined && Object.getLength(val) > 0){

          Object.each(val, function(mount, key){
            //console.log('adding blockdevice chart '+this.host+'_os_blockdevices_stats_'+key)
            let chart_name = this.host+'_os_blockdevices_stats_'+key

             this.$options.charts[chart_name] = Object.clone({
              name: this.host+'_os_blockdevices_stats_'+key,
              chart: Object.merge(blockdevices_stats_chart, this.$options.charts_objects['blockdevices_stats']),
              // init: this.__blockdevices_get_stat.bind(this),
              stop: function(payload){
                // console.log('stoping _os_cpus_times', payload.stat)
                this.$store.dispatch('stats_tabular/flush', payload.stat)
                // this.$store.dispatch('stats_tabular/splice', payload.stat)
              }.bind(this),
              // watch: {
              //   name: '$store.state.stats.'+this.host+'.os_blockdevices.'+key,
              //   deep:true,
              //   // cb: this.__watcher_callback.bind(this)
              //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
              // },
              stat: {
                host: this.host,
                path: 'blockdevices_stats',
                key: 'os_blockdevices_'+key,
                length: this.seconds || 300,
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              }
            })

            this.__blockdevices_get_stat({
              name: this.host+'_os_blockdevices_stats_'+key,
              stat: {
                host: this.host,
                path: 'blockdevices_stats',
                key: 'os_blockdevices_'+key,
                length: this.seconds || 300,
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              }
            })

          }.bind(this))

          unwatch_blockdevices()
        }
      }.bind(this),{
        deep:true
      })


      let unwatch_mounts = this.$watch('mounts', function(val, old){

        // //console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

        if(val !== undefined && Object.getLength(val) > 0){

          Object.each(val, function(mount, key){
            //console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
            let chart_name = this.host+'_os_mounts_percentage_'+key

             this.$options.charts[chart_name] = Object.clone({
              name: this.host+'_os_mounts_percentage_'+key,
              chart: Object.merge(mounts_percentage_chart, this.$options.charts_objects['mounts_percentage']),
              // init: this.__mounts_get_stat.bind(this),
              stop: function(payload){
                // console.log('stoping _os_cpus_times', payload.stat)
                this.$store.dispatch('stats_tabular/flush', payload.stat)
                // this.$store.dispatch('stats_tabular/splice', payload.stat)
              }.bind(this),
              // watch: {
              //   name: '$store.state.stats.'+this.host+'.os_mounts.'+key,
              //   deep:true,
              //   // cb: this.__watcher_callback.bind(this)
              //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
              // },
              stat: {
                host: this.host,
                path: 'mounts_percentage',
                key: 'os_mounts_'+key,
                length: this.seconds || 300,
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              }
            })

            // this.add_chart(this.$options.charts[chart_name], chart_name)
            this.__mounts_get_stat({
              name: this.host+'_os_mounts_percentage_'+key,
              stat: {
                host: this.host,
                path: 'mounts_percentage',
                key: 'os_mounts_'+key,
                length: this.seconds || 300,
                tabular: true
                // range: [Date.now() - this.seconds * 1000, Date.now()]
              }
            })
          }.bind(this))

          unwatch_mounts()
        }
      }.bind(this),{
        deep:true
      })

      // Object.each(this.$options.charts, function(chart, id){
      //   this.add_chart(chart, id)
      // }.bind(this))

      /**
      * remove for testing
      **/
    })

    EventBus.$on('os', payload => {
      // console.log('recived doc via Event os', payload)
        // if(this.$options.tabular_range_started === true && payload.tabular == true){
        if(payload.tabular == true){
          this.process_os_tabular(payload.doc)
        }
        // else if(this.$options.range_started === true && payload.tabular != true){
        else{
          this.process_os_doc(payload.doc, this.__add_os_doc_stats.bind(this))
        }

        // if(payload.type == 'range')
        //   console.log('RANGE', payload)

        if(
          payload.type == 'range'
          && payload.tabular != true
          // && this.$options.range_started === false
        ){
          // this.$options.range_started = true
          EventBus.$emit(payload.doc[0].doc.metadata.path+'Range')
          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')
          // //console.log('RANGE', payload.doc[0].doc.metadata.path+'Range')
        }
        else if(
          payload.type == 'range'
          // && this.$options.tabular_range_started === false
        ){
          console.log('recived doc via Event os', payload)
          // this.$options.tabular_range_started = true
          EventBus.$emit('tabularRange')
        }
    })


  },



  mounted: function(){
    console.log('life cycle mounted')

    this.create_host_pipelines(this.$store.state.app.paths)


    /**
    * remove for testing
    **/

    this.$options.charts[this.host+'_os_freemem'] = {
      name: this.host+'_os_freemem',
      chart: Object.clone(freemem_chart),
      // init: this.__freemem_get_stat.bind(this),
      stop: function(payload){
        // console.log('stoping _os_cpus_times', payload.stat)
        this.$store.dispatch('stats/flush', payload.stat)
        // this.$store.dispatch('stats/splice', payload.stat)
      }.bind(this),
      // watch: {
      //   name: '$store.state.stats.'+this.host+'.os.freemem',
      //   // cb: this.__watcher_callback.bind(this)
      //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
      // },
      stat: {
        host: this.host,
        path: 'os',
        key: 'freemem',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    }

    this.__freemem_get_stat({
      name: this.host+'_os_freemem',
      stat: {
        host: this.host,
        path: 'os',
        key: 'freemem',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    })


    let unwatch_networkInterfaces = this.$watch('networkInterfaces', function(val, old){

      // //console.log('$watch networkInterfaces ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        // let iface_index = 0
        Object.each(val, function(iface, name){

          Object.each(iface, function(data, messure){
            // if(name == 'lo' && messure == 'bytes'){
            if(messure == 'bytes' || messure == 'packets' || messure == 'errs'){
              //console.log('adding networkInterface chart '+this.host+'_os_networkInterfaces_stats_'+name+'_'+messure)
              let chart_name = this.host+'_os_networkInterfaces_stats_'+name+'_'+messure

              // this.__networkInterfaces_get_stat({
              //   name: this.host+'_os_networkInterfaces_stats_'+name+'_'+messure,
              //   stat: {
              //     host: this.host,
              //     path: 'os',
              //     key: 'networkInterfaces',
              //     length: this.seconds || 300,
              //     // range: [Date.now() - this.seconds * 1000, Date.now()]
              //   }
              // })

               this.$options.charts[chart_name] = Object.clone({
                name: this.host+'_os_networkInterfaces_stats_'+name+'_'+messure,
                chart: Object.clone(networkInterfaces_chart),
                init: this.__networkInterfaces_get_stat.bind(this),
                stop: function(payload){
                  // console.log('stoping _os_cpus_times', payload.stat)
                  this.$store.dispatch('stats/flush', payload.stat)
                  // this.$store.dispatch('stats/splice', payload.stat)
                }.bind(this),
                // watch: {
                //   name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
                //   deep:true,
                //   // cb: this.__watcher_callback.bind(this)
                //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
                // },
                stat: {
                  host: this.host,
                  path: 'os',
                  key: 'networkInterfaces',
                  length: this.seconds || 300,
                  // range: [Date.now() - this.seconds * 1000, Date.now()]
                }
              })

              // this.add_chart(this.$options.charts[chart_name], chart_name)
              // iface_index++

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

    /**
    * manually
    */


    /**
    * moved to "charts" event
    **/
    // this.$options.charts[this.host+'_os_cpus_times'] = {
    //   name: this.host+'_os_cpus_times',
    //   chart: Object.clone(cpus_times_chart),
    //   init: this.__cpus_time_get_stat.bind(this),
    //   // watch: {
    //   //   name: '$store.state.stats.'+this.host+'.os.cpus',
    //   //   deep: true,
    //   //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   // },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds || 300,
    //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //
    //   }
    // }

    /**
    * moved to "charts" event
    **/
    // this.$options.charts[this.host+'_os_cpus_percentage'] = {
    //   name: this.host+'_os_cpus_percentage',
    //   chart: Object.clone(cpus_percentage_chart),
    //   init: this.__cpus_percentage_get_stat.bind(this),
    //   // watch: {
    //   //   name: '$store.state.stats.'+this.host+'.os.cpus',
    //   //   // cb: this.__watcher_callback.bind(this)
    //   //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   // },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds || 300,
    //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // }


    /**
    * moved to "charts" event
    **/
    // this.$options.charts[this.host+'_os_loadavg'] = {
    //   name: this.host+'_os_loadavg',
    //   chart: Object.clone(loadavg_chart),
    //   init: this.__loadavg_get_stat.bind(this),
    //   // watch: {
    //   //   name: '$store.state.stats.'+this.host+'.os.loadavg',
    //   //   // cb: this.__watcher_callback.bind(this)
    //   //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   // },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'loadavg',
    //     length: this.seconds || 300,
    //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // }

    /**
    * moved to "charts" event
    **/
    // this.$options.charts[this.host+'_os_uptime'] = {
    //   name: this.host+'_os_uptime',
    //   chart: Object.clone(uptime_chart),
    //   init: this.__uptime_get_stat.bind(this),
    //   // watch: {
    //   //   name: '$store.state.stats.'+this.host+'.os.uptime',
    //   //   // cb: (doc, old, payload) => this.__update_chart_stat(payload.name, doc.value)
    //   //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   // },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'uptime',
    //     length: this.seconds || 300,
    //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // }

    /**
    * moved to "charts" event
    **/
    // let unwatch_mounts = this.$watch('mounts', function(val, old){
    //
    //   // //console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
    //
    //   if(val !== undefined && Object.getLength(val) > 0){
    //
    //     Object.each(val, function(mount, key){
    //       //console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
    //       let chart_name = this.host+'_os_mounts_percentage_'+key
    //
    //        this.$options.charts[chart_name] = Object.clone({
    //         name: this.host+'_os_mounts_percentage_'+key,
    //         chart: Object.clone(mounts_percentage_chart),
    //         init: this.__mounts_get_stat.bind(this),
    //         // watch: {
    //         //   name: '$store.state.stats.'+this.host+'.os_mounts.'+key,
    //         //   deep:true,
    //         //   // cb: this.__watcher_callback.bind(this)
    //         //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //         // },
    //         stat: {
    //           host: this.host,
    //           path: 'os_mounts',
    //           key: key,
    //           length: this.seconds || 300,
    //           // range: [Date.now() - this.seconds * 1000, Date.now()]
    //         }
    //       })
    //
    //
    //     }.bind(this))
    //
    //     unwatch_mounts()
    //   }
    // }.bind(this),{
    //   deep:true
    // })


    /**
    * moved to "charts" event
    **/
    // let unwatch_blockdevices = this.$watch('blockdevices', function(val, old){
    //
    //   // //console.log('$watch blockdevices ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
    //
    //   if(val !== undefined && Object.getLength(val) > 0){
    //
    //     Object.each(val, function(mount, key){
    //       //console.log('adding blockdevice chart '+this.host+'_os_blockdevices_stats_'+key)
    //       let chart_name = this.host+'_os_blockdevices_stats_'+key
    //
    //        this.$options.charts[chart_name] = Object.clone({
    //         name: this.host+'_os_blockdevices_stats_'+key,
    //         chart: Object.clone(blockdevices_stats_chart),
    //         init: this.__blockdevices_get_stat.bind(this),
    //         // watch: {
    //         //   name: '$store.state.stats.'+this.host+'.os_blockdevices.'+key,
    //         //   deep:true,
    //         //   // cb: this.__watcher_callback.bind(this)
    //         //   cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //         // },
    //         stat: {
    //           host: this.host,
    //           path: 'os_blockdevices',
    //           key: key,
    //           length: this.seconds || 300,
    //           // range: [Date.now() - this.seconds * 1000, Date.now()]
    //         }
    //       })
    //
    //
    //     }.bind(this))
    //
    //     unwatch_blockdevices()
    //   }
    // }.bind(this),{
    //   deep:true
    // })

    /**
    * moved to "charts" event
    **/
    // let unwatch_mounts = this.$watch('mounts', function(val, old){
    //
    //   // //console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
    //
    //   if(val !== undefined && Object.getLength(val) > 0){
    //
    //     Object.each(val, function(mount, key){
    //       //console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
    //       this.add_chart (Object.clone({
    //         name: this.host+'_os_mounts_percentage_'+key,
    //         chart: Object.clone(mounts_percentage_chart),
    //         init: this.__mounts_get_stat.bind(this),
    //         watch: {
    //           name: '$store.state.stats.'+this.host+'.os_mounts.'+key,
    //           deep:true,
    //           // cb: this.__watcher_callback.bind(this)
    //           cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //         },
    //         stat: {
    //           host: this.host,
    //           path: 'os_mounts',
    //           key: key,
    //           length: this.seconds || 300,
    //           range: [Date.now() - this.seconds * 1000, Date.now()]
    //         }
    //       }))
    //
    //
    //     }.bind(this))
    //
    //     unwatch_mounts()
    //   }
    // }.bind(this),{
    //   deep:true
    // })

    /**
    * moved to "charts" event
    **/
    // let unwatch_blockdevices = this.$watch('blockdevices', function(val, old){
    //
    //   // //console.log('$watch blockdevices ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
    //
    //   if(val !== undefined && Object.getLength(val) > 0){
    //
    //     Object.each(val, function(mount, key){
    //       //console.log('adding blockdevice chart '+this.host+'_os_blockdevices_stats_'+key)
    //       this.add_chart (Object.clone({
    //         name: this.host+'_os_blockdevices_stats_'+key,
    //         chart: Object.clone(blockdevices_stats_chart),
    //         init: this.__blockdevices_get_stat.bind(this),
    //         watch: {
    //           name: '$store.state.stats.'+this.host+'.os_blockdevices.'+key,
    //           deep:true,
    //           // cb: this.__watcher_callback.bind(this)
    //           cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //         },
    //         stat: {
    //           host: this.host,
    //           path: 'os_blockdevices',
    //           key: key,
    //           length: this.seconds || 300,
    //           range: [Date.now() - this.seconds * 1000, Date.now()]
    //         }
    //       }))
    //
    //
    //     }.bind(this))
    //
    //     unwatch_blockdevices()
    //   }
    // }.bind(this),{
    //   deep:true
    // })

    // let unwatch_networkInterfaces = this.$watch('networkInterfaces', function(val, old){
    //
    //   // //console.log('$watch networkInterfaces ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )
    //
    //   if(val !== undefined && Object.getLength(val) > 0){
    //
    //     // let iface_index = 0
    //     Object.each(val, function(iface, name){
    //
    //       Object.each(iface, function(data, messure){
    //         // if(name == 'lo' && messure == 'bytes'){
    //         if(messure == 'bytes' || messure == 'packets' || messure == 'errs'){
    //           //console.log('adding networkInterface chart '+this.host+'_os_networkInterfaces_stats_'+name+'_'+messure)
    //
    //           this.add_chart (Object.clone({
    //             name: this.host+'_os_networkInterfaces_stats_'+name+'_'+messure,
    //             chart: Object.clone(networkInterfaces_chart),
    //             init: this.__networkInterfaces_get_stat.bind(this),
    //             watch: {
    //               name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
    //               deep:true,
    //               // cb: this.__watcher_callback.bind(this)
    //               cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //             },
    //             stat: {
    //               host: this.host,
    //               path: 'os',
    //               key: 'networkInterfaces',
    //               length: this.seconds || 300,
    //               range: [Date.now() - this.seconds * 1000, Date.now()]
    //             }
    //           }))
    //
    //           // iface_index++
    //         }
    //       }.bind(this))
    //     }.bind(this))
    //
    //     unwatch_networkInterfaces()
    //   }
    // }.bind(this),{
    //   deep:true
    // })

    // this.add_chart ({
    //   name: this.host+'_os_cpus_times',
    //   chart: Object.clone(cpus_times_chart),
    //   init: this.__cpus_time_get_stat.bind(this),
    //   watch: {
    //     name: '$store.state.stats.'+this.host+'.os.cpus',
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds || 300,
    //     // range: [Date.now() - this.seconds * 1000, Date.now()]
    //
    //   }
    // })


    // this.add_chart(this.$options.charts.os_cpus_times)
    /**
    * no init, as __cpus_time_get_stat already manage all os.cpus docs
    **/
    // this.add_chart ({
    //   name: this.host+'_os_cpus_percentage',
    //   chart: Object.clone(cpus_percentage_chart),
    //   watch: {
    //     name: '$store.state.stats.'+this.host+'.os.cpus',
    //     // cb: this.__watcher_callback.bind(this)
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds || 300,
    //     range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // })


    // this.add_chart ({
    //   name: this.host+'_os_freemem',
    //   chart: Object.clone(freemem_chart),
    //   init: this.__freemem_get_stat.bind(this),
    //   watch: {
    //     name: '$store.state.stats.'+this.host+'.os.freemem',
    //     // cb: this.__watcher_callback.bind(this)
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'freemem',
    //     length: this.seconds || 300,
    //     range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // })


    // this.add_chart ({
    //   name: this.host+'_os_loadavg',
    //   chart: Object.clone(uptimechart),
    //   init: this.__uptime_get_stat.bind(this),
    //   watch: {
    //     name: '$store.state.stats.'+this.host+'.os.loadavg',
    //     // cb: this.__watcher_callback.bind(this)
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'loadavg',
    //     length: this.seconds || 300,
    //     range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // })


    // this.add_chart ({
    //   name: this.host+'_os_uptime',
    //   chart: Object.clone(uptime_chart),
    //   init: this.__uptime_get_stat.bind(this),
    //   watch: {
    //     name: '$store.state.stats.'+this.host+'.os.uptime',
    //     // cb: this.__watcher_callback.bind(this)
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_chart_stat(payload.name, doc.value) }
    //   },
    //   stat: {
    //     host: this.host,
    //     path: 'os',
    //     key: 'uptime',
    //     length: this.seconds || 300,
    //     range: [Date.now() - this.seconds * 1000, Date.now()]
    //   }
    // })



  },
  // beforeUpdate: function(){
  //   ////////console.log('beforeUpdate')
  // },
  // updated: function(){
  //
  // },
  beforeCreate: function(){
    console.log('life cycle beforeCreate')
    EventBus.$off('host')
    EventBus.$off('os')
  },
  beforeDestroy: function(){
    console.log('life cycle beforeDestroy')
    ////console.log('beforeDestroy')
    // this.$options.tabular_range_started = false
    // this.$options.range_started = false

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

    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      // let {path, list} = this.name_to_module(entry.target.id.replace('-card',''))

      let id = entry.target.id.replace('-collapsible', '')
      // let name = id.replace(this.host+'_', '')

      // console.log('visibilityChanged', isVisible, id, name, this.$options.charts[id])

      if(
        isVisible == false
        && this.$options.charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == true)
      ){
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
        // this.$store.dispatch('stats/splice', this.$options.charts[id].stat)
        // this.$store.dispatch('stats_tabular/splice', this.$options.charts[id].stat)
      }
      else if (
        isVisible == true
        && this.$options.charts[id]
        && (this.visibility[id] == undefined || this.visibility[id] == false)
      ){

        this.$set(this.visibility, id, true)
        this.add_chart(this.$options.charts[id], id)
      }
    },

    __cpus_time_get_stat: function(payload){
      let {stat, name} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      console.log('__cpus_time_get_stat', payload)

      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep: true,
        cb: (doc, old, payload) => {
          // console.log('__cpus_time_get_stat watcher ', new Date())
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)

        }
      }

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){
          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            console.log('got cpus stat missing')
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          console.log('got cpus not close enought')
          docs = []
        }


          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              console.log('got cpus stat4', docs, docs_range)
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )


              // this.$set(this.stats[name], 'data', [])

              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)

              this.add_watcher(payload)



              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __cpus_percentage_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep: true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){
          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }


          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __freemem_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      payload.watch = {
        name: '$store.state.stats.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep: true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }




          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __uptime_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep: true,
        // cb: (doc, old, payload) => this.__update_chart_stat(payload.name, doc.value)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }




          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __loadavg_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep: true,
        // cb: (doc, old, payload) => this.__update_chart_stat(payload.name, doc.value)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }




          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __blockdevices_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep:true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os.blockdevices']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }




          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __mounts_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      payload.watch = {
        name: '$store.state.stats_tabular.'+stat.host+'.'+stat.path+'.'+stat.key,
        deep:true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os.mounts']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }


          EventBus.$once('tabularRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },



    __networkInterfaces_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      payload.watch = {
        name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
        deep:true,
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => {
          // if(this.visibility[payload.name] === true)
          this.__update_chart_stat(payload.name, doc.value)
        }
      },

      stat.range = range

      this.add_chart_stat(name)

      this.__get_stat(stat, function(docs){
        // console.log('got cpus stat', docs)
        //
        // if(docs.length > 0)
        //   console.log('got cpus stat 2',
        //     new Date(docs[0].metadata.timestamp),
        //     new Date(docs[docs.length - 1].metadata.timestamp),
        //     new Date(range[0]),
        //     new Date(range[1])
        //   )

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(
          docs.length != 0
          // && range_length
          // && (docs.length  < range_length + 10 && docs.length > range_length - 10)
          && docs[docs.length - 1].metadata
          && docs[0].metadata.timestamp > range[0] - 10000
          && docs[0].metadata.timestamp < range[0] + 10000
        ){
        // if(docs.length != 0 && docs[docs.length - 1].metadata){

          // console.log('got cpus stat 3', docs, new Date(range[0]), new Date(range[1]))

          // if(docs[0].metadata.timestamp > range[0] - 10000 && docs[0].metadata.timestamp < range[0] + 10000){
          let prev = undefined
          let missing = false

          docs.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

          Array.each(docs, function(doc){
            if(prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp){
              // console.log('got cpus stat missing', new Date(prev.metadata.timestamp), new Date(doc.metadata.timestamp))
              missing = true
            }
            prev = doc
          })

          if(missing == false){
            range[0] = docs[docs.length - 1].metadata.timestamp
            // console.log('got cpus stat change range', docs, new Date(range[0]), new Date(range[1]))
          }
          else{
            docs = []
          }
          // }

          // this.__update_chart_stat(this.host+'_os_cpus_times', docs)
          // // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
          // this.add_watcher(payload)
          // pipeline.fireEvent('onResume')
        }
        else{
          docs = []
        }


          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs_range){
              // console.log('got cpus stat4', docs,
              //   docs_range,
              //   new Date(range[0]),
              //   new Date(range[1]),
              //   new Date(docs_range[0].metadata.timestamp),
              //   new Date(docs_range[docs_range.length - 1].metadata.timestamp)
              // )

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              let length = all_stats.length
              all_stats.splice(
                range_length -1,
                length - range_length
              )

              // this.$set(this.stats[name], 'data', [])
              this.__update_chart_stat(name, all_stats)
              // this.__update_chart_stat(this.host+'_os_cpus_percentage', docs)
              this.add_watcher(payload)
              // pipeline.fireEvent('onResume')
              // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )
        // }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    // __watcher_callback: function(doc, old, payload){
    //   let {name, watch} = payload
    //
    //   this.__update_chart_stat(name, doc.value)
    //
    // },
    // __pre_update_stat: function(name, docs){
    //   this.$options.stats[name] = docs
    //
    // }
    destroy_host_pipelines: function(){
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
    process_os_tabular: function(doc){
      console.log('process_os_tabular', doc)
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

                console.log('process_os_tabular', path, key, result)

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

            // //console.log('ROW', keys, path)

            if(!paths[path])
              paths[path] = {}


            Object.each(keys, function(data, key){
              // //console.log('ROW', key, data)
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
      // console.log('__add_os_doc_stats', paths)
      Object.each(paths, function(keys, path){
        // //console.log('stat process_os_doc', path)

        Object.each(keys, function(data, key){
          console.log('stat process_os_doc', path, key, data)
          this.$store.dispatch('stats/add', {
            host: this.host,
            path: path,
            key: key,
            data: data
          })

        }.bind(this))

      }.bind(this))
    },
    create_host_pipelines (paths) {
      // paths = ['os.procs']
      ////////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$store.state.hosts.current || this.$route.params.host

      let range = Object.clone(this.$store.state.app.range)


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

              ////////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                //////////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  ////////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  ////////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

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

              if(range[1] == null){
                range[1] = new Date().getTime()
              }

              // pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

              if(this.$store.state.app.suspend != true){
                ////////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

                /** manually resume **/
                // pipe.fireEvent('onResume')
              }
            // }
          // }.bind(this))
        }.bind(this))

        // }.bind(this))
      }
    },

  },
}

// JSON.unflatten = function(data) {
//     "use strict";
//     if (Object(data) !== data || Array.isArray(data))
//         return data;
//     var result = {}, cur, prop, idx, last, temp;
//     for(var p in data) {
//         cur = result, prop = "", last = 0;
//         do {
//             idx = p.indexOf(".", last);
//             temp = p.substring(last, idx !== -1 ? idx : undefined);
//             cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
//             prop = temp;
//             last = idx + 1;
//         } while(idx >= 0);
//         cur[prop] = data[p];
//     }
//     return result[""];
// }
// JSON.flatten = function(data) {
//     var result = {};
//     function recurse (cur, prop) {
//         if (Object(cur) !== cur) {
//             result[prop] = cur;
//         } else if (Array.isArray(cur)) {
//              for(var i=0, l=cur.length; i<l; i++)
//                  recurse(cur[i], prop ? prop+"."+i : ""+i);
//             if (l == 0)
//                 result[prop] = [];
//         } else {
//             var isEmpty = true;
//             for (var p in cur) {
//                 isEmpty = false;
//                 recurse(cur[p], prop ? prop+"."+p : p);
//             }
//             if (isEmpty)
//                 result[prop] = {};
//         }
//     }
//     recurse(data, "");
//     return result;
// }

</script>
