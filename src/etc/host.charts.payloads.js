'use strict'

/**
* use stat.path on rethinkdb (faster), does a range call for each
* on couchdb grouping all (seting stat.path = undefined) is faster
*/
// export default {
let __payloads = {
  /**
  * @test - merged stats
  */
  'merged':{
    name: 'merged',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: true,
      sources: [{type: 'tabulars', path:'.os.cpus.times'}, {type: 'tabulars', path: '.os.uptime'}],
      // sources: [{type: 'tabulars', path:'.os.cpus.times'}, {type: 'tabulars', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: 'os.cpus',
        tabular: true,
      },
      {
        host: undefined,
        path: 'os.uptime',
        tabular: true,
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      // range: true
    }
  },
  'os.cpus.percentage': {
    name: 'os.cpus.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os.cpus.percentage'}],
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      // range: true
    }
  },

  'os.cpus.times': {
    name: 'os.cpus.times',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os.cpus.times'}],
      events: [{
        host: undefined,
        path: 'os.cpus',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      // range: true
    }
  },

  'os.uptime': {
    name: 'os.uptime',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os.uptime'}],

      events: [{
        host: undefined,
        path: 'os.uptime',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os.loadavg': {
    name: 'os.loadavg',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path: '.os.loadavg'}],
      events: [{
        host: undefined,
        path: 'os.loadavg',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs.count.pids': {
    name: 'os_procs.count.pids',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os_procs.count.pids'}],

      events: [{
        host: undefined,
        path: 'os_procs',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs.count.cmd': {
    name: 'os_procs.count.cmd',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os_procs.count.cmd'}],

      events: [{
        host: undefined,
        path: 'os_procs',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs.count.uids': {
    name: 'os_procs.count.uids',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'tabulars', path:'.os_procs.count.uids'}],

      events: [{
        host: undefined,
        path: 'os_procs',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_procs.uids':{
    name: 'os_procs.uids',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: false,//this is for component, if not set is "chart-tabular"
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'stats', path: '.os_procs.uids'}],
      events: [{
        host: undefined,
        path: 'os_procs',
        // key: 'cpus',
        // length: 300,
        tabular: false,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },
  'os_blockdevices.stats': {
    name: 'os_blockdevices.stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_blockdevices',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.blockdevices',
      range: true
    }
  },

  'os_mounts.percentage': {
    name: 'os_mounts.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_mounts',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.mounts',
      range: true
    }
  },

  'os.freemem':{
    name: 'os.freemem',
    chart: undefined,
    init: undefined,
    stop: undefined,
    tabular: false,//this is for component, if not set is "chart-tabular"
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      sources: [{type: 'stats', path: '.os.freemem'}],
      events: [{
        host: undefined,
        path: 'os.freemem',
        // key: 'cpus',
        // length: 300,
        tabular: false,
        // range: undefined
      }]
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os',
      range: true
    }
  },

  'os_networkInterfaces_stats.properties': {
    name: 'os_networkInterfaces_stats.properties',
    chart: undefined,
    init: undefined,
    stop: undefined,
    wrapper: {
      type: 'dygraph',
      props: {}
    },
    stat: {
      merged: false,
      events: [{
        host: undefined,
        path: 'os_networkInterfaces_stats',
        // key: 'cpus',
        // length: 300,
        tabular: true,
        // range: undefined
      }]
    },
    // watcher: undefined,
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      // // path: 'os.networkInterfaces_stats',
      // range: true
    }
  }

}

export default function(payload){
  console.log('host_charts_payloads func', payload)
  let {host, seconds, range} = payload
  let payloads = Object.clone(__payloads)
  Object.each(payloads, function(chart, key){
    chart.name = host+'.'+chart.name
    chart.stat.range = range || chart.stat.range
    chart.stat.length = seconds || chart.stat.length

    if(chart.stat.events && !Array.isArray(chart.stat.events))
      chart.stat.events = [chart.stat.events]

    if(chart.stat.events)
      Array.each(chart.stat.events, function(event){
        event.host = host
        // event.length = seconds || event.length
        // event.range = range || event.range
      })

    if(chart.stat.sources && !Array.isArray(chart.stat.sources))
      chart.stat.sources = [chart.stat.sources]

    if(chart.stat.sources)
      Array.each(chart.stat.sources, function(source){
        source.path = host+source.path
      })



  })
  return payloads
}
