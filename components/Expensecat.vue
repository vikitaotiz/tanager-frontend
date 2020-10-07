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
        <v-toolbar-title>Expense Categories</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Expense Category Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
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
                    <v-text-field autofocus v-model="editedItem.name" label="Expense Category Name"></v-text-field>
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

    <template v-slot:item.users="{ item }">
      <v-simple-table dense v-if="item.users.length > 0">
        <thead>
          <th>Name</th>
        </thead>
        <tbody>
          <tr v-for="(user, index) in item.users" :key="index">
            <td>{{user.name}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm Expense Category Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedExpenseCategory)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    data: () => ({
      dialog: false,
      dialogConfirmDelete: false,
      deletedExpenseCategory: '',
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Expenses', value: 'expenses' },
        { text: 'Date', value: 'time' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      expensecats: [],

      editedIndex: -1,

      editedItem: {
        name: ''
      },

      defaultItem: {
        name: ''
      },
    }),

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'New Expense Category' : 'Edit Expense Category'
      },

      filteredData(){
          return this.expensecats.filter((text) => {
            return  text.name.toLowerCase().includes(this.search.toLowerCase())
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
    },

    methods: {
      back(){
        this.$router.back();
      },

      initialize () {
        this.fetchExpensecats()
      },

      fetchExpensecats(){
        this.$axios.get(`/expensecats`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name,
                 time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                 expenses: val.expenses
               }

               this.expensecats.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.expensecats.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedExpenseCategory = item
      },

      deleteItem (item) {
        const index = this.expensecats.indexOf(item)

        let delete_expense_category = this.$axios.delete(`/expensecats/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Expense Category deleted successfully!`, {
               duration: 1000
             })
             this.expensecats.splice(index, 1)
           }).catch(error => { console.log(error)})

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
              // Object.assign(this.expensecats[this.editedIndex], this.editedItem)
          this.$axios.patch(`/expensecats/${this.editedItem.id}`, {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
            })
           .then(response => {
             this.$toast.success(`Expense Category edited successfully!`, {
               duration: 1000
             })
              Object.assign(this.expensecats[this.editedIndex], this.editedItem)
              this.close()
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/expensecats`, {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
          })
           .then(response => {
             this.$toast.success(`Expense Category created successfully!`, {
               duration: 1000
             })
              let val = response.data.data;
              let data = {
                name: val.name,
                time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                expenses: val.expenses
              }

              this.expensecats.unshift(data)
              this.close()

           }).catch(error => { console.log(error.data) })
          //this.expensecats.push(this.editedItem)
        }
      },
    },
  }
</script>
