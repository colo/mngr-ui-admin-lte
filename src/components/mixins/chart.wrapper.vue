<script>



export default {

  graph: undefined,
  freezed: false,

  __unwatcher: undefined,
  visible: true,

  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    id: {
      type: [String],
      default: () => ('')
    },
    chart: {
      type: [Object],
      // default: () => ({})
    },
    data: {
      type: [Array],
      default: () => ([])
    },
    freezed: {
      type: [Boolean],
      default: () => (false)
    },
    // visible: {
    //   type: [Boolean],
    //   default: () => (true)
    // },
  },
  data () {
    return {
      container_class_helper: '',
      highlighted: false,
      ready: false,
    }
  },

  mounted () {
    this.create()
  },
  // updated () {
  //   this.create()
  // },
  destroyed (){
    this.destroy()
    // if(this.$options.graph && typeof this.$options.graph.destroy == 'function'){
    //   // //////////console.log('destroying ...', this.id)
    //   this.$options.graph.destroy()
    //
    // }
    //
    // this.$options.graph = undefined
    this.$off()
  },
  methods: {

    /**
    * UI related
    **/
    reset: function(){
      ////console.log('dygraph reset')
      this.destroy()
      this.create()
    },
    destroy: function(){

    },
    create (){

    },
    get_data: function(data){
      data = data || Array.clone(this.data)
      return data
    },
    update (data){
      data = this.get_data(data)
    },

  }
}
</script>
