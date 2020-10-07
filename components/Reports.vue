<template>
  <div>
    <v-card>

      <v-card-title>
        <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
        Reports (Under Construction)</v-card-title>
      <v-divider dark color="primary"></v-divider>

      <v-row class="pa-1">
        <v-col cols="12" sm="4">
          <v-card outlined flat class="pa-2">
            <v-overflow-btn
              @change="selectedModule"
              dense
              class="my-2"
              :items="modules"
              item-value="name"
              item-text="name"
              label="Select Module to generate report from.."
              editable
            ></v-overflow-btn>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" v-if="selected_module">
          <v-card outlined flat class="pa-1">

            <v-card-text v-if="selected_module">
              <span style="color: #006064;"><b>{{selected_module.toUpperCase()}}</b>.</span>
              <v-divider></v-divider>
              <div v-if="selected_module === 'Users'">
                <v-overflow-btn
                  @change="selectUserReport"
                  dense
                  class="my-2"
                  :items="moduleContent"
                  item-value="id"
                  item-text="name"
                  label="User Names..."
                  editable
                ></v-overflow-btn>

                <div v-if="selected_user_report"></div>
              </div>

              <div v-if="selected_module === 'Sales'">
                <v-row>
                  <v-col cols="12" md="6">
                    <b><u>From</u></b><br>
                    <input type="date" v-model="from_datetime" @focus="resetSalesReport" style="padding: 2%; border: 2px solid #006064; width: 100%;">
                  </v-col>

                  <v-col cols="12" md="6" v-if="from_datetime">
                    <b><u>To</u></b><br>
                    <input type="date" v-model="to_datetime" style="padding: 2%; border: 2px solid #006064; width: 100%;">
                  </v-col>

                  <v-row v-if="to_datetime">
                    <v-col cols="12" md="6">
                      <v-overflow-btn
                        dense
                        class="my-2"
                        :items="payment_modes"
                        item-value="name"
                        item-text="name"
                        label="Select Payment Mode..."
                        v-model="payment_mode"
                        editable
                    ></v-overflow-btn>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-overflow-btn
                        dense
                        class="my-2"
                        :items="users"
                        item-value="name"
                        item-text="name"
                        label="Select User..."
                        v-model="user_order"
                        editable
                    ></v-overflow-btn>
                    </v-col>

                  </v-row>

                  <v-col cols="12" sm="12" v-if="to_datetime">
                    <v-btn small block dark color="primary" @click="submitQuery">Fetch Report</v-btn>
                  </v-col>
                </v-row>
              </div>

              <!-- <div v-if="selected_module === 'Categories'">
                Categories
              </div> -->

            </v-card-text>

            <v-card-text v-else>No module has been selected.</v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="8" v-else>
          <div class="text-center mt-7" style="color: #006064;">
            <v-icon>mdi-arrow-left</v-icon>
            Select Module to begin...
          </div>
        </v-col>
      </v-row>

      <v-divider dark color="primary"></v-divider>
      <v-card outlined flat class="pa-2 ma-2" v-if="selected_module === 'Sales' && sales_report.length > 0">

          <v-card-title>
            Sales
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <span>
              <small>
                 Total : Ksh <u><b>{{total_amount}}</b></u>.<br>
                 <i style="color: grey"> (Sales between <b>{{datetime_from}}</b>
                 and <b>{{datetime_to}}</b>)</i>
              </small>
            </span>

              <v-divider dark color="primary"></v-divider>

          <v-data-table
            :headers="headers"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="id"
            show-expand
            :items="sales_report"
            :search="search"
          >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">

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
                        <td>1</td>
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
          </v-data-table>

      </v-card>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}

