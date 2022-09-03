import api from '~/services/api';

export default {
  state: {
    user: {
      id: null,
      name: null,
      token: undefined,
    }
  },
  mutations: {
    SINGIN_USER(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    async Signin(context, payload) {
      try {
        const { status, data } = await api.post('/auth/signin', {
          email: payload.email,
          password: payload.password
        });
        if (status != 200) return { data, signin: false };
        const user = {
          id: data.user._id,
          name: data.user.name,
          token: data.token,
        }
        context.commit('SINGIN_USER', user);
        return { data, signin: true }
      } catch (error) {
      }
    },
    async AutoSignin(context, payload) {
      if (!context.getters['getToken']) return { signin: false };
      try {
        const { status, data } = await api.get('/auth/autosignin', {
          headers: {
            Authorization: `Bearer ${context.getters['getToken']}dsadas`
          }
        });
        if (status != 200) return { signin: false };
        return { data, signin: true }
      } catch (error) {
        console.error(error);
      }
    },
    async CreateAccount(context, payload) {
      try {
        const { status, data } = await api.post('/user/register', {
          name: payload.name,
          email: payload.email,
          password: payload.password
        });
        if (status != 201) return { ...data, signup: false };

        const user = {
          id: data.user._id,
          name: data.user.name,
          token: data.token,
        }
        context.commit('SINGIN_USER', user);

        return { ...data, signup: true }
      } catch (error) {
        console.error(error);
      }
    }
  },
  getters: {
    getName: (state) => state.user.name,
    getId: (state) => state.user.id,
    getToken: (state) => state.user.token,
  }
}