/* eslint-disable */
<template>
  <div class="modal-backdrop">
    <div class="modal" >
      <slot></slot> <!-- Dialogue content (inserted from the using component) -->
    </div>
  </div>
</template>

<script>
export default {
  name: "dialogue-window",
}
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: var(--primary);
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 95%;
  min-width: 500px;
  margin-top: 500px auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  overflow-y:auto;
}

</style>