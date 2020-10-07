<template>
  <div>
    <Measurementunit />
  </div>
</template>

<script>
import Measurementunit from "~/components/Measurementunit"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Measurementunit,
  }
}
</script>

<style>

</style>
