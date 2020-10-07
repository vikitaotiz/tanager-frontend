<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card
            color="teal"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-key</v-icon>Shifts</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
                <v-btn block small color="orange" @click="openEndShift">END SHIFT</v-btn>
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle>
                <v-btn block small color="orange" dark to="/shifts">View Shifts</v-btn>
            </v-card-subtitle>

            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>

      </v-col>
      <v-col cols="12" md="4">
        <v-card
            color="primary"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-account</v-icon>Users</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
                  <v-card outlined class="pa-1">
                    All Users : {{number_of_users.length}}
                    <v-btn class="ml-10" x-small color="orange" dark to="/users">View All Users</v-btn>
                  </v-card>
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle>
                  <v-card outlined class="pa-1">
                    Online users : {{online_users}}
                    <v-btn class="ml-5" x-small color="orange" dark to="/online_users">View Online Users</v-btn>
                  </v-card>
            </v-card-subtitle>

            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>

      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="green"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-domain</v-icon>Departments</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
              Number of departments : {{number_of_departments.length}}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn text to="/departments">View More</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="purple"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-lock</v-icon>Roles</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
              Number of roles : {{number_of_roles.length}}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn text to="/roles">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="orange"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-marker-cancel</v-icon>Cancelling Reasons</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
              Number of reasons : {{number_of_cancels.length}}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn text to="/cancels">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="red"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Voids</v-card-title>
              <v-divider></v-divider>
            <v-card-subtitle>
              Number of voids : {{number_of_voids.length}}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn text to="/voids">View More</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>

      <v-col cols="12" md="4">
         <v-card
            color="accent"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-file</v-icon> Reports</v-card-title>
              <v-divider></v-divider>
            <v-card-actions>
              <v-btn text to="/reports">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Expenses</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'expenses'}">View More</v-btn>
            </v-card-actions>
          </v-card>

      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Variables</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'constants'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Procurements</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'procurements'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Timestamps</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'data_logs'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

    </v-row>

    <v-dialog
      v-model="dialogShift"
      width="800"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
        <v-icon>mdi-plus-outline</v-icon>
          End Shift
          <v-spacer></v-spacer>
          Today's Sales Ksh {{totalCost(all_sales_in24hrs)}}
        </v-card-title>

        <v-card-text>
          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">
                <v-list bordered>
                  <v-list-item>
                    <strong>Cash : </strong> Ksh {{totalCost(cash)}}
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <strong>Mpesa : </strong> Ksh {{totalCost(mpesa)}}
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <strong>Card : </strong> Ksh {{totalCost(card)}}
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <strong>Credit : </strong> Ksh {{totalCost(credit)}}
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <strong>Starting Float : </strong> Ksh {{totalCost1(yesterday_float)}}
                  </v-list-item>
                </v-list>


              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">
                <v-card-title>Today's Expense : Ksh {{totalCost(expenses_in_24hrs)}}</v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle>
                  (Starting Float + Cash) - Expense = Cash At Hand
                <v-divider></v-divider>
                  ({{totalCost1(yesterday_float)}} + {{totalCost(cash)}}) - {{totalCost(expenses_in_24hrs)}} = {{(totalCost1(yesterday_float) + totalCost(cash)) - totalCost(expenses_in_24hrs)}}<br>
                </v-card-subtitle>
                <v-divider></v-divider>
                <strong class="ml-5">Cash At Hand : Ksh {{totalCost(cash) - totalCost(expenses_in_24hrs)}}</strong>
                <v-divider></v-divider>
                <v-card-subtitle>
                  <v-text-field dense outlined autofocus label="Cash In Drawer" type="number" v-model="cash_in_drawer"></v-text-field><br>
                  <strong>Difference : {{totalCost(cash) - totalCost(expenses_in_24hrs)}} - {{cash_in_drawer}} = {{(totalCost(cash) - totalCost(expenses_in_24hrs) - cash_in_drawer)}}</strong>
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="headline grey lighten-2">

          <v-btn
            color="red"
            text
            @click="dialogShift = false"
          >
          <v-icon small>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            v-if="cash_in_drawer"
            color="primary"
            outlined
            @click="confirmEndShift"
          >
            <v-icon small>mdi-skip-backward</v-icon> End Shift
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'admin'],
  data(){
    return {
        online_users: 0,
        number_of_users: '',
        number_of_departments: '',
        number_of_roles: '',
        number_of_cancels: '',
        number_of_voids: '',

        dialogShift: '',
        all_sales_in24hrs: '',
        cash: '',
        mpesa: '',
        card: '',
        credit: '',
        expenses_in_24hrs: '',
        cash_in_drawer: 0,
        yesterday_float: 0
      }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  created(){
    this.fetchUsers();
    this.fetchRoles();
    this.fetchCancels();
    this.fetchDepartments();
    this.fetchVoids();
    this.fetchLoggedInUser();

    this.allSalesIn24hrs();
    this.fetchYesterdayFloat();
    this.cashSalesIn24hrs();
    this.mpesaSalesIn24hrs();
    this.cardSalesIn24hrs();
    this.creditSalesIn24hrs();
    this.expensesIn24Hrs();

    socket.on('recordLoggedInUser', data => {
      this.online_users++
    })

    socket.on('recordLoggedOutUser', data => {
      this.online_users--
    })
  },

  methods: {
    fetchUsers(){
      this.$axios.get('/users')
          .then(res => this.number_of_users = res.data.data)
    },

    fetchRoles(){
      this.$axios.get('/roles')
          .then(res => this.number_of_roles = res.data.data)
    },

    fetchCancels(){
      this.$axios.get('/cancels')
          .then(res => this.number_of_cancels = res.data.data)
    },

    fetchDepartments(){
      this.$axios.get('/departments')
          .then(res => this.number_of_departments = res.data.data)
    },

    fetchVoids(){
      this.$axios.get('/loggers')
          .then(res => this.number_of_voids = res.data.data)
    },

    fetchLoggedInUser(){
      this.$axios.get('/loggedinusers')
          .then(res => this.online_users = res.data.data.length)
    },

    openEndShift(){
      this.dialogShift = true
      this.dialogLoadingShiftData = true
    },

    confirmEndShift(){
      let cash_hand = this.totalCost(this.cash) - this.totalCost(this.expenses_in_24hrs)
      let cash_difference = (this.totalCost(this.cash) - this.totalCost(this.expenses_in_24hrs)) - this.cash_in_drawer

      let data = {
        daily_sale: this.totalCost(this.all_sales_in24hrs),
        daily_expense: this.totalCost(this.expenses_in_24hrs),
        cash: this.totalCost(this.cash),
        mpesa: this.totalCost(this.mpesa),
        card: this.totalCost(this.card),
        credit: this.totalCost(this.credit),
        cash_at_hand: cash_hand,
        cash_in_drawer: this.cash_in_drawer,
        cash_difference: cash_difference,
        user_id: this.loggedInUser.data.id
      }

      this.$axios.post('/shifts', data).then(res => {
        console.log(res.data.data)
        this.dialogShift = false
        this.$toast.success('Shift Ended Successfully', {
          duration: 2000
        })
      }).catch(err => {
        this.$toast.error('There was an error', {
          duration: 2000
        })
      })
    },


    allSalesIn24hrs() {
        this.$axios.get(`/all_sales_in_24hrs`).then(res => {
          this.all_sales_in24hrs = res.data.data;
        }).catch(err => console.log(err));
      },

    fetchYesterdayFloat(){
      this.$axios.get(`/yesterday_float`).then(res => {
        this.yesterday_float = res.data.data
      })
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

    expensesIn24Hrs(){
        this.$axios.get(`/expenses_in_24hrs`).then(res => {
          this.expenses_in_24hrs = res.data.data;
        }).catch(err => console.log(err));
      },

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
      },

  }

}
</script>

<style>

</style>
