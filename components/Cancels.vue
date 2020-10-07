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
        <v-toolbar-title>Voids</v-toolbar-title>
        <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Void description..."
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
                    <v-textarea v-model="editedItem.description" outlined label="Void Description"></v-textarea>
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
        <v-card-title class="headline">Confirm Void Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedCancel)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>
import { mapGetters } from 'vuex';

  export default {
    data: () => ({
      dialog: false,
      dialogConfirmDelete: false,
      deletedCancel: '',
      search: '',
      headers: [
        {
          text: 'Description',
          align: 'start',
          sortable: false,
          value: 'description',
        },
        { text: 'User', value: 'user' },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      cancels: [],

      editedIndex: -1,

      editedItem: {
        description: ''
      },

      defaultItem: {
        description: ''
      },
    }),

    computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'New Void' : 'Edit Void'
      },

      filteredData(){
          return this.cancels.filter((text) => {
            return  text.description.toLowerCase().includes(this.search.toLowerCase())
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
        this.fetchCancels()
      },

      fetchCancels(){
        this.$axios.get(`/cancels`)
           .then(response => {
             this.cancels = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.cancels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedCancel = item
      },

      deleteItem (item) {
        const index = this.cancels.indexOf(item)

        let delete_user = this.$axios.delete(`/cancels/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Void deleted successfully!`, {
               duration: 1000
             })
             this.cancels.splice(index, 1)
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
              Object.assign(this.cancels[this.editedIndex], this.editedItem)
          this.$axios.patch(`/cancels/${this.editedItem.id}`, { description: this.editedItem.description })
           .then(response => {
             console.log('1234')
              // Object.assign(this.cancels[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {

          let data = {
            description: this.editedItem.description,
            user_id: this.loggedInUser.data.id
          }

          this.$axios.post(`/cancels`, data)
           .then(response => {
             this.$toast.success(`Void created successfully!`, {
               duration: 1000
             })
             this.cancels.push(response.data.data)
           }).catch(error => { console.log(error.data) })
          // this.cancels.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
