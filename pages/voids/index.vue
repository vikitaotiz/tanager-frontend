<template>
  <div>
    <Voids />
  </div>
</template>

<script>
import Voids from "~/components/Voids"

export default {
  middleware: ['auth'],

  components: {
    Voids
  }
}
</script>

<style>

</style>
