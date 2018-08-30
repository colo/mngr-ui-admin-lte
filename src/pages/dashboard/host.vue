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
          :id="host+'.os.cpus_times-collapsible'"
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

        <admin-lte-box-solid
          title="CPU Percentage"
          :id="host+'.os.cpus_percentage-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            :type="'dygraph'"
            :ref="host+'_os_cpus_percentage'"
            :id="host+'_os_cpus_percentage'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_cpus_percentage']"
            :stat="stats[host+'_os_cpus_percentage']"
          >
          </chart>
          <!-- :stat="stats_tabular[host+'_os_cpus_times']" -->

        </admin-lte-box-solid>

        <admin-lte-box-solid
          title="Freemem Percetange"
          :id="host+'.os.freemem-collapsible'"
          v-on:show="el => showCollapsible(el)"
          v-on:hide="el => hideCollapsible(el)"
        >

          <chart
            :type="'dygraph'"
            :ref="host+'_os_freemem'"
            :id="host+'_os_freemem'"
            :EventBus="EventBus"
            :chart="charts[host+'_os_freemem']"
            :stat="stats[host+'_os_freemem']"
          >
          </chart>
          <!-- :stat="stats_tabular[host+'_os_cpus_times']" -->

        </admin-lte-box-solid>

        <template v-for="(mount, index) in mounts">
          <admin-lte-box-solid
            :key="'mount_'+index"
            :title="'Mounts Percetange usage '+index"
            :id="host+'.os.mounts_percentage_'+index+'-collapsible'"
            v-on:show="el => showCollapsible(el)"
            v-on:hide="el => hideCollapsible(el)"
          >

            <chart
              :type="'dygraph'"
              :ref="host+'_os_mounts_percentage_'+index"
              :id="host+'_os_mounts_percentage_'+index"
              :EventBus="EventBus"
              :chart="charts[host+'_os_mounts_percentage_'+index]"
              :stat="stats[host+'_os_mounts_percentage_'+index]"
            >
            </chart>
            <!-- :stat="stats_tabular[host+'_os_cpus_times']" -->

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
import cpus_percentage_chart from 'components/charts/cpus_percentage'
import freemem_chart from 'components/charts/freemem'
import mounts_percentage_chart from 'components/charts/mounts_percentage'

