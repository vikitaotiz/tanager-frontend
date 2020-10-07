<template>
  <div>
    <v-data-iterator
              :items="filteredData"
              :items-per-page.sync="itemsPerPage"
              :search="searchRequest"
            >
              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="request in props.items"
                    :key="request.name"
                    cols="12"
                    md="6"
                  >
                    <v-card outlined>
                      <v-card-subtitle style="background: #006064; color: #fff;">
                        Requested By : {{ request.user }}
                        <v-divider dark color="white"></v-divider>
                        <small>Requested On : {{ request.time }}</small>
                      </v-card-subtitle>
                      <v-divider></v-divider>

                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-header><small><u>More Details...</u></small></v-expansion-panel-header>
                            <v-expansion-panel-content>

                                  <v-simple-table dense>
                                    <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th class="text-left">Qty</th>
                                          <th class="text-left">Name</th>
                                          <th class="text-left">Units</th>
                                          <th v-if="request.content.length > 1" class="text-left">Accept</th>
                                          <th v-if="request.content.length > 1" class="text-left">Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="(item, index) in request.content" :key="index">
                                          <td>{{ item.qty }}</td>
                                          <td>{{ item.name }}</td>
                                          <td>{{ item.measurementunit }}</td>
                                          <td v-if="request.content.length > 1">
                                            <v-icon dark color="primary" @click="acceptSingle(request, item)">mdi-arrow-right</v-icon>
                                          </td>
                                          <td v-if="request.content.length > 1">
                                             <v-icon dark color="red" @click="confirmSingle(request, item)">mdi-delete</v-icon>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                  <v-divider></v-divider>
                                  <v-row>
                                    <v-col><v-btn small block dark color="primary" @click="openInfo(request)">Accept All</v-btn></v-col>
                                    <v-col><v-btn small text block dark color="red" @click="confirmDelete(request)">Reject All</v-btn></v-col>
                                  </v-row>

                            </v-expansion-panel-content>
                          </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:header>
                <v-toolbar
                  dark
                  color="primary"
                  class="mb-1"
                >
                <v-btn text @click="back">
                    <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>

                <v-list-item-content>
                      <v-list-item-title><v-icon class="mr-2">mdi-monitor-dashboard</v-icon>
                        User Requests
                      </v-list-item-title>
                    </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchRequest"
                    dense
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search Supply..."
                  ></v-text-field>
                </v-toolbar>

                  </template>
            </v-data-iterator>

    <v-dialog v-model="dialogConfirmDelete" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Reject Request from {{deletedRequest.user}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedRequest)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-dialog v-model="confirmSingleDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Remove {{delete_item.name}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
          This process is permanent !!!
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="confirmSingleDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteSingleItem(delete_item)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAccept" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Accept {{user_request_item.name}}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
                <v-overflow-btn
                      editable
                      dense
                      :items="providers"
                      label="Select Service Provider..."
                      item-text="name"
                      item-value="name"
                      v-model="editedItem.provider_id"
                    ></v-overflow-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="red" text @click="dialogAccept = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="editedItem.provider_id" color="primary" text @click="sendSingleToSupplier(user_request_item)">Send To Supplier</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogAcceptAll" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Accept request from {{user_request.user}}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
                <v-overflow-btn
                      editable
                      dense
                      :items="providers"
                      label="Select Service Provider..."
                      item-text="name"
                      item-value="name"
                      v-model="editedItem.provider_id"
                    ></v-overflow-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="red" text @click="dialogAcceptAll = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="editedItem.provider_id" color="primary" text @click="sendAllToSupplier(user_request)">Send To Supplier</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default {

  data(){
    return {
      searchRequest: '',
      itemsPerPage: 30,

      userrequests: [],
      providers: [],

      editedIndex: -1,

      editedItem: {
        name: '',
        provider_id: ''
      },

      defaultItem: {
        name: '',
        provider_id: ''
      },

      dialogConfirmDelete: false,
      deletedRequest: '',

      confirmSingleDialog: false,
      delete_item: '',
      request_item: '',

      dialogAccept: false,
      user_request_item: '',
      user_request: '',

      dialogAcceptAll: false
    }
  },

  created(){
    this.fetchUserrequests()
    this.fetchProviders()

    socket.on('newUserRequest', data => {
        this.userrequests = []
        this.fetchUserrequests()
    })
  },

  computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'Accept' : 'Accept User Request'
      },

      filteredData(){
          return this.userrequests.filter((text) => {
            return  text.user.toLowerCase().includes(this.searchRequest.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

  methods:{
    back(){
        this.$router.back();
      },

    fetchUserrequests(){
        this.$axios.get(`/userrequests`)
           .then(response => {
             response.data.data.forEach(val => {
               let data = {
                 id: val.id,
                 user: val.user,
                 content: JSON.parse(val.content),
                 time: val.created_at
               }
               this.userrequests.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchProviders(){
        let content_array = []
        this.$axios.get(`/providers`)
           .then(response => {
             response.data.data.forEach(val => {
               let data ={
                 id: val.id,
                 name: val.name,
                 content: content_array
               }
               this.providers.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

    confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedRequest = item
      },

    deleteItem (item) {
        const index = this.userrequests.indexOf(item)

        let delete_user = this.$axios.delete(`/userrequests/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Role created successfully!`, {
               duration: 1000
             })
             this.userrequests.splice(index, 1)
           }).catch(error => { console.log(error)})
      },

    confirmSingle(request, item){
        this.confirmSingleDialog = true
        this.delete_item = item
        this.request_item = request
      },

    deleteSingleItem(item){
        let table_index = this.request_item.content.indexOf(item)
        this.request_item.content.splice(table_index, 1)

        let data = {
          content: JSON.stringify(this.request_item.content),
          user_id: this.loggedInUser.data.id
        }

        this.$axios.patch(`/userrequests/${this.request_item.id}`, data).then(res => {
          this.$toast.success('Request Updated', {
            duration: 2000
          })
          this.confirmSingleDialog = false
        })
      },

    acceptSingle(request, item){
      this.dialogAccept = true
      this.user_request_item = item
      this.user_request = request
    },

    sendSingleToSupplier(item){

      let arr = []
      arr.push(item)

      let data1 = {
          user_requesting: this.user_request.user,
          provider_name: this.editedItem.provider_id,
          content: JSON.stringify(arr),
          user_id: this.loggedInUser.data.id
        }

      let table_index = this.user_request.content.indexOf(item)

      this.$axios.post(`/accepts`, data1)
           .then(response => {

             this.user_request.content.splice(table_index, 1)
             let data2 = {
                content: JSON.stringify(this.user_request.content),
                user_id: this.loggedInUser.data.id
              }

              this.$axios.patch(`/userrequests/${this.user_request.id}`, data2).then(res => {
                  this.$toast.success(`Request sent to supplier`, {
                    duration: 2000
                  })

                  this.dialogAccept = false
                })

           }).catch(error => {
             this.$toast.error(`There is an error!`, {
                  duration: 2000
                })
            })

    },

    openInfo(request){
      this.dialogAcceptAll = true
      this.user_request = request
    },

    sendAllToSupplier(request){
      const index = this.userrequests.indexOf(request)

      let data = {
          user_requesting: request.user,
          provider_name: this.editedItem.provider_id,
          content: JSON.stringify(request.content),
          user_id: this.loggedInUser.data.id
        }

      this.$axios.post(`/accepts`, data)
           .then(response => {
          this.$axios.delete(`/userrequests/${request.id}`)
           .then(response => {
             this.dialogAcceptAll = false
              this.$toast.success(`Request sent to supplier!`, {
                duration: 1000
              })
              this.userrequests.splice(index, 1)
            })
           }).catch(error => { console.log(error)})

    }

  }
}
</script>

<style>

</style>
