<template>
  <div>
    <Categories />
  </div>
</template>

<script>
import Categories from "~/components/Categories"

export default {
  middleware: ['auth'],

  components: {
    Categories
  }
}
</script>

<style>

</style>