export default {
  mixins: [dashboard],

  name: 'admin-lte-dashboard-host',

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

    }
  },
  // pouch: {
  //   host: {}
  // },

  watch: {
    // '$store.state.app.docs.os': function(oldVal, newVal){
    //   ////console.log('recived doc via Event os', newVal)
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
        // ////////////////console.log('seconds to splice', state.app.range)

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
      }
    }

  ),

  created: function(){
    let unwatch_mounts = this.$watch('mounts', function(val, old){

      // console.log('$watch mounts ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        Object.each(val, function(mount, key){
          console.log('adding mount chart '+this.host+'_os_mounts_percentage_'+key)
          this.add_chart (Object.clone({
            name: this.host+'_os_mounts_percentage_'+key,
            chart: Object.clone(mounts_percentage_chart),
            init: this.__mounts_get_stat.bind(this),
            watch: {
              name: '$store.state.stats.'+this.host+'.os_mounts.'+key,
              deep:true,
              cb: this.__watcher_callback.bind(this)
            },
            stat: {
              host: this.host,
              path: 'os_mounts',
              key: key,
              length: this.seconds || 300,
              range: [Date.now() - this.seconds * 1000, Date.now()]
            }
          }))


        }.bind(this))

        unwatch_mounts()
      }
    }.bind(this),{
      deep:true
    })

    this.create_host_pipelines(this.$store.state.app.paths)

    EventBus.$on('os', doc => {
      // console.log('recived doc via Event os', doc.length, this.seconds)
        this.process_os_doc(doc)
    })


    // Array.each(this.mounts, function(mount, index){

      // this.add_chart ({
      //   name: this.host+'_os_mounts_percentage_'+index,
      //   chart: Object.clone(mounts_percentage_chart),
      //   watch: {
      //     name: '$store.state.stats.'+this.host+'.os_mounts.'+index,
      //     cb: this.__watcher_callback.bind(this)
      //   },
      //   stat: {
      //     host: this.host,
      //     path: 'os_mounts',
      //     key: index,
      //     length: this.seconds,
      //     range: [Date.now() - this.seconds * 1000, Date.now()]
      //   }
      // })

    // }.bind(this))

  },



  mounted: function(){
    this.add_chart ({
      name: this.host+'_os_cpus_times',
      chart: Object.clone(cpus_times_chart),
      init: this.__cpu_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.cpus',
        cb: this.__watcher_callback.bind(this)
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'cpus',
        length: this.seconds || 300,
        range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    })

    /**
    * no init, as __cpu_get_stat already manage all os.cpus docs
    **/
    this.add_chart ({
      name: this.host+'_os_cpus_percentage',
      chart: Object.clone(cpus_percentage_chart),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.cpus',
        cb: this.__watcher_callback.bind(this)
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'cpus',
        length: this.seconds || 300,
        range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    })

    this.add_chart ({
      name: this.host+'_os_freemem',
      chart: Object.clone(freemem_chart),
      init: this.__freemem_get_stat.bind(this),
      watch: {
        name: '$store.state.stats.'+this.host+'.os.freemem',
        cb: this.__watcher_callback.bind(this)
      },
      stat: {
        host: this.host,
        path: 'os',
        key: 'freemem',
        length: this.seconds || 300,
        range: [Date.now() - this.seconds * 1000, Date.now()]
      }
    })
  },
  // beforeUpdate: function(){
  //   //////console.log('beforeUpdate')
  // },
  updated: function(){
    //console.log('updated')
  //   this.create_host_pipelines(this.$store.state.app.paths)
  },
  beforeDestroy: function(){
    //console.log('beforeDestroy')

    // this.$store.dispatch('stats/splice', {
    //   host: this.host,
    //   path: 'os',
    //   key: 'cpus'
    // })

    this.destroy_host_pipelines()
    Object.each(this.$options.__unwatchers__, function(unwatcher){
      unwatcher()
    })
  },
  methods: {
    __cpu_get_stat: function(payload){
      let {stat} = payload
      let range = stat.range

      this.__get_stat(stat, function(docs){
        console.log('got cpus stat', docs)

        let pipeline = this.$store.state['host_'+this.host].pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os']
        if(docs.length == 0){
          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          // this.__watcher()
        }
        else{
          this.__update_stat(this.host+'_os_cpus_times', docs)
          this.__update_stat(this.host+'_os_cpus_percentage', docs)


          range[0] = docs[docs.length -1].metadata.timestamp
          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        }

        setTimeout(function(){
          this.__get_stat(stat, function(docs){
            console.log('got cpus stat2', docs)

              this.__update_stat(this.host+'_os_cpus_times', docs)
              this.__update_stat(this.host+'_os_cpus_percentage', docs)

          }.bind(this))

          this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')

        }.bind(this), 500)

      }.bind(this))
    },

    __freemem_get_stat: function(payload){
      let {stat} = payload
      let range = stat.range

      this.__get_stat(stat, function(docs){
        console.log('got freemem stat', docs)

        /**
        * don't fireEvent as it's been fired already by CPUS_*
        **/
        if(docs.length > 0){
          this.__update_stat(this.host+'_os_freemem', docs)
        }

        setTimeout(function(){
          this.__get_stat(stat, function(docs){
            console.log('got freemem stat2', docs)

            this.__update_stat(this.host+'_os_freemem', docs)

          }.bind(this))

          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')

        }.bind(this), 500)


        // Array.each(docs, function(doc, index){
        //
        //   this.__update_stat(this.host+'_os_freemem', doc)
        //
        // }.bind(this))

      }.bind(this))
    },

    __mounts_get_stat: function(payload){
      let {name, stat} = payload
      let range = stat.range

      // this.__get_stat(stat, function(docs){
      //   console.log('got mounts '+key+' stat', docs)
      //
      //   let pipeline = this.$store.state['host_'+this.host].pipelines['input.os']
      //   pipeline.inputs[0].options.conn[0].module.options.paths = ['os.mounts']
      //   if(docs.length == 0 && key == 0){//fireEvent only on one mount
      //     pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
      //     // this.__watcher()
      //   }
      //   else{
      //     this.__update_stat(this.host+'_os_mounts_percentage_'+key, docs)
      //     range[0] = docs[docs.length -1].metadata.timestamp
      //     pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
      //
      //   }
      //
      //
      // }.bind(this))
      this.__get_stat(stat, function(docs){
        console.log('got mounts stat', docs)

        let pipeline = this.$store.state['host_'+this.host].pipelines['input.os']
        pipeline.inputs[0].options.conn[0].module.options.paths = ['os.mounts']
        if(docs.length == 0){
          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          // this.__watcher()
        }
        else{
          this.__update_stat(name, docs)
          // this.__update_stat(this.host+'_os_cpus_percentage', docs)


          range[0] = docs[docs.length -1].metadata.timestamp
          pipeline.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
        }

        setTimeout(function(){
          this.__get_stat(stat, function(docs){
            console.log('got mounts stat2', docs)

            this.__update_stat(name, docs)

          }.bind(this))

          // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')

        }.bind(this), 5000)

      }.bind(this))
    },
    __watcher_callback: function(doc, old, payload){
      let {name, watch} = payload
      // console.log('THIS', this)

      // if(this.stats[name] && this.stats[name].lastupdate == 0){
      //   //avoid a race condition, as another watcher iteration may reach this point before __get_stat run (async func)
      //   this.stats[name].lastupdate = Date.now()
      //
      //   // this.__get_stat(watch.stat,
      //   //   (docs) => Array.each(docs, (doc) => this.__update_stat(name, doc))
      //   // )
      //
      //   this.__get_stat(watch.stat, (docs) => this.__update_stat(name, docs) )
      //   // this.__get_stat(watch.stat, (docs) => this.__pre_update_stat(name, docs) )
      //
      // }
      // else{
      //   this.__update_stat(name, doc.value)
      //
      // }

      this.__update_stat(name, doc.value)

      // /** manually resume **/
      // this.$store.state['host_'+this.host].pipelines['input.os'].fireEvent('onResume')


      // this.stats_tabular[this.host+'_os_cpus_times'].data.splice(
      //   -300 -1,
      //   length - 300
      // )

    },
    // __pre_update_stat: function(name, docs){
    //   this.$options.stats[name] = docs
    //
    // }
    destroy_host_pipelines: function(){
      let host = this.$store.state.hosts.current || this.$route.params.host

      if(
        host
        && this.$store.state['host_'+host]
        && Object.getLength(this.$store.state['host_'+host].pipelines) > 0
      ){
        Object.each(this.$store.state['host_'+host].pipelines, function(pipe, id){//destroy old ones
          pipe.fireEvent('onSuspend')
          pipe.fireEvent('onExit')
          pipe.removeEvents()
          // delete pipe
          // delete this.hosts_pipelines[index]
          // // this.hosts_pipelines.shift()
        }.bind(this))

        // this.$set(this.hosts_pipelines, [])
        this.$store.commit('host_'+host+'/clear')
      }
    },

    process_os_doc: function(doc){

      let paths = {}

      if(Array.isArray(doc)){
        Array.each(doc, function(row){

          if(row.doc != null && row.doc.metadata.host == this.host){
            let {keys, path, host} = extract_data_os(row.doc)

            // console.log('ROW', keys, path)

            if(!paths[path])
              paths[path] = {}


            Object.each(keys, function(data, key){
              // console.log('ROW', key, data)
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
        // console.log('stat process_os_doc', path)

        Object.each(keys, function(data, key){
          // console.log('stat process_os_doc', path, key, data)
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
      //////console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$store.state.hosts.current || this.$route.params.host

      let range = Object.clone(this.$store.state.app.range)


      if(paths.length > 0 && this.$store.state['host_'+host]){
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

              //////////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                ////////console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  //////////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  //////console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

                  this.$store.commit('app/suspend', false)//

                  /** manually resume **/
                  // pipe.fireEvent('onResume')

                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', false)
                }
              }.bind(this))

              // this.hosts_pipelines.push(pipe)
              this.$store.commit('host_'+host+'/add', {id: pipeline_id, pipeline: pipe})
              if(range[1] == null){
                range[1] = new Date().getTime()
              }

              // pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

              if(this.$store.state.app.suspend != true){
                //////console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);

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
