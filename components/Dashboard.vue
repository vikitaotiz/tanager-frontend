<template>
  <div>
     <v-row  style="border-bottom: 2px solid #246224;" class="mb-2">
      <v-col cols="12" md="6" v-if="isAdmin">
        <v-card
          class="mx-auto text-center"
          color="primary"
          dark
          max-width="600"
        >
          <v-card-text>
            <v-sheet color="rgba(0, 0, 0, .12)">
              <v-sparkline
                :value="value"
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="24"
                stroke-linecap="round"
                smooth
              >
                <template v-slot:label="item">
                  {{ item.value }}
                </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <div class="display-1 font-weight-thin">Sales for last 7days</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center">
            <v-btn block text to="/reports">Go to Report</v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
      <v-col cols="12" md="6">
        <v-card
            color="teal"
            dark
            outlined
            class="mb-8"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-line</v-icon>Total Sales</v-card-title>
              <span class="ml-5">Total Sales (Since Midnight) : Ksh {{totalCost(all_sales_in24hrs)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle>
              Starting Float: Ksh {{totalCost1(yesterday_float)}} <span class="ml-10"> No. of Sales since midnight: {{all_sales_in24hrs.length}}</span>
            </v-card-subtitle>
          </v-card>

          <v-row>
            <v-col>
              <v-card
                color="green"
                dark
                outlined
                v-if="isAdmin"
              >
                <v-card-title class="headline">
                  <v-icon class="mr-1">mdi-chart-line</v-icon>Daily Target Sales : Ksh {{this.daily_sale.daily_target_sale ? this.daily_sale.daily_target_sale : 0}}</v-card-title>
                  <v-divider></v-divider>
                <v-divider></v-divider>
                <v-card-subtitle class="font-weight-thin">
                    All Sales : Ksh {{totalCost(all_sales)}}
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-card-subtitle class="font-weight-thin">
                    No. of total sales: {{all_sales.length}}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
      </v-col>

    </v-row>

    <v-row v-if="isAdmin" style="border-bottom: 2px solid #246224;" class="mb-2">
      <v-col cols="12" md="4">
        <v-card
            color="orange"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cash</v-icon>Cash </v-card-title>
              <span class="ml-5">Total (Since Midnight) : Ksh {{totalCost(cash)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
              No. of Cash Sales since midnight: {{cash.length}}
            </v-card-subtitle>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="primary"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-card-account-phone</v-icon>Mpesa</v-card-title>
              <span class="ml-5">Total (Since Midnight) : Ksh {{totalCost(mpesa)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
                No. of Mpesa Sales since midnight: {{mpesa.length}}
            </v-card-subtitle>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="purple"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-card</v-icon>Card</v-card-title>
              <span class="ml-5">Total (Since Midnight) : Ksh {{totalCost(card)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
                No. of Card Sales since midnight: {{card.length}}
            </v-card-subtitle>
          </v-card>
      </v-col>
    </v-row>

    <v-row v-if="isAdmin">
      <v-col cols="12" md="4">
        <v-card
            color="blue"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cash</v-icon>Credit </v-card-title>
              <span class="ml-5">Total (Since Midnight) : Ksh {{totalCost(credit)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
              No. of Credit Sales since midnight: {{credit.length}}
            </v-card-subtitle>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="red"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-card</v-icon>Daily Expenses</v-card-title>
              <span class="ml-5">Today's Expenses : Ksh {{totalCost(expenses_in_24hrs)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
                Total Expenses (Since Midnight)
            </v-card-subtitle>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="red"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-card</v-icon>All Expenses</v-card-title>
              <span class="ml-5">All Expenses : Ksh {{totalCost(all_expenses)}}</span>
              <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin">
                All Expenses
            </v-card-subtitle>
          </v-card>
      </v-col>
    </v-row>
    <v-row style="border-top: 2px solid #246224;">
      <v-col v-for="(user, index) in users"
            :key="index" cols="6" md="3">
        <v-card
            dark
            class="winner"
            outlined
            v-if="winner == user.daily_sales"
          >
            <v-card-subtitle>
              <v-icon class="mr-1" >mdi-trophy</v-icon>{{user.name}} : Ksh {{user.daily_sales}}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle>
              <span class="ml-3">Number of sales {{user.sales_count}}</span>
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin" v-if="user.sales_count > 0">
               Average Sales = Ksh {{(user.daily_sales/user.sales_count).toFixed()}}
            </v-card-subtitle>
        </v-card>

        <v-card
            dark
            color="primary"
            outlined
            v-else
          >
            <v-card-subtitle>
              <v-icon class="mr-1">mdi-account</v-icon>{{user.name}} : Ksh {{user.daily_sales}}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle>
              <span class="ml-3">Number of sales {{user.sales_count}}</span>
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle class="font-weight-thin" v-if="user.sales_count > 0">
               Average Sales = Ksh {{(user.daily_sales/user.sales_count).toFixed()}}
            </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth'],

  computed: {
     ...mapGetters(['isAdmin'])
  },

  data: () => ({
      value: [],
      cash: [],
      mpesa: [],
      card: [],
      credit: [],
      all_sales: [],
      all_sales_in24hrs: [],
      all_expenses: [],
      expenses_in_24hrs: [],

      users: [],
      user_sales_per_day: 0,
      yesterday_float: 0,

      winner: '',
      daily_sale: ''
    }),

    async fetch(){
      this.$axios.get(`/target_sales`).then(res => {
        this.daily_sale = res.data
      })
    },

    created() {
      this.cashSalesIn24hrs()
      this.mpesaSalesIn24hrs()
      this.cardSalesIn24hrs()
      this.creditSalesIn24hrs()
      this.sales_last_seven_days()

      this.allSales()
      this.allSalesIn24hrs()

      this.allExpenses()
      this.expensesIn24Hrs()

      this.fetchUserSales()
      this.fetchYesterdayFloat()
    },

    methods: {

      totalCost(arr){
        let cost = []
        if(arr.length > 0){
           arr.forEach(val => {
            cost.push(val.amount)
          })
          let sum = cost.reduce((a, b)=>{
            return a + b
          })
          return sum
        } else {
          return 0
        }
      },

      fetchYesterdayFloat(){
      this.$axios.get(`/yesterday_float`).then(res => {
        this.yesterday_float = res.data.data
      })
    },

      sales_last_seven_days() {
        this.$axios.get(`/sales_last_seven_days`).then(res => {
          this.value = res.data.reverse();
        }).catch(err => console.log(err));
      },

      cashSalesIn24hrs() {
        this.$axios.get(`/cashSalesIn24hrs`).then(res => {
          this.cash = res.data.data;
        }).catch(err => console.log(err));
      },

      mpesaSalesIn24hrs() {
        this.$axios.get(`/mpesaSalesIn24hrs`).then(res => {
          this.mpesa = res.data.data;
        }).catch(err => console.log(err));
      },

      cardSalesIn24hrs() {
        this.$axios.get(`/cardSalesIn24hrs`).then(res => {
          this.card = res.data.data;
        }).catch(err => console.log(err));
      },

      creditSalesIn24hrs() {
        this.$axios.get(`/creditSalesIn24hrs`).then(res => {
          this.credit = res.data.data;
        }).catch(err => console.log(err));
      },

      allSalesIn24hrs() {
        this.$axios.get(`/all_sales_in_24hrs`).then(res => {
          this.all_sales_in24hrs = res.data.data;
        }).catch(err => console.log(err));
      },

      allSales(){
        this.$axios.get(`/sales`).then(res => {
          this.all_sales = res.data.data;
        }).catch(err => console.log(err));
      },

      allExpenses(){
        this.$axios.get(`/expenses`).then(res => {
          this.all_expenses = res.data.data;
        }).catch(err => console.log(err));
      },

      expensesIn24Hrs(){
        this.$axios.get(`/expenses_in_24hrs`).then(res => {
          this.expenses_in_24hrs = res.data.data;
        }).catch(err => console.log(err));
      },

      fetchUserSales(){
        let sales_score = []
        this.$axios.get(`/user_sales`).then(res => {

          res.data.forEach(val => {
            let data = {
              name: val.name,
              daily_sales: val.daily_sales,
              sales_count: val.sales_count,
              winner: false
            }

            sales_score.push(val.daily_sales)

            this.users.push(data)
          })

            let sum = sales_score. reduce(function(a, b){
              return a + b;
            }, 0);

          if(sum>0){
            this.winner = Math.max.apply(Math, sales_score)
          }else{
            this.winner = -2
          }


          this.users.sort((a, b) => b.daily_sales - a.daily_sales)
        })
      },

      today_sales_per_user(user_name){
        let user_sales = this.all_sales_in24hrs.filter(val => {
          return val.user_order === user_name;
        })
        return this.totalCost(user_sales)
      },

      totalCost1(arr){
        let cost = []
        if(arr.length > 0){
           arr.forEach(val => {
            cost.push(val.cash_in_drawer)
          })
          let sum = cost.reduce((a, b)=>{
            return a + b
          })
          return sum
        } else {
          return 0
        }
      }
    }
  }
</script>


<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }

  .winner{
    background: orangered;
    animation: mymove 2s infinite;
  }

  .normal {
    background: #006064;
  }

  @keyframes mymove {
    0% {background-color: red;}
    25% {background-color: blueviolet;}
    50% {background-color: orange;}
    100% {background-color: #006064;}
  }
</style>
