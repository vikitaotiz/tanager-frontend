<template>
  <div>
    <Sales />
  </div>
</template>

<script>
import Sales from "~/components/Sales"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Sales
  }
}
</script>

<style>

</style>
