<script setup></script>

<template>
	<section>
		<router-view v-slot="{ Component, route }">
			<transition name="scale" mode="out-in" appear>
				<component :is="Component" :key="route.path" />
			</transition>
		</router-view>
	</section>
</template>

<style lang="scss">
	.error {
		font-size: 16px;
		color: #ff6b6b;
		font-weight: 500;
	}

	.scale-enter-active,
	.scale-leave-active {
		transition: all 0.5s ease;
	}

	.scale-enter-from,
	.scale-leave-to {
		opacity: 0;
		transform: scale(0.9);
	}

	.treme-animation {
		animation: treme 0.2s infinite;
	}
</style>
