'use strict'

export default {
  'os.cpus.percentage': {
    name: 'os.cpus.percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      // path: 'os.cpus',
      // key: 'cpus',
      // length: 300,
      tabular: true,
      // range: undefined
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
    stat: {
      host: undefined,
      // path: 'os.cpus',
      // key: 'cpus',
      // length: 300,
      tabular: true,
      // range: undefined
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
    stat: {
      host: undefined,
      // path: 'os.uptime',
      // key: 'uptime',
      // length: 300,
      tabular: true,
      // range: undefined
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
    //
    stat: {
      host: undefined,
      // path: 'os.loadavg',
      // key: 'loadavg',
      // length: 300,
      tabular: true,
      // range: undefined
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
    stat: {
      host: undefined,
      // path: 'os_blockdevices',
      // key: '',
      // length: 300,
      tabular: true,
      range: undefined
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
    stat: {
      host: undefined,
      // path: 'os_mounts',
      // key: '',
      // length: 300,
      tabular: true,
      // range: undefined
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

    stat: {
      host: undefined,
      path: 'os.freemem',
      // key: 'freemem',
      // length: 300,
      // range: undefined,
      tabular: false
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

  'os_networkInterfaces_stats.properties': {
    name: 'os_networkInterfaces_stats.properties',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      // path: 'os_networkInterfaces_stats',
      // key: '',
      // length: 300,
      tabular: true,
      // range: undefined
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
