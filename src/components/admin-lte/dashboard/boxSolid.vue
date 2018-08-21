<template>
  <!-- solid sales graph -->
  <div class="box box-solid">
    <div class="box-header">
      <i class="fa fa-th"></i>

      <h3 class="box-title">{{title}}</h3>

      <div class="box-tools pull-right">
        <button type="button" class="btn bg-white btn-sm" data-widget="collapse"><i class="fa fa-minus"></i>
        </button>
        <button type="button" class="btn bg-white btn-sm" data-widget="remove"><i class="fa fa-times"></i>
        </button>
      </div>
    </div>
    <div class="box-body border-radius-none">
      <!-- <div class="chart" id="line-chart" style="height: 250px;"></div> -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-aqua">
          <span class="info-box-icon"><i class="fa fa-envelope-o"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Hosts</span>
            <span class="info-box-number">{{number_of_hosts}}</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-yellow">
          <span class="info-box-icon"><i class="fa fa-files-o"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">documents/sec</span>
            <span class="info-box-number">{{docs_per_sec}}</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
    </div>
    <!-- /.box-body -->

    <!-- <div class="box-footer no-border">
      <div class="row">
        <div class="col-xs-4 text-center" style="border-right: 1px solid #f4f4f4">
          <input type="text" class="knob" data-readonly="true" value="20" data-width="60" data-height="60"
                 data-fgColor="#39CCCC">

          <div class="knob-label">Mail-Orders</div>
        </div>


        <div class="col-xs-4 text-center" style="border-right: 1px solid #f4f4f4">
          <input type="text" class="knob" data-readonly="true" value="50" data-width="60" data-height="60"
                 data-fgColor="#39CCCC">

          <div class="knob-label">Online</div>
        </div>

        <div class="col-xs-4 text-center">
          <input type="text" class="knob" data-readonly="true" value="30" data-width="60" data-height="60"
                 data-fgColor="#39CCCC">

          <div class="knob-label">In-Store</div>
        </div>


      </div>


    </div> -->
    <!-- /.box-footer -->
  </div>
  <!-- /.box -->
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'admin-lte-box-solid',

  props: {
    docs_per_sec: {
      type: [Number],
       default: 0
    },
    number_of_hosts: {
      type: [Number],
       default: 0
    },
  },

  data () {
    return {
      title : '',
    }
  },

//   computed: Object.merge(
//     mapState({
//       docs_per_sec: state => state.app.docs_per_sec,
//       // modules_whitelist: state => state.hosts.modules_whitelist,
//       // reset: state => state.app.reset,
//       // // arrow functions can make the code very succinct!
//       // seconds: function(state){
//       //   // //////////console.log('seconds to splice', state.app.range)
//       //
//       //   let end = new Date().getTime()
//       //   if(state.app.range[1] != null)
//       //     end = state.app.range[1]
//       //
//       //   let seconds = Math.trunc( (end - state.app.range[0]) / 1000 )
//       //
//       //
//       //   return seconds
//       // },
//       number_of_hosts: state => state.hosts.all.length,
//       // currentHost: state => state.hosts.current,
//
//     })
//
//   ),
}

</script>
