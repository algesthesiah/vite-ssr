import About from 'pages/About'
import Router from './ssr-router'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { label: '404', component: NotFound },
  ],
})
