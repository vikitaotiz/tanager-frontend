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
              <v-list-item-title><v-icon>mdi-chef-hat</v-icon> New Kitchen Orders</v-list-item-title>
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
                          <v-list v-if="timerT(product.timer) <= 7" dense dark color="primary">
                          <v-list-item>
                              <div><b> {{product.table}}</b> <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_name}}</b><br>
                                Time: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                            <v-list-item>
                               <v-btn text color="yellow" block small @click="openAddDialog(product)">Add Product</v-btn>
                            </v-list-item>
                          </v-list>

                          <v-list v-if="timerT(product.timer) > 7 && timerT(product.timer) <= 15" dense dark color="orange">
                          <v-list-item>
                              <div><b> {{product.table}}</b> <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_name}}</b><br>
                                Time: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                            <v-list-item>
                               <v-btn text color="yellow" block small @click="openAddDialog(product)">Add Product</v-btn>
                            </v-list-item>
                          </v-list>

                          <v-list v-if="timerT(product.timer) > 15" dense dark class="danger">
                            <v-list-item>
                              <div><b> {{product.table}}</b> <small class="ml-2"><small>({{timerZ(product.timer)}})</small></small>
                                <v-divider color="white"></v-divider>
                                <small>Order Created By <b>{{product.user_name}}</b><br>
                                Time: <b>{{product.time}}</b></small></div>
                            </v-list-item>
                            <v-list-item>
                               <v-btn text color="yellow" block small @click="openAddDialog(product)">Add Product</v-btn>
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
                                      <th class="text-left" v-if="product.content.length > 1 && loggedInUser.data.role === 'Administrator'" >Action</th>
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
                                      <td><v-icon v-if="product.content.length > 1 && loggedInUser.data.role === 'Administrator'" dark color="red" @click="voidSingleItem(product, item, index)">mdi-delete</v-icon></td>
                                    </tr>
                                    <tr style="background: #ddd;">
                                      <td>Total</td>
                                      <td>{{product.amount}}</td>
                                      <td v-if="product.content.length > 1 && loggedInUser.data.role === 'Administrator'" ></td>
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
                                  text
                                  @click="openConfirm(product)"
                                >
                                <v-icon small>mdi-cancel</v-icon> Void
                                </v-btn>

                                <v-btn
                                  :loading="loading" :disabled="loading"
                                  v-if="!product.amount == 0 && loggedInUser.data.name === 'KITCHEN'"
                                  small
                                  color="primary"
                                  text
                                  @click="sendOrderToPick(product, timerT(product.timer))"
                                >
                                <v-icon small>mdi-check</v-icon> Pick
                                </v-btn>
                              </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>

                </v-data-iterator>

            </v-card>
          </v-col>

          <v-col cols="12" sm="3" v-if="adds_table.length>0">

            <v-card outlined class="pa-2">

                <v-card color="primary" outlined v-for="(table, index) in adds_table" :key="index" class="mb-2">
                              <div style="color: orange; text-align: center; padding: 1%; line-height: 1.1;">
                                <strong>{{table.table_name}}</strong><br><small>({{table.user_name}})</small>
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
                                      <td>{{ product.qty }}</td>
                                      <td>
                                        <small><b>{{ product.name }}</b><br>
                                          Amount: Ksh {{ product.selling_price }}
                                        </small>
                                      </td>
                                    </tr>
                                    <tr style="background: #ddd;">
                                      <td>Total: Ksh {{ table.amount }}</td>
                                        <td><v-btn
                                          :loading="loading" :disabled="loading"
                                          v-if="loggedInUser.data.name === 'KITCHEN'"
                                          small
                                          color="primary"
                                          text
                                          @click="sendToAddPicks(table)"
                                        >
                                        <v-icon small>mdi-check</v-icon>
                                          Picks
                                        </v-btn>
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                    </v-card>
               </v-card>

          </v-col>

    </v-row>

     <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Void Order for {{table_order.table}}?</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-overflow-btn
              dense
              :items="users"
              label="Add User Requesting Void..."
              item-text="name"
              item-value="name"
              v-model="user_requesting_void"
            ></v-overflow-btn>
            <v-select
              v-if="user_requesting_void"
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
          <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text v-if="yes" @click="deleteTable">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <!-- Add Products Dialog -->
    <v-dialog
      v-model="dialogAdd"
      width="800"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
        <v-icon>mdi-plus-outline</v-icon>
          Add Items To {{added_product.table}}.
          <v-spacer /> Amount: Ksh{{added_product.amount}}
        </v-card-title>

        <v-card-text style="height: 300px;">
          <v-row no-gutters class="mt-3">
            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">

                <v-text-field class="mt-2" v-model="added_products_search" label="Search for food..." outlined dense />

                          <v-list dense class="v-card mb-1" v-for="(product, index) in filteredProducts(non_drinks)" :key="index">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title><b>{{product.name}}</b>. Ksh {{product.selling_price}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-content>
                                <v-list-item-title>{{product.category}}</v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-icon>
                                <v-icon color="primary" @click="addNewTableProduct(product, index)">mdi-plus-circle</v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list>

              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card outlined class="pa-1">
                <v-card outlined class="pa-1">
                  <v-card-subtitle>Current Table Items</v-card-subtitle>
                  <v-chip
                    class="ma-1"
                    color="primary"
                    text-color="white"
                    small
                    v-for="(item, index) in added_product.content"
                    :key="index"
                  >
                    {{item.name}}. Ksh{{item.selling_price}}
                  </v-chip>
                </v-card>

                <v-card outlined class="pa-1">
                  <v-card-subtitle>Added Items
                    <v-spacer><b>New Amount Ksh {{added_product.amount + totalCost3()}}</b></v-spacer>
                  </v-card-subtitle>

                    <v-chip
                      class="ma-1"
                      close
                      small
                      color="primary"
                      label
                      outlined
                      @click:close="removeNewTableProduct(index)"
                      v-for="(prd, index) in new_table_products" :key="index"
                    >
                      {{prd.name}}. Ksh{{prd.selling_price}}

                    </v-chip>

                </v-card>

              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="headline grey lighten-2">

          <v-btn
            color="red"
            text
            @click="closeDialogAdd"
          >
          <v-icon small>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="addItemsToTable"
            v-if="new_table_products.length > 0"
          >
            <v-icon small>mdi-skip-backward-outline</v-icon> Add Item(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End of Add Products Dialog -->

    <v-dialog v-model="voidSingleItemDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Void {{single_table_item_name}}?</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
            <v-overflow-btn
              dense
              :items="users"
              label="Add User Requesting Void..."
              item-text="name"
              item-value="name"
              v-model="user_requesting_void"
            ></v-overflow-btn>
            <v-select
              v-if="user_requesting_void"
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
          <v-btn color="primary" text @click="voidSingleItemDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text v-if="yes" @click="deleteSingleItem">Confirm</v-btn>
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
      loading: false,
      itemsPerPage: 8,
      page: 1,
      dialog: false,
      data: [],
      table_order: '',
      sound: false,
      adds_table: [],
      voids: [],
      void_id: '',
      yes: false,

      added_products_search: '',
      dialogAdd: false,
      added_product: '',
      non_drinks: [],
      products: [],
      new_table_products: [],

      voidSingleItemDialog: false,
      single_table_item_name: '',
      single_table_item_product: '',
      single_table_item_index: '',

      users: [],
      user_requesting_void: '',

      data_logs_success: 0,
      data_logs_warning: 0,
      data_logs_danger: 0
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'isAdmin']),

      playSound(){
        console.log(this.sound)
      }
  },

  created(){
    this.fetchCarts()

    this.fetchCancels()

    this.fetchUsers()

    this.fetchAddsTable()

    this.fetchProducts()
    this.fetchDataLogsKitchen()

    socket.on('newOrderKitchen', order=>{
      this.data = []
      this.fetchCarts();
    })

    socket.on('additionalItem_to_kitchen_from_ready', order=>{
      this.adds_table = [];
      this.fetchAddsTable();
    })

    socket.on('removePickedTableKitchen', index => {
      this.data.splice(index, 1)
    })

    // socket.on('additionalProductsSendFood', order=>{
    //   this.adds_table = [];
    //   this.fetchAddsTable();
    // })

    socket.on('AddItemsToKitchen', new_data =>{
      this.data = [];
      this.fetchCarts();
    })

    socket.on('single_item_deleted_kitchen', data1 =>{
      this.data = [];
      this.fetchCarts();
    })

    socket.on('sendAddedFoodToPick2', data2 =>{
      this.adds_table = [];
      this.fetchAddsTable()
    })

  },

  mounted : function(){
      this.kitchenTimer()
  },

  methods: {
    kitchenTimer: function(){
        setInterval(function(){
            this.data = [];
            this.fetchCarts();
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

    back(){
      this.$router.back();
    },

    fetchDataLogsKitchen(){
      this.$axios.get(`/timers_kitchen`).then(res => {

        this.data_logs_success = res.data.data.filter(val => {
          return val.timer <= 7;
        })

        this.data_logs_warning = res.data.data.filter(val => {
          return val.timer > 7 && val.timer <= 15;
        })

        this.data_logs_danger = res.data.data.filter(val => {
          return val.timer > 15;
        })

      })
    },

    toast(){
      // let src = '../notification_sounds/kitchen.mp3'
      // let audio = new Audio(src);
      // audio.play();
      // this.$toast.success('New Table Order', {
      //    duration: 2000
      // })
      // this.$toast.clear()
    },

    openConfirm(product){
      this.table_order = product
      this.dialog = true
    },

    openAddDialog(product){
      this.dialogAdd = true;
      this.added_product = product;
    },

    closeDialogAdd(){
      this.new_table_products = [];
      this.dialogAdd = false;
    },

    // Filter Functions
    filteredProducts(products){
        return products.filter((text) => {
          return  text.name.toLowerCase().includes(this.added_products_search.toLowerCase())
        })
      },

    removeNewTableProduct(index){
      this.new_table_products.splice(index, 1)
    },

    addNewTableProduct(product){
      let new_product = {
         qty: 1,
         name: product.name,
         selling_price: product.selling_price,
         item_type: product.item_type
      }
      this.new_table_products.push(new_product)
    },

    totalCost3(){
        if(this.new_table_products.length > 0){
            let cost = []
            this.new_table_products.forEach(val => {
              cost.push(val.selling_price)
            })
            let sum = cost.reduce((a, b)=>{
              return a + b
            })
            return sum }
          else {
            return 0
          }
    },

    addItemsToTable(){
      let new_amount = this.added_product.amount + this.totalCost3();

      this.new_table_products.forEach(val => {
        this.added_product.content.push(val)
      });

      this.added_product.amount = new_amount;

      let data = {
            table_name: this.added_product.table,
            user_id: this.loggedInUser.data.id,
            amount: new_amount,
            content: JSON.stringify(this.added_product.content)
      }

      this.$axios.patch(`/carts/${this.added_product.id}`, data).then(res => {
        this.closeDialogAdd();
        let new_data = res.data.data;
        socket.emit('AddItemsToKitchen', new_data);
        this.$toast.success('Item(s) Added!', {
          duration: 2000
        })
      }).catch(err=>{
        console.log(err)
      })
    },

    sendToAddPicks(table, index){
      this.loading = true

      let data1 = {
        user_id: this.loggedInUser.data.id,
        user_order: table.user_name,
        amount: table.amount,
        table_name: table.table_name,
        table_id: table.table_id,
        content: JSON.stringify(table.content),
        sold: 0
      }

      this.$axios.post(`/addpicks`, data1)
      .then(response => {

        socket.emit('sendAddedFoodToPick1', response.data.data)

        this.$axios.delete(`/adds/${table.id}`)
          .then(response => {
            this.$toast.success('Order sent to Pick!', {
                duration: 2000
              })

            socket.emit('sendAddedFoodToPick2', response.data.data)
            this.loading = false
            this.adds_table.splice(index, 1)
          });
      })
      .catch(err => console.log(err))

    },

    fetchUsers(){
      this.$axios.get(`/users`)
      .then(res => {
        let ar4 = []
        res.data.data.forEach(val => {
          let data = {
            name: val.name,
            role: val.role
          }
          ar4.push(data)
        });
        this.users = ar4.filter(el => {
          return el.role === 'Normal User'
        })
      })
      .catch()
    },

    fetchCarts(){
      let ar1 = []

      if(this.loggedInUser.data.role === "Administrator" || this.loggedInUser.data.name === "KITCHEN"){
        this.$axios.get(`/carts`).then(response => {

            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  table: val.table_name,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user
                }

              this.data.push(table)
              });

           })
           .catch(error => {
             console.log(error.data);
           })
      } else {

        this.$axios.get(`/carts`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  sold: val.sold,
                  amount: val.amount,
                  table: val.table_name,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user
                }
                ar1.push(table)
              });

              this.data  = ar1.filter(el=>{
                return el.user_name === this.loggedInUser.data.name
              })
           })
           .catch(error => {
             console.log(error.data);
           })

      }
    },

    fetchProducts(){
      this.$axios.get(`/products`).then(response => {
          this.products = response.data.data
          let product_non_drinks = this.products.filter(val=>{
            return val.item_type === 'non_drink'
          })
          this.non_drinks = product_non_drinks
        }).catch(err => { console.log(err)})
    },

    fetchCancels(){
        this.$axios.get(`/cancels`).then(response => {
          this.voids = response.data.data
        }).catch(err => { console.log(err)})
    },

    fetchAddsTable(){
      let ar2 = []

      if(this.loggedInUser.data.role === "Administrator" || this.loggedInUser.data.name === "KITCHEN"){
        this.$axios.get(`/adds`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  amount: val.amount,
                  table_name: val.table_name,
                  table_id: val.table_id,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order
                }
              this.adds_table.push(table)
              });
           })
           .catch(error => {
             console.log(error.data);
           })
        } else {

          this.$axios.get(`/adds`).then(response => {
            response.data.data.forEach(val => {
              let table = {
                  id: val.id,
                  amount: val.amount,
                  table_name: val.table_name,
                  table_id: val.table_id,
                  content: JSON.parse(val.content),
                  timer: val.created_at,
                  time: moment(val.created_at).format('MMMM Do YYYY, h:mm a'),
                  user_name: val.user_order
                }
              ar2.push(table)
              });
              this.adds_table = ar2.filter(el=>{
                return el.user_name === this.loggedInUser.data.name
              })
           })
           .catch(error => {
             console.log(error.data);
           })

        }
    },

    sendOrderToPick(table, minutes){
      this.loading = true

      let data = {
        user_id: this.loggedInUser.data.id,
        user_order: table.user_name,
        table_name: table.table_name,
        sold: 0,
        amount: table.amount,
        table_name: table.table,
        content: JSON.stringify(table.content)
      }

        this.$axios.post(`/picks`, data).then(response => {

            socket.emit('sendToPicks', response.data.data)

            //Remove from open-orders
            let table_index = this.data.indexOf(table)
            let id = table.id;

            // Remove kitchen data
            this.$axios.delete(`/carts/${table.id}`).then(()=>{
              this.$toast.success('Order sent to Pick!', {
                duration: 2000
              })
              socket.emit('removePickedTableKitchen', table_index)
              this.loading = false
              this.data.splice(table_index, 1)

            })
        }).catch(error => {
          console.log(error)
        })

      let data_log = {
        module: 'Kitchen',
        user_order: table.user_name,
        table_name: table.table,
        timer: minutes.toFixed(),
        content: JSON.stringify(table.content),
        amount: table.amount,
        user_id: this.loggedInUser.data.id,
      }

      this.$axios.post(`/timers`, data_log);

    },

    enableYes(){
      this.yes = true
    },

    voidSingleItem(product, item, index){
      this.voidSingleItemDialog = true;
      this.single_table_item_name = item.name;
      this.single_table_item_product = product;
      this.single_table_item_index = index;
    },

    deleteSingleItem(){
      this.voidSingleItemDialog = false;
      let product = this.single_table_item_product;

      let deleted_content = product.content[this.single_table_item_index];
      product.content.splice(this.single_table_item_index, 1);

      let total_sum = 0;
      if(product.content.length > 0){
        let cost = []
        product.content.forEach(val => {
          cost.push(val.selling_price)
        })
        total_sum = cost.reduce((a, b)=>{
          return a + b;
        })
      }

      product.amount = total_sum;
      let new_content = []
      new_content.push(deleted_content)

      let data = {
        user_id: this.loggedInUser.data.id,
        sold: 0,
        amount: total_sum,
        table_name: product.table,
        content: JSON.stringify(product.content)
      };

      this.$axios.patch(`/carts/${product.id}`, data).then(res => {
        socket.emit('single_item_deleted_kitchen', res.data.data);
        this.$toast.success(`${this.single_table_item_name} has been deleted from ${product.table}.`,
        { duration: 1000 });

        let new_data = {
          sold: 0,
          id: product.id,
          user_name: product.user_name,
          time: product.time,
          amount: deleted_content.selling_price,
          table: product.table,
          content: new_content
        }

        let data1 = {
          user_requesting_void: this.user_requesting_void,
          module: `${this.single_table_item_name} has been deleted from kitchen.`,
          content: JSON.stringify(new_data),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data1).then()
          .catch(err => console.log(err));

      }).catch(err => {console.log(err)})

    },

    deleteTable(){
      if(typeof this.void_id == 'number'){
        this.dialog = false

        let table_index = this.data.indexOf(this.table_order)
        let id = this.table_order.id;

        let data = {
          user_requesting_void: this.user_requesting_void,
          module: 'Table Order Kitchen',
          content: JSON.stringify(this.table_order),
          user_id: this.loggedInUser.data.id,
          cancel_id: this.void_id
        }

        this.$axios.post('/loggers', data).then(res => {
          this.$axios.delete(`/carts/${id}`)
            .then(res => {
                socket.emit('removePickedTableKitchen', table_index)
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