export default {

  data: () => ({
    modules: [
      {name: 'Users', id: 1},
      // {name: 'Products', id: 2},
      {name: 'Sales', id: 3},
      // {name: 'Product Categories', id: 4}
    ],
    from_datetime: '',
    to_datetime: '',
    datetime_from: '',
    datetime_to: '',
    payment_mode: '',
    payment_modes: [
      {name: 'Cash', id: 1},
      {name: 'Mpesa', id: 2},
      {name: 'Card', id: 3},
      {name: 'Credit', id: 4}
    ],

    moduleContent: [],
    users: [],
    products: [],
    sales: [],
    categories: [],
    selected_module: '',
    selected_user_report: '',
    total_amount: '',
    no_sales_message: '',
    user_order: '',

    search: '',
    expanded: [],
    singleExpand: false,
        headers: [
          {
            text: 'Date and Time',
            align: 'start',
            value: 'time',
          },
          { text: 'Sold By', value: 'user' },
          { text: 'Amount (Ksh)', value: 'amount' },
          { text: 'Payment Mode', value: 'payment_mode' },
          { text: 'Content (Details)', value: 'data-table-expand' }
       ],

    sales_report: []

  }),

  created(){
    this.fetchUsers()
    // this.fetchProducts()
    this.fetchSales()
    // this.fetchCategories()
  },

  methods: {

    back(){
      this.$router.back();
    },

    submitQuery(){
      let data = {
        from: this.from_datetime,
        to: this.to_datetime,
        payment_mode: this.payment_mode,
        user_order: this.user_order
      };

      let user_name = ''
      this.users.forEach(val => {
        if(this.user_order === val.name){
          user_name = val.name
        }
      })

      this.datetime_from = this.from_datetime;
      this.datetime_to = this.to_datetime;

      if(this.payment_mode && this.user_order){

          this.$axios.post('/sales_report_all', data).then(res => {

          if(!res.data.data.length){
            this.no_sales_message = `No ${this.payment_mode} sales records for the period between ${this.datetime_from} and ${this.datetime_to} made by ${user_name}.`
            this.$toast.error(this.no_sales_message, {
              duration: 7000
            });
          }
          res.data.data.forEach(val => {
                let data = {
                  id: val.id,
                  user: val.user,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  amount: val.amount,
                  payment_mode: val.payment_mode,
                  content: JSON.parse(val.content)
                }

                this.sales_report.push(data)
              });

        this.total_amount = this.totalAmount(this.sales_report);

        this.from_datetime = '';
        this.to_datetime = '';
        this.payment_mode = '';
        this.user_id = '';

        }).catch(err => console.log(err));

      } else {

        this.$axios.post('/sales_report', data).then(res => {

          if(!res.data.data.length){
            this.no_sales_message = `No ${this.payment_mode} sales records for the period between ${this.datetime_from} and ${this.datetime_to}.`
            this.$toast.error(this.no_sales_message, {
              duration: 7000
            });
          }
          res.data.data.forEach(val => {
                let data = {
                  id: val.id,
                  user: val.user,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  amount: val.amount,
                  payment_mode: val.payment_mode,
                  content: JSON.parse(val.content)
                }

                this.sales_report.push(data)
              });

        this.total_amount = this.totalAmount(this.sales_report);

        this.from_datetime = '';
        this.to_datetime = '';
        this.payment_mode = '';
        this.user_id = '';

        }).catch(err => console.log(err));
      }
    },

    resetSalesReport(){
      if(this.sales_report.length > 0){
        this.sales_report = []
        this.no_sales_message = ''
        this.from_datetime = ''
        this.to_datetime = ''
      }
    },

    totalAmount(arr){
      if(arr.length > 0){
        let cost = []
        arr.forEach(val => {
          cost.push(val.amount)
        })
        let sum = cost.reduce((a, b)=>{
          return a + b;
        })

      return sum;
      } else {
        return 0;
      }
    },

    fetchUsers(){
      this.$axios.get(`/users`).then((res) => {
        this.users = res.data.data
      }).catch((err) => {console.log(err)});
    },

    // fetchProducts(){
    //   this.$axios.get(`/products`).then((res) => {
    //     this.products = res.data.data
    //   }).catch((err) => {console.log(err)});
    // },

    // fetchCategories(){
    //   this.$axios.get(`/categories`).then((res) => {
    //     this.categories = res.data.data
    //   }).catch((err) => {console.log(err)});
    // },

    fetchSales(){
      this.$axios.get(`/sales`).then((res) => {
        this.sales = res.data.data
      }).catch((err) => {console.log(err)});
    },

    selectedModule(e){
      this.selected_module = e
      if(e === 'Users'){
        this.moduleContent = this.users
        this.sales_report = []
        this.from_datetime = ''
        this.to_datetime = ''
        this.no_sales_message = ''
      }

      if(e === 'Products'){
        this.moduleContent = this.products
      }

      if(e === 'Sales'){
        this.moduleContent = this.sales
      }

      if(e === 'Product Categories'){
        this.moduleContent = this.categories
      }
    },
    selectUserReport(item){
      console.log(item)
    }

  }
}
</script>

<style>

</style>
