<template>
  <div>
    <Supplies />
  </div>
</template>

<script>
import Supplies from "~/components/Supplies"

export default {
  middleware: ['auth'],

  components: {
    Supplies
  }
}
</script>
