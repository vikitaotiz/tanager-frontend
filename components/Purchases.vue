<template>
  <div>
      <v-card>
        <v-btn text @click="back">
            <v-icon>mdi-arrow-left</v-icon> Back
        </v-btn>
        <v-card-title>
          Purchases
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
          :items="purchases"
          :search="search"
        >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card outlined class="pa-1">
              <v-simple-table dense class="ma-2" dark color="primary" >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Quantity</th>
                        <th class="text-left">Name</th>
                        <th class="text-left">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(prod, index) in item.content" :key="index">
                        <td>{{prod.qty}}</td>
                        <td>{{prod.name}}</td>
                        <td>{{prod.measurementunit}}</td>
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
          { text: 'Amount', value: 'amount' },
          { text: 'Provider', value: 'provider' },
          { text: 'Mode', value: 'paymentmode' },
          { text: 'Requested By', value: 'user_requesting' },
          { text: 'Approved By', value: 'user' },
          { text: 'Content (Details)', value: 'data-table-expand' }
       ],

        purchases: []
  }
},

created(){
  this.fetchPurchases()
  socket.on('sendToPurchases', data => {

    let new_data = {
      content: JSON.parse(data.content),
      amount: data.amount,
      provider: data.provider,
      paymentmode: data.paymentmode,
      id: data.id,
      time: data.created_at,
      user: data.user,
      user_order: data.user_order
    }

    this.purchases.unshift(new_data)

  })
},

methods: {
    back(){
      this.$router.back();
    },

    fetchPurchases(){
      this.$axios.get(`/confirmedrequests`)
           .then(response => {

            response.data.data.forEach(val => {

              let data = {
                id: val.id,
                amount: val.amount,
                provider: val.provider,
                paymentmode: val.paymentmode,
                user_requesting: val.user_requesting,
                user: val.user,
                time: val.created_at,
                content: JSON.parse(val.content)
              }

              this.purchases.push(data)
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
