<template>
  <div>
    <Picks />
  </div>
</template>

<script>
import Picks from "~/components/Picks"

export default {
  middleware: ['auth'],

  components: {
    Picks
  }
}
</script>

<style>

</style>
