import { createRouter, createWebHistory } from 'vue-router'
import jwt from 'jwt-decode'
import store from '~/store';

import routes from '~/views/routes.js'

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to) => {
  document.title = `${to.meta.title} - ask-me`;
});

router.beforeEach((to, from, next) => {
  const token = store.getters.getToken;
  if (to.matched.some(record => record.meta.authenticated)) {
    if (!token) return next({ name: 'signin' });
    try {
      const decode = jwt(token);
      const now = Math.round(Date.now() / 1000);
      if (decode.exp > now) {
        next();
      } else {
        window.localStorage.clear();
        return next({ name: 'signin' });
      }
    } catch (error) {
      console.error(error);
      window.localStorage.clear();
      return next({ name: 'signin' });
    }
  } else {
    return next();
  }
});

export default router