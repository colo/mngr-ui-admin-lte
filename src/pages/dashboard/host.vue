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
          title="CPU"
          :id="host+'.os.cpus-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >
          <dygraph-wrapper
            :ref="host+'_os_cpus_times'"
            :id="host+'_os_cpus_times'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_times']"
            :stat="stats_tabular[host+'_os_cpus_times']"
          >
          <!-- :chart="chart"
          :stat="stats[name]" -->
          </dygraph-wrapper>
          <div class="netdata-chart-legend">
          </div>
        </admin-lte-box-solid>
      </section>
    </div>
    <!-- <input-vue-watcher></input-vue-watcher> -->
  </section>
</template>

<style>
</style>

<script>

/**
* charting
**/
let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

let extract_data_os = require( 'node-mngr-docs' ).extract_data_os
let extract_data_os_historical = require( 'node-mngr-docs' ).extract_data_os_historical

import Vue from 'vue'
import { mapState } from 'vuex'

import sizeof from 'object-sizeof'

/**
* to registerModule 'hosts/'+host+'/stats'
**/
// let hostStats = {
//   namespaced: true,
//   state: {},
//   getters: {},
//   actions: {},
//   mutations: {
//     data: function(state, payload) {//generic mutation
//       if(Array.isArray(payload.value)){
//         // state.networkInterfaces = payload
//         Vue.set(state, payload.key, payload.value)
//         // let len = state[payload.key].length;
//         // while (len--) {
//         //   state[payload.key].pop()
//         // }
//         // len = payload.value.length;
//         // let index = 0
//         // while (index<len) {
//         //   state[payload.key].push(payload.value[index])
//         // }
//
//
//       }
//       else {
//
//         // if(payload.key == 'loadavg'){
//         //   //////////console.log('data', state, payload)
//         // }
//
//         state[payload.key].push(payload.value)
//       }
//     },
//     splice: (state, payload) => {
//
//       let length = state[payload.key].length
//       state[payload.key].splice(
//         -payload.length -1,
//         length - payload.length
//       )
//     }
//   }
// }

// import AdminLteBoxSolid from 'components/admin-lte/dashboard/boxSolid'
import Pipeline from 'node-mngr-worker/lib/pipeline'


import HostTemplatePipeline from '@libs/pipelines/host.template'
import HostHistoricalTemplatePipeline from '@libs/pipelines/host.historical.template'
import HostMuninTemplatePipeline from '@libs/pipelines/host.munin.template'

// import DygraphVuePipeline from '@libs/pipelines/dygraph.vue'
// let test = new Pipeline(DygraphVuePipeline)

let host_pipelines_templates = [
  HostTemplatePipeline,
  // HostMuninTemplatePipeline,
  // HostHistoricalTemplatePipeline
]

import AdminLteBoxSolid from 'components/admin-lte/boxSolid'
import AdminLteDashboardHostSummary from 'components/admin-lte/dashboard/host/summary'

import chart from 'components/mixins/chart'
import dashboard from 'components/mixins/dashboard'

import dygraphWrapper from 'components/charts/wrappers/dygraph'

import cpus_times_chart from 'components/charts/cpus_times'

