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
        <v-toolbar-title>Users</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search User Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px" persistent>
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
                    <v-text-field outlined dense v-model="editedItem.name" label="User Name"></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field outlined type="email" dense v-model="editedItem.email" label="User Email"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      dense
                      :items="roles"
                      item-text="name"
                      item-value="id"
                      label="Select User Role"
                      outlined
                      v-model="editedItem.role_id"
                    ></v-select>
                  </v-col>

                  <v-col>
                    <v-select
                        dense
                        :items="departments"
                        item-text="name"
                        item-value="id"
                        label="Select User Department"
                        outlined
                        v-model="editedItem.department_id"
                      ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field outlined type="number" dense v-model="editedItem.pin" label="Enter User Pin"></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field outlined type="password" dense v-model="editedItem.password" label="Enter User Password"></v-text-field>
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
        v-if="item.role !== 'Administrator'"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-if="item.role !== 'Administrator'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm User Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedUser)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>

  export default {
    data: () => ({
      dialog: false,
      dialogConfirmDelete: false,
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Pin', value: 'pin' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Department', value: 'department' },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      users: [],
      departments: [],
      roles: [],
      deletedUser: '',

      editedIndex: -1,

      editedItem: {
        name: '',
        email: '',
        pin: '',
        password: '',
        role_id: '',
        department_id: ''
      },

      defaultItem: {
        name: '',
        email: '',
        pin: '',
        password: '',
        role_id: '',
        department_id: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Create New User' : 'Edit User'
      },

      filteredData(){
          return this.users.filter((text) => {
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
      this.fetchRoles()
      this.fetchDepartments()
    },

    methods: {
      back(){
        this.$router.back();
      },

      initialize () {
        this.fetchUsers()
      },

      fetchUsers(){

        this.$axios.get(`/users`)
           .then(response => {
             this.users = response.data.data;
            //  console.log(response.data);
           })
           .catch(error => {
             console.log(error.data);
           })
        },

        fetchRoles(){
        this.$axios.get(`/roles`)
           .then(response => {
             this.roles = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

        fetchDepartments(){
        this.$axios.get(`/departments`)
           .then(response => {
             this.departments = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedUser = item
      },

      deleteItem(item){
        const index = this.users.indexOf(item)

        let delete_user = this.$axios.delete(`/users/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`${item.name} deleted`, {
               duration: 1000
             })
             this.users.splice(index, 1)
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
              Object.assign(this.users[this.editedIndex], this.editedItem)
          this.$axios.patch(`/users/${this.editedItem.id}`, {
            name: this.editedItem.name,
            email: this.editedItem.email,
            role_id: this.editedItem.role_id,
            department_id: this.editedItem.department_id,
            pin: this.editedItem.pin,
            password: this.editedItem.password,
            pwd_clr: this.editedItem.password
          })
           .then(response => {
             this.$toast.success(`User edited`, {
               duration: 1000
             })
            this.close()
              // Object.assign(this.users[this.editedIndex], this.editedItem)
           }).catch(error => {
             this.$toast.error(`There was an error. Ensure all fields are filled`, {
               duration: 2000
             })
            })
        } else {

          let data2 = {
            name: this.editedItem.name,
            email: this.editedItem.email,
            role_id: this.editedItem.role_id,
            department_id: this.editedItem.department_id,
            pin: this.editedItem.pin,
            password: this.editedItem.password,
            pwd_clr: this.editedItem.password
          }
          // console.log(data2)
          this.$axios.post(`/users`, data2)
           .then(response => {
             this.$toast.success(`New User created`, {
               duration: 1000
             })
             this.users.push(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error(`There was an error. Ensure all fields are filled`, {
               duration: 2000
             })
            })
          // this.users.push(this.editedItem)
        }
      },
    },
  }
</script>
