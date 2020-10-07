<template>
  <div>
    <Userrequests />
  </div>
</template>

<script>
import Userrequests from "~/components/Userrequests"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Userrequests
  }
}
</script>

<style>

</style>
