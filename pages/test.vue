<template>
  <div>
    <button class="btn btn-primary" @click="showModal = !showModal">
      TOGGLE
    </button>

    <button class="btn btn-primary" @click="showModal1 = !showModal1">
      TOGGLE UNO
    </button>
    <client-only>
      <VModal v-model="showModal">
        <VModalDialog>
          <div class="modal-content">
            Hola MUNDO
          </div>
        </VModalDialog>
      </VModal>

      <VModal v-model="showModal1">
        <VModalDialog>
          <div class="modal-content">
            Hola MUNDO UNO
          </div>
        </VModalDialog>
      </VModal>
    </client-only>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    showModal1: false,
  }),
};
</script>

<style></style>
