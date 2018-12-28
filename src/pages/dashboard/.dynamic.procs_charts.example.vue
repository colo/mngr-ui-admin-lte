<script>
this.$set(this.available_charts, this.host+'.os_procs_uid_stats_percentage_cpu', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_uid_stats']),
  {
    name: this.host+'.os_procs_uid_stats_percentage_cpu',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_percentage_cpu'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      "options": {
        valueRange: [0, self.cpus.length * 100],
        labels: ['Time'],
      },
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_percentage_cpu transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.push('uid['+data['uid']+']')
                  chart.top.pids.push(data['uid'])
                }

              })

              self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.push('uid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['uid'])
              if(_index > -1){
                transform_value[_index] = data['%cpu']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)

//console.log('os_procs_uid_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_uid_stats_percentage_cpu'])

this.set_chart_visibility(this.host+'.os_procs_uid_stats_percentage_cpu', true)

/**
*
**/

this.$set(this.available_charts, this.host+'.os_procs_uid_stats_percentage_mem', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_uid_stats']),
  {
    name: this.host+'.os_procs_uid_stats_percentage_mem',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_percentage_mem'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        uids: []
      },

      "options": {
        valueRange: [0, 100],
        labels: ['Time'],
      },
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_uid_stats_percentage_mem transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['uid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                  self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.push('uid['+data['uid']+']')
                  chart.top.uids.push(data['uid'])
                }

              })

              self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.push('uid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.uids.indexOf(data['uid'])
              if(_index > -1){
                transform_value[_index] = data['%mem']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)

//console.log('os_procs_uid_stats_percentage_mem', this.available_charts[this.host+'.os_procs_uid_stats_percentage_mem'])

this.set_chart_visibility(this.host+'.os_procs_uid_stats_percentage_mem', true)

/**
*
**/
this.$set(this.available_charts, this.host+'.os_procs_uid_stats_time', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_uid_stats']),
  {
    name: this.host+'.os_procs_uid_stats_time',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_time'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        uids: []
      },

      "options": {
        labels: ['Time'],
      },
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_uid_stats_time transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['uid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                  self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.push('uid['+data['uid']+']')
                  chart.top.uids.push(data['uid'])
                }

              })

              self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.push('uid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.uids.indexOf(data['uid'])
              if(_index > -1){
                transform_value[_index] = data['time']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)

//console.log('os_procs_uid_stats_time', this.available_charts[this.host+'.os_procs_uid_stats_time'])

this.set_chart_visibility(this.host+'.os_procs_uid_stats_time', true)

/**
*
**/

this.$set(this.available_charts, this.host+'.os_procs_uid_stats_count', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_uid_stats']),
  {
    name: this.host+'.os_procs_uid_stats_count',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_uid_stats_count'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        uids: []
      },

      "options": {
        labels: ['Time'],
      },
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_uid_stats_count transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['uid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'uid['+data.uid+']'
                  self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.push('uid['+data['uid']+']')
                  chart.top.uids.push(data['uid'])
                }

              })

              self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.push('uid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_uid_stats_count'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.uids.indexOf(data['uid'])
              if(_index > -1){
                transform_value[_index] = data['count']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['count'] : transform_value[_others_index] + data['count']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)



//console.log('os_procs_uid_stats_count', this.available_charts[this.host+'.os_procs_uid_stats_count'])

this.set_chart_visibility(this.host+'.os_procs_uid_stats_count', true)


/**
* @start reactive chart.options.labels
* procs.cmd: %cpu top 5
**/


let os_procs_cmd_stats_percentage_cpu_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  valueRange: [0, self.cpus.length * 100],
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_cpu', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
  {
    name: this.host+'.os_procs_cmd_stats_percentage_cpu',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_percentage_cpu'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      // "options": {
      //   valueRange: [0, self.cpus.length * 100],
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_percentage_cpu transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.push('cmd['+data['cmd']+']')
                  chart.top.pids.push(data['cmd'])
                }

              })

              self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.push('cmd[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['cmd'])
              if(_index > -1){
                transform_value[_index] = data['%cpu']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)

//console.log('os_procs_cmd_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_cmd_stats_percentage_cpu'])
this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_percentage_cpu'].chart, 'options', os_procs_cmd_stats_percentage_cpu_options)

this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_cpu', true)

/**
* @end reactive chart.options.labels
* procs.cmd: %cpu top 5
**/


/**
* @start reactive chart.options.labels
* procs.cmd: %mem top 5
**/

let os_procs_cmd_stats_percentage_mem_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  valueRange: [0, 100],
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_percentage_mem', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
  {
    name: this.host+'.os_procs_cmd_stats_percentage_mem',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_percentage_mem'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        cmds: []
      },

      // "options": {
      //   valueRange: [0, 100],
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_cmd_stats_percentage_mem transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['cmd']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                  self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.push('cmd['+data['cmd']+']')
                  chart.top.cmds.push(data['cmd'])
                }

              })

              self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.push('cmd[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.cmds.indexOf(data['cmd'])
              if(_index > -1){
                transform_value[_index] = data['%mem']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)

//console.log('os_procs_cmd_stats_percentage_mem', this.available_charts[this.host+'.os_procs_cmd_stats_percentage_mem'])
this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_percentage_mem'].chart, 'options', os_procs_cmd_stats_percentage_mem_options)

this.set_chart_visibility(this.host+'.os_procs_cmd_stats_percentage_mem', true)

/**
* @end reactive chart.options.labels
* procs.cmd: %mem top 5
**/

/**
* @start reactive chart.options.labels
* procs.cmd: time top 5
**/


let os_procs_cmd_stats_time_options = Object.merge(Object.clone(dygraph_line_chart.options),{
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_time', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
  {
    name: this.host+'.os_procs_cmd_stats_time',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_time'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        cmds: []
      },

      // "options": {
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_cmd_stats_time transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['cmd']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                  self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.push('cmd['+data['cmd']+']')
                  chart.top.cmds.push(data['cmd'])
                }

              })

              self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.push('cmd[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.cmds.indexOf(data['cmd'])
              if(_index > -1){
                transform_value[_index] = data['time']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)

//console.log('os_procs_cmd_stats_time', this.available_charts[this.host+'.os_procs_cmd_stats_time'])
this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_time'].chart, 'options', os_procs_cmd_stats_time_options)

this.set_chart_visibility(this.host+'.os_procs_cmd_stats_time', true)

/**
* @end reactive chart.options.labels
* procs.cmd: time top 5
**/

/**
* @start reactive chart.options.labels
* procs.cmd: count top 5
**/

let os_procs_cmd_stats_count_options = Object.merge(Object.clone(dygraph_line_chart.options),{
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_cmd_stats_count', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_cmd_stats']),
  {
    name: this.host+'.os_procs_cmd_stats_count',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_cmd_stats_count'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        cmds: []
      },

      // "options": {
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_cmd_stats_count transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['cmd']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'cmd['+data.cmd+']'
                  self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.push('cmd['+data['cmd']+']')
                  chart.top.cmds.push(data['cmd'])
                }

              })

              self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.push('cmd[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_cmd_stats_count'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.cmds.indexOf(data['cmd'])
              if(_index > -1){
                transform_value[_index] = data['count']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['count'] : transform_value[_others_index] + data['count']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })
  })
)



