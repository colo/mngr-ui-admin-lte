import DefaultDygraphLine from './js/default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine),{
    // name: 'os.cpus_times',
    name: function(vm, chart, stats){
      return vm.host+'_os.cpus_times'
    },
    match: /^cpus/,
    watch: {
      merge: true,
      value: 'times',
      /**
      * @trasnform: diff between each value against its prev one
      */
      transform: function(values){
        // //////console.log('transform: ', values)
        let transformed = []
        let prev = null
        Array.each(values, function(val, index){
          let transform = {timestamp: val.timestamp, value: { times: {} } }
          if(index == 0){
            Object.each(val.value.times, function(stat, key){
                transform.value.times[key] = 0
            })
          }
          else{
            Object.each(val.value.times, function(stat, key){
              if(key == 'idle'){//represent idle on the negative sideof axes
                stat = 0 - stat
                let value = ((stat + prev.value.times[key]) < 0) ? stat + prev.value.times[key] : 0
                transform.value.times[key] = value
              }
              else{
                let value = ((stat - prev.value.times[key]) > 0) ? stat - prev.value.times[key] : 0
                transform.value.times[key] = value
              }
            })
          }
          prev = val
          transformed.push(transform)
        })
        return transformed
      }
    }

  })
  
