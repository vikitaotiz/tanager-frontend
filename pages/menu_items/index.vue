<template>
  <div>
    <Products />
  </div>
</template>

<script>
import Products from "~/components/Products"

export default {
  middleware: ['auth', 'admin'],

  components: {
    Products
  }
}
</script>

<style>

</style>
