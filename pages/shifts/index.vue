<template>
  <div>
    <Shifts />
  </div>
</template>

<script>
import Shifts from "~/components/Shifts"

export default {
  middleware: ['auth'],

  components: {
    Shifts
  }
}
</script>

<style>

</style>
