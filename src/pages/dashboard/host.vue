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
          <!-- <dygraph-wrapper
            :ref="host+'_os_cpus_times'"
            :id="host+'_os_cpus_times'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_times']"
            :stat="stats_tabular[host+'_os_cpus_times']"
          >
          </dygraph-wrapper> -->
          <chart
            :type="'dygraph'"
            :ref="host+'_os_cpus_times'"
            :id="host+'_os_cpus_times'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_times']"
            :stat="stats[host+'_os_cpus_times']"
          >
          </chart>
          <!-- :stat="stats_tabular[host+'_os_cpus_times']" -->

        </admin-lte-box-solid>
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

import sizeof from 'object-sizeof'

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

import cpus_times_chart from 'components/charts/cpus_times'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

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

  unwatchers: {},

  data () {
    return {
      // title: 'title',
      // parent: 'Dashboard'
      EventBus: EventBus,
      stats: {},
      // stats_tabular: {},
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

    '$store.state.app.paths': function(oldVal, newVal){ this.create_host_pipelines(newVal) }
  },


  created: function(){
    this.add_chart (this.host+'_os_cpus_times', Object.clone(cpus_times_chart))




  },

  computed: Object.merge(
    mapState({
      // modules_blacklist: state => state.hosts.modules_blacklist,
      // modules_whitelist: state => state.hosts.modules_whitelist,
      // reset: state => state.app.reset,
      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      seconds: function(state){
        // //////////////console.log('seconds to splice', state.app.range)

        let end = new Date().getTime()
        if(state.app.range[1] != null)
          end = state.app.range[1]

        let seconds = Math.trunc( (end - state.app.range[0]) / 1000 )


        // return seconds
        return 300
      },
      hosts: state => state.hosts.all,
      // currentHost: state => state.hosts.current,

    }),
    {
      host: function(){
        return this.$store.state.hosts.current || this.$route.params.host
      }
    }

  ),
  mounted: function(){

    let range = [Date.now() - this.seconds * 1000, Date.now()]
    this.$store.dispatch('stats/get', {
      host: this.host,
      path: 'os',
      key: 'cpus',
      length: this.seconds,
      range: range
    }).then((docs) => {
      console.log('got stat', docs)

      let pipeline = this.$store.state['host.'+this.host].pipelines[0]
      if(docs.length == 0){
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']
        pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        this.__watcher()
      }

      Array.each(docs, function(doc, index){
        let data = { timestamp: doc.metadata.timestamp, value: doc.data }
        this.stats[this.host+'_os_cpus_times'].data.push(data)

        let length = this.stats[this.host+'_os_cpus_times'].data.length

        this.stats[this.host+'_os_cpus_times'].data.splice(
          -300 -1,
          length - 300
        )

        this.stats[this.host+'_os_cpus_times'].lastupdate = Date.now()

        if(index == docs.length -1){
          pipeline.inputs[0].options.conn[0].module.options.paths = ['os']
          // console.log('PIPELINE', pipeline.inputs[0].options.conn[0].module.paths)
          range[0] = doc.metadata.timestamp
          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

          this.__watcher()
        }
      }.bind(this))
    })

    EventBus.$on('os', doc => {
      console.log('recived doc via Event os', doc.length, this.seconds)

      // if(Array.isArray(doc)){
      //   Array.each(doc, function(val){
      //     console.log('VAL', val)
      //     if(val.doc.metadata.host == this.host)
      //       this.process_os_doc(val.doc)
      //
      //   }.bind(this))
      // }
      // else if(doc.metadata.host == this.host){
        this.process_os_doc(doc)
      // }

		})

    ////console.log('this.$route',this.$route.params.host)
    this.create_host_pipelines(this.$store.state.app.paths)




  },
  // beforeUpdate: function(){
  //   ////console.log('beforeUpdate')
  // },
  updated: function(){
    console.log('updated')
  //   this.create_host_pipelines(this.$store.state.app.paths)
  },
  beforeDestroy: function(){
    console.log('beforeDestroy')
    this.destroy_host_pipelines()
    Object.each(this.$options.unwatchers, function(unwatcher){
      unwatcher()
    })
  },
  methods: {
    __watcher(){
      this.$options.unwatchers['$store.state.stats.'+this.host+'.os.cpus'] = this.$watch('$store.state.stats.'+this.host+'.os.cpus', function (doc, old) {
        // let doc = JSON.parse(JSON.stringify(newVal))
        console.log('$store.state.stats.'+this.host+'.os.cpus', doc)

        if(this.stats[this.host+'_os_cpus_times'].lastupdate > 0){
          let data = { timestamp: doc.value.metadata.timestamp, value: doc.value.data }
          this.stats[this.host+'_os_cpus_times'].data.push(data)

          let length = this.stats[this.host+'_os_cpus_times'].data.length
          this.stats[this.host+'_os_cpus_times'].data.splice(
            -300 -1,
            length - 300
          )

          this.stats[this.host+'_os_cpus_times'].lastupdate = Date.now()

          /** manually resume **/
          this.$store.state['host.'+this.host].pipelines[0].fireEvent('onResume')

          // this.stats_tabular[this.host+'_os_cpus_times'].data.splice(
          //   -300 -1,
          //   length - 300
          // )
        }
      })
    },
    add_chart (name, chart){
      this.$set(this.charts, name, chart)
      this.$set(this.stats, name, {lastupdate: 0, 'data': [] })
    },

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
      console.log('process_os_doc', doc)
      // let self = this
      let paths = {}
      // let keys, path, host = undefined
      if(Array.isArray(doc)){
        Array.each(doc, function(row){
          console.log('ROW', row.doc)
          if(row.doc != null && row.doc.metadata.host == this.host){
            let {keys, path, host} = extract_data_os(row.doc)
            if(!paths[path])
              paths[path] = {}

            // paths[path].push(keys)
            paths[path] = Object.merge(paths[path], keys)
          }
        }.bind(this))
      }
      else if(doc.metadata.host == this.host){
        let {keys, path, host} = extract_data_os(doc)
        paths[path] = keys
        // paths[path].push(keys)
      }
      // let {keys, path, host} = extract_data_os(doc)
      ////console.log('pre register_host_store_module',path, keys)

      // Object.each(keys, function(data, key){
      //   if(
      //     this.modules_blacklist
      //     && this.modules_blacklist[path]
      //     && this.modules_blacklist[path].test(key) == true
      //   ){
      //       // ////console.log('deleting...', path, key)
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

      Object.each(paths, function(keys, path){
        // console.log('process_os_doc', path)

        Object.each(keys, function(data, key){
          // console.log('process_os_doc', data, key)
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
      ////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
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

              ////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                //////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  ////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  ////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

                  this.$store.commit('app/suspend', false)//

                  /** manually resume **/
                  // pipe.fireEvent('onResume')

                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', false)
                }
              }.bind(this))

              // this.hosts_pipelines.push(pipe)
              this.$store.commit('host.'+host+'/add', pipe)
              if(range[1] == null){
                range[1] = new Date().getTime()
              }

              // pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

              if(this.$store.state.app.suspend != true){
                ////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

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
