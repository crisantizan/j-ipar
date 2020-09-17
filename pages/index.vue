<template>
	<div>
		<h1>Home</h1>
		<img :src="imageUrl" alt="">
		<pre>{{ tenant }}</pre>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('tenant', ['tenant']),
		imageUrl() {
			return `${process.env.BASE_IMAGE_URL}/${this.tenant.logoUrl}`;
		}
	},
};
</script>
