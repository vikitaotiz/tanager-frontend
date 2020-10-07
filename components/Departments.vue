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
        <v-toolbar-title>Departments</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Department Name..."
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
                    <v-text-field autofocus v-model="editedItem.name" label="Department Name"></v-text-field>
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
        v-if="item.name !== 'Administration'"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-if="item.name !== 'Administration'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogConfirmDelete" persistent max-width="380">
      <v-card>
        <v-card-title class="headline">Confirm Department Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedDepartment)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Users', value: 'users' },
        { text: 'Created By', value: 'created by' },
        { text: 'Created On', value: 'created on' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      departments: [],
      deletedDepartment: '',
      dialogConfirmDelete: false,

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
        return this.editedIndex === -1 ? 'New Department' : 'Edit Department'
      },

      filteredData(){
          return this.departments.filter((text) => {
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
        this.fetchDepartments()
      },

      fetchDepartments(){
        this.$axios.get(`/departments`)
           .then(response => {
             this.departments = response.data.data;
             console.log(this.departments)
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.departments.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedDepartment = item
      },

      deleteItem (item) {
        const index = this.departments.indexOf(item)

        let delete_user = this.$axios.delete(`/departments/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false

             this.$toast.success(`${item.name} deleted`, {
               duration: 1000
             })

             this.departments.splice(index, 1)
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
              Object.assign(this.departments[this.editedIndex], this.editedItem)
          this.$axios.patch(`/departments/${this.editedItem.id}`, { name: this.editedItem.name })
           .then(response => {
              // Object.assign(this.departments[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          let data = {
            name: this.editedItem.name,
            creator_id: this.loggedInUser.data.id
          }
          this.$axios.post(`/departments`, data)
           .then(response => {

             this.$toast.success('New Department Created', {
               duration: 1000
             })

             this.departments.push(response.data.data)
           }).catch(error => { console.log(error.data) })
          //this.departments.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
