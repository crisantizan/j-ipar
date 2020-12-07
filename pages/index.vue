<template>
	<div class="d-flex justify-content-center">
		<!-- card -->
		<div class="card bg-light mt-3" style="width: 18rem">
			<!-- card image -->
			<img class="card-img-top" :src="imageUrl" alt="Card image cap" />
			<!-- card body -->
			<div class="card-body">
				<h5 class="card-title">{{ tenant.name }}</h5>
				<!-- billing data -->
				<div class="d-flex justify-content-between">
					<h6 class="card-subtitle mb-2 text-muted">
						<i class="fas fa fa-user mr-1"></i>{{ fullname }}
					</h6>
					<h6 class="card-subtitle mb-2 text-muted">
						<i class="fas fa fa-map-marker mr-1"></i>{{ address }}
					</h6>
				</div>
				<!-- end billing data -->
			</div>
			<!-- end card body -->
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import gql from 'graphql-tag';

export default {
	computed: {
		...mapGetters('tenant', ['tenant']),

		fullname() {
			return `${this.tenant.billingFirstName} ${this.tenant.billingLastName}`;
		},

		address() {
			return this.tenant.billingAddress || 'Billing Address';
		},

		imageUrl() {
			return `${process.env.BASE_IMAGE_URL}/${this.tenant.logoUrl}`;
		},
	},
};
</script>

<style scoped>
.card {
	border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
