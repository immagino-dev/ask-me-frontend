<script setup>
	import { onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';

	import useSocket from '~/hooks/useSocket';

	import QuestionVue from '~/components/Question.vue';
	import ButtonVue from '~/components/Button.vue';
	import RoomCodeVue from '~/components/RoomCode.vue';

	import logo from '~/assets/logo.svg';

	const store = useStore();
	const route = useRoute();
	const router = useRouter();

	const socket = useSocket(route.params._room);

	const state = ref({
		room: {
			questions: [],
		},
		focused: false,
	});

	socket.on('question', (room) => {
		state.value.room = room;
	});

	socket.on('like', (room) => {
		state.value.room.questions.find((question, index) => {
			if (room._id === question._id) {
				let questionBefore = state.value.room.questions[index - 1];
				if (questionBefore && room.likes.length > questionBefore.likes.length && !questionBefore.focus) {
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
				state.value.focused = true;
			}
		});
	});

	socket.on('answered', (room) => {
		state.value.room.questions.find((question, index) => {
			if (room._id === question._id) {
				state.value.room.questions.splice(index, 1);
				state.value.room.questions.push(room);
				state.value.focused = false;
			}
		});
	});

	const closeRoom = async () => {
		await store.dispatch('CloseRoom', {
			room: state.value.room._id,
			open: false,
			title: state.value.room.title,
		});
		router.push({ name: 'room.select' });
	};

	const answerQuestion = async (_id) => {
		await store.dispatch('AnswerQuestion', {
			question: _id,
		});
	};

	const answeredQuestion = async (_id) => {
		await store.dispatch('AnsweredQuestion', {
			question: _id,
		});
	};
	onMounted(async () => {
		const room = await store.dispatch('GetMyRoom', { code: route.params._room });
		if (room.status == 403) {
			router.push({ name: 'room.select' });
		} else if (!room.getMyRoom) {
			router.push({ name: 'room', params: { _room: route.params._room } });
		}
		room.questions.forEach((question) => {
			if (question.focused) {
				state.value.focused = true;
			}
		});
		state.value.room = room;
	});
</script>

<template>
	<div id="page-room">
		<header>
			<div class="content">
				<img :src="logo" alt="ask-me" />
				<div>
					<RoomCodeVue :code="state.room._id" />
					<ButtonVue :isOutlined="true" @click="closeRoom()"> encerrar sala </ButtonVue>
				</div>
			</div>
		</header>
		<main>
			<div class="room-title">
				<h1>Sala - {{ state.room.title }}</h1>
				<span v-if="state.room.questions.length > 0"> {{ state.room.questions.length }} perguntas</span>
			</div>
			<div class="question-list">
				<QuestionVue
					v-for="question in state.room.questions"
					:key="question.id"
					:question="question"
					:isAnswared="question.answered"
					:isHighLighted="question.focused"
				>
					<button type="button" @click="answeredQuestion(question._id)" v-if="!question.answered">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle
								cx="12.0003"
								cy="11.9998"
								r="9.00375"
								stroke="#737380"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
								stroke="#737380"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<button
						type="button"
						@click="answerQuestion(question._id)"
						:disabled="state.focused"
						v-if="!question.answered"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
								stroke="#737380"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<button class="like-button" disabled>
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

<style lang="scss"></style>
