import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

import modules from "./module";

export default createStore({
  modules,
  plugins: [createPersistedState()]
});
