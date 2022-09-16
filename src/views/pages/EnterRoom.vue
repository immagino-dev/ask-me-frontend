<script setup>
	import { reactive } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';

	import Button from '~/components/Button.vue';
	import logo from '~/assets/logo.svg';

	const store = useStore();
	const router = useRouter();

	const payload = reactive({
		code: '',
		error: '',
	});

	const onSubmit = async () => {
		payload.error = '';
		const room = await store.dispatch('EnterRoom', { code: payload.code });
		if (room.enterRoom) {
			router.push({ name: 'room', params: { _room: room._id } });
		} else {
			payload.error = room.error;
			setTimeout(() => {
				payload.error = '';
			}, 6000);
		}
	};
</script>

<template>
	<section id="page-form">
		<aside>
			<strong>Crie salas de Q&amp;A ao-vivo</strong>
			<p>Tire as dúvidas de sua audiêcia em tempo-real</p>
		</aside>
		<main>
			<div class="main-content">
				<img :src="logo" alt="" />
				<span class="error">{{ payload.error }}</span>
				<form @submit.prevent="onSubmit()">
					<input type="text" v-model="payload.code" placeholder="digite o código da sala" />
					<Button type="submit">entrar na sala</Button>
				</form>
				<div class="separator">ou crie uma sala</div>
				<router-link :to="{ name: 'room.create' }" class="createRoom">crie sua sala</router-link>
			</div>
		</main>
	</section>
</template>
<style scoped lang="scss"></style>