//console.log('os_procs_cmd_stats_count', this.available_charts[this.host+'.os_procs_cmd_stats_count'])
this.$set(this.available_charts[this.host+'.os_procs_cmd_stats_count'].chart, 'options', os_procs_cmd_stats_count_options)

this.set_chart_visibility(this.host+'.os_procs_cmd_stats_count', true)

/**
* @end reactive chart.options.labels
* procs.cmd: count top 5
**/

/**
* @start reactive chart.options.labels
* procs: %cpu top 5
**/
let self = this

let os_procs_stats_percentage_cpu_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  valueRange: [0, self.cpus.length * 100],
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_cpu', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_stats']),
  {
    name: this.host+'.os_procs_stats_percentage_cpu',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_stats_percentage_cpu'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      // "options": {
      //   valueRange: [0, self.cpus.length * 100],
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_percentage_cpu transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.push('pid['+data['pid']+']')
                  chart.top.pids.push(data['pid'])
                }

              })

              self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.push('pid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_stats_percentage_cpu'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['pid'])
              if(_index > -1){
                transform_value[_index] = data['%cpu']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%cpu'] : transform_value[_others_index] + data['%cpu']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)


// this.available_charts[this.host+'.os_procs_stats_percentage_cpu'].chart.options = undefined
this.$set(this.available_charts[this.host+'.os_procs_stats_percentage_cpu'].chart, 'options', os_procs_stats_percentage_cpu_options)

//console.log('os_procs_stats_percentage_cpu', this.available_charts[this.host+'.os_procs_stats_percentage_cpu'])

this.set_chart_visibility(this.host+'.os_procs_stats_percentage_cpu', true)

/**
* @end reactive chart.options.labels
* procs: %cpu top 5
**/

/**
* @start reactive chart.options.labels
* procs: %mem top 5
**/
/**
* @todo tabular
**/

let os_procs_stats_percentage_mem_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  valueRange: [0, 100],
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_stats_percentage_mem', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_stats']),
  {
    name: this.host+'.os_procs_stats_percentage_mem',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_stats_percentage_mem'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      // "options": {
      //   valueRange: [0, 100],
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_percentage_mem transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.push('pid['+data['pid']+']')
                  chart.top.pids.push(data['pid'])
                }

              })

              self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.push('pid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['pid'])
              if(_index > -1){
                transform_value[_index] = data['%mem']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)

this.$set(this.available_charts[this.host+'.os_procs_stats_percentage_mem'].chart, 'options', os_procs_stats_percentage_mem_options)

//console.log('os_procs_stats_percentage_mem', this.available_charts[this.host+'.os_procs_stats_percentage_mem'])

this.set_chart_visibility(this.host+'.os_procs_stats_percentage_mem', true)

/**
* @end reactive chart.options.labels
* procs: %mem top 5
**/

/**
* @start reactive chart.options.labels
* procs: elapsed top 5
**/

let os_procs_stats_elapsed_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_stats_elapsed', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_stats']),
  {
    name: this.host+'.os_procs_stats_elapsed',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_stats_elapsed'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      // "options": {
      //   labels: ['Time'],
      // },
      "options": undefined,
      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_elapsed transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.push('pid['+data['pid']+']')
                  chart.top.pids.push(data['pid'])
                }

              })

              self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.push('pid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.length - 1)
            transform_value.fill(0)

            let _others_index = self.available_charts[self.host+'.os_procs_stats_elapsed'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['pid'])
              if(_index > -1){
                transform_value[_index] = data['elapsed']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['elapsed'] : transform_value[_others_index] + data['elapsed']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)

this.$set(this.available_charts[this.host+'.os_procs_stats_elapsed'].chart, 'options', os_procs_stats_elapsed_options)

//console.log('os_procs_stats_elapsed', this.available_charts[this.host+'.os_procs_stats_elapsed'])

this.set_chart_visibility(this.host+'.os_procs_stats_elapsed', true)

/**
* @end reactive chart.options.labels
* procs: elapsed top 5
**/

/**
* @start reactive chart.options.labels
* procs: time top 5
**/


let os_procs_stats_time_options = Object.merge(Object.clone(dygraph_line_chart.options), {
  labels: ['Time'],
})

this.$set(this.available_charts, this.host+'.os_procs_stats_time', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_stats']),
  {
    name: this.host+'.os_procs_stats_time',
    stat: {
      sources: [{type: 'stats', path: this.host+'_os_procs_stats_time'}],
    },
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      top: {
        count: 5,
        pids: []
      },

      // "options": {
      //   labels: ['Time'],
      // },
      "options": undefined,

      watch: {

        transform: function(values, caller, chart, cb){

          // //console.log('os_procs_stats_time transform', values)
          let transformed = []

          for(let index = 0; index < values.length; index++){
            // let transform_value = []
            let val = values[index]


            // let length = val.value.length
            // val.value.splice(
            //   (chart.top * -1) -1,
            //   length - chart.top
            // )
            //
            // self.$set(self.available_charts[self.host+'.os_procs_stats_time'].chart.options, 'labels', ['Time'])
            //
            if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
              Array.each(val.value, function(data, data_index){
                // //console.log('pre transformed: ', data)
                // if(index < chart.top)
                //   transform_value.push(data['pid']*1)

                if(chart.options.labels.length < chart.top.count){
                  // chart.options.labels[index + 1] = 'pid['+data.pid+']'
                  self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.push('pid['+data['pid']+']')
                  chart.top.pids.push(data['pid'])
                }

              })

              self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.push('pid[others]')
            }

            let transform_value = new Array(self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.length - 1)
            transform_value.fill(0)


            let _others_index = self.available_charts[self.host+'.os_procs_stats_time'].chart.options.labels.length - 2 //remember, first label is Time
            Array.each(val.value, function(data, data_index){
              let _index = chart.top.pids.indexOf(data['pid'])
              if(_index > -1){
                transform_value[_index] = data['time']
              }
              else{
                transform_value[_others_index] = (!transform_value[_others_index]) ? data['time'] : transform_value[_others_index] + data['time']
              }
            })

            if(!transform_value[_others_index])
              transform_value[_others_index] = 0

            let transform = {timestamp: val.timestamp, value: transform_value}

            transformed.push(transform)

            if(index == values.length -1){
              // //console.log('transformed: ', transformed)
              cb( transformed )
            }
          }
        }.bind(self)
      }
    })

  })
)

