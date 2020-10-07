<template>
  <div>
    <Ready />
  </div>
</template>

<script>
import Ready from '~/components/Ready'

export default {
  middleware: ['auth'],

  components: {
    Ready
  }
}
</script>

<style>

</style>
