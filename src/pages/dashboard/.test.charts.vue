<script>
/**
* remove for testing
**/


/**
* pie
**/
// this.available_charts[this.host+'_os_freemem_pie'] = {
//   name: this.host+'_os_freemem_pie',
//   chart: Object.merge(Object.clone(pie_chart), {
//     totalmem: this.os_stats.totalmem.value.data,
//     watch: {
//       /**
//       * @trasnform: diff between each value against its prev one
//       */
//       transform: function(values, caller, chart){
//         let last = values[values.length - 1]
//         last.value = last.value * 100 / chart.totalmem
//         // //////////////console.log('_os_freemem_pie transform', values, chart.totalmem, last)
//         return values
//       }
//     },
//     options:{
//       // 'track-color': false,
//       size: 80,
//       // animated: false,
//       'font-size': '14px',
//       "bar-color": function(percentage){
//         if(percentage > 0 && percentage < 33){
//           return '#ff704d'
//         }
//         else if(percentage > 33 && percentage < 66){
//           return '#f6d95b'
//         }
//         else{
//           return '#86b300'
//         }
//       }
//     }
//   }),
//   init: this.__get_stat_for_chart.bind(this),
//   stop: function(payload){
//     // //this.$store.dispatch('stats/flush', payload.stat)
//   }.bind(this),
//   stat: {
//     host: this.host,
//     path: 'os',
//     key: 'freemem',
//     length: 1,
//     // tabular:true
//     // range: [Date.now() - this.seconds * 1000, Date.now()]
//   },
//   pipeline: {
//     name: 'input.os',
//     path: 'os',
//     range: true
//   }
// }

/**
* knob
*/
// this.available_charts[this.host+'_os_freemem_knob'] = {
//   name: this.host+'_os_freemem_knob',
//   chart: Object.merge(Object.clone(jqueryKnob), {
//     totalmem: this.os_stats.totalmem.value.data,
//     watch: {
//       /**
//       * @trasnform: diff between each value against its prev one
//       */
//       transform: function(values, caller, chart){
//         let last = values[values.length - 1]
//         last.value = last.value * 100 / chart.totalmem
//         // //////////////console.log('_os_freemem_knob transform', values, chart.totalmem, last)
//         return values
//       }
//     },
//     options:{
//       readOnly: true,
//       displayPrevious: true,
//       thickness: 0.1,
//       width: 80,
//       skin: 'tron',
//       // bgColor: 'black',
//       fgColor: function(percentage){
//         if(percentage > 0 && percentage < 33){
//           return '#ff704d'
//         }
//         else if(percentage > 33 && percentage < 66){
//           return '#f6d95b'
//         }
//         else{
//           return '#86b300'
//         }
//       },
//       inputColor: function(percentage){
//         if(percentage > 0 && percentage < 33){
//           return '#ff704d'
//         }
//         else if(percentage > 33 && percentage < 66){
//           return '#f6d95b'
//         }
//         else{
//           return '#86b300'
//         }
//       }
//     }
//   }),
//   init: this.__get_stat_for_chart.bind(this),
//   stop: function(payload){
//     // //this.$store.dispatch('stats/flush', payload.stat)
//   }.bind(this),
//   stat: {
//     host: this.host,
//     path: 'os',
//     key: 'freemem',
//     length: 1,
//     // tabular:true
//     // range: [Date.now() - this.seconds * 1000, Date.now()]
//   },
//   pipeline: {
//     name: 'input.os',
//     path: 'os',
//     range: true
//   }
// }


/**
* remove for testing
**/
</script>
