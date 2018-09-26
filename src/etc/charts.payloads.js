'use strict'

export default {
  os_cpus_percentage: {
    name: 'os_cpus_percentage',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'cpus_percentage',
      key: 'os_cpus',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: false
    }
  },

  os_cpus_times: {
    name: 'os_cpus_times',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'cpus_times',
      key: 'os_cpus',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: false
    }
  },

  os_uptime: {
    name: 'os_uptime',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'uptime',
      key: 'os_uptime',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: false
    }
  },

  os_loadavg: {
    name: 'os_loadavg',
    chart: undefined,
    init: undefined,
    stop: undefined,
    //
    stat: {
      host: undefined,
      path: 'loadavg',
      key: 'os_loadavg',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: false
    }
  },

  os_blockdevices_stats: {
    name: 'os_blockdevices_stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'blockdevices_stats',
      key: 'os_blockdevices',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os.blockdevices',
      range: false
    }
  },

  os_mounts_percentage: {
    name: 'os_mounts_percentage_',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'mounts_percentage',
      key: 'os_mounts_',
      length: 300,
      tabular: true,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os.mounts',
      range: false
    }
  },

  os_freemem:{
    name: 'os_freemem',
    chart: undefined,
    init: undefined,
    stop: undefined,

    stat: {
      host: undefined,
      path: 'os',
      key: 'freemem',
      length: 300,
      range: undefined
    },
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: false
    }
  },

  os_networkInterfaces_stats: {
    name: 'os_networkInterfaces_stats',
    chart: undefined,
    init: undefined,
    stop: undefined,
    stat: {
      host: undefined,
      path: 'os',
      key: 'networkInterfaces',
      length: 300,
      range: undefined
    },
    watcher: undefined,
    /**
    * for __get_stat_for_chart
    **/
    pipeline: {
      name: 'input.os',
      path: 'os',
      range: true
    }
  }

}
