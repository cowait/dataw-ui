<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  created() {
    console.log('process.env.VUE_APP_PATH', process)
  }
}
</script>

<style>
</style>
