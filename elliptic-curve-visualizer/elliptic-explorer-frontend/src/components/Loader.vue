<template>
    <div v-if="visible" class="loader-backdrop">
      <div class="loader-spinner"></div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  });
  </script>
  
  <style scoped>
  .loader-backdrop {
    position: absolute; /* Absolu par rapport au conteneur parent */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  
  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 5px solid #ccc;
    border-top-color: #2c3e50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
  