<template>
  <div>
    <Kitchen />
  </div>
</template>

<script>
import Kitchen from '~/components/Kitchen'

export default {
  middleware: ['auth'],

  components: {
    Kitchen
  }
}
</script>

<style>

</style>
