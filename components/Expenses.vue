<template>
<div>
  <v-data-table
    :headers="headers"
    :items="filteredData"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
      <v-toolbar flat color="white">
        <v-toolbar-title>Expenses</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Expense Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on" fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-textarea
                      v-model="editedItem.content"
                      autofocus
                      outlined
                      dense
                      label="Enter Expense Description..."
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-overflow-btn
                      editable
                      dense
                      :items="expensecats"
                      label="Select Expense Category..."
                      item-text="name"
                      item-value="id"
                      v-model="editedItem.expensecat_id"
                    ></v-overflow-btn>
                  </v-col>
                  <v-col>
                    <v-overflow-btn
                      editable
                      dense
                      :items="measurementunits"
                      label="Select Measurement Units..."
                      item-text="name"
                      item-value="id"
                      v-model="editedItem.measurementunit_id"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-overflow-btn
                      editable
                      dense
                      :items="users"
                      label="Select user..."
                      item-text="name"
                      item-value="name"
                      v-model="editedItem.user_requesting_expense"
                    ></v-overflow-btn>
                  </v-col>
                  <v-col>
                    <v-text-field outlined dense type="number" v-model="editedItem.quantity" label="Expense Quantity"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field outlined dense type="number" v-model="editedItem.amount" label="Expense Amount"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-overflow-btn
                      editable
                      dense
                      :items="providers"
                      label="Select Service Provider..."
                      item-text="name"
                      item-value="id"
                      v-model="editedItem.provider_id"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      :items="paymentmodes"
                      outlined
                      dense
                      label="Select payment mode..."
                      v-model="editedItem.paymentmode_id"
                      item-text="name"
                      item-value="id"
                    ></v-select>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        class="mr-2"
        @click="getDetails(item)"
        color="primary"
        dark
      >
        mdi-eye
      </v-icon>
      <v-icon
        class="mr-2"
        @click="editItem(item)"
        color="blue"
        dark
      >
        mdi-pencil
      </v-icon>
      <v-icon
        @click="confirmDelete(item)"
        color="red"
        dark
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

    <v-dialog v-model="dialogConfirmDelete" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Confirm Expense Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedExpense)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogDetails"
      width="800"
      persistent
    >

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Expense Details
          <v-spacer></v-spacer>
          Requested By {{expenseDetails.user_requesting_expense}}
        </v-card-title>

        <v-card-text>

          <v-card outlined class="mt-2 pa-1">
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Content</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.content}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Amount (Kshs)</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.amount}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Expense Category</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.category ? expenseDetails.category.name : 'Not Provided'}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Approved By</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.user}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Provider</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.provider ? expenseDetails.provider.name : 'Not Provided'}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Payment Mode</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.payment_mode ? expenseDetails.payment_mode.name : 'Not Provided'}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Measurement Unit</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.unit ? expenseDetails.unit.name : 'Not Provided'}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Quantity</v-list-item-title>
                    <v-list-item-subtitle>{{expenseDetails.quantity ? expenseDetails.quantity : 'Not Provided'}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

          </v-card>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <span>Created On {{expenseDetails.time}}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogDetails = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>

</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment';

export default {

    data: () => ({
      users: [],
      dialog: false,
      dialogDetails: false,
      dialogConfirmDelete: false,
      deletedExpense: '',
      search: '',
      headers: [
        {
          text: 'Requested By',
          align: 'start',
          sortable: false,
          value: 'user_requesting_expense',
        },
        { text: 'Date', value: 'time' },
        { text: 'Authorized By', value: 'user' },
        { text: 'Content', value: 'content' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      modes: [
        { name: 'Cash'},
        { name: 'Mpesa'},
        { name: 'Card'}
      ],

      expenses: [],
      providers: [],
      expensecats: [],
      measurementunits: [],
      paymentmodes: [],
      expenseDetails: '',


      editedIndex: -1,

      editedItem: {
        user_requesting_expense: '',
        content: '',
        quantity: 0,
        amount: 0,

        expensecat_id: '',
        measurementunit_id: '',
        paymentmode_id: '',
        provider_id: ''

      },

      defaultItem: {
        user_requesting_expense: '',
        content: '',
        quantity: 0,
        amount: 0,

        expensecat_id: '',
        measurementunit_id: '',
        paymentmode_id: '',
        provider_id: ''
      },
    }),

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
      },

      filteredData(){
          return this.expenses.filter((text) => {
            return  text.content.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
      this.fetchUsers()
      this.fetchExpensecats()
      this.fetchMeasurementunits()
      this.fetchPaymentmodes()
      this.fetchProviders()
    },

    methods: {
      back(){
        this.$router.back();
      },

      getDetails(item){
        this.dialogDetails = true
        this.expenseDetails = item
      },

      initialize () {
        this.fetchExpenses()
      },

      fetchUsers(){
        this.$axios.get('/users')
        .then( res => {
          this.users = res.data.data
        })
        .catch(err => {
          console
        });
      },

      fetchExpenses(){
        this.$axios.get(`/expenses`)
           .then(response => {

             response.data.data.forEach(val => {
               let data = {
                 amount: val.amount,
                 content: val.content,
                 time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                 id: val.id,
                 payment_mode: val.payment_mode,
                 provider: val.provider,
                 quantity: val.quantity,
                 unit: val.measurement_unit,
                 category: val.expense_cat,
                 user_requesting_expense: val.user_requesting_expense,
                 user: val.user
               }

               this.expenses.push(data)
             })

           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchExpensecats(){
        this.$axios.get(`/expensecats`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name
               }

               this.expensecats.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchMeasurementunits(){
        this.$axios.get(`/measurementunits`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name
               }
               this.measurementunits.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchPaymentmodes(){
        this.$axios.get(`/paymentmodes`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name
               }

               this.paymentmodes.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchProviders(){
        this.$axios.get(`/providers`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name
               }

               this.providers.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.expenses.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedExpense = item
      },

      deleteItem (item) {
        const index = this.expenses.indexOf(item)

        let delete_user = this.$axios.delete(`/expenses/${item.id}`)
           .then(response => {
             this.$toast.success('Expense deleted successfully!', {
               duration: 1000
             })
             this.expenses.splice(index, 1)
           }).catch(error => { console.log(error)})

        this.dialogConfirmDelete = false

      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {

            Object.assign(this.expenses[this.editedIndex], this.editedItem)

            let data1 = {
              user_requesting_expense: this.editedItem.user_requesting_expense,
              user_id: this.loggedInUser.data.id,
              content: this.editedItem.content,
              quantity: this.editedItem.quantity,
              amount: this.editedItem.amount,
              paymentmode_id: this.editedItem.paymentmode_id,
              measurementunit_id: this.editedItem.measurementunit_id,
              expensecat_id: this.editedItem.expensecat_id,
              provider_id: this.editedItem.provider_id
            }

            // console.log(this.editedItem)

          this.$axios.patch(`/expenses/${this.editedItem.id}`, data1)
           .then(response => {
             this.$toast.success('Expense edited successfully!', {
               duration: 1000
             })

             this.close()
             this.expenses = []
             this.fetchExpenses()
              // Object.assign(this.expenses[this.editedIndex], this.editedItem)
           }).catch(error => {
             this.$toast.error('There was an error. Try again!', {
               duration: 1000
             })
           })
        } else {

          let expense = {
            user_requesting_expense: this.editedItem.user_requesting_expense,
            user_id: this.loggedInUser.data.id,
            content: this.editedItem.content,
            quantity: this.editedItem.quantity,
            amount: this.editedItem.amount,
            paymentmode_id: this.editedItem.paymentmode_id,
            measurementunit_id: this.editedItem.measurementunit_id,
            expensecat_id: this.editedItem.expensecat_id,
            provider_id: this.editedItem.provider_id
          }

          this.$axios.post(`/expenses`, expense)
           .then(response => {
             this.$toast.success('Expense created successfully!', {
               duration: 1000
             })
             this.expenses.unshift(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error('There was an error. Try again!', {
               duration: 1000
             })
            })
        }

      },
    },
  }
</script>
