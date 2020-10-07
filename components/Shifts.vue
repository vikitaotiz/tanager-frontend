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
        <v-toolbar-title>Shifts</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Shift Date..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.name" autofocus label="Shift Name"></v-text-field>
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
      <!-- <v-icon
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon> -->
      <v-icon
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Confirm Shift Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedShift)">Confirm</v-btn>
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
      dialog: false,
      dialogConfirmDelete: false,
      deletedShift: '',
      search: '',
      headers: [
        {
          text: 'Created On',
          align: 'start',
          value: 'time'
        },
        { text: 'Cash At Hand', value: 'cash_at_hand' },
        { text: 'Cash In Drawer', value: 'cash_in_drawer' },
        { text: 'Closed By', value: 'user' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      shifts: [],

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
        return this.editedIndex === -1 ? 'New Shift' : 'Edit Shift'
      },

      filteredData(){
          return this.shifts.filter((text) => {
            return  text.time.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.fetchShifts()
    },

    methods: {
      back(){
        this.$router.back();
      },

      fetchShifts(){
        this.$axios.get(`/shifts`)
           .then(res => {

            res.data.data.forEach(val => {
              let data = {
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                 cash_at_hand: val.cash_at_hand,
                 cash_in_drawer: val.cash_in_drawer,
                 user: val.user
              }
              this.shifts.push(data)
            })

           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.shifts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedShift = item
      },

      deleteItem (item) {
        const index = this.shifts.indexOf(item)

        let delete_user = this.$axios.delete(`/shifts/${item.id}`)
           .then(response => {
             this.$toast.success('Shift deleted successfully!', {
               duration: 1000
             })
             this.shifts.splice(index, 1)
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
              Object.assign(this.shifts[this.editedIndex], this.editedItem)
          this.$axios.patch(`/shifts/${this.editedItem.id}`, {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
           })
           .then(response => {
             this.$toast.success('Shift edited successfully!', {
               duration: 1000
             })
             this.close()
              // Object.assign(this.shifts[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {

          let shift = {
            name: this.editedItem.name,
            user_id: this.loggedInUser.data.id
          }
          // console.log(this.loggedInUser.data.id)
          this.$axios.post(`/shifts`, shift)
           .then(response => {
             this.$toast.success('Shift created successfully!', {
               duration: 1000
             })
             this.shifts.push(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error('There was an error. Try again!', {
               duration: 1000
             })
            })
          // this.shifts.push(this.editedItem)
        }

      },
    },
  }
</script>
