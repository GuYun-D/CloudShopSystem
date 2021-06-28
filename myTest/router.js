import VueRouter from "vue-router";
import Vue from "vue";
Vue.use(VueRouter)

export default  router = new VueRouter({
  scrollBehavior: () => ({y: 0}),
  routes: {
    path: '/',
    component: Home
  }
})