import api from '~/services/api';

export default {
  actions: {
    async EnterRoom(context, payload) {
      try {
        const { status, data } = await api.get(`/room/list/${payload.code}`);
        if (status != 200) return { ...data, enterRoom: false };
        return { ...data, enterRoom: true }
      } catch (error) {
        console.error(error);
      }
    },
    async CreateRoom(context, payload) {
      try {
        const { status, data } = await api.post('/room/create', payload);
        if (status != 201) return { ...data, createRoom: false };
        return { ...data, createRoom: true }
      } catch (error) {
        console.error(error);
      }
    },
    async GetRoom(context, payload) {
      try {
        const { status, data } = await api.get(`/question/room/${payload.code}`);
        if (status != 200) return { ...data, getRoom: false };
        return { ...data, getRoom: true }
      } catch (error) {
        console.error(error);
      }
    },
    async GetMyRoom(context, payload) {
      try {
        const { status, data } = await api.get(`/room/my/${payload.code}`);
        if (status != 200) return { ...data, status, getMyRoom: false };
        return { ...data, getMyRoom: true }
      } catch (error) {
        console.error(error);
      }
    },
    async AddQuestion(context, payload) {
      try {
        const { status, data } = await api.post(`/question/create`, {
          room: payload.room,
          question: payload.question,
        });
        if (status != 201) return { ...data, addQuestion: false };
        return { ...data, addQuestion: true }
      } catch (error) {
        console.error(error);
      }
    },
    async LikeQuestion(context, payload) {
      try {
        const { status, data } = await api.patch(`/question/like/${payload.question}`);
        if (status != 200) return { ...data, likeQuestion: false };
        return { ...data, likeQuestion: true }
      } catch (error) {
        console.error(error);
      }
    },
    async AnswerQuestion(context, payload) {
      try {
        const { status, data } = await api.patch(`/question/focused/${payload.question}`, {
          focused: payload.focused,
        });
        if (status != 200) return { ...data, focosedQuestion: false };
        return { ...data, focosedQuestion: true }
      } catch (error) {
        console.error(error);
      }
    },
    async AnsweredQuestion(context, payload) {
      try {
        const { status, data } = await api.patch(`/question/answered/${payload.question}`);
        if (status != 200) return { ...data, answeredQuestion: false };
        return { ...data, answeredQuestion: true }
      } catch (error) {
        console.error(error);
      }
    },
    async CloseRoom(context, payload) {
      try {
        const { status, data } = await api.patch(`/room/update/${payload.room}`, {
          title: payload.title,
          opened: payload.open,
        });
        if (status != 200) return { ...data, closeRoom: false };
        return { ...data, closeRoom: true }
      } catch (error) {
        console.error(error);
      }
    }
  },
}