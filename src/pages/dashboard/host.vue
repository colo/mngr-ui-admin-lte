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
          v-observe-visibility="visibilityChanged"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="visibility[host+'_os_cpus_times']"
            :type="'dygraph'"
            :ref="host+'_os_cpus_times'"
            :id="host+'_os_cpus_times'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_times']"
            :stat="stats[host+'_os_cpus_times']"
          >
          </chart>
          <chart-empty-container v-else></chart-empty-container>


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="CPU Percentage"
          :id="host+'_os_cpus_percentage-collapsible'"
          v-observe-visibility="visibilityChanged"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="visibility[host+'_os_cpus_percentage']"
            :type="'dygraph'"
            :ref="host+'_os_cpus_percentage'"
            :id="host+'_os_cpus_percentage'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_percentage']"
            :stat="stats[host+'_os_cpus_percentage']"
          >
          </chart>
          <chart-empty-container v-else></chart-empty-container>


        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Freemem"
          :id="host+'_os_freemem-collapsible'"
          v-observe-visibility="visibilityChanged"
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
          v-observe-visibility="visibilityChanged"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="visibility[host+'_os_uptime']"
            :type="'dygraph'"
            :ref="host+'_os_uptime'"
            :id="host+'_os_uptime'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_uptime']"
            :stat="stats[host+'_os_uptime']"
          >
          </chart>
          <chart-empty-container v-else></chart-empty-container>

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Load Average"
          :id="host+'_os_loadavg-collapsible'"
          v-observe-visibility="visibilityChanged"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            v-if="visibility[host+'_os_loadavg']"
            :type="'dygraph'"
            :ref="host+'_os_loadavg'"
            :id="host+'_os_loadavg'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_loadavg']"
            :stat="stats[host+'_os_loadavg']"
          >
          </chart>
          <chart-empty-container v-else></chart-empty-container>

        </admin-lte-box-solid>


        <template v-for="(blockdevice, index) in blockdevices">
          <admin-lte-box-solid
            :key="'blockdevice_stats_'+index"
            :title="'Blockdevice stats['+index+']'"
            :id="host+'_os_blockdevices_stats_'+index+'-collapsible'"
            v-observe-visibility="visibilityChanged"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart
              v-if="visibility[host+'_os_blockdevices_stats_'+index]"
              :type="'dygraph'"
              :ref="host+'_os_blockdevices_stats_'+index"
              :id="host+'_os_blockdevices_stats_'+index"
              :EventBus="EventBus"
              :chart="charts[host+'_os_blockdevices_stats_'+index]"
              :stat="stats[host+'_os_blockdevices_stats_'+index]"
            >
            </chart>
            <chart-empty-container v-else></chart-empty-container>


          </admin-lte-box-solid>
        </template>

        <template v-for="(mount, index) in mounts">
          <admin-lte-box-solid
            :key="'mounts_percentage_'+index"
            :title="'Mounts Percetange usage '+index"
            :id="host+'_os_mounts_percentage_'+index+'-collapsible'"
            v-observe-visibility="visibilityChanged"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart
              v-if="visibility[host+'_os_mounts_percentage_'+index]"
              :type="'dygraph'"
              :ref="host+'_os_mounts_percentage_'+index"
              :id="host+'_os_mounts_percentage_'+index"
              :EventBus="EventBus"
              :chart="charts[host+'_os_mounts_percentage_'+index]"
              :stat="stats[host+'_os_mounts_percentage_'+index]"
            >
            </chart>
            <chart-empty-container v-else></chart-empty-container>


          </admin-lte-box-solid>
        </template>

        <template v-for="(iface, name) in networkInterfaces">
          <template v-for="(data, messure) in iface">
            <admin-lte-box-solid v-if="messure == 'bytes' || messure == 'packets' || messure == 'errs'"
              :key="'networkInterfaces_stats'+name+'_'+messure"
              :title="'Network Interface '+name+' : '+messure"
              :id="host+'_os_networkInterfaces_stats_'+name+'_'+messure+'-collapsible'"
              v-observe-visibility="visibilityChanged"
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

import Pipeline from 'node-mngr-worker/lib/pipeline'


import HostTemplatePipeline from '@libs/pipelines/host.template'
import HostHistoricalTemplatePipeline from '@libs/pipelines/host.historical.template'
import HostMuninTemplatePipeline from '@libs/pipelines/host.munin.template'


let host_pipelines_templates = [
  HostTemplatePipeline,
  // HostMuninTemplatePipeline,
  // HostHistoricalTemplatePipeline
]

import AdminLteBoxSolid from 'components/admin-lte/boxSolid'
import AdminLteDashboardHostSummary from 'components/admin-lte/dashboard/host/summary'

import dashboard from 'components/mixins/dashboard'

// import dygraphWrapper from 'components/charts/wrappers/dygraph'

