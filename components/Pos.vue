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
          Loading Tables
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

  <v-data-iterator
      :items="filteredTables"
      :items-per-page.sync="itemsPerPage"
      hide-default-footer
      :search="searchTable"
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="2"
          >
            <v-card tile :to="{name: 'pos-id', params: {id: item.id}}" dark color="orange">
              <v-card-title class="font-weight-light table-title">
                <v-icon>mdi-table</v-icon> {{ item.name }}
              </v-card-title>
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
                POINT OF SALE
              </v-list-item-title>
            </v-list-item-content>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchTable"
            dense
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search Table..."
          ></v-text-field>
        </v-toolbar>

          </template>
    </v-data-iterator>
</div>
</template>

<script>

export default {
  computed: {
    filteredTables(){
          return this.tables.filter((text) => {
            return  text.name.toLowerCase().includes(this.searchTable.toLowerCase())
          })
        }
  },
    data () {
      return {
        searchTable: '',
        itemsPerPage: 30,
        tables: [],
        dialogLoadingTable: true,
        test: []
      }
    },

    async fetch(){
      await this.$axios.get(`/tables`).then(res => {
        res.data.data.forEach(data=>{
            let table = {
              name: data.name,
              id: data.id
            }

            this.tables.push(table)
            this.dialogLoadingTable = false
          })
        }).catch(error=>{
          console.log(error)
        })
    },

    methods: {
      back(){
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .table-title:hover {
    background: #006064;
  }
</style>
