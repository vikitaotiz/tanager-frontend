<template>
  <div>

      <v-card>
        <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
        <v-card-title>
          Online Users
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="loggedinusers"
          :search="search"
        >
        </v-data-table>
      </v-card>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default {
middleware: ['auth', 'admin'],

data(){
  return {
    search: '',
        headers: [
          {
            text: 'Name',
            align: 'start',
            value: 'name',
          },
          { text: 'Logged In Time', value: 'time' },
          { text: 'Role', value: 'role' },
          { text: 'Department', value: 'department' }
       ],

        loggedinusers: []
  }
},

created(){
  this.fetchLoggedInUsers()
  socket.on('recordLoggedInUser', data => {

    let new_data = {
      name: data.name,
      email: data.email,
      time: data.time,
      role: data.role,
      department: data.department,
      user_id: data.user_id
    }

    this.loggedinusers.unshift(new_data)

  })

  socket.on('recordLoggedOutUser', data => {

    let user_index = this.loggedinusers.findIndex(obj => obj.name === data.name && obj.email === data.email);
    this.loggedinusers.splice(user_index, 1)

  })
},

methods: {
    back(){
      this.$router.back();
    },

    fetchLoggedInUsers(){
      this.$axios.get(`/loggedinusers`)
           .then(response => {
            response.data.data.forEach(val => {

              let data = {
                name: val.name,
                email: val.email,
                time: val.time,
                role: val.role,
                department: val.department,
                user_id: val.user_id
              }

              this.loggedinusers.push(data)
            });

           })
           .catch(error => {
             console.log(error.data);
           })
    },
  }
}
</script>

<style>

</style>
