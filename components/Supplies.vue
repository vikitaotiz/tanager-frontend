<template>
  <div>
    <div class="text-center">
      <v-dialog
        v-model="dialogLoadingSupply"
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

    <v-data-iterator
      :items="filteredProcurementcats"
      :items-per-page.sync="itemsPerPage"
      :search="searchProcurementcats"
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
            <v-card tile :to="{name: 'supplies-id', params: {id: item.id}}" dark color="primary">
              <v-card-title class="font-weight-light table-title">
                <small>{{ item.name }}</small>
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
                SUPPLIES
              </v-list-item-title>
            </v-list-item-content>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchProcurementcats"
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
  middleware: ['auth'],

  data(){
    return {
      procurementcats: [],
      searchProcurementcats: '',
      itemsPerPage: 30,
      dialogLoadingSupply: true
    }
  },

  computed: {
    filteredProcurementcats(){
          return this.procurementcats.filter((text) => {
            return  text.name.toLowerCase().includes(this.searchProcurementcats.toLowerCase())
          })
        }
  },

  async fetch(){
      await this.$axios.get(`/procurementcats`).then(res => {
        res.data.data.forEach(data=>{
            let procurementcat = {
              name: data.name,
              id: data.id
            }

            this.procurementcats.push(procurementcat)
            this.dialogLoadingSupply = false
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
    background: purple;
  }
</style>
