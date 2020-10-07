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
        <v-toolbar-title>Provider</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Provider Name..."
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
                    <v-text-field autofocus v-model="editedItem.name" label="Provider Name"></v-text-field>
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
        <v-card-title class="headline">Confirm Provider Deletion?</v-card-title>
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

      providers: [],

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
        return this.editedIndex === -1 ? 'New Provider' : 'Edit Provider'
      },

      filteredData(){
          return this.providers.filter((text) => {
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
        this.fetchProviders()
      },

      fetchProviders(){
        this.$axios.get(`/providers`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name,
                 time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                 expenses: val.expenses
               }

               this.providers.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.providers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedExpenseCategory = item
      },

      deleteItem (item) {
        const index = this.providers.indexOf(item)

        let delete_expense_category = this.$axios.delete(`/providers/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Provider deleted successfully!`, {
               duration: 1000
             })
             this.providers.splice(index, 1)
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
              // Object.assign(this.providers[this.editedIndex], this.editedItem)
          this.$axios.patch(`/providers/${this.editedItem.id}`, {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
            })
           .then(response => {
             this.$toast.success(`Provider edited successfully!`, {
               duration: 1000
             })
              Object.assign(this.providers[this.editedIndex], this.editedItem)
              this.close()
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/providers`, {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
          })
           .then(response => {
             this.$toast.success(`Provider created successfully!`, {
               duration: 1000
             })
              let val = response.data.data;
              let data = {
                name: val.name,
                time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                expenses: val.expenses
              }

              this.providers.unshift(data)
              this.close()

           }).catch(error => { console.log(error.data) })
          //this.providers.push(this.editedItem)
        }
      },
    },
  }
</script>
