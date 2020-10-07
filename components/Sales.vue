<template>
  <div>

      <v-card>
        <v-btn text @click="back">
             <v-icon>mdi-arrow-left</v-icon> Back
        </v-btn>
        <v-card-title>
          Sales

          <v-spacer></v-spacer>
          <div v-if="this.daily_sale">
            <strong>Daily Target Sales Ksh {{this.daily_sale.daily_target_sale}}</strong>
            <v-icon dark color="green" class="ml-5" @click="openEditTargetSale">mdi-pencil</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

          <v-btn
            v-if="!this.daily_sale"
            color="pink"
            dark
            absolute
            top
            right
            fab
            class="mt-10"
            @click="openDailySalesDialog"
          >
           <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Set Daily Sales Record</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field outlined autofocus type="number" v-model="daily_target_sale" label="Enter Daily Target Sale"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="saveDailyTargetSale">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEditTargetSale" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Daily Sales Record</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field outlined autofocus type="number" v-model="daily_target_sale" label="Enter Daily Target Sale"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="red" text @click="dialogEditTargetSale = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="updateDailyTargetSale">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-data-table
          :headers="headers"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          :items="sales"
          :search="search"
        >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">

            <strong>Order created by : {{item.user_order}}</strong>
            <strong>Creditor Name : {{item.creditor_name}}</strong>

            <v-simple-table dense class="ma-2">
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
                      <td>{{prod.qty}}</td>
                      <td>{{prod.name}}</td>
                      <td>{{prod.selling_price}}</td>
                    </tr>
                    <tr style="background: #ddd;">
                      <td></td>
                      <td>Total</td>
                      <td>{{item.amount}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
          </td>
        </template>
        <template v-slot:item.payment_mode="{ item }">
          <span v-if="item.payment_mode === 'credit'">
            <strong>
              <v-btn text @click="openConfirmCredit(item)">{{item.payment_mode}}</v-btn><br>
            </strong>
          </span>
          <span v-else>{{item.payment_mode}}</span>
        </template>
        </v-data-table>
      </v-card>

      <v-dialog
        v-model="dialogClearCredit"
        width="500"
        persistent
      >

        <v-card>
          <v-card-text class="grey lighten-2">
            <v-row>
              <v-col>Clear Credit for {{creditItem.creditor_name}}</v-col>
              <v-col>Order Created by {{creditItem.user_order}}</v-col>
              <v-col>{{creditItem.time}}</v-col>
            </v-row>
          </v-card-text>
          <strong style="margin-left: 10%;">Total Amount : Ksh {{creditItem.amount}} ({{creditItem.payment_mode}})</strong>
          <v-divider></v-divider>
          <v-card-text>
            <v-simple-table dense class="ma-2">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Cost ( Kshs )</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(prod, index) in creditItem.content" :key="index">
                      <td>{{prod.qty}}</td>
                      <td>{{prod.name}}</td>
                      <td>{{prod.selling_price}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
          </v-card-text>
          <v-divider></v-divider>
            <v-select
              class="ml-2 mr-2 mt-2"
              :items="payment_modes"
              label="Select Payment Mode..."
              outlined
              v-model="change_payment"
              item-text="name"
              item-value="name"
              dense
            ></v-select>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="red"
              text
              @click="dialogClearCredit= false"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="change_payment"
              color="primary"
              text
              @click="confirmCredit"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import moment, { duration } from 'moment';
import { mapGetters } from 'vuex'

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
          { text: 'Order By', value: 'user_order' },
          { text: 'Sold By', value: 'user' },
          { text: 'Amount (Ksh)', value: 'amount' },
          { text: 'Payment Mode', value: 'payment_mode' },
          { text: 'Content (Details)', value: 'data-table-expand' }
       ],

      sales: [],

      creditItem: '',
      change_payment: '',
      dialogClearCredit: false,

      payment_modes: [
        {name: 'mpesa'},
        {name: 'cash'},
        {name: 'card'}
      ],

      dialog: false,
      daily_target_sale: 0,
      daily_sale: '',
      dialogEditTargetSale: false
  }
},

created(){
  this.fetchSales()
  socket.on('sendToSales', data => {
    // console.log(data)
    let new_data = {
      content: JSON.parse(data.content),
      amount: data.amount,
      id: data.id,
      time: moment(data.created_at).format('MMMM Do YYYY, h:mm a'),
      user: data.user,
      user_order: data.user_order
    }

    this.sales.unshift(new_data)

  })
},

computed: {
  ...mapGetters(['isAuthenticated', 'loggedInUser'])
},

async fetch(){
  this.$axios.get(`/target_sales`).then(res => {
    this.daily_sale = res.data
  })
},

methods: {
    back(){
      this.$router.back();
    },

    fetchSales(){
      this.$axios.get(`/sales`)
           .then(response => {

            response.data.data.forEach(val => {
              let data = {
                id: val.id,
                user: val.user,
                user_order: val.user_order,
                creditor_name: val.creditor_name,
                time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                amount: val.amount,
                payment_mode: val.payment_mode,
                content: JSON.parse(val.content)
              }
              this.sales.push(data)
            });
        })
        .catch(error => {
          console.log(error.data);
      })
    },

    openDailySalesDialog(){
      this.dialog = true
    },

    openEditTargetSale(){
      this.dialogEditTargetSale = true
    },

    openConfirmCredit(item){
      this.dialogClearCredit = true
      this.creditItem = item
    },

    confirmCredit(){

      let data = {
        amount: this.creditItem.amount,
        content: JSON.stringify(this.creditItem.content),
        payment_mode: this.change_payment,
        time: this.creditItem.time,
        user: this.creditItem.user,
        user_order: this.creditItem.user_order
      }

      this.$axios.post(`/clear_credit`, data).then(res=> {
        this.dialogClearCredit = false
        this.$toast.success('Credit cleared', {
          duration: 2000
        });

        this.sales = [];
        this.fetchSales();

      }).catch(err => {
        this.$toast.error('There was an error', {
          duration: 3000
          });
      })

      this.change_payment = ''
    },

    saveDailyTargetSale(){
      let data = {
        daily_target_sale: this.daily_target_sale,
        user_id: this.loggedInUser.data.id
      }

      this.$axios.post(`/target_sales`, data).then(res => {
        this.daily_sale = res.data
        this.dialog = false
        this.$toast.success('Daily Target Sale Created', {
          duration: 2000
        })
      })
    },

    updateDailyTargetSale(){
      let data = {
        daily_target_sale: this.daily_target_sale,
        user_id: this.loggedInUser.data.id
      }

      this.$axios.patch(`/target_sales/${this.daily_sale.id}`, data).then(res => {
        this.daily_sale = res.data
        this.dialogEditTargetSale = false
        this.$toast.success('Daily Target Sale Edited', {
          duration: 2000
        })
      })
    }

  }
}
</script>

<style>

</style>
