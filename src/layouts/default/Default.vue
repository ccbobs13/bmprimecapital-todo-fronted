<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title >
        <v-icon icon="mdi-list-status"></v-icon>
        Todo App
      </v-app-bar-title>
    </v-app-bar>
    <default-view/>
  </v-app>
</template>

<script lang="ts" setup>
import DefaultView from './View.vue'
</script>
