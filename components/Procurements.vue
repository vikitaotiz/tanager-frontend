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
        <v-toolbar-title>Procurements</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Procurement Name..."
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
                    <v-text-field outlined dense v-model="editedItem.name" autofocus label="Procurement Name"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-overflow-btn
                      editable
                      dense
                      :items="procurementcats"
                      label="Select Procurement Category..."
                      item-text="name"
                      item-value="id"
                      v-model="editedItem.procurementcat_id"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>
                <v-row>
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
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red" text @click="close">Cancel</v-btn>
              <v-spacer></v-spacer>
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

<v-dialog v-model="dialogConfirmDelete" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Confirm Procurement Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedTable)">Confirm</v-btn>
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
      deletedProcurement: '',
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Measurement Unit', value: 'measurementunit' },
        { text: 'Category', value: 'category' },
        { text: 'Created On', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      measurementunits: [],
      procurements: [],
      procurementcats: [],

      editedIndex: -1,

      editedItem: {
        name: '',
        measurementunit_id: '',
        procurementcat_id: ''
      },

      defaultItem: {
        name: '',
        measurementunit_id: '',
        procurementcat_id: ''
      },
    }),

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'New  Procurement' : 'Edit  Procurement'
      },

      filteredData(){
          return this.procurements.filter((text) => {
            return  text.name.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async fetch(){
      await this.$axios.get(`/procurements`)
        .then(response => {
            this.procurements = response.data.data;
        })
        .catch(error => {
            console.log(error.data);
        })

      await this.$axios.get(`/measurementunits`)
        .then(response => {
            this.measurementunits = response.data.data;
        })
        .catch(error => {
            console.log(error.data);
        })

      await this.$axios.get(`/procurementcats`)
        .then(response => {
            this.procurementcats = response.data.data;
        })
        .catch(error => {
            console.log(error.data);
        })
    },

    methods: {
      back(){
        this.$router.back();
      },

      editItem (item) {
        this.editedIndex = this.procurements.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedTable = item
      },

      deleteItem (item) {
        const index = this.procurements.indexOf(item)

        let delete_user = this.$axios.delete(`/procurements/${item.id}`)
           .then(response => {
             this.$toast.success('Procurement deleted successfully!', {
               duration: 1000
             })
             this.procurements.splice(index, 1)
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
              Object.assign(this.procurements[this.editedIndex], this.editedItem)
          let data1 = {
            name: this.editedItem.name,
            measurementunit_id: this.editedItem.measurementunit_id,
            procurementcat_id: this.editedItem.procurementcat_id,
            user_id: this.loggedInUser.data.id
          }
          this.$axios.patch(`/procurements/${this.editedItem.id}`, data1)
           .then(response => {
             this.$toast.success('Procurement edited successfully!', {
               duration: 1000
             })
             this.close()
              // Object.assign(this.procurements[this.editedIndex], this.editedItem)
           }).catch(error => {
             this.$toast.error('There was an error. Try again!', {
               duration: 1000
             })
            })
        } else {

          let procurement = {
            name: this.editedItem.name,
            measurementunit_id: this.editedItem.measurementunit_id,
            procurementcat_id: this.editedItem.procurementcat_id,
            user_id: this.loggedInUser.data.id
          }

          this.$axios.post(`/procurements`, procurement)
           .then(response => {
             this.$toast.success('Procurement created successfully!', {
               duration: 1000
             })
             this.procurements.push(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error('There was an error. Try again!', {
               duration: 1000
             })
            })
          // this.procurements.push(this.editedItem)
        }

      },
    },
  }
</script>
