<template>
  <!-- Main content -->
  <section class="content" v-if="!$route.params.host">
    <div class="row">
      <section class="col-lg-12 connectedSortable">
        <admin-lte-box-solid/>
      </section>
    </div>

  </section>
  <router-view v-else></router-view>


</template>

<style>
</style>

<script>


import AdminLteBoxSolid from 'components/admin-lte/dashboard/boxSolid'

export default {
  name: 'Dashboard',

  components: {
    AdminLteBoxSolid
  },


}
</script>
