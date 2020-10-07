<template>
  <div>
    <Barista />
  </div>
</template>

<script>
import Barista from '~/components/Barista'

export default {
  middleware: ['auth'],

  components: {
    Barista
  }
}
</script>

<style>

</style>
