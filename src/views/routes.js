
export default [
  {
    path: "/",
    name: "",
    meta: {
      title: "",
    },
    redirect: '/room'
  },
  {
    path: "/signin",
    name: "signin",
    meta: {
      title: "entrar",
    },
    component: () => import(/* webpackChunkName: "auth" */ './pages/Signin.vue'),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: "criar conta",
    },
    component: () => import(/* webpackChunkName: "auth" */ './pages/CreateAccount.vue')
  },
  {
    path: '/room',
    children: [
      {
        path: "",
        name: "room.select",
        meta: {
          title: "welcome",
        },
        component: () => import(/* webpackChunkName: "room" */ './pages/EnterRoom.vue'),
      },
      {
        path: "my/:_room",
        name: "room.my-room",
        meta: {
          title: "sala",
        },
        component: () => import(/* webpackChunkName: "room" */ './pages/MyRoom.vue'),
      },
      {
        path: ":_room",
        name: "room",
        meta: {
          title: "sala",
        },
        component: () => import(/* webpackChunkName: "room" */ './pages/Room.vue'),
      },
      {
        path: "create",
        name: "room.create",
        meta: {
          authenticated: true,
          title: "criar sala",
        },
        component: () => import(/* webpackChunkName: "room" */ './pages/CreateRoom.vue'),
      },
    ],
  },
  { path: "/:catchAll(.*)", redirect: '/signin' }


];
