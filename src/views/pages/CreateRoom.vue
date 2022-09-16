<script setup>
	import Button from '~/components/Button.vue';
	import logo from '~/assets/logo.svg';

	import { ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';

	const store = useStore();
	const router = useRouter();

	const payload = ref({
		title: '',
		error: '',
	});

	const onSubmit = async () => {
		payload.value.error = '';
		const room = await store.dispatch('CreateRoom', { title: payload.value.title });
		if (room.createRoom) {
			router.push({ name: 'room.my-room', params: { _room: room.room._id } });
		} else {
			payload.value.error = room.error;
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
					<input type="text" v-model="payload.title" placeholder="nome da sua sala" />
					<Button type="submit">criar na sala</Button>
				</form>
				<router-link class="separator" :to="{name: 'room.select'}">voltar</router-link>
			</div>
		</main>
	</section>
</template>
<style scoped lang="scss"></style>
