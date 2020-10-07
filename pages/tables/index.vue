<template>
  <div>
    <Tables />
  </div>
</template>

<script>
import Tables from "~/components/Tables"

export default {
  middleware: ['auth'],

  components: {
    Tables
  }
}
</script>

<style>

</style>
