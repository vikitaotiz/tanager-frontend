<template>
  <div>
    <Paymentmode />
  </div>
</template>

<script>
import Paymentmode from "~/components/Paymentmode"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Paymentmode,
  }
}
</script>

<style>

</style>
