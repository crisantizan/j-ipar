<template>
	<div class="d-flex align-items-center justify-content-center" style="height: 100vh">
		<h2 class="text-danger">Access denied!</h2>
	</div>
</template>

<script>
	export default {
		layout: 'access-denied',

		async created() {
			// remove cookie (token)
			if (this.$apolloHelpers.getToken()) {
				await this.$apolloHelpers.onLogout();
			}
		}
	}
</script>
