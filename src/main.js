import { createApp } from 'vue'
import './styles.scss';
import App from './App.vue'

import router from './routes'
import store from './store';

createApp(App).use(router).use(store).mount('#app')
