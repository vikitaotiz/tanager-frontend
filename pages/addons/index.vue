<template>
  <div>
    <Addons />
  </div>
</template>

<script>
import Addons from "~/components/Addons"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Addons
  }
}
</script>

<style>

</style>
