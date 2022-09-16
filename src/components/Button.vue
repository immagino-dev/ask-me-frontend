<script setup>
	const props = defineProps({
		isOutlined: {
			type: Boolean,
			default: false,
		},
	});
</script>

<template>
	<button class="button" :class="isOutlined ? 'outlined' : ''">
		<slot />
	</button>
</template>

<style scoped lang="scss">
	button {
		height: 50px;
		border-radius: 8px;
		font-weight: 500;
		background: #feca57;
		color: #fff;
		padding: 0 32px;

		display: flex;
		justify-content: center;
		align-items: center;

		cursor: pointer;
		border: 0;

		transition: filter 0.2s;

		img {
			margin-right: 8px;
		}

		&.outlined {
			background: #fff;
			border: 1px solid #feca57;
			color: #feca57;
		}

		&:not(:disabled):hover {
			filter: brightness(0.9);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
</style>