export default {
  // mixins: [chart, dashboard],

  name: 'admin-lte-dashboard-host',

  components: {
    AdminLteBoxSolid,
    AdminLteDashboardHostSummary,
    dygraphWrapper
  },

  // visible_paths:['os', 'os.procs'],

  breadcrumb () {
    return {
      label: this.$route.params.host,
      parent: 'Dashboard'
    }
  },

  unwatchers: {},

  data () {
    return {
      // title: 'title',
      // parent: 'Dashboard'
      EventBus: EventBus,
      stats: {},
      stats_tabular: {},
      charts: {},
    }
  },
  // pouch: {
  //   host: {}
  // },

  watch: {
    // '$store.state.app.docs.os': function(oldVal, newVal){
    //   //console.log('recived doc via Event os', newVal)
    //   this.process_os_doc(newVal)
    // },

    //testing
    // '$store.state.stats.colo.os.cpus': function(oldVal, newVal){
    //   console.log('$store.state.stats.colo.os/cpus',newVal)
    //   console.log('geting stats...')
    //   this.$store.dispatch('stats/get', {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds,
    //   }).then((docs) => {
    //     console.log('got stat', docs)
    //     Array.each(docs, function(doc){
    //       console.log(new Date(doc.metadata.timestamp))
    //     })
    //   })
    // },
    '$store.state.app.paths': function(oldVal, newVal){ this.create_host_pipelines(newVal) }
  },


  created: function(){
    // this.$watch(function(){
    //   return "$store.state.stats.colo.os.cpus"
    // },function(oldVal, newVal){
    //   console.log('$store.state.stats.colo.os/cpus',newVal)
    // })

    EventBus.$on('os', doc => {
      //console.log('recived doc via Event os', doc, this.seconds)
      if(Array.isArray(doc)){
        Array.each(doc, function(val){
          this.process_os_doc(val.doc)
        }.bind(this))
      }
      else{
        this.process_os_doc(doc)
      }


      //
      // // let register_commit = function(host, path, keys){
      // //   let register = this.register_host_store_module(host, path, keys)
      // //   if(register == true){
      // //     Object.each(keys, function(data, key){
      // //
      // //       //console.log('register_host_store_module',path, key)
      // //
      // //       this.$store.commit('hosts/'+host+'/'+path+'/data', {key: key, value: data })
      // //       this.$store.commit('hosts/'+host+'/'+path+'/splice', { key: key, length: this.seconds })
      // //
      // //     }.bind(this))
      // //   }
      // //
      // //   return register
      // // }.bind(this)
      //
      // let {keys, path, host} = extract_data_os(doc)
      // // //console.log('pre register_host_store_module',path, keys)
      //
      // Object.each(keys, function(data, key){
      //   if(
      //     this.modules_blacklist
      //     && this.modules_blacklist[path]
      //     && this.modules_blacklist[path].test(key) == true
      //   ){
      //       // //console.log('deleting...', path, key)
      //       let whitelisted = false
      //       if( this.modules_whitelist && this.modules_whitelist[path] )
      //         Array.each(this.modules_whitelist[path], function(whitelist){
      //           if(whitelist.test(key) == true)
      //             whitelisted = true
      //         })
      //
      //       if(whitelisted == false)
      //         delete keys[key]
      //   }
      // }.bind(this))
      //
      // // if(register_commit(host, path, keys) != true){
      // //   let interval = setInterval(function(){
      // //     //////console.log('os_interval', interval, path)
      // //
      // //     if(register_commit(host, path, keys) == true){
      // //       clearInterval(interval)
      // //     }
      // //
      // //
      // //   }.bind(this), 1000)
      // // }
      //
      // /**
      // * don't register a module for each path
      // **/
      // Object.each(keys, function(data, key){
      //   this.$store.dispatch('stats/add', {
      //     host: host,
      //     path: path,
      //     key: key,
      //     value: data
      //   })
      //
      //   // //console.log(JSON.flatten(data))
      //   // this.$store.commit('hosts/'+host+'/data', { path: path, key: key, value: data })
      //   // this.$store.commit('hosts/'+host+'/splice', { path: path, key: key, length: this.seconds })
      //
      //   // this.$pouch.post('host', {host: host, path: path, key: key, value: data })
      //
      //   //console.log(sizeof(data))
      //   // //console.log(sizeof(JSON.encode(data)))
      //   //console.log('register_host_store_module',path, key, window.performance.memory)
      //
      // }.bind(this))
      //
		})



  },

  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,
      // reset: state => state.app.reset,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // ////////////console.log('seconds to splice', state.app.range)

        let end = new Date().getTime()
        if(state.app.range[1] != null)
          end = state.app.range[1]

        let seconds = Math.trunc( (end - state.app.range[0]) / 1000 )


        // return seconds
        return 300
      },
      // hosts: state => state.hosts.all,
      // currentHost: state => state.hosts.current,

    }),
    {
      host: function(){
        return this.$store.state.hosts.current || this.$route.params.host
      }
    }

  ),
  mounted: function(){

    //console.log('this.$route',this.$route.params.host)
    this.create_host_pipelines(this.$store.state.app.paths)

    let self = this

    let unwatch = this.$watch('$store.state.stats', function (oldVal, val) {
      console.log('$store.state.stats', val)
      // if(val.length > 1){
        if(val[this.host] && !this.charts[this.host+'_os_cpus_times']){
          let data = { timestamp: val[this.host].os.cpus.timestamp, value: val[this.host].os.cpus.value.data }
          // self.process_chart(cpus_times_chart, 'cpus', data)
          // self.process_chart(
          //   cpus_times_chart.pre_process(cpus_times_chart, 'cpus', [data]),
          //   'cpus',
          //   [data]
          // )
          console.log('gonna process_dyn', data)
          self.process_dynamic_chart(Object.clone(cpus_times_chart), 'cpus', [data])
          // this.stats[this.host+'_os_cpus_times'].data.shift()
          // unwatch()


          // console.log('gonna watch', val[this.host])

          this.$watch('$store.state.stats.'+this.host+'.os.cpus', function (oldVal, val) {
            console.log('$store.state.stats.'+this.host+'.os.cpus')

            this.$store.dispatch('stats/get', {
              host: this.host,
              path: 'os',
              key: 'cpus',
              length: this.seconds,
            }).then((docs) => {
              console.log('got stat', docs)
              Array.each(docs, function(doc){
                let data = { timestamp: doc.metadata.timestamp, value: doc.data }
                this.stats[this.host+'_os_cpus_times'].data.push(data)
                let length = this.stats[this.host+'_os_cpus_times'].data.length
                this.stats[this.host+'_os_cpus_times'].data.splice(
                  -300 -1,
                  length - 300
                )
                // console.log(new Date(doc.metadata.timestamp))
              }.bind(this))
            })
          })


        }


      //
      //   unwatch()
      // }
      //
    })

    this.$watch('charts', function (oldVal, val) {
      console.log('charts', val)
    })

    let unwatch2 = this.$watch('stats', function (oldVal, val) {
      this.$watch('stats._os_cpus_times.data', function (oldVal, val) {

        console.log('stats._os_cpus_times.data', val)
      })
      console.log('stats', val)
      unwatch2()
    })

    // setInterval(function(){
    //   console.log('geting stats...')
    //   this.$store.dispatch('stats/get', {
    //     host: this.host,
    //     path: 'os',
    //     key: 'cpus',
    //     length: this.seconds,
    //   }).then((docs) => {
    //     console.log('got stat', docs)
    //     Array.each(docs, function(doc){
    //       let data = { timestamp: doc.metadata.timestamp, value: doc.data }
    //       this.stats[this.host+'_os_cpus_times'].data.push(data)
    //       let length = this.stats[this.host+'_os_cpus_times'].data.length
    //       this.stats[this.host+'_os_cpus_times'].data.splice(
    //         -300 -1,
    //         length - 300
    //       )
    //       // console.log(new Date(doc.metadata.timestamp))
    //     }.bind(this))
    //   })
    // }.bind(this), 1000)



  },
  // beforeUpdate: function(){
  //   //console.log('beforeUpdate')
  // },
  // updated: function(){
  //   //console.log('updated')
  //   this.create_host_pipelines(this.$store.state.app.paths)
  // },
  beforeDestroy: function(){
    this.destroy_host_pipelines()
  },
  methods: {
    /**
    * charting
    **/
    name_to_module(name){
      let module = name.replace(this.host+'_', '')
      if(module.indexOf('_') > -1)
        module = module.substring(0, module.indexOf('_'))

      let second_indexOf = module.indexOf('.', module.indexOf('.') + 1)
      let path = module.substring(0, second_indexOf).replace('.', '/')


      let list = ''
      // if(second_indexOf == -1){
        list = module.substring(module.lastIndexOf('.') + 1, module.length)
      // }
      // else{
      //   list = module.substring(second_indexOf + 1, module.indexOf('.', second_indexOf+1) )
      // }

      console.log('name_to_module', name, path, list)

      return {path, list}
    },
    process_dynamic_chart (chart, name, stat){

      if(Array.isArray(stat[0].value)){//like 'cpus'

        Array.each(stat[0].value, function(val, index){

          let arr_chart = Object.clone(chart)

          arr_chart.label = this.process_chart_label(chart, name, stat) || name
          let chart_name = this.process_chart_name(chart, stat) || name

          if(chart.watch.merge != true){
            chart_name += '_'+index
          }

          if(chart.watch.merge != true || index == 0){//merge creates only once instance

            this.process_chart(
              arr_chart.pre_process(arr_chart, chart_name, stat),
              chart_name,
              stat
            )

          }

        }.bind(this))

      }
      else if(isNaN(stat[0].value)){
        //sdX.stats.

        let filtered = false
        if(chart.watch && chart.watch.filters){
          Array.each(chart.watch.filters, function(filter){
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if(
              stat[0].value[prop_to_filter]
              && value_to_filter.test(stat[0].value[prop_to_filter]) == true
            ){
              filtered = true
            }

          })
        }
        else{
          filtered = true
        }

        if(filtered == true){

          chart = chart.pre_process(chart, name, stat)

          chart.label = this.process_chart_label(chart, name, stat) || name
          let chart_name = this.process_chart_name(chart, stat) || name

          this.process_chart(chart, chart_name, stat)
        }

      }
      else{

        chart.label = this.process_chart_label(chart, name, stat) || name
        let chart_name = this.process_chart_name(chart, stat) || name

        this.process_chart(
          chart.pre_process(chart, chart_name, stat),
          name,
          stat
        )
      }

    },
    process_chart (chart, name, stat){

      // this.$store.commit('hosts/blacklist_module', {path: path, list: /[\s\S]*/} )

      if(name.indexOf('os_') < 0)
        name = this.host+'_os_'+name

      // let {path, list} = this.name_to_module(name)
      // if(path == "")
      //   path == 'os'

      // console.log('process_chart', name, path, list)
      // this.$store.commit('hosts/blacklist_module', {path: path, list: /[\s\S]*/} )

      // if(chart.watch && chart.watch.managed == true)
      //   this.$store.commit('hosts/whitelist_module', {path: path, list: list} )

      if(!chart.watch || chart.watch.managed != true){

        this.add_chart(name, chart)
      }

      this._process_chart(chart, name, stat)


    },
    _process_chart (chart, name, stat){

      if(chart.init && typeOf(chart.init) == 'function')
        chart.init(this, chart, name, stat, 'chart')

      this.create_watcher(name, chart)

    },
    add_chart (name, chart){
      this._add_chart(name, chart)
    },
    _add_chart (name, chart){
      let data = [[]]
      // if(chart.options && chart.options.labels)//dygraph code, should be would
      //   Array.each(chart.options.labels, function(label, index){
      //     if(index == 0){
      //       data[0].push(Date.now())
      //     }
      //     else{
      //       // data[0].push(0)
      //       data[0].push(null)
      //     }
      //
      //   })

      //console.log('adding chart...', name)
      // if(!chart.icon){
      //   Object.each(this.$store.state.app.icons, function(rgexp, icon){
      //       if(rgexp.test(name))
      //         chart.icon = icon
      //   })
      //
      //   if(!chart.icon)
      //     chart.icon = this.$store.state.app.default_chart_icon
      // }

      this.$set(this.charts, name, chart)
      this.$set(this.stats, name, {lastupdate: 0, 'data': [] })
      this.$set(this.stats_tabular, name, {lastupdate: 0, 'data': [[]] })

      // this.expanded.push(name)
    },
    create_watcher(name, chart){
      let watcher = chart.watch || {}
      let watch_name = name
      let replace_host = new RegExp(this.host+'_', 'g')
      watch_name = watch_name.replace(replace_host, '')

      // if(watch_name.indexOf('_') > 0 ){//removes host_ & indixes, ex: cpu.0
      //   watch_name = watch_name.substring(0, watch_name.indexOf('_'))
      // }

      // watch_name = watch_name.replace(/os\./, '', 'g')

      console.log('create_watcher ', watch_name, name)

      // this._create_watcher('$store.state.hosts.'+this.host+'.os.'+watch_name, name, chart)
      this._create_watcher('stats.'+this.host+'_'+watch_name+'.data', name, chart)
    },
    /**
    * @override chart [mixin]
    **/
    _create_watcher(path, name, chart){
      let watcher = chart.watch || {}
      path = path || ''

      watcher = watcher || {}
      watcher.value = watcher.value || ''
      watcher.transform = watcher.transform || ''

      if(this.$options.unwatchers[path+name]){
        this.$options.unwatchers[path+name]()
        delete this.$options.unwatchers[path+name]
      }

      /**
      * process only if it's visible
      * saves CPU
      **/
      let generic_data_watcher = function(current){

        /**
        * managed charts doens't match (==) visibles[name]
        * so use it as a regexp
        */
        // let visible_found = false
        // if(chart.watch && chart.watch.managed == true){ //managed stats must run always
        //   let rg = new RegExp(name, 'ig')
        //   Object.each(this.visibles, function(bool, namaged){
        //     if(rg.test(namaged) == true && bool == true)
        //       visible_found = true
        //   })
        // }
        //
        // if(
        //   (this.visibles[name] == true || visible_found == true)
        //   && this.freezed == false
        //   && this.highlighted == false
        //   && this.paused == false
        //   // || (chart.watch && chart.watch.managed == true) //managed stats must run always
        // ){

          console.log('generic_data_watcher', name, current)

          this.generic_data_watcher(current, chart, name, this.update_chart_stat.bind(this))
        // }
      }

      console.log('gonna watch...', name, path)
      // this.$options.unwatchers[path+name] = this.$watch(path+watch_name, generic_data_watcher)
      this.$options.unwatchers[path+name] = this.$watch(path, generic_data_watcher)

    },
    generic_data_watcher: data_to_tabular,
    update_chart_stat (name, data){

      // if(this.hide[name] != true){
      //
      //   let has_data = true
      //   Array.each(data, function(columns){
      //      has_data = columns.some(function(column, index){
      //        if(index == 0) return false//timestamp column
      //        return column != 0;
      //     });
      //   })
      //
      //
      //   if(!this.$options.has_no_data[name])
      //     this.$options.has_no_data[name] = 0
      //
      //   this.$options.has_no_data[name] = (has_data == true) ? 0 : this.$options.has_no_data[name] + 1
      //
      //   if(this.$options.has_no_data[name] > 60){//60 = a minute, once hidden, user should unhide it
      //     // this.$set(this.hide, name, true)
      //     let hide = Object.clone(this.hide)
      //     hide[name] = true
      //     this.$set(this, 'hide', hide)//or won't work the watch.hide
      //   }
      //
      //   if(
      //     this.stats[name].lastupdate < Date.now() - this.charts[name].interval
      //     && (this.$refs[name]
      //       && this.$refs[name][0]
      //       && this.$refs[name][0].chart != null
      //     )
      //     && ( this.visibles[name] != false || this.freezed == true )
      //     && this.highlighted == false
      //     && this.paused == false
      //     && this.stats[name].data.length > 0 && this.stats[name].data[0].length > 0
      //   ){

          /**
          * @start
          * moved from outside this 'if'
          **/
          console.log('update_chart_stat', name)



          /**
          * always update data, allow a hidden chart to update graphs on visibility change
          **/
          this.$set(this.stats_tabular[name], 'data', data)
          /**
          * @end
          * moved from outside this 'if'
          **/

          // this.$refs[name][0].update()//default update

          this.stats_tabular[name].lastupdate = Date.now()

          console.log('update_chart_stat',name, window.performance.memory)

          // this.$forceUpdate()
        // }

      // }
    },
    process_chart_label (chart, name, stat) {
      if(chart.labeling && typeOf(chart.labeling) == 'function'){

        return chart.labeling(this, chart, name, stat)
      }
      else if(chart.label){
        return chart.label
      }
      else{
        return this.process_chart_name(chart, stat)
      }
    },
    process_chart_name (chart, stat){
      if(chart.name && typeOf(chart.name) == 'function') return chart.name(this, chart, stat)
      else if(chart.name) return chart.name
    },
    /**
    * charting
    **/
    destroy_host_pipelines: function(){
      let host = this.$store.state.hosts.current || this.$route.params.host

      if(
        host
        && this.$store.state['host.'+host]
        && this.$store.state['host.'+host].pipelines.length > 0
      ){
        Array.each(this.$store.state['host.'+host].pipelines, function(pipe, index){//destroy old ones
          pipe.fireEvent('onSuspend')
          pipe.fireEvent('onExit')
          pipe.removeEvents()
          // delete pipe
          // delete this.hosts_pipelines[index]
          // // this.hosts_pipelines.shift()
        }.bind(this))

        // this.$set(this.hosts_pipelines, [])
        this.$store.commit('host.'+host+'/clear')
      }
    },

    process_os_doc: function(doc){
      let {keys, path, host} = extract_data_os(doc)
      //console.log('pre register_host_store_module',path, keys)

      Object.each(keys, function(data, key){
        if(
          this.modules_blacklist
          && this.modules_blacklist[path]
          && this.modules_blacklist[path].test(key) == true
        ){
            // //console.log('deleting...', path, key)
            let whitelisted = false
            if( this.modules_whitelist && this.modules_whitelist[path] )
              Array.each(this.modules_whitelist[path], function(whitelist){
                if(whitelist.test(key) == true)
                  whitelisted = true
              })

            if(whitelisted == false)
              delete keys[key]
        }
      }.bind(this))

      // if(register_commit(host, path, keys) != true){
      //   let interval = setInterval(function(){
      //     //////console.log('os_interval', interval, path)
      //
      //     if(register_commit(host, path, keys) == true){
      //       clearInterval(interval)
      //     }
      //
      //
      //   }.bind(this), 1000)
      // }

      /**
      * don't register a module for each path
      **/
      Object.each(keys, function(data, key){
        this.$store.dispatch('stats/add', {
          host: host,
          path: path,
          key: key,
          data: data
        })

        // this.$store.dispatch('stats/splice', {
        //   host: host,
        //   path: path,
        //   key: key,
        //   length: this.seconds
        // })

        // //console.log(JSON.flatten(data))
        // this.$store.commit('hosts/'+host+'/data', { path: path, key: key, value: data })
        // this.$store.commit('hosts/'+host+'/splice', { path: path, key: key, length: this.seconds })

        // this.$pouch.post('host', {host: host, path: path, key: key, value: data })

        //console.log(sizeof(data))
        // //console.log(sizeof(JSON.encode(data)))
        //console.log('register_host_store_module',path, key,this.seconds, window.performance.memory)

      }.bind(this))

    },
    create_host_pipelines (paths) {
      // paths = ['os.procs']
      //console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$store.state.hosts.current || this.$route.params.host

      let range = Object.clone(this.$store.state.app.range)


      if(paths.length > 0 && this.$store.state['host.'+host]){
        this.destroy_host_pipelines()

        // Array.each(hosts, function(host){
        Array.each(host_pipelines_templates, function(pipeline_template){

          // Array.each(paths, function(path){//one pipeline per used/visible path
          //   if(this.$options.visible_paths.contains(path)){

              let template = Object.clone(pipeline_template)

              template.input[0].poll.conn[0].stat_host = host
              // template.input[0].poll.conn[0].paths = paths
              // template.input[0].poll.conn[0].paths = [path]

              template.input[0].poll.id += '-'+host
              template.input[0].poll.conn[0].id = template.input[0].poll.id

              let pipe = new Pipeline(template)

              //////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                ////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  //////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  //console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

                  this.$store.commit('app/suspend', false)//

                  pipe.fireEvent('onResume')
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', false)
                }
              }.bind(this))

              // this.hosts_pipelines.push(pipe)
              this.$store.commit('host.'+host+'/add', pipe)
              if(range[1] == null){
                range[1] = new Date().getTime()
              }

              pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

              if(this.$store.state.app.suspend != true){
                //console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);
                pipe.fireEvent('onResume')
              }
            // }
          // }.bind(this))
        }.bind(this))

        // }.bind(this))
      }
    },
    // register_host_store_module (host, path, keys){
    //
    //
    //   // ////////////console.log('this.check_store_path', path, this.check_store_path(path.split('/'), this.$store.state.hosts[host]))
    //
    //   // if(!this.$store.state.hosts[host][path]){
    //   let status = this.check_store_path(path.split('/'), this.$store.state['host.'+host])
    //   ////////////console.log('status', status)
    //   if(status == false){
    //
    //     let state_props = (keys) ? Object.clone(keys) : {}
    //     Object.each(state_props, function(data, key){
    //       state_props[key] = []
    //     })
    //
    //     //console.log('registering....', host, path, keys)
    //
    //     let stats = Object.merge(Object.clone(hostStats), Object.clone({state: function() {
    //       return state_props
    //     }}))
    //
    //     // let new_path = ['hosts', host]
    //     new_path = 'host.'+host
    //     new_path = new_path.append(path.split('/'))
    //     this.$store.registerModule(new_path, stats)
    //
    //     // this.$store.commit('hosts/blacklist_module', {path: path, list: /[\s\S]*/} )
    //     // //console.log('registering....', host, new_path, this.$store.state.hosts[host])
    //
    //     return true
    //   }
    //   else if(status == undefined){
    //     return false
    //   }
    //   else{
    //     return true
    //   }
    // },
    // check_store_path(path, root){
    //   // //console.log('registering check_store_path', path)
    //   // for(let i = 0; i < path.length; ){
    //     if(root == undefined){
    //       return undefined
    //     }
    //     else if(root[path[0]] == undefined && path.length == 1){//last path item
    //       return false
    //     }
    //     // else if(i < path.length - 1){
    //     else if(path.length > 1){
    //       let tmp_root = root[path[0]]
    //       // return this.check_store_path([path[++i]], tmp_root)
    //       path.shift()
    //       return this.check_store_path(path, tmp_root)
    //     }
    //     else{
    //       return true
    //     }
    //   // }
    // },
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
