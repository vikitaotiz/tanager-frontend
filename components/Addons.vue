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
        <v-toolbar-title>Addons</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Addon Name..."
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
                    <v-text-field outlined dense v-model="editedItem.name" label="Addon Name"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field outlined type="number" dense v-model="editedItem.buying_price" label="Buying Price..."></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field outlined type="number" dense v-model="editedItem.selling_price" label="Selling Price..."></v-text-field>
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

<v-dialog v-model="dialogConfirmDelete" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Confirm Addon Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedAddon)">Confirm</v-btn>
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
      dialogConfirmDelete: false,
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Buying Price', value: 'buying_price' },
        { text: 'Selling Price', value: 'selling_price' },
        { text: 'Created On', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      addons: [],
      deletedAddon: '',

      editedIndex: -1,

      editedItem: {
        name: '',
        buying_price: '',
        selling_price: ''
      },

      defaultItem: {
        name: '',
        buying_price: '',
        selling_price: ''
      },
    }),

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'Create New Addon' : 'Edit Addon'
      },

      filteredData(){
          return this.addons.filter((text) => {
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
        this.fetchAddons()
      },

      fetchAddons(){
        this.$axios.get(`/addons`)
           .then(response => {
             this.addons = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.addons.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedAddon = item
      },

      deleteItem(item){
        const index = this.addons.indexOf(item)

        let delete_addon = this.$axios.delete(`/addons/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`${item.name} deleted`, {
               duration: 1000
             })
             this.addons.splice(index, 1)
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
              Object.assign(this.addons[this.editedIndex], this.editedItem)
          this.$axios.patch(`/addons/${this.editedItem.id}`, { name: this.editedItem.name })
           .then(response => {
             console.log('1234')
              // Object.assign(this.addons[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {

          let data2 = {
            name: this.editedItem.name,
            buying_price: this.editedItem.buying_price,
            selling_price: this.editedItem.selling_price,
            user_id: this.loggedInUser.data.id
          }
          this.$axios.post(`/addons`, data2)
           .then(response => {
             this.$toast.success(`New Addon created`, {
               duration: 1000
             })
             this.addons.push(response.data.data)
           }).catch(error => { console.log(error.data) })
        }
        this.close()
      },
    },
  }
</script>
