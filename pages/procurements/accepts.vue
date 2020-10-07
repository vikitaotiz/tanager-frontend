<template>
  <div>
    <v-data-iterator
              :items="filteredData"
              :items-per-page.sync="itemsPerPage"
              :search="searchAccept"
            >
              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="request in props.items"
                    :key="request.name"
                    cols="12"
                    md="4"
                  >
                    <v-card outlined>
                      <v-card-subtitle style="background: #006064; color: #fff;">
                        Supplier : {{ request.provider_name }}
                        <v-divider dark color="white"></v-divider>
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
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="(item, index) in request.content" :key="index">
                                          <td>{{ item.qty }}</td>
                                          <td>{{ item.name }}</td>
                                          <td>{{ item.measurementunit }}</td>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                  <v-divider></v-divider>
                                  <v-row>
                                    <v-col><v-btn small block dark color="primary" @click="openPayment(request)">Pay</v-btn></v-col>
                                    <v-col><v-btn small text block dark color="red" @click="confirmDelete(request)">Cancel Request</v-btn></v-col>
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
                        Accepted User Requests
                      </v-list-item-title>
                    </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchAccept"
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

<!-- Payment Dialog   -->
     <v-bottom-sheet v-model="sheet" inset>
      <v-toolbar dark color="primary">
          <v-btn icon dark @click="sheet = !sheet">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title><v-icon>mdi-credit-card</v-icon> Payment Mode</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title> Amount Ksh #</v-toolbar-title>
        </v-toolbar>
      <v-sheet class="text-center" height="300px">
        <v-container class="grey lighten-5">
          <v-row>

            <v-radio-group v-model="payment_mode" :mandatory="false" row style="width: 100%;">
                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Cash" value="cash"></v-radio>

                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Mpesa" value="mpesa"></v-radio>

                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Card" value="card"></v-radio>
                  </v-card>
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    outlined
                    tile
                  >
                    <v-radio label="Credit" value="credit"></v-radio>
                  </v-card>
                </v-col>

            </v-radio-group>

          </v-row>

          <div v-if="payment_mode == 'cash'">
            <v-row>
              <v-col>
                <v-text-field type="number" dense outlined label="Enter Amount Paid By Customer..." v-model="amount_paid" />
              </v-col>
              <v-col>
                <p style="background: #006064; padding: 1%; color: white;" v-if="amount_paid">
                  <strong>Balance Due: Ksh #</strong>
                </p>
              </v-col>
            </v-row>
            <div v-if="amount_paid">
              <v-btn block dark color="primary" @click="sendReadyToPurchase">Save Transaction</v-btn>
            </div>
          </div>

          <div v-if="payment_mode == 'credit'">
            <v-row>
              <v-col>
                <v-text-field dense outlined label="Enter Name of Creditor..." v-model="creditor_name" />
              </v-col>
            </v-row>
            <div v-if="creditor_name">
              <v-btn block dark color="primary" @click="sendReadyToPurchase">Save Transaction</v-btn>
            </div>
          </div>

          <div v-if="payment_mode !== 'cash'">
            <div v-if="payment_mode !== 'credit'">
              <v-btn block dark color="primary" @click="sendReadyToPurchase">Save Transaction</v-btn>
            </div>
          </div>

        </v-container>
      </v-sheet>
    </v-bottom-sheet>
    <!-- End Payment Dialog   -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default {

  data(){
    return {
      searchAccept: '',
      itemsPerPage: 30,

      accepts: [],
      providers: [],

      editedIndex: -1,

      editedItem: {
        provider_id: ''
      },

      defaultItem: {
        provider_id: ''
      },

      dialogConfirmDelete: false,
      deletedRequest: '',

      sheet: false,
      payment_mode: 'cash',
      amount_paid: '',
      creditor_name: '',
      accepted_request: ''
    }
  },

  created(){
    this.fetchAccepts()

    socket.on('newUserRequest', data => {
        this.accepts = []
        this.fetchAccepts()
    })
  },

  computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'Accept' : 'Accept User Request'
      },

      filteredData(){
          return this.accepts.filter((text) => {
            return  text.provider_name.toLowerCase().includes(this.searchAccept.toLowerCase())
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

    fetchAccepts(){
        this.$axios.get(`/accepts`)
           .then(response => {
             response.data.data.forEach(val => {
               let data = {
                 id: val.id,
                 user: val.user_requesting,
                 provider_name: val.provider_name,
                 content: JSON.parse(val.content),
                 time: val.created_at
               }
               this.accepts.push(data)
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
        const index = this.accepts.indexOf(item)

        this.$axios.delete(`/accepts/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Request deleted successfully!`, {
               duration: 1000
             })
             this.accepts.splice(index, 1)
           }).catch(error => { console.log(error)})
      },
  openPayment(item){
    this.sheet = true
    this.accepted_request = item
  },
  sendReadyToPurchase(){

    let data = {
          provider_name: this.accepted_request.provider_name,
          user_id: this.loggedInUser.data.id,
          paid: 1,
          payment_mode: this.payment_mode,
          amount: this.payment_cost,
          amount_paid: this.payment_cost,
          balance: 0,
          creditor_name: this.creditor_name,
          content: JSON.stringify(this.accepted_request.content)
        }

    console.log(data)

    }
  }
}
</script>

<style>

</style>
