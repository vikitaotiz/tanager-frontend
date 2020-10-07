<template>
  <div>
    <Purchases />
  </div>
</template>

<script>
import Purchases from "~/components/Purchases"

export default {
  middleware: ['auth'],

  components: {
    Purchases
  }
}
</script>

<style>

</style>
