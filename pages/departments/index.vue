<template>
  <div>
    <Departments />
  </div>
</template>

<script>
import Departments from "~/components/Departments"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Departments
  }
}
</script>

<style>

</style>
