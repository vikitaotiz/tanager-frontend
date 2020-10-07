<template>
  <div>
      <v-card
          dark
          color="primary"
          style="margin-bottom: 1%;"
              >
        <v-list-item>
            <v-list-item-action>
                <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title><v-icon>mdi-hand</v-icon> New Picks</v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title>
                <v-chip
                  class="ma-2"
                  color="teal"
                  small
                >
                  Success: {{this.data_logs_success.length}}
                </v-chip>

                <v-chip
                  class="ma-2"
                  color="orange"
                  small
                >
                  Late: {{this.data_logs_warning.length}}
                </v-chip>

                <v-chip
                  class="ma-2"
                  color="red"
                  small
                >
                  Fail: {{this.data_logs_danger.length}}
                </v-chip>

                </v-list-item-title>
            </v-list-item-content>
            <v-list-item-content v-if="isAdmin">
              <v-list-item-title>
                <v-btn text small color="white" :to="{name: 'data_logs'}">More Details</v-btn>
              </v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-card>


    <v-row no-gutters>
          <v-col cols="12" sm="9">
            <v-card outlined class="pa-2">

           <v-data-iterator
                  :items="data"
                  :items-per-page.sync="itemsPerPage"
                >
                  <template v-slot:default="props">
                    <v-row>
                      <v-col
                        v-for="(product, index) in props.items"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                      >
                        <v-card>
                          <v-list v-if="timerT(product.timer) <= 1" dense dark color="primary">
                            <v-list-item>
                              <div><b><v-icon>mdi-table-border</v-icon> {{product.table}}</b>
                                <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_order}}</b><br>
                               Created On: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                          </v-list>

                          <v-list v-if="timerT(product.timer) > 1 && timerT(product.timer) <= 3" dense dark color="orange">
                            <v-list-item>
                              <div><b><v-icon>mdi-table-border</v-icon> {{product.table}}</b>
                                <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_order}}</b><br>
                               Created On: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                          </v-list>

                          <v-list v-if="timerT(product.timer) > 3" dense dark class="danger">
                            <v-list-item>
                              <div><b> {{product.table}}</b> <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_order}}</b><br>
                                Time: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                          </v-list>

                          <v-divider></v-divider>

                          <v-list dense>
                            <v-list-item>

                              <v-simple-table style="width: 100%;" dense>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th class="text-left">Qty</th>
                                      <th class="text-left">Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in product.content" :key="index">
                                      <td>{{item.qty}}</td>
                                      <td>
                                        <small><b>{{ item.name }}</b><br>
                                        Amount: Ksh {{item.selling_price}}
                                        </small>
                                      </td>
                                    </tr>
                                    <tr style="background: #ddd;">
                                      <td>Total</td>
                                      <td>{{product.amount}}</td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>


                            </v-list-item>

                            <v-divider></v-divider>

                          </v-list>
                             <v-card-actions>
                                <v-btn
                                  v-if="loggedInUser.data.role === 'Administrator'"
                                  small
                                  color="orange"
                                  @click="openConfirm(product)"
                                >
                                <v-icon small>mdi-cancel</v-icon>
                                  Void
                                </v-btn>
                                <v-spacer></v-spacer>
                                <div v-if="loggedInUser.data.name !== 'BARISTA'">
                                  <v-btn
                                    :loading="loading" :disabled="loading"
                                    v-if="loggedInUser.data.name !== 'KITCHEN'"
                                    small
                                    color="primary"
                                    @click="sendTableToReady(product, timerT(product.timer))"
                                  >
                                  <v-icon small>mdi-check</v-icon>
                                    Ready
                                  </v-btn>
                                </div>

                              </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>

                </v-data-iterator>

            </v-card>
          </v-col>

          <v-col cols="12" sm="3" v-if="add_picks_table.length>0">

            <v-card outlined class="pa-2">

                <v-card color="primary" outlined v-for="(table, table_index) in add_picks_table" :key="table_index" class="mb-2">
                              <div style="color: orange; text-align: center; padding: 1%; line-height: 1.1;">
                                <strong>{{table.table_name}}</strong><br><small>({{table.user_name}} : {{table.time}})</small>
                              </div>
                              <v-divider></v-divider>
                            <v-simple-table style="width: 100%;" dense>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th class="text-left">Qty</th>
                                      <th class="text-left">Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(product, index) in table.content" :key="index">
                                      <td>{{product.qty}}</td>
                                      <td>
                                        <small><b>{{ product.name }}</b><br>
                                          Amount: Ksh {{ product.selling_price }}
                                        </small>
                                      </td>
                                    </tr>
                                    <tr style="background: #ddd;">
                                      <td>Total: Ksh {{ table.amount }}</td>
                                        <td v-if="loggedInUser.data.name !== 'BARISTA'"><v-btn
                                          :loading="loading" :disabled="loading"
                                          v-if="loggedInUser.data.name !== 'KITCHEN'"
                                          small
                                          color="primary"
                                          text
                                          @click="sendAddToReady(table, table_index)"
                                        >
                                        <v-icon small>mdi-check</v-icon>
                                          Ready
                                        </v-btn>
                                      </td>
                                      <td></td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                    </v-card>
               </v-card>

          </v-col>
    </v-row>

    <v-dialog v-model="dialogVoid" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Void Order for {{table_order.table}}?</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
            <v-select
              dense
              :items="voids"
              item-text="description"
              item-value="id"
              v-model="void_id"
              @change="enableYes"
              label="Select a reason for voiding..."
              outlined
            ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogVoid = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text v-if="yes" @click="voidTable">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import moment from 'moment'

