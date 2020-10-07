<template>
<div>
  <v-data-table
    :headers="headers"
    :items="filteredData"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    item-key="id"
    show-expand
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-btn text @click="back">
         <v-icon>mdi-arrow-left</v-icon> Back
      </v-btn>
      <v-toolbar flat color="white">
        <v-toolbar-title>Menu Items</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Product Name..."
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
                  <v-col cols="12" sm="6">
                    <v-text-field dense v-model="editedItem.name" autofocus label="Product Name"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-overflow-btn
                        dense
                        :items="categories"
                        item-value="id"
                        item-text="name"
                        label="Product Category..."
                        v-model="editedItem.category_id"
                        editable
                    ></v-overflow-btn>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field dense type="number" v-model="editedItem.buying_price" label="Buying Price"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field dense type="number" v-model="editedItem.selling_price" label="Selling Price"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12">
                     <v-select
                        dense
                        :items="item_type"
                        item-text="name"
                        item-value="value"
                        label="Select Product Type.."
                        v-model="editedItem.item_type"
                      ></v-select>
                  </v-col>

                  <v-col cols="12" sm="12">
                    <v-textarea dense v-model="editedItem.description" outlined label="Product Description"></v-textarea>
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

    <template v-slot:expanded-item="{ item }">

        <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-subtitle>Description</v-card-subtitle>
                <v-card-text>{{item.description}}</v-card-text>
                <v-divider></v-divider>
                <v-card-text><p color="orange">{{item.created_at}}</p></v-card-text>
              </div>

              <v-avatar
                class="ma-1"
                size="125"
                tile
              >
                <v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"></v-img>
              </v-avatar>
            </div>
          </v-card>

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

<v-dialog v-model="dialogConfirmDelete" persistent max-width="350" persist>
      <v-card>
        <v-card-title class="headline">Confirm Product Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedProduct)">Confirm</v-btn>
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
      deletedProduct: '',
      expanded: [],
      singleExpand: false,
      search: '',
      item_type: [{name:'Non Drink', value: 'non_drink'}, {name:'Drink', value: 'drink'}],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Buying Price (Ksh)', value: 'buying_price' },
        { text: 'Selling Price (Ksh)', value: 'selling_price' },
        { text: 'Product Type', value: 'item_type' },
        { text: 'Category', value: 'category' },
        { text: 'Image (More Details)', value: 'data-table-expand' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      products: [],
      categories: [],

      editedIndex: -1,

      editedItem: {
        name: '',
        category_id: '',
        buying_price: '',
        selling_price: '',
        item_type: '',
        description: ''
      },

      defaultItem: {
        name: '',
        category_id: '',
        buying_price: '',
        selling_price: '',
        item_type: '',
        description: ''
      },
    }),

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

      formTitle () {
        return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
      },

      filteredData(){
          return this.products.filter((text) => {
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
      this.fetchCategories()
    },

    methods: {
      back(){
        this.$router.back();
      },

      initialize () {
        this.fetchProducts()
      },

      fetchProducts(){
        this.$axios.get(`/products`)
           .then(response => {
             this.products = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchCategories(){
        this.$axios.get(`/categories`)
           .then(response => {
             this.categories = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedProduct = item
      },

      deleteItem (item) {
        const index = this.products.indexOf(item)

        let delete_user = this.$axios.delete(`/products/${item.id}`)
           .then(response => {
             this.$toast.success('Product deleted successfully!', {
               duration: 1000
             })
             this.products.splice(index, 1)
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

        let data = {
            name: this.editedItem.name,
            category_id: this.editedItem.category_id,
            buying_price: this.editedItem.buying_price,
            selling_price: this.editedItem.selling_price,
            item_type: this.editedItem.item_type,
            user_id: this.loggedInUser.data.id,
            description: this.editedItem.description
          }

        if (this.editedIndex > -1) {

          Object.assign(this.products[this.editedIndex], this.editedItem)

          this.$axios.patch(`/products/${this.editedItem.id}`, data)
           .then(response => {
             this.$toast.success('Product edited successfully!', {
               duration: 1000
             })
             this.close()
              // Object.assign(this.products[this.editedIndex], this.editedItem)
           }).catch(error => {
             this.$toast.error('Please fill all fields.', {
               duration: 2000
             })
            })

        } else {
          this.$axios.post(`/products`, data)
           .then(response => {
             this.$toast.success('Product created successfully!', {
               duration: 1000
             })
             this.products.push(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error('Please fill all fields.', {
               duration: 2000
             })
            })
        }

      },
    },
  }
</script>