this.$set(this.available_charts[this.host+'.os_procs_stats_time'].chart, 'options', os_procs_stats_time_options)

//console.log('os_procs_stats_time', this.available_charts[this.host+'.os_procs_stats_time'])

this.set_chart_visibility(this.host+'.os_procs_stats_time', true)

/**
* @end reactive chart.options.labels
* procs: time top 5
**/

/**
* procs: kernel - user
**/
this.$set(this.reactive_data, 'os_procs_stats', [])
this.$options.unwatchers['os_procs_stats'] = this.$watch('$store.state.stats_sources.'+this.host+'_os_procs_stats_kernel', function(val, old){

  // let data = [{
  //   timestamp: val[0].timestamp,
  //   value: {
  //     kernel: (Object.keys(val[0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value,
  //     user: (Object.keys(this.$store.state.stats_sources[this.host+'_os_procs_stats_user'][0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value
  //   }
  // }]
  let data = [
    val[0].timestamp,
    (Object.keys(val[0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value,//kernel
    (Object.keys(this.$store.state.stats_sources[this.host+'_os_procs_stats_user'][0].value).length * 100) / this.$store.state.stats_sources[this.host+'_os_procs_stats_pids_count'][0].value//user
  ]

  this.$set(this.reactive_data['os_procs_stats'], 0, [data])
  // this.reactive_data['os_procs_stats'].push(data)

}.bind(this),{deep:true})

// //console.log('this.reactive_data.os_procs_stats', this.reactive_data.os_procs_stats)

this.$set(this.available_charts, this.host+'.os_procs_stats', Object.merge(
  Object.clone(this.$options.host_charts['os_procs_stats']),
  {
    tabular: true,//value watcher converts data to tabular
    chart: Object.merge(Object.clone(dygraph_line_chart),{
      pre_process: function(chart, name, stat){
        // //console.log('os_procs_stats pre_process', chart, name, stat)
        return chart
      },
      "options": {
        valueRange: [0, 100],
        labels: ['Time', 'kernel %', 'user %'],
      },
      // watch: {
      // }
    })

  })
)

this.$set(this.available_charts[this.host+'.os_procs_stats'].stat, 'data', this.reactive_data.os_procs_stats)

this.set_chart_visibility(this.host+'.os_procs_stats', true)

//console.log('os_procs_stats', this.available_charts[this.host+'.os_procs_stats'])

</script>
