<template>
  <div>
    <Cancels />
  </div>
</template>

<script>
import Cancels from "~/components/Cancels"

export default {
  middleware: ['auth'],

  components: {
    Cancels
  }
}
</script>

<style>

</style>
