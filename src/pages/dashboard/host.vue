<template>
 <div>
   {{title}}
 </div>
</template>

<style>
</style>

<script>

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
//         //   ////////console.log('data', state, payload)
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

let host_pipelines_templates = [
  HostTemplatePipeline,
  // HostMuninTemplatePipeline,
  // HostHistoricalTemplatePipeline
]

export default {
  name: 'DashboardHost',

  // components: {
  //   AdminLteBoxSolid
  // },
  visible_paths:['os', 'os.procs'],

  breadcrumb () {
    return {
      label: this.$route.params.host,
      parent: 'Dashboard'
    }
  },
  data () {
    return {
      title: 'title',
      // parent: 'Dashboard'
    }
  },
  // pouch: {
  //   host: {}
  // },

  watch: {
    // '$store.state.app.docs.os': function(oldVal, newVal){
    //   console.log('recived doc via Event os', newVal)
    //   this.process_os_doc(newVal)
    // },
    '$store.state.app.paths': function(oldVal, newVal){ this.create_host_pipelines(newVal) }
  },


  created: function(){
    EventBus.$on('os', doc => {
      console.log('recived doc via Event os', doc, this.seconds)
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
      // //       console.log('register_host_store_module',path, key)
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
      // // console.log('pre register_host_store_module',path, keys)
      //
      // Object.each(keys, function(data, key){
      //   if(
      //     this.modules_blacklist
      //     && this.modules_blacklist[path]
      //     && this.modules_blacklist[path].test(key) == true
      //   ){
      //       // console.log('deleting...', path, key)
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
      // //     ////console.log('os_interval', interval, path)
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
      //   // console.log(JSON.flatten(data))
      //   // this.$store.commit('hosts/'+host+'/data', { path: path, key: key, value: data })
      //   // this.$store.commit('hosts/'+host+'/splice', { path: path, key: key, length: this.seconds })
      //
      //   // this.$pouch.post('host', {host: host, path: path, key: key, value: data })
      //
      //   console.log(sizeof(data))
      //   // console.log(sizeof(JSON.encode(data)))
      //   console.log('register_host_store_module',path, key, window.performance.memory)
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

      seconds: function(state){
        // //////////console.log('seconds to splice', state.app.range)

        let end = new Date().getTime()
        if(state.app.range[1] != null)
          end = state.app.range[1]

        let seconds = Math.trunc( (end - state.app.range[0]) / 1000 )


        // return seconds
        return 300
      },
      // hosts: state => state.hosts.all,
      // currentHost: state => state.hosts.current,

    })

  ),
  mounted: function(){
    console.log('this.$route',this.$route.params.host)
    this.create_host_pipelines(this.$store.state.app.paths)

  },
  // beforeUpdate: function(){
  //   console.log('beforeUpdate')
  // },
  // updated: function(){
  //   console.log('updated')
  //   this.create_host_pipelines(this.$store.state.app.paths)
  // },
  beforeDestroy: function(){
    this.destroy_host_pipelines()
  },
  methods: {
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
      console.log('pre register_host_store_module',path, keys)

      Object.each(keys, function(data, key){
        if(
          this.modules_blacklist
          && this.modules_blacklist[path]
          && this.modules_blacklist[path].test(key) == true
        ){
            // console.log('deleting...', path, key)
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
      //     ////console.log('os_interval', interval, path)
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
          value: data
        })

        this.$store.commit('stats/splice', {
          host: host,
          path: path,
          key: key,
          length: this.seconds
        })

        // console.log(JSON.flatten(data))
        // this.$store.commit('hosts/'+host+'/data', { path: path, key: key, value: data })
        // this.$store.commit('hosts/'+host+'/splice', { path: path, key: key, length: this.seconds })

        // this.$pouch.post('host', {host: host, path: path, key: key, value: data })

        console.log(sizeof(data))
        // console.log(sizeof(JSON.encode(data)))
        console.log('register_host_store_module',path, key,this.seconds, window.performance.memory)

      }.bind(this))

    },
    create_host_pipelines (paths) {
      // paths = ['os.procs']
      console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
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

              ////////console.log('$store.state.hosts.all', pipe)

              /**
              * start suspended already
              **/
              // pipe.fireEvent('onSuspend')

              //suscribe to 'onRangeDoc

              pipe.inputs[0].addEvent('onRangeDoc', function(doc){
                //console.log('create_hosts_pipelines onRangeDoc',doc);

                if(this.$store.state.app.freeze == true){
                  ////////console.log('pipe.inputs[0].addEvent(onRangeDoc)')
                  // this.$nextTick(function(){pipe.fireEvent('onSuspend')})
                  this.$store.commit('app/suspend', true)
                  // this.$q.loading.hide()
                  // this.$store.commit('app/pause', true)
                }
                else{
                  console.log('create_hosts_pipelines ON_RESUME',pipe.inputs[0].options.id);

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
                console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);
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
    //   // //////////console.log('this.check_store_path', path, this.check_store_path(path.split('/'), this.$store.state.hosts[host]))
    //
    //   // if(!this.$store.state.hosts[host][path]){
    //   let status = this.check_store_path(path.split('/'), this.$store.state['host.'+host])
    //   //////////console.log('status', status)
    //   if(status == false){
    //
    //     let state_props = (keys) ? Object.clone(keys) : {}
    //     Object.each(state_props, function(data, key){
    //       state_props[key] = []
    //     })
    //
    //     console.log('registering....', host, path, keys)
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
    //     // console.log('registering....', host, new_path, this.$store.state.hosts[host])
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
    //   // console.log('registering check_store_path', path)
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
