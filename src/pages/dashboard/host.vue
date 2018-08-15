<template>
 <div>
   {{title}}
 </div>
</template>

<style>
</style>

<script>


// import AdminLteBoxSolid from 'components/admin-lte/dashboard/boxSolid'
import Pipeline from 'node-mngr-worker/lib/pipeline'


import HostTemplatePipeline from '../../libs/pipelines/host.template'
import HostHistoricalTemplatePipeline from '../../libs/pipelines/host.historical.template'
import HostMuninTemplatePipeline from '../../libs/pipelines/host.munin.template'

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

  // watch: {
  //   '$route.params.host': function(host){ this.$store.commit('hosts/current', host) }
  // },
  mounted: function(){
    console.log('this.$route',this.$route.params.host)
    this.create_host_pipelines(this.$store.state.app.paths)
    // this.$store.commit('hosts/current', this.$route.params.host)

    // // Make the dashboard widgets sortable Using jquery UI
    // $('.connectedSortable').sortable({
    //   placeholder         : 'sort-highlight',
    //   connectWith         : '.connectedSortable',
    //   handle              : '.box-header, .nav-tabs',
    //   forcePlaceholderSize: true,
    //   zIndex              : 999999
    // });
    // $('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');
  },
  // beforeUpdate: function(){
  //   console.log('beforeUpdate')
  // },
  // updated: function(){
  //   console.log('updated')
  //   this.create_host_pipelines(this.$store.state.app.paths)
  // },
  beforeDestroy: function(){
    let host = this.$store.state.hosts.current

    if(this.$store.state.hosts[host].pipelines.length > 0)
      Array.each(this.$store.state.hosts[host].pipelines, function(pipe, index){//destroy old ones
        pipe.fireEvent('onSuspend')
        pipe.fireEvent('onExit')
        pipe.removeEvents()
        // delete pipe
        // delete this.hosts_pipelines[index]
        // // this.hosts_pipelines.shift()
      }.bind(this))

    // this.$set(this.hosts_pipelines, [])
    this.$store.commit('hosts/'+host+'/clear')
  },
  methods: {
    create_host_pipelines (paths) {
      console.log('$store.state create_hosts_pipelines', this.$route.params.host, paths)
      let host = this.$route.params.host

      let range = Object.clone(this.$store.state.app.range)


      if(paths.length > 0){
        if(this.$store.state.hosts[host].pipelines.length > 0)
          Array.each(this.$store.state.hosts[host].pipelines, function(pipe, index){//destroy old ones
            pipe.fireEvent('onSuspend')
            pipe.fireEvent('onExit')
            pipe.removeEvents()
            // delete pipe
            // delete this.hosts_pipelines[index]
            // // this.hosts_pipelines.shift()
          }.bind(this))

        // this.$set(this.hosts_pipelines, [])
        this.$store.commit('hosts/'+host+'/clear')


        // Array.each(hosts, function(host){
          Array.each(host_pipelines_templates, function(pipeline_template){

            let template = Object.clone(pipeline_template)

            template.input[0].poll.conn[0].stat_host = host
            template.input[0].poll.conn[0].paths = paths

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
            this.$store.commit('hosts/'+host+'/add', pipe)
            if(range[1] == null){
              range[1] = new Date().getTime()
            }

            pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })

            if(this.$store.state.app.suspend != true){
              console.log('store.state.hosts.current ON_RESUME',this.$store.state.app.suspend);
              pipe.fireEvent('onResume')
            }

          }.bind(this))

        // }.bind(this))
      }
    }
  },
}
</script>
