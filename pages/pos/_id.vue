<template>
<div>
  <div class="text-center">
    <v-dialog
      v-model="dialogLoadingTable"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Preparing Table
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

   <v-card
      tile
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

            <v-list-item-content v-if="table">
              <v-list-item-title><v-icon class="mr-5">mdi-table</v-icon>
              <u>{{table.name.toUpperCase()}}</u></v-list-item-title>
            </v-list-item-content>

          </v-list-item>
    </v-card>

<v-row>
    <v-col
        cols="12"
        sm="8"
      >
    <v-card class="pa-2" tile style="border: 1px solid #006064;" v-if="categories.length">
      <v-overflow-btn
              @change="selectedCategory"
              dense
              :items="categories"
              item-value="id"
              item-text="tab"
              label="Select or Search Product Category.."
              loading="true"
              editable
            ></v-overflow-btn>
      <v-card-text v-if="!selected_category" style="text-align: center; color: #006064;">
        <v-icon>mdi-arrow-up</v-icon>
        <v-icon>mdi-arrow-up</v-icon>
        <v-icon>mdi-arrow-up</v-icon>
        <br>
        Select or Search Product Category to begin...
      </v-card-text>

      <v-card-text v-if="selected_category">

          <v-data-iterator
      :items="categoryProducts"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
    >
      <template v-slot:header>
        <v-toolbar
          dark
          color="primary"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            dense
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search for product(s)..."
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
              <b><u>{{selected_category}}</u></b>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                small
                depressed
                color="orange"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                small
                depressed
                color="orange"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card flat outlined class="ma-1" style="border: 1px solid #006064;">

                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th>

                                      <v-menu>
                                          <template v-slot:activator="{on, attrs}">
                                            <b
                                              style="color: #006064;
                                              text-align: center;"
                                              v-bind="attrs"
                                              v-on="on">{{item.name}}</b>
                                          </template>

                                          <v-card>
                                            <v-card-subtitle class="text-center" style="background: #006064; color: white;">
                                              Add Addon?
                                            </v-card-subtitle>
                                            <v-divider dark color="orange" ></v-divider>
                                            <v-row>
                                              <v-col v-if="addons.length > 0">
                                                <v-btn block text small dark color="primary" @click="openDialogAddon(item)">
                                                  Yes
                                                  </v-btn>
                                              </v-col>
                                                <v-divider vertical dark color="orange" ></v-divider>
                                              <v-col>

                                                <v-menu offset-x>
                                                  <template v-slot:activator="{ on: menu }">
                                                    <v-tooltip bottom color="orange">
                                                      <template v-slot:activator="{ on: tooltip }">
                                                        <v-btn
                                                          color="orange"
                                                          dark
                                                          text
                                                          block
                                                          v-on="{ ...tooltip, ...menu }"
                                                          @click="openProductQuantity(item)"
                                                        >No</v-btn>
                                                      </template>
                                                      <span>Add to {{table.name}}</span>
                                                    </v-tooltip>
                                                  </template>

                                                </v-menu>

                                              </v-col>
                                            </v-row>
                                          </v-card>
                                        </v-menu>

                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      Price:  Ksh {{ item.selling_price }}
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>

                          </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

      </v-card-text>

    </v-card>
    </v-col>

    <v-col
        cols="12"
        sm="4"
        v-if="table"
      >
        <v-card
          class="pa-2"
          v-if="table.content.length"
          tile
          style="border: 1px solid #006064;"
        >

                    <v-btn small dark color="orange" block @click="removeTable()" class="mb-2">
                      CLEAR TABLE
                      </v-btn>
                        <v-divider dark color="primary"></v-divider>
                            <v-simple-table style="width: 100%;" dense>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th class="text-left">Qty</th>
                                      <th class="text-left">Name</th>
                                      <th class="text-left">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(product, index) in table.content" :key="index">
                                      <td>{{product.qty}}</td>
                                      <td>
                                        <small><b>{{ product.name }}</b> <br>Amount: Ksh {{product.selling_price}}</small>
                                      </td>
                                      <td>
                                        <v-icon color="red" dense  @click="removeFromTable(index)">mdi-delete</v-icon>
                                      </td>
                                      <td></td>
                                    </tr>
                                    <tr style="background: #ddd;">
                                      <td>Total: Ksh {{totalCost(table)}}</td>
                                        <td><v-btn
                                          small
                                          color="primary"
                                          outlined
                                          v-if="table.content.length > 0"
                                          @click="saveTable(table, totalCost(table))"
                                        >
                                        <v-icon small>mdi-chef-hat</v-icon>
                                          Send Order
                                        </v-btn>
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>

        </v-card>
      </v-col>
    </v-row>

  <v-dialog
      v-model="dialogAddon"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline primary text-center"
          primary-title
          style="color: white;"
        >
          Add Addon to {{foodAndAddon.name}}
          <v-spacer></v-spacer>
          Ksh {{foodAndAddon.selling_price}}
        </v-card-title>

        <v-card-text class="pa-1">
          <v-row no-gutters>
            <v-col>
              <v-card outlined class="pa-1">

                <v-text-field v-model="addons_search" label="Search for addons..." outlined dense />

                 <v-list dense class="v-card mb-1" v-for="(product, index) in filteredAddons(addons)" :key="index">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><b>{{product.name}}</b>. Ksh {{product.price}}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-icon color="primary" @click="addAddonToProduct(foodAndAddon, product, index)">mdi-plus-circle</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>

              </v-card>
            </v-col>
            <v-col>
              <v-card outlined class="pa-1">
                <v-card-subtitle>Added Addons
                    <v-spacer><b>New Amount Ksh {{foodAndAddon.selling_price + totalCost3()}}</b></v-spacer>
                  </v-card-subtitle>

                    <v-chip
                      class="ma-1"
                      close
                      small
                      color="primary"
                      label
                      outlined
                      @click:close="removeAddonFromAddedAddons(index)"
                      v-for="(prd, index) in addedAddons" :key="index"
                    >
                      {{prd.name}}. Ksh{{prd.price}}

                    </v-chip>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="orange"
            text
            @click="closeDialogAddon"
          >
            Cancel
          </v-btn>

          <v-spacer></v-spacer>

          <v-menu v-if="addedAddons.length > 0">
            <template v-slot:activator="{ on: menu }">
              <v-btn color="primary" dark text v-on="menu" @click="openProductQuantityAddons()">
                Add To Table
              </v-btn>
            </template>

          </v-menu>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="dialogQuantity"
      width="300"
    >
      <v-card>
        <v-card-title>
          <small>Adjust Quantity for {{product_tobe_changed_quantity.name}}</small>
        </v-card-title>
        <v-divider dark color="primary"></v-divider>

        <v-card-text class="mt-1">
          <small class="mb-1">Default quantity is <b>1</b></small>
             <v-text-field type="number" dense outlined v-model="prd_qty" label="Enter Product Quantity.." />
        </v-card-text>

        <v-divider dark color="primary"></v-divider>

        <v-card-actions>
          <v-btn
            small
            color="orange"
            text
            @click="dialogQuantity = false"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            text
            @click="addToTable()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth'],

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

    filteredKeys () {
        return this.keys.filter(key => key !== `Name`)
      },
  },
    data () {
      return {
        dialogLoadingTable: true,
        searchTable: '',
        tab: null,
        categories: [],
        table: '',
        table_content: [],

        addons: [],
        addedAddons: [],

        itemsPerPage: 8,
        dialogAddon: false,
        foodAndAddon: '',

        dialogQuantity: false,
        product_tobe_changed_quantity: '',
        prd_qty: 1,

        search: '',
        addons_search: '',
        tableForAddedAddons: '',
        addonsAndProduct: '',
        page: 1,
        cart: [],

        selected_category: '',
        categoryProducts: '',

        itemsPerPageArray: [4, 8, 12],
        sortBy: 'name',
        sortDesc: false,
        searchProduct: '',
        filter: {},
        keys: [
          'Name'
        ],

       itemsPerPage: 30,
      }
    },

    async fetch(){
      await this.$axios.get(`/tables/${this.$route.params.id}`).then(result => {
          let data = {
            name: result.data.data.name,
            id: result.data.data.id,
            content: []
          }
            this.table = data
            this.$toast.success(`${this.table.name} is ready!`, {
              duration: 1000
          })
        }).catch(error=>{
          console.log(error)
        })

      await this.$axios.get('/categories').then(res => {
          res.data.data.forEach(data=>{
            let category = {
              tab: data.name,
              content: data.products
            }
            this.categories.push(category)
            this.dialogLoadingTable = false
          })
        }).catch(error=>{
          console.log(error)
        })

      await this.$axios.get('/addons').then(res => {
          res.data.data.forEach(data=>{
            let addon = {
              name: data.name,
              price: data.selling_price
            }
            this.addons.push(addon)
          })
        }).catch(error=>{
          console.log(error)
        })
    },

    methods: {
      back(){
        this.$router.back();
      },

      changeQty(e){
        this.prd_qty = e
      },

      selectedCategory(e){
        this.selected_category = e

        this.categories.forEach(val => {
          if(e === val.tab){
            this.categoryProducts = val.content;
          }
        })

      },

      openDialogAddon(item){
        this.dialogAddon = true
        this.foodAndAddon = item
      },

      openProductQuantity(item){
        this.dialogQuantity = true
        this.product_tobe_changed_quantity = item
      },

      openProductQuantityAddons(){
        this.dialogQuantity = true
        this.product_tobe_changed_quantity = this.addonsAndProduct
        this.addedAddons = []
      },

      closeDialogAddon(){
        this.addedAddons = []
        this.dialogAddon = false
      },

      totalCost3(){

        if(this.addedAddons.length > 0){
            let cost = []
            this.addedAddons.forEach(val => {
              cost.push(val.price)
            })
            let sum = cost.reduce((a, b)=>{
              return a + b
            })
            return sum }
          else {
            return 0
          }
      },

      totalCost(table){
        if(table.content.length > 0){

            let cost = []
            table.content.forEach(val => {
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

      addAddonToProduct(product, added_addon, index){
        this.addedAddons.push(added_addon)
        let cost = []
        let new_addons = []
        this.addedAddons.forEach(val => {
          cost.push(val.price)
          new_addons.push(val.name)
        })
        let sum = cost.reduce((a, b)=>{
           return a + b
        })
        let new_sum = sum + product.selling_price
        let new_products = new_addons.toString();
        let new_product_name = `${product.name} (${new_products})`
        this.addonsAndProduct = {
          item_type: product.item_type,
          name: new_product_name,
          selling_price: new_sum
        }
      },

      addAddonsAndProductToTable(table){
        let table_index = this.cart.indexOf(table)
          if(table_index < 0){
            table.content.push(this.addonsAndProduct)
            this.cart.push(table)
          } else {
            this.cart[table_index].content.push(this.addonsAndProduct)
          }
      },

      removeAddonFromAddedAddons(index){
        this.addedAddons.splice(index, 1)
      },

      filteredData(products){
        return products.filter((text) => {
          return  text.name.toLowerCase().includes(this.search.toLowerCase())
        })
      },

      filteredAddons(addons){
        return addons.filter((text) => {
          return  text.name.toLowerCase().includes(this.addons_search.toLowerCase())
        })
      },

      addToTable(){

        let new_prd_qty = 1
        if(this.prd_qty){
          new_prd_qty = this.prd_qty
        }

        if(this.prd_qty <= 0 ){
          new_prd_qty = 1
        }

        let item = {
          qty: new_prd_qty,
          item_type: this.product_tobe_changed_quantity.item_type,
          name: this.product_tobe_changed_quantity.name,
          selling_price: this.product_tobe_changed_quantity.selling_price * new_prd_qty,
        }

        this.table.content.push(item)

        this.dialogQuantity = false
        this.dialogAddon = false
        this.prd_qty = 1
      },

      removeTable(){
        this.table.content = []
        this.$toast.show('Table removed from queu!', {
             duration: 1000
        })
      },

      removeFromTable(index){
        this.table.content.splice(index, 1)
      },

      saveTable(table, amount){

        //Remove observer value from array
        let content = JSON.parse(JSON.stringify(table.content))

        //Get the total amount of each item array (drinks and non_drinks)
        let totalAmount = (items) => {
          let cost = []
          items.forEach(val => {
            cost.push(val.selling_price)
          })
          let sum = cost.reduce((a,b) => {
            return a+b;
          }, 0)
          return sum
        }

        //Use filter to extract drinks from array content
        let drinks = content.filter(val => {
          return val.item_type === 'drink'
        })
        //Use filter to extract non drinks from array content
        let non_drinks = content.filter(val => {
          return val.item_type === 'non_drink'
        })

        //Add drinks to array content only if drinks exists
        if(drinks.length > 0){
          let data = {
            table_name: table.name,
            user_id: this.loggedInUser.data.id,
            amount: totalAmount(drinks),
            content: JSON.stringify(drinks)
          }

          this.$axios.post(`/drinks`, data).then(res => {
              this.$toast.success(`${table.name} order sent to barista`, {
                    duration: 2000
              })
              socket.emit('newOrderBarista', res.data.data);
          }).catch(err => console.log(err))
        }
        //Add drinks to array content only if drinks exists
        if(non_drinks.length > 0){
          let data = {
            table_name: table.name,
            user_id: this.loggedInUser.data.id,
            amount: totalAmount(non_drinks),
            content: JSON.stringify(non_drinks)
          }

          this.$axios.post(`/carts`, data).then(res => {
             this.$toast.success(`${table.name} order sent to kitchen`, {
                duration: 2000
             })
             socket.emit('newOrderKitchen', res.data.data);
          }).catch(err => console.log(err))
        }
        //Remove table from POS
        this.removeTable(table)
        this.$router.replace('/pos')
      }
    }
  }
</script>
