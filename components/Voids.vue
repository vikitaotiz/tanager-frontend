<template>
  <div>
      <v-card>
        <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
        <v-card-title>
          Voids
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
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          :items="loggers"
          :search="search"
        >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card outlined class="pa-1">
              <v-card-title class="text-center">
                {{item.content.table}}
              </v-card-title>
              <v-simple-table dense class="ma-2" dark color="primary" >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Quantity</th>
                        <th class="text-left">Name</th>
                        <th class="text-left">Cost ( Kshs )</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(prod, index) in item.content.content" :key="index">
                        <td>1</td>
                        <td>{{prod.name}}</td>
                        <td>{{prod.selling_price}}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{{item.content.amount}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
          </td>
        </template>
        </v-data-table>
      </v-card>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default {

data(){
  return {
    search: '',
    expanded: [],
    singleExpand: false,
        headers: [
          {
            text: 'Date and Time',
            align: 'start',
            value: 'time',
          },
          { text: 'Module', value: 'module' },
          { text: 'Void Reason', value: 'desc' },
          { text: 'Voided By', value: 'user' },
          { text: 'Content (Details)', value: 'data-table-expand' }
       ],

        loggers: []
  }
},

created(){
  this.fetchLoggers()
  socket.on('sendToLoggers', data => {

    let new_data = {
      content: JSON.parse(data.content),
      amount: data.amount,
      id: data.id,
      time: data.created_at,
      user: data.user,
      user_order: data.user_order
    }

    this.loggers.unshift(new_data)

  })
},

methods: {
    back(){
      this.$router.back();
    },

    fetchLoggers(){
      this.$axios.get(`/loggers`)
           .then(response => {

            response.data.data.forEach(val => {

              let data = {
                id: val.id,
                module: val.module,
                user: val.user,
                desc: val.desc,
                time: val.created_at,
                content: JSON.parse(val.content)
              }

              this.loggers.push(data)
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
