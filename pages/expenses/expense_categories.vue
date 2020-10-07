<template>
  <div>
    <Expensecat />
  </div>
</template>

<script>
import Expensecat from "~/components/Expensecat"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Expensecat,
  }
}
</script>

<style>

</style>
