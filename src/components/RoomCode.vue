<script setup>
	import copyImg from '~/assets/copy.svg';
	
	const props = defineProps({
		code: {
			type: String,
		},
	});

	const copyRoomCode = () => {
		navigator.clipboard.writeText(props.code);
	};
</script>

<template>
	<button type="button" class="room-code" @click="copyRoomCode()">
		<div>
			<img :src="copyImg" alt="Copiar código da sala" />
		</div>
		<span>sala código {{ code }}</span>
	</button>
</template>

<style scoped lang="scss">
	.room-code {
		height: 40px;
		border-radius: 8px;
		overflow: hidden;

		background: #fff;
		border: 1px solid #feca57;
		cursor: pointer;

		display: flex;

		div {
			background: #feca57;
			padding: 0 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
		}

		span {
			display: block;
			align-self: center;
			flex: 1;
			padding: 0 16px 0 12px;
			width: 240px;
			font-size: 14px;
			font-weight: 500;
		}

		&:hover {
			filter: brightness(0.9);
			transition: 0.7s;
		}
	}
</style>
