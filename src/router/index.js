import Vue from 'vue'
import Router from 'vue-router'
import start from '@/components/start'
import editor from '@/components/editor'
import ccsl from '@/components/CCSL'
import log from '@/components/log'
import labdata from '@/components/labdata'
import t from '@/components/test'
import blog from '@/components/blog'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: start
    },
    {
      path: '/editor',
      name: 'editor',
      component: editor,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ccsl',
      name: 'ccsl',
      component: ccsl,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/log',
      name: 'log',
      component: log
    },
    {
      path: '/labdata',
      name: 'labdata',
      component: labdata,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/t',
      name: 't',
      component: t
    },
    {
      path: '/blog',
      name: 'blog',
      component: blog,
      meta: {
        keepAlive: true
      }
    }
  ]
})
