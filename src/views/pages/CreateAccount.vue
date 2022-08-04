<script setup>
	import { ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';

	import Button from '~/components/Button.vue';
	import logo from '~/assets/logo.svg';

	const store = useStore();
	const router = useRouter();

	const payload = ref({
		name: '',
		email: '',
		password: '',
		error: '',
	});

	const state = ref({
		loading: false,
	});

	const onSubmit = async () => {
		state.value.loading = true;

		const createAccount = await store.dispatch('CreateAccount', payload.value);

		if (createAccount.signup) {
			router.push({ name: 'room.select' });
		} else {
			payload.value.error = createAccount.error;
			setTimeout(() => {
				payload.value.error = '';
			}, 5000);
		}

		state.value.loading = false;
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
				<img :src="logo" alt="ask-me logo" />
				<h3>Cadastro</h3>
				<form @submit.prevent="onSubmit()">
					<input type="text" v-model="payload.name" placeholder="Nome" />
					<input type="text" v-model="payload.email" placeholder="E-mail" />
					<input type="password" v-model="payload.password" placeholder="Senha" />
					<Button type="submit" :disabled="state.loading">enviar</Button>
				</form>
				<div>
					<div class="separator"><router-link :to="{ name: 'signin' }">voltar</router-link></div>
				</div>
			</div>
		</main>
	</section>
</template>
<style scoped lang="scss">
	h3 {
		margin-bottom: 20px;
	}

	a {
		color: #636363;
		text-decoration: none;
	}
</style>
