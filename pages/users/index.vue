<template>
  <div>
    <Users />
  </div>
</template>

<script>
import Users from "~/components/Users"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Users
  }
}
</script>

<style>

</style>
