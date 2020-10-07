<template>
  <div>
    <Procurements />
  </div>
</template>

<script>
import Procurements from "~/components/Procurements"

export default {
  middleware: ['auth'],

  components: {
    Procurements
  }
}
</script>

<style>

</style>
