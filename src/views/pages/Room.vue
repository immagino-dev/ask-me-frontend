<script setup>
	import { onMounted, reactive, ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';

	import useSocket from '~/hooks/useSocket';

	import QuestionVue from '~/components/Question.vue';
	import ButtonVue from '~/components/Button.vue';
	import RoomCodeVue from '~/components/RoomCode.vue';

	import logoImg from '~/assets/logo.svg';

	import Button from '~/components/Button.vue';

	const store = useStore();
	const route = useRoute();
	const router = useRouter();
	const socket = useSocket(route.params._room);

	const state = ref({
		room: {
			questions: [],
		},
		feedback: '',
		loading: false,
	});

	const payload = ref({
		question: '',
		feedback: {
			sendQuestion: '',
			sendLike: '',
		},
	});

	const onSubmit = async () => {
		const question = await store.dispatch('AddQuestion', {
			room: state.value.room._id,
			question: payload.value.question,
		});
		if (question.addQuestion) {
			payload.value.question = '';
			payload.value.feedback.sendQuestion = 'pergunta enviada com sucesso!';
			setInterval(() => {
				payload.value.feedback.sendQuestion = '';
			}, 3000);
		} else {
			payload.value.feedback.sendQuestion = question.error;
		}
	};

	const onLike = async (_id) => {
		const question = await store.dispatch('LikeQuestion', {
			question: _id,
		});
		if (question.likeQuestion) {
			payload.value.feedback.sendLike = 'pergunta curtida com sucesso!';
			setInterval(() => {
				payload.value.feedback.sendLike = '';
			}, 3000);
		} else {
			payload.value.feedback.sendLike = question.error;
		}
	};

	const exitRoom = async () => {
		router.push({ name: 'room.select' });
	};

	socket.on('question', (room) => {
		state.value.room = room;
	});

	socket.on('like', (room) => {
		state.value.room.questions.find((question, index) => {
			if (room._id === question._id) {
				let questionBefore = state.value.room.questions[index - 1];
				if (questionBefore && room.likes.length > questionBefore.likes.length && !questionBefore.focused) {
					state.value.room.questions[index - 1] = room;
					state.value.room.questions[index] = questionBefore;
				} else {
					state.value.room.questions[index] = room;
				}
			}
		});
	});

	socket.on('focus', (room) => {
		state.value.room.questions.find((question, index) => {
			if (room._id === question._id) {
				if (index === 0) {
					state.value.room.questions[0].focused = true;
				} else {
					state.value.room.questions.splice(index, 1);
					state.value.room.questions.splice(0, 0, room);
				}
			}
		});
	});

	socket.on('answered', (room) => {
		state.value.room.questions.find((question, index) => {
			if (room._id === question._id) {
				state.value.room.questions.splice(index, 1);
				state.value.room.questions.push(room);
			}
		});
	});

	socket.on('closed', (room) => {
		state.value.feedback = 'A sala foi fechada! redirecionando...';
		setTimeout(() => {
			state.value.feedback = '';
			router.push({ name: 'room.select' });
		}, 3000);
	});

	onMounted(async () => {
		const room = await store.dispatch('GetRoom', { code: route.params._room });

		if (!room.room.opened) {
			router.push('/');
		}

		if (room.room.user == store.getters['getId']) {
			router.push({ name: 'room.my-room', params: { _room: room.room._id } });
		}

		state.value.room = room.room;
	});
</script>

<template>
	<div id="page-room">
		<header>
			<div className="content">
				<img :src="logoImg" alt="Ask-Me" />
				<div>
					<RoomCodeVue :code="state.room._id" />
					<ButtonVue :isOutlined="true" @click="exitRoom()"> sair da sala </ButtonVue>
				</div>
			</div>
		</header>
		<main>
			<div className="room-title">
				<h1>Sala - {{ state.room.title }}</h1>
				<span v-if="state.room.questions.length == 1"> {{ state.room.questions.length }} pergunta</span>
				<span v-else-if="state.room.questions.length > 1"> {{ state.room.questions.length }} perguntas</span>
			</div>

			<form @submit.prevent="onSubmit">
				<span class="feedback">{{ payload.feedback.sendQuestion }}</span>
				<span class="feedback">{{ state.feedback }}</span>
				<textarea placeholder="O que você quer perguntar?" rows="6" v-model="payload.question" />
				<div class="form-footer">
					<div class="user-info" v-if="store.getters['getToken']">
						<span>{{ store.getters['getName'] }}</span>
					</div>
					<span v-else>
						Para enviar uma pergunta,
						<button>
							<router-link :to="{ name: 'signin', query: { redirect: true, code: state.room._id } }"
								>faça seu login</router-link
							>
						</button>
					</span>
					<ButtonVue type="submit" :disabled="!store.getters['getToken'] || state.loading"> enviar pergunta </ButtonVue>
				</div>
			</form>

			<div class="question-list">
				<template class="feedback">{{ payload.feedback.sendLike }}</template>
				<QuestionVue
					v-for="question in state.room.questions"
					:key="question._id"
					:question="question"
					:isAnswared="question.answered"
					:isHighLighted="question.focused"
				>
					<button
						class="like-button"
						@click="onLike(question._id)"
						:disabled="
							!store.getters['getToken'] || question.answered || question.likes.indexOf(store.getters['getId']) != -1
						"
					>
						{{ question.likes.length }}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
								stroke="#737380"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</QuestionVue>
			</div>
		</main>
	</div>
</template>

<style scoped lang="scss">
	.feedback {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
		font-weight: bold;
		color: #1dd1a1;
		font-size: 16px;
	}

	.like {
		display: flex;
		align-items: flex-end;
		font-weight: bold;
		color: #1dd1a1;
		font-size: 16px;
	}
</style>