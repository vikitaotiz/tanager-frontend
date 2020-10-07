<template>
  <div>
    <Reports />
  </div>
</template>

<script>
import Reports from "~/components/Reports"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Reports
  }
}
</script>

<style>

</style>
