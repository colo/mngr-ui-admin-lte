
<script>

import statStore from 'src/store/stat'

export default {

  components: {
  },

  __stat_unwatcher: undefined,
  root: undefined,
  path: undefined,
  key: undefined,

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    stat: {
      type: [Object],
      default: () => ({
        range: [],
        length: 1,
        data: {}
      })
    },
    // type:{
    //   type: [String],
    //   default: 'dygraph'
    // },
    id:{
      type: [String],
      default: ''
    },
    // wrapper_props: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // merged: {
    //   type: [Boolean],
    //   default: false
    // }
  },

  data () {
    return {
      stat_lastupdate: 0,
      stat_data: []
    }

  },
  created () {
    // console.log('stat.vue id', this.id, this.$options.type, this.stat.range)
    this.$options.root = this.id.split('.')[0]
    this.$options.path = this.id.split('.')[1]
    this.$options.key = this.id.split('.')[2]

    this.$options.__stat_unwatcher = this.$watch('stat.data', function(val, old){
      console.log('stat.vue $watch', val)

      if(val && val.length > 0 && !this.$store.state[this.$options.type][this.id]){
        console.log('registerModule stat', this.$options.type, this.id)
        this.$store.registerModule([this.$options.type, this.id], Object.clone(statStore))
        this.$store.commit(this.$options.type+'/'+this.id+'/set_id', this.id)
        this.$store.commit(this.$options.type+'/'+this.id+'/set_type', this.$options.type)
      }
      else if(val && val.length > 0){
        this.__add_stats(val)
      }

    },{deep: true})
  },

  destroyed (){
    this.$off()
  },
  methods: {
    __add_stats(stat){

      let data = {}
      if(this.$options.type == 'tabular'){
        if(Array.isArray(stat[0])){//array of array, range data
          let result = []
          Array.each(stat, function(value) {

            result.push({
              timestamp: value[0],
              value: value
            })


          }.bind(this))

          // result.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

          //////////console.log('process_os_tabular', path, key, result)
          data = {
            tabular:true,
            root: this.$options.root,
            path: this.$options.path,
            key: this.$options.key,
            data: result
          }


        }
        else{
          data = {
            tabular:true,
            root: this.$options.root,
            path: this.$options.path,
            key: this.$options.key,
            data: {
              timestamp: stat[0],
              value: stat
            }
          }
        }
      }
      else{
        data = {
          tabular: false,
          root: this.$options.root,
          path: this.$options.path,
          key: this.$options.key,
          data: stat
        }
      }

      ////console.log('__add_os_doc_stats', paths)
      // Object.each(paths, function(keys, path){
        ////console.log('__add_os_doc_stats PATH', path)

        // Object.each(keys, function(data, key){
          ////console.log('__add_os_doc_stats KEY', key, data)


          // if(this.check_active_stat(stat) == true)
      this.$store.dispatch(this.$options.type+'/'+this.id+'/add', data)
      this.stat_data.push( data.data )
      this.stat_lastupdate = Date.now()
      console.log('stat.vue __add_stats', this.id, data.data, this.stat.range)


      //   }.bind(this))
      //
      // }.bind(this))
    },
    // get: function(payload, cb){
    //   ////console.log('__get_stat', payload)
    //   if(payload.tabular == true){
    //     this.$store.dispatch('stats_tabular/get', payload).then((docs) => cb(docs))
    //   }
    //   else{
    //     this.$store.dispatch('stats/get', payload).then((docs) => cb(docs))
    //   }
    // },
  }
}
</script>
