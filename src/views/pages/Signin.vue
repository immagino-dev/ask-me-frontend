<script setup>
	import { useRoute, useRouter } from 'vue-router';
	import { onMounted, reactive } from 'vue';
	import { useStore } from 'vuex';

	import Button from '~/components/Button.vue';
	import logo from '~/assets/logo.svg';

	const router = useRouter();
	const route = useRoute();
	const store = useStore();

	const payload = reactive({
		email: '',
		password: '',
		error: '',
	});
	const onSubmit = async () => {
		try {
			const action = await store.dispatch('Signin', {
				email: payload.email,
				password: payload.password,
			});

			if (action.signin) {
				route.query.redirect
					? router.push({ name: 'room', params: { _room: route.query.code } })
					: router.push({ name: 'room.select' });
			} else {
				payload.error = 'Usuário ou senha inválidos';
				setTimeout(() => {
					payload.error = '';
				}, 5000);
			}
		} catch (error) {
			payload.error = error.message;
		}
	};
	onMounted(async () => {
		const autoSignin = await store.dispatch('AutoSignin');
		if (autoSignin.signin) {
			route.query.redirect
				? router.push({ name: 'room', params: { _room: route.query.code } })
				: router.push({ name: 'room.select' });
		} else {
			localStorage.clear();
		}
	});
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
				<h3>Login</h3>
				<span class="error">{{ payload.error }}</span>
				<form @submit.prevent="onSubmit()">
					<input type="text" v-model="payload.email" placeholder="e-mail" />
					<input type="password" v-model="payload.password" placeholder="senha" />
					<Button type="submit">entrar</Button>
				</form>
				<div>
					<div class="separator">ou</div>
					<router-link :to="{ name: 'register' }">cadastre-se aqui</router-link>
				</div>
			</div>
		</main>
	</section>
</template>
<style scoped lang="scss">
	a {
		color: #636363;
		text-decoration: none;
	}

	.error {
		margin-top: 10px;
		color: #ee5253;
	}
</style>
