<template>
  <div>
    <Provider />
  </div>
</template>

<script>
import Provider from "~/components/Provider"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Provider,
  }
}
</script>

<style>

</style>
