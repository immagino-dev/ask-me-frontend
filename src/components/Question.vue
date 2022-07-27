<script setup>
	const props = defineProps({
		question: {
			type: Object,
		},
		isAnswared: {
			type: Boolean,
		},
		isHighLighted: {
			type: Boolean,
		},
	});
</script>

<template>
	<div class="question" :class="[isHighLighted ? 'highlighted' : '', isAnswared ? 'answared' : '']">
		<p>{{ question.question }}</p>
		<footer>
			<div class="user-info">
				<span>{{ question.user.name }} - {{ new Date(question.createdAt).toTimeString().split(' ')[0] }} </span>
			</div>
			<div>
				<slot />
			</div>
		</footer>
	</div>
</template>

<style lang="scss">
	.question {
		background: #fefefe;
		border-radius: 8px;
		box-shadow: 0 2px 12px rgba($color: #000000, $alpha: 0.04);
		padding: 24px;

		& + .question {
			margin-top: 8px;
		}

		&.highlighted {
			background: #fff;
			border: 1px solid #feca57;

			footer .user-info span {
				color: #29292e;
			}
		}

		&.answared {
			background: #dbdcdd;
			// border: 1px solid #feca57;
		}

		p {
			color: #29292e;
		}

		footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 24px;

			.user-info {
				display: flex;
				align-items: center;

				img {
					width: 32px;
					height: 32px;
					border-radius: 50%;
				}

				span {
					margin-left: 8px;
					color: #737380;
					font-size: 14px;
				}
			}

			> div {
				display: flex;
				gap: 16px;
			}

			button {
				border: 0;
				background: transparent;
				cursor: pointer;
				transition: filter 0.4s;
				display: flex;
				align-items: flex-end;
				gap: 8px;

				&.like-button {
					color: #737380;

					&.liked {
						// color: #feca57;
						svg path,
						circle {
							stroke: #feca57;
						}
					}
				}

				&:hover {
					svg path,
					circle {
						stroke: #feca57;
					}
					transition: filter 0.9s;
				}

				&:disabled {
					svg path,
					circle {
						stroke: #737380;
					}
					cursor: not-allowed;
					opacity: 0.5;
				}
			}
		}
	}
</style>
