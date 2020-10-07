<template>
  <div>
    <div class="text-center">
      <v-dialog
        v-model="dialogLoadingCategory"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Loading Supplies
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
              <v-list-item-title><v-icon>mdi-chef-hat</v-icon> {{title}}</v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-card>

    <v-row no-gutters>
      <v-col cols="12" md="8">
        <v-card outlined tile class="pa-2">

          <v-data-iterator
            :items="categories"
            :items-per-page.sync="itemsPerPage"
            :search="search"
          >
            <template v-slot:header>
              <v-toolbar
                dark
                color="primary"
                class="mb-1"
              >
                <v-text-field
                  dense
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                ></v-text-field>

              </v-toolbar>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.name"
                  cols="12"
                  md="4"
                >
                  <v-card dark color="primary" @click="openQtyDialog(item)">
                    <div class="table-title">
                      <v-card-subtitle class="subheading font-weight-bold">
                        {{ item.name }}
                      </v-card-subtitle>
                      <v-divider></v-divider>
                      <v-card-subtitle class="subheading font-weight-bold">
                        {{ item.measurementunit }}
                      </v-card-subtitle>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>

        </v-card>
      </v-col>

      <v-col cols="12" md="4" v-if="supply_array.length">
        <v-card outlined tile class="pa-2">
          <v-btn small block dark color="orange" depressed @click="clearContent">Clear Content</v-btn>

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Qty</th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Unit</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in supply_array" :key="index">
                  <td>{{ item.qty }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.measurementunit }}</td>
                  <td><v-icon dark color="red" @click="removeItem(index)">mdi-delete</v-icon></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-btn class="mt-2" small block dark color="primary" depressed @click="sendUserRequest">Send Request</v-btn>

        </v-card>
      </v-col>

    </v-row>

     <v-dialog
      v-model="qtyDialog"
      width="500"
      >
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Adjust Quantity for {{supply.name}}
          </v-card-title>

          <v-card-text class="pt-2">
            <v-text-field dense outlined type="number" v-model="qty" label="Enter Quantity..."></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="red"
              text
              @click="qtyDialog = false"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="addToArray(supply)"
            >
              Add
            </v-btn>
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
  middleware: ['auth'],

  data(){
    return {
      categories: [],
      dialogLoadingCategory: true,
      title: '',

      search: '',
      filter: {},
      itemsPerPage: 30,
      keys: [
        'Name'
      ],
      qtyDialog: false,
      qty: 1,
      supply: '',
      supply_array: []
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

    filteredKeys () {
        return this.keys.filter(key => key !== `Name`)
      }
  },

  created(){
  },

  async fetch(){
      await this.$axios.get(`/procurementcats/${this.$route.params.id}`).then(res => {
        this.title = res.data.data.name
        res.data.data.procurements.forEach(val=>{
             let category = {
              name: val.name,
              id: val.id,
              measurementunit: val.measurementunit
            }
            this.categories.push(category)
          })

          this.dialogLoadingCategory = false

        }).catch(error=>{
          console.log(error)
        })
    },

  methods: {
    back(){
        this.$router.back();
      },
    openQtyDialog(item){
      this.qtyDialog = true
      this.supply = item
    },

    clearContent(){
      this.supply_array = []
    },

    removeItem(index){
      this.supply_array.splice(index, 1)
    },

    addToArray(item){
      let supply = {
        qty: this.qty,
        name: item.name,
        measurementunit: item.measurementunit
      }

      this.supply_array.push(supply)
      this.qtyDialog = false
      this.qty = 1
    },

    sendUserRequest(){
      let data = {
        content: JSON.stringify(this.supply_array),
        user_id: this.loggedInUser.data.id
      }

      this.$axios.post(`/userrequests`, data).then(res=>{
        socket.emit('newUserRequest', res.data.data);
        this.$toast.success('Request Sent', {
          duration: 2000
        })

        this.supply_array = []
        this.qty = 1
      })
    }
  },

}
</script>

<style scoped>
  .table-title:hover {
    background: orangered;
  }
</style>
