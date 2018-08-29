import DefaultDygraphLine from './js/default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine),{
  // name: 'os.cpus_times',
  // name: function(vm, chart, stats){
  //   return vm.host+'_os_cpus_times'
  // },
  match: /^cpus/,
  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: {timestamp: 0, value: { times: {} } },
  watch: {
    merge: true,
    value: 'times',
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart){
      // console.log('transform: ', values, Object.clone(chart))

      let transformed = []
      // let prev = null

      Array.each(values, function(val, index){

        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp < val.timestamp - 1100
          || chart.prev.timestamp > val.timestamp + 1100
        ){
          // let transform = {timestamp: val.timestamp, value: { times: {} } }

          chart.prev.timestamp = val.timestamp
          Object.each(val.value.times, function(stat, key){
            if(key == 'idle'){
              chart.prev.value.times[key] = stat - 1
            }
            else{
              chart.prev.value.times[key] = stat
            }

            // transform.value.times[key] = 0
          })

          // transformed.push(transform)

          // console.log('chart.prev.timestamp', chart.prev)

        }
        else{
          let transform = {timestamp: val.timestamp, value: { times: {} } }
          let prev = Object.clone(chart.prev)
          Object.each(val.value.times, function(stat, key){

            if(key == 'idle'){//represent idle on the negative sideof axes
              stat = stat * -1
              let value = ((stat + prev.value.times[key]) < 0) ? stat + prev.value.times[key] : 0
              transform.value.times[key] = value
            }
            else{
              let value = ((stat - prev.value.times[key]) > 0) ? stat - prev.value.times[key] : 0
              transform.value.times[key] = value
            }
          })


          if(transform.timestamp > chart.prev.timestamp)
            transformed.push(transform)

          val.value.times.idel = val.value.times.idel * -1
          chart.prev = Object.clone(val)

        }


      })
      return transformed
    }
  }

})
