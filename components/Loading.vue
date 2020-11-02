<template functional>
	<div class="Loading__wrapper" v-if="props.value">
		<div class="Loading__content">
			<div class="sk-chase">
				<div class="sk-chase-dot"></div>
				<div class="sk-chase-dot"></div>
				<div class="sk-chase-dot"></div>
				<div class="sk-chase-dot"></div>
				<div class="sk-chase-dot"></div>
				<div class="sk-chase-dot"></div>
			</div>
			<h4 class="Loading__text">
				<slot>Loading, please wait...</slot>
			</h4>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			value: Boolean,
			default: false,
		}
	}
</script>

<style scoped>
.Loading__wrapper {
	position: fixed;
	width: 100%;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0.2);
	height: 100vh;
	z-index: 20000;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.Loading__content {
	background-color: #3283f6;
	border-radius: 3px;
	padding: 0 1.5rem;
	box-shadow: 0px 0px 5px 0px rgba(50, 131, 246, 0.65);
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50px;
}

.Loading__text {
	color: #fff;
	margin-left: 1.5rem;
	align-self: center;
}

.sk-chase {
	width: 75px;
	height: 75px;
	position: relative;
	animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot:before {
	content: '';
	display: block;
	width: 25%;
	height: 25%;
	background-color: #fff;
	/*background-color: #3283f6;*/
	border-radius: 100%;
	animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
	animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2) {
	animation-delay: -1s;
}
.sk-chase-dot:nth-child(3) {
	animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4) {
	animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5) {
	animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6) {
	animation-delay: -0.6s;
}
.sk-chase-dot:nth-child(1):before {
	animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2):before {
	animation-delay: -1s;
}
.sk-chase-dot:nth-child(3):before {
	animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4):before {
	animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5):before {
	animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6):before {
	animation-delay: -0.6s;
}

@keyframes sk-chase {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes sk-chase-dot {
	80%,
	100% {
		transform: rotate(360deg);
	}
}

@keyframes sk-chase-dot-before {
	50% {
		transform: scale(0.4);
	}
	100%,
	0% {
		transform: scale(1);
	}
}
</style>