// import DefaultDygraphLine from 'components/charts/js/default.dygraph.line'
import uptime_chart from 'components/charts/uptime'
import loadavg_chart from 'components/charts/loadavg'
import cpus_times_chart from 'components/charts/cpus_times'
import cpus_percentage_chart from 'components/charts/cpus_percentage'
import freemem_chart from 'components/charts/freemem'
import mounts_percentage_chart from 'components/charts/mounts_percentage'
import blockdevices_stats_chart from 'components/charts/blockdevices_stats'
import networkInterfaces_chart from 'components/charts/networkInterfaces'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

  charts: {},
  pipelines: {},

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
    //console.log('life cycle created')


    EventBus.$on('os', payload => {
      //console.log('recived doc via Event os', payload.type)
        this.process_os_doc(payload.doc)

        if(payload.type == 'range'){
          EventBus.$emit(payload.doc[0].doc.metadata.path+'Range')
          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')
          // //console.log('RANGE', payload.doc[0].doc.metadata.path+'Range')
        }
    })


  },



  mounted: function(){
    //console.log('life cycle mounted')

    this.create_host_pipelines(this.$store.state.app.paths)

    this.$options.charts[this.host+'_os_cpus_times'] = {
      name: this.host+'_os_cpus_times',
      chart: Object.clone(cpus_times_chart),
      init: this.__cpus_time_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.cpus',
        deep: true,
        cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'cpus',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]

      }
    }

    this.$options.charts[this.host+'_os_cpus_percentage'] = {
      name: this.host+'_os_cpus_percentage',
      chart: Object.clone(cpus_percentage_chart),
      init: this.__cpus_percentage_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.cpus',
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'cpus',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    }

    this.$options.charts[this.host+'_os_freemem'] = {
      name: this.host+'_os_freemem',
      chart: Object.clone(freemem_chart),
      init: this.__freemem_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.freemem',
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'freemem',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    }

    this.$options.charts[this.host+'_os_loadavg'] = {
      name: this.host+'_os_loadavg',
      chart: Object.clone(loadavg_chart),
      init: this.__loadavg_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.loadavg',
        // cb: this.__watcher_callback.bind(this)
        cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'loadavg',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    }


    this.$options.charts[this.host+'_os_uptime'] = {
      name: this.host+'_os_uptime',
      chart: Object.clone(uptime_chart),
      init: this.__uptime_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.uptime',
        // cb: (doc, old, payload) => this.__update_stat(payload.name, doc.value)
        cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'uptime',
        length: this.seconds || 300,
        // range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    }

    let unwatch_mounts = this.$watch('mounts', function(val, old){

      // //console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        Object.each(val, function(mount, key){
          //console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
          let chart_name = this.host+'_os_mounts_percentage_'+key

           this.$options.charts[chart_name] = Object.clone({
            name: this.host+'_os_mounts_percentage_'+key,
            chart: Object.clone(mounts_percentage_chart),
            init: this.__mounts_get_stat.bind(this),
            watch: {
              name: '$store.state.stats.'+this.host+'.os_mounts.'+key,
              deep:true,
              // cb: this.__watcher_callback.bind(this)
              cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
            },
            stat: {
              host: this.host,
              path: 'os_mounts',
              key: key,
              length: this.seconds || 300,
              // range: [Date.now() - this.seconds * 1000, Date.now()]
            }
          })


        }.bind(this))

        unwatch_mounts()
      }
    }.bind(this),{
      deep:true
    })

    let unwatch_blockdevices = this.$watch('blockdevices', function(val, old){

      // //console.log('$watch blockdevices ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        Object.each(val, function(mount, key){
          //console.log('adding blockdevice chart '+this.host+'_os_blockdevices_stats_'+key)
          let chart_name = this.host+'_os_blockdevices_stats_'+key

           this.$options.charts[chart_name] = Object.clone({
            name: this.host+'_os_blockdevices_stats_'+key,
            chart: Object.clone(blockdevices_stats_chart),
            init: this.__blockdevices_get_stat.bind(this),
            watch: {
              name: '$store.state.stats.'+this.host+'.os_blockdevices.'+key,
              deep:true,
              // cb: this.__watcher_callback.bind(this)
              cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
            },
            stat: {
              host: this.host,
              path: 'os_blockdevices',
              key: key,
              length: this.seconds || 300,
              // range: [Date.now() - this.seconds * 1000, Date.now()]
            }
          })


        }.bind(this))

        unwatch_blockdevices()
      }
    }.bind(this),{
      deep:true
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

               this.$options.charts[chart_name] = Object.clone({
                name: this.host+'_os_networkInterfaces_stats_'+name+'_'+messure,
                chart: Object.clone(networkInterfaces_chart),
                init: this.__networkInterfaces_get_stat.bind(this),
                watch: {
                  name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
                  deep:true,
                  // cb: this.__watcher_callback.bind(this)
                  cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
                },
                stat: {
                  host: this.host,
                  path: 'os',
                  key: 'networkInterfaces',
                  length: this.seconds || 300,
                  // range: [Date.now() - this.seconds * 1000, Date.now()]
                }
              })

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
    * manually
    */

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
    //           cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //           cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //               cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
    //     cb: (doc, old, payload) => { if(this.visibility[payload.name] === true) this.__update_stat(payload.name, doc.value) }
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
  updated: function(){
    //console.log('life cycle updated')

    // let parallelize = {}
    // Object.each(this.$options.charts, function(chart, name){
    //   if(!this.charts[name])
    //     parallelize[name] = this.add_chart(chart, name)
    // }.bind(this))
    //
    // if(Object.getLength(parallelize) > 0)
    //   parallel(parallelize, function(err, results) {
    //     // results is now equals to: {one: 1, two: 2}
    //   })
  },
  beforeDestroy: function(){
    //console.log('life cycle beforeDestroy')
    ////console.log('beforeDestroy')

    // this.$store.dispatch('stats/splice', {
    //   host: this.host,
    //   path: 'os',
    //   key: 'cpus'
    // })

    this.destroy_host_pipelines()


    this.remove_charts()

    this.$store.dispatch('stats/splice', {host: this.host, length: 400})

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
      let name = id.replace(this.host+'_', '')

      console.log('visibilityChanged', isVisible, id, name, this.$options.charts[id])

      if(isVisible == false){
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
      }
      else{
        // if(!this.charts[id])
        this.add_chart(this.$options.charts[id])
        // if(this.charts[id] && typeof this.charts[id].init == 'function')
        //   this.charts[id].init(this.$options.charts[id])

        this.$set(this.visibility, id, true)
      }
    },
    __cpus_time_get_stat: function(payload){
      let {stat, name} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      console.log('__cpus_time_get_stat', payload)

      this.__get_stat(stat, function(docs){

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          // console.log('__cpus_time_get_stat RANGE', docs)
          console.log('got cpus stat', docs, new Date(range[0]), new Date(range[1]))

          this.__update_stat(this.host+'_os_cpus_times', docs)
          // this.__update_stat(this.host+'_os_cpus_percentage', docs)
          pipeline.fireEvent('onResume')
        }
        else{

          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
              console.log('got cpus stat2', docs)
                // this.$set(this.stats[name], 'data', [])
                this.__update_stat(this.host+'_os_cpus_times', docs)
                // this.__update_stat(this.host+'_os_cpus_percentage', docs)
                pipeline.fireEvent('onResume')
                // this.$options.pipelines['input.os'].fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __cpus_percentage_get_stat: function(payload){
      let {stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      // //console.log('RANGE LENGT', range_length)

      this.__get_stat(stat, function(docs){
        //console.log('got cpus stat', docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(this.host+'_os_cpus_percentage', docs)
          // pipeline.fireEvent('onResume')
        }
        else{

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
                this.__update_stat(this.host+'_os_cpus_percentage', docs)
                // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __freemem_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      /**
      * don't fireEvent as it's been fired already by CPUS_*
      **/

      this.__get_stat(stat, function(docs){
        //console.log('got freemem stat', docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']

        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{

          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got freemem stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __loadavg_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      /**
      * don't fireEvent as it's been fired already by CPUS_*
      **/

      this.__get_stat(stat, function(docs){
        //console.log('got loadavg stat', docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']

        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{

          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got loadavg stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __uptime_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined


      /**
      * don't fireEvent as it's been fired already by CPUS_*
      **/

      this.__get_stat(stat, function(docs){
        //console.log('got loadavg stat', docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']

        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{

          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got loadavg stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },



    __blockdevices_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      /**
      * don't fireEvent as it's been fired already by CPUS_*
      **/

      this.__get_stat(stat, function(docs){
        //console.log('got blockdevice sda stat', docs, range_length)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os.blockdevices']

        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{

          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('os.blockdevicesRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got blockdevice stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){

        // }.bind(this), 500)

      }.bind(this))
    },

    __mounts_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      this.__get_stat(stat, function(docs){
        //console.log('got mounts stat', docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os.mounts']


        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{
          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('os.mountsRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got mounts stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){
          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')

        // }.bind(this), 500)

      }.bind(this))
    },



    __networkInterfaces_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]

      let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined

      this.__get_stat(stat, function(docs){
        //console.log('got networkInterfaces stat', payload, docs)

        let pipeline = this.$options.pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']


        if(range_length && (docs.length  < range_length + 10 && docs.length > range_length - 10)){
          this.__update_stat(name, docs)
          // pipeline.fireEvent('onResume')
        }
        else{
          // if(docs.length != 0)
          //   range[0] = docs[docs.length -1].metadata.timestamp

          // pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          EventBus.$once('osRange', () =>
            this.__get_stat(stat, function(docs){
              //console.log('got networkInterfaces stat2', docs)

              this.__update_stat(name, docs)
              // pipeline.fireEvent('onResume')
            }.bind(this))
          )
        }

        // setTimeout(function(){
          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')

        // }.bind(this), 500)

      }.bind(this))
    },

    // __watcher_callback: function(doc, old, payload){
    //   let {name, watch} = payload
    //
    //   this.__update_stat(name, doc.value)
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

    process_os_doc: function(doc){

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


      Object.each(paths, function(keys, path){
        // //console.log('stat process_os_doc', path)

        Object.each(keys, function(data, key){
          // //console.log('stat process_os_doc', path, key, data)
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
                  // pipe.fireEvent('onResume')

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
