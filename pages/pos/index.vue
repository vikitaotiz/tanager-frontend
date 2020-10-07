<template>
  <div>
    <Pos />
  </div>
</template>

<script>
import Pos from '~/components/Pos'

export default {
  middleware: ['auth'],

  components: {
    Pos
  }
}
</script>

<style>

</style>
