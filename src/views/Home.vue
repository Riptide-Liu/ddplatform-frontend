<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "HomePage",
  computed: {
  },
  data() {
    return {
      show_menu: false,
      drag_pos: {x: 0, y: 0}
    }
  },
  methods: {
    test() {
      this.$request({
        url: '/user/login',
        method: 'post',
        headers: {
          isToken: false
        },
        data: {"userName":'lhd',"password":1234}
      }).then(
          resp => {
            if(resp.code === 200)
              console.log(111111)
          }
      )
    }
  },
  mounted() {

  },
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
  padding: 0;
}

.content {
  min-width: 1440px;
  padding: 0;
  background: #f2f2f2;
  /* - Header + border */
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

.content > div {
  /*width: fit-content;*/
  margin-left: auto;
  margin-right: auto;
}
</style>