export default {
  data(){
    return {
      itemsPerPage: 8,
      page: 1,
      data: [],
      add_picks_table: [],
      dialogVoid: false,
      voids: [],
      table_order: '',
      void_id: '',
      yes: false,
      loading: false,

      data_logs_success: 0,
      data_logs_warning: 0,
      data_logs_danger: 0
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'isAdmin'])
    },

  mounted : function(){
      this.pickTimer()
  },

  created(){
    this.fetchPicks()
    this.fetchAddPicks()
    this.fetchCancels()
    this.fetchDataLogsPick()

    socket.on('sendToPicks', order=>{
      this.data = []
      this.fetchPicks();
    })

    socket.on('sendPickedTableToReady1', index => {
      this.data.splice(index, 1)
    })

    socket.on('sendAddedFoodToPick1', order=>{
      this.add_picks_table = []
      this.fetchAddPicks();
    })

    socket.on('sendAddedFoodToPick2', index => {
      this.data.splice(index, 1)
    })

    socket.on('removeAddPicksFromPicks', data => {
      this.add_picks_table = []
      this.fetchAddPicks();
    })
  },

  methods: {
    pickTimer: function(){
        setInterval(function(){
            this.data = [];
            this.fetchPicks();
        }.bind(this), 60000);
    },

    timerT(at){
      let now = moment(new Date());
      let end = moment(at);
      let duration = moment.duration(now.diff(end));
      let minutes = duration.asMinutes();
      return minutes;
    },

    timerZ(at){
      let now = moment(new Date());
      let end = moment(at);
      let duration = moment.duration(now.diff(end));
      let minutes = duration.asMinutes();
      return now.from(end);
    },

    fetchDataLogsPick(){
      this.$axios.get(`/timers_pick`).then(res => {
        this.data_logs_success = res.data.data.filter(val => {
          return val.timer <= 1;
        })

        this.data_logs_warning = res.data.data.filter(val => {
          return val.timer > 1 && val.timer <= 3;
        })

        this.data_logs_danger = res.data.data.filter(val => {
          return val.timer > 3;
        })

      })
    },

    back(){
      this.$router.back();
    },

    fetchPicks(){
      let ar1 = []

      if(this.loggedInUser.data.role === "Administrator" || this.loggedInUser.data.name === "BARISTA" || this.loggedInUser.data.name === "KITCHEN"){
        this.$axios.get(`/picks`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  table: val.table_name,
                  user_name: val.user_name,
                  user_order: val.user_order
                }
                this.data.push(table)
              });

           })
           .catch(error => {
             console.log(error.data);
           })
      }else {
        this.$axios.get(`/picks`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  table: val.table_name,
                  user_name: val.user_name,
                  user_order: val.user_order
                }
              ar1.push(table)
              });

              this.data = ar1.filter(el=>{
                return el.user_order === this.loggedInUser.data.name
              })

           })
           .catch(error => {
             console.log(error.data);
           })
      }
    },

    fetchCancels(){
        this.$axios.get(`/cancels`).then(response => {
          this.voids = response.data.data
        }).catch(err => { console.log(err)})
    },

    fetchAddPicks(){
      let ar2 = []

      if(this.loggedInUser.data.role === "Administrator" || this.loggedInUser.data.name === "BARISTA" || this.loggedInUser.data.name === "KITCHEN"){
        this.$axios.get(`/addpicks`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  amount: val.amount,
                  table_id: val.table_id,
                  table_name: val.table_name,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order
                }
              this.add_picks_table.push(table)
              });

           })
           .catch(error => {
             console.log(error.data);
           })
        } else {
          this.$axios.get(`/addpicks`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  amount: val.amount,
                  table_id: val.table_id,
                  table_name: val.table_name,
                  content: JSON.parse(val.content),
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order
                }
              ar2.push(table)
              });

              this.add_picks_table = ar2.filter(el=>{
                return el.user_name === this.loggedInUser.data.name;
              })

           })
           .catch(error => {
             console.log(error.data);
           })
        }
    },

    sendTableToReady(table, minutes){
      this.loading = true
      let data = {
        user_id: this.loggedInUser.data.id,
        user_order: table.user_order,
        sold: 0,
        freaze: 0,
        merged: 0,
        split: 0,
        amount: table.amount,
        table_name: table.table,
        content: JSON.stringify(table.content)
      }

        this.$axios.post(`/readies`, data).then(response => {

            //Remove from open-orders
            let table_index = this.data.indexOf(table)
            let id = table.id;

            // Remove from picks data
            this.$axios.delete(`/picks/${table.id}`).then(()=>{

              this.$toast.success('Order sent to Ready!', {
                duration: 2000
              })

              socket.emit('sendPickedTableToReady2', response.data.data)

              socket.emit('sendPickedTableToReady1', table_index)
              this.loading = false
              this.data.splice(table_index, 1)

            })
        }).catch(error => {
          console.log(error)
        })

        let data_log = {
          module: 'Pick',
          user_order: table.user_order,
          table_name: table.table,
          timer: minutes.toFixed(),
          content: JSON.stringify(table.content),
          amount: table.amount,
          user_id: this.loggedInUser.data.id,
        }

      this.$axios.post(`/timers`, data_log);

    },

    sendAddToReady(table){
      this.loading = true

      let table_index = this.add_picks_table.indexOf(table)

      this.$axios.get(`/readies/${table.table_id}`).then(res => {

        let dat = res.data.data;

        let content = JSON.parse(dat.content).concat(table.content)

        let data2 = {
            content: JSON.stringify(content),
            table_name: dat.table_name,
            amount: dat.amount + table.amount,
            user_id: this.loggedInUser.data.id,
            user_order: table.user_name,
            freaze: 0,
            merged: 0,
            split: 0,
            sold: 0,
            qty: 1
          }

          this.$axios.patch(`/readies/${dat.id}`, data2).then(res => {
              this.$axios.delete(`/addpicks/${table.id}`).then(res => {
                this.$toast.success('Order sent to Ready!', {
                  duration: 2000
                })
                socket.emit('removeAddPicksFromPicks', table_index)
                this.loading = false
                this.add_picks_table.splice(table_index, 1)
              })
          })

      }).catch(() => {

        let data3 = {
          user_id: this.loggedInUser.data.id,
          user_order: table.user_name,
          sold: 0,
          freaze: 0,
          merged: 0,
          split: 0,
          amount: table.amount,
          table_name: table.table_name,
          content: JSON.stringify(table.content)
        }

        this.$axios.post(`/readies`, data3).then(res => {
              this.$axios.delete(`/addpicks/${table.id}`).then(res => {
                this.$toast.success('Order sent to Ready!', {
                  duration: 2000
                })
                this.loading = false
                this.add_picks_table.splice(table_index, 1)
              })
          })
      })

    },

    enableYes(){
      this.yes = true
    },

    openConfirm(product){
      this.table_order = product
      this.dialogVoid = true
    },

    voidTable(){
      if(typeof this.void_id == 'number'){
        this.dialogVoid = false

        let table_index = this.data.indexOf(this.table_order)
        let id = this.table_order.id;

        let data = {
          module: 'Table Order Picks',
          content: JSON.stringify(this.table_order),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data).then(res => {

          this.$axios.delete(`/picks/${id}`)
            .then(res => {
                socket.emit('removeTableFromReadies', table_index)
                this.data.splice(table_index, 1)
                this.$toast.success('Table Order has been voided!', {
                    duration: 1000
                })
              })
            .catch(error => { console.log(error) })
        }).catch(err => {console.log(err)})
      }
    }
  }

}
</script>

<style scoped>
  .danger{
    background: red;
    animation: mymove 2s infinite;
  }

@keyframes mymove {
  0% {background-color: red;}
  50% {background-color: black;}
  100% {background-color: green;}
}
</style>
