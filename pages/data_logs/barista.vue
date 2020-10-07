<template>
  <div>
      <v-card>
        <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
        <v-card-title>
           Barista Timestamps
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
          :items="data_barista"
          :search="search"
        >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card outlined class="pa-1">
              <v-card-title class="text-center">
                {{item.table_name}}
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
                      <tr v-for="(prod, index) in item.content" :key="index">
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
        <template v-slot:item.status="{ item }">
          <div v-if="item.timer <= 3">
            <v-chip color="primary" small>Success</v-chip>
          </div>
          <div v-if="item.timer > 3 && item.timer <= 8">
            <v-chip color="orange" small>Late</v-chip>
          </div>
          <div v-if="item.timer > 8">
            <v-chip color="red" style="color: white;" small>Fail</v-chip>
          </div>
        </template>
        </v-data-table>
      </v-card>

  </div>
</template>

<script>
import moment from 'moment'

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
            { text: 'User Order', value: 'user_order' },
            { text: 'Time (Mins)', value: 'timer' },
            { text: 'Status', value: 'status' },
            { text: 'Content (Details)', value: 'data-table-expand' }
        ],

        data_barista: []
  }
},

created(){
  this.fetchDataLogsKitchen()
},

methods: {
    back(){
      this.$router.back();
    },

    fetchDataLogsKitchen(){
      this.$axios.get(`/timers_barista_all`).then(response => {
        response.data.data.forEach(val => {

              let data = {
                id: val.id,
                module: val.module,
                user: val.user,
                user_order: val.user_order,
                timer: val.timer,
                table_name: val.table_name,
                desc: val.desc,
                time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                content: JSON.parse(val.content)
              }

              this.data_barista.push(data)
            });
      })
    }
  }
}
</script>

<style>

</style>
