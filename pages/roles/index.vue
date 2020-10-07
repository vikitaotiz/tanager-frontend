<template>
  <div>
    <Roles />
  </div>
</template>

<script>
import Roles from "~/components/Roles"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Roles
  }
}
</script>

<style>

</style>
