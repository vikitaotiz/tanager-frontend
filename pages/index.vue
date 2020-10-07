<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from '~/components/Dashboard'

export default {
  middleware: ['auth', 'kitchen', 'barista'],

  data(){
    return {
      online_users: ''
    }
  },

  components: {
    Dashboard
  }
}
</script>
