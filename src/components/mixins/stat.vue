
<script>

import statStore from 'src/store/stat'

// import Deque from 'double-ended-queue'

export default {

  components: {
  },

  // __deque: undefined,
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
        merged: false,
        data: []
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
    const DATA_LENGTH = this.stat.data.length
    this.$options.root = this.id.split('.')[0]
    this.$options.path = this.id.split('.')[1]
    this.$options.key = this.id.split('.')[2]

    console.log('stat.vue id', this.id, this.$options.type, this.stat.data.length)

    this.$store.registerModule([this.$options.type, this.id], Object.clone(statStore))
    this.$store.commit(this.$options.type+'/'+this.id+'/set_id', this.id)
    this.$store.commit(this.$options.type+'/'+this.id+'/set_type', this.$options.type)

    this.$store.dispatch(this.$options.type+'/'+this.id+'/get', {
      root: this.$options.root,
      path: this.$options.path,
      key: this.$options.key,
      length: 300
    }).then((docs) => {
      if(docs.length > 0){
        console.log('stats/get', docs)
        let stats = []
        Array.each(docs, function(doc){
          let stat = {
           timestamp: doc.data[0],
           value: doc.data
          }
          stats.push(stat)
        })

        console.log('stats/get 2', stats)
        this.$set(this, 'stat_data', stats)
        this.stat_lastupdate = Date.now()
      }
    })


    if(this.stat.merged == true){
      // this.$options.deque = new Deque(this.stat.data.length * 1)
      //
      // console.log('stat.vue id', this.id, this.$options.type, this.stat.range, this.$options.deque, this.$options.deque.length, QUEUE_SIZE)
      this.$options.__stat_unwatcher = this.$watch('stat.data.0', function(val, old){
        if(val && val.length > 0){

          if(!Array.isArray(val[0])){//array of array, range data
            val = [val]
          }

          let columns = []
          for(let i = 1; i < DATA_LENGTH; i++){//ommit timestamp
            columns.push(this.stat.data[i])
          }

          Array.each(val, function(row, index){
            Array.each(columns, function(column, col_index){
              if(Array.isArray(column[0])){//array of array, range data
                val[index] = this._merge_tabular_data(row, column[index])//match columns/rows
              }
              else{
                val[index] = this._merge_tabular_data(row, column)//fill always with same val
              }
            }.bind(this))

          }.bind(this))

          console.log('__stat_unwatcher merged ', val)
          // this.__stat_data_watcher(val)
          this.__add_stats(val)
        }
      },{deep: true})
    }
    else{
      this.$options.__stat_unwatcher = this.$watch('stat.data', function(val, old){
        // console.log('__stat_unwatcher ', val)
        // this.__stat_data_watcher(val)
        if(val && val.length > 0){
          this.__add_stats(val)
        }
      },{deep: true})
    }


  },

  destroyed (){
    this.$off()
  },
  methods: {
    // __stat_data_watcher: function(val){
    //   if(val && val.length > 0 && !this.$store.state[this.$options.type][this.id]){
    //     console.log('registerModule stat', this.$options.type, this.id)
    //     this.$store.registerModule([this.$options.type, this.id], Object.clone(statStore))
    //     this.$store.commit(this.$options.type+'/'+this.id+'/set_id', this.id)
    //     this.$store.commit(this.$options.type+'/'+this.id+'/set_type', this.$options.type)
    //   }
    //   else if(val && val.length > 0){
    //     this.__add_stats(val)
    //   }
    // },
    _merge_tabular_data: function(a, b){

      let merged = Array.clone(a)
      if(!b){
        merged.push(undefined)
      }
      else{
        for(let i = 1; i < b.length; i++){//ommit timestamp
            merged.push(b[i])
        }
      }
      return merged
    },
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
