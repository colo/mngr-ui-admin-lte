<script>

let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

export default {

  unwatchers: {},

  dynamic_blacklist: null, //regexp
  dynamic_whitelist: null, //regexp

  static_charts: null,
  dynamic_charts: null,

  data () {
    return {


    }
  },

  methods: {
    /**
    * @param stat = stat data to parse
    * @param name = chart name
    */
    parse_chart_from_stat (stat, name){
      // console.log('parse_chart_from_stat', name)


      if(Array.isArray(stat)){//it's stat
        /**
        * create chart automatically if it's not blacklisted or is whitelisted
        **/
        if(
          (
            ( this.$options.dynamic_blacklist
            && this.$options.dynamic_blacklist.test(name) == false )
          || ( this.$options.dynamic_whitelist
            && this.$options.dynamic_whitelist.test(name) == true )
          )
          && (
            !this.$options.static_charts
            || Object.keys(this.$options.static_charts).contains(name) == false
          )
        ){

          let dynamic_charts = this._get_dynamic_charts(name, this.$options.dynamic_charts)

          if(dynamic_charts[name]){

            Array.each(dynamic_charts[name], function(dynamic){

              this.process_dynamic_chart(Object.clone(dynamic), name, stat)

            }.bind(this))
          }
          else{

            let chart = Object.clone(this.$options.DefaultChart)

            this.process_chart(
              chart.pre_process(chart, name, stat),
              name,
              stat
            )

          }

        }
      }
      else{//blockdevices.[key]
        // console.log('...parse_chart_from_stat', Object.clone(stat))
        Object.each(stat, function(data, key){
          // console.log('gonna parse_chart_from_stat', name+'.'+key)

          this.parse_chart_from_stat(data, name+'.'+key)
        }.bind(this))

      }


    },
    /**
    * chart attributes
    **/
    process_chart_label (chart, name, stat) {
      if(chart.labeling && typeOf(chart.labeling) == 'function'){

        return chart.labeling(this, chart, name, stat)
      }
      else if(chart.label){
        return chart.label
      }
      else{
        return this.process_chart_name(chart, stat)
      }
    },
    process_chart_name (chart, stat){
      if(chart.name && typeOf(chart.name) == 'function') return chart.name(this, chart, stat)
      else if(chart.name) return chart.name
    },
    process_dynamic_chart (chart, name, stat){

      if(Array.isArray(stat[0].value)){//like 'cpus'

        Array.each(stat[0].value, function(val, index){

          let arr_chart = Object.clone(chart)

          arr_chart.label = this.process_chart_label(chart, name, stat) || name
          let chart_name = this.process_chart_name(chart, stat) || name

          if(chart.watch.merge != true){
            chart_name += '_'+index
          }

          if(chart.watch.merge != true || index == 0){//merge creates only once instance

            this.process_chart(
              arr_chart.pre_process(arr_chart, chart_name, stat),
              chart_name,
              stat
            )

          }

        }.bind(this))

      }
      else if(isNaN(stat[0].value)){
        //sdX.stats.

        let filtered = false
        if(chart.watch && chart.watch.filters){
          Array.each(chart.watch.filters, function(filter){
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if(
              stat[0].value[prop_to_filter]
              && value_to_filter.test(stat[0].value[prop_to_filter]) == true
            ){
              filtered = true
            }

          })
        }
        else{
          filtered = true
        }

        if(filtered == true){

          chart = chart.pre_process(chart, name, stat)

          chart.label = this.process_chart_label(chart, name, stat) || name
          let chart_name = this.process_chart_name(chart, stat) || name

          this.process_chart(chart, chart_name, stat)
        }

      }
      else{

        chart.label = this.process_chart_label(chart, name, stat) || name
        let chart_name = this.process_chart_name(chart, stat) || name

        this.process_chart(
          chart.pre_process(chart, chart_name, stat),
          name,
          stat
        )
      }

    },
    /**
    * commmon for generics or dynamics charts
    */
    process_chart (chart, name, stat){
      this._process_chart(chart, name)
    },
    _process_chart (chart, name, stat){

      if(chart.init && typeOf(chart.init) == 'function')
        chart.init(this, chart, name, stat, 'chart')

      this.create_watcher(name, chart)

    },
    /**
    * creates watchers for charts
    **/
    create_watcher(name, chart){
      this._create_watcher('', name, chart)
    },
    _create_watcher(path, name, chart){
      let watcher = chart.watch || {}
      path = path || ''

      watcher = watcher || {}
      watcher.value = watcher.value || ''
      watcher.transform = watcher.transform || ''

      // let watch_name = name
      // if(watch_name.indexOf('_') > 0 )//removes indixes, ex: cpu.0
      //   watch_name = watch_name.substring(0, watch_name.indexOf('_'))

      if(this.$options.unwatchers[path+name]){
        this.$options.unwatchers[path+name]()
        delete this.$options.unwatchers[path+name]
      }

      // let found_watcher = false
      //
      // if(Array.isArray(this._watchers)){
      //   Array.each(this._watchers, function(watcher){
      //     // console.log('watcher.expression', watcher.expression)
      //     if(watcher.expression == path && watcher.user == true)//means user already added a watcher for this chart
      //       found_watcher = true
      //       // console.log('watcher.expression', watcher.expression)
      //   })
      // }

      // if(found_watcher == false){

        let generic_data_watcher = function(current){
          console.log('generic_data_watcher')
          this.generic_data_watcher(current, chart, name, this.update_chart_stat.bind(this))
        }

        console.log('gonna watch...', name, path)
        // this.$options.unwatchers[path+name] = this.$watch(path+watch_name, generic_data_watcher)
        this.$options.unwatchers[path+name] = this.$watch(path, generic_data_watcher)

      // }
    },

    generic_data_watcher: data_to_tabular,
    /**
    * update chart data
    **/
    update_chart_stat (name, data){

    },
    /**
    * chart attributes
    **/
    // process_chart_label (chart, name, stat) {
    //   if(chart.labeling && typeOf(chart.labeling) == 'function'){
    //
    //     return chart.labeling(this, chart, name, stat)
    //   }
    //   else if(chart.label){
    //     return chart.label
    //   }
    //   else{
    //     return this.process_chart_name(chart, stat)
    //   }
    // },
    // process_chart_name (chart, stat){
    //   if(chart.name && typeOf(chart.name) == 'function') return chart.name(this, chart, stat)
    //   else if(chart.name) return chart.name
    // },
    /**
    * trasnform "current" to chart.data
    **/
    // _current_nested_array: nested_array_to_tabular,
    // _current_number_to_data: number_to_tabular,
    // _current_array_to_data: array_to_tabular,

  }
}
</script>
