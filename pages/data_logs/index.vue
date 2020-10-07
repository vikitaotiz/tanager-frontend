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
              <v-list-item-title><v-icon>mdi-chef-hat</v-icon> Data Timestamps</v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-card>

      <v-row>
        <v-col cols="12" md="4">
          <v-card
              color="teal"
              dark
              outlined
            >
              <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chef-hat</v-icon>Kitchen Timestamps</v-card-title>
              <v-divider></v-divider>
                <v-card-subtitle>
                  Number of Picks : {{data_kitchen.length}}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text :to="{name: 'data_logs-kitchen'}">View More</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
              color="teal"
              dark
              outlined
            >
              <v-card-title class="headline">
              <v-icon class="mr-1">mdi-glass-cocktail</v-icon>Barista Timestamps</v-card-title>
              <v-divider></v-divider>
                <v-card-subtitle>
                  Number of Picks : {{data_barista.length}}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text :to="{name: 'data_logs-barista'}">View More</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
              color="teal"
              dark
              outlined
            >
              <v-card-title class="headline">
              <v-icon class="mr-1">mdi-hand</v-icon>Picks Timestamps</v-card-title>
              <v-divider></v-divider>
                <v-card-subtitle>
                  Number of Ready : {{data_pick.length}}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text :to="{name: 'data_logs-picks'}">View More</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script>

export default {
  middleware: ['auth'],
  data () {
    return {
      data_kitchen: [],
      data_barista: [],
      data_pick: [],

    }
  },

  created(){
    this.fetchDataLogsKitchen()
    this.fetchDataLogsBarista()
    this.fetchDataLogsPick()
  },

  methods: {
    back(){
      this.$router.back();
    },

    fetchDataLogsKitchen(){
      this.$axios.get(`/timers_kitchen_all`).then(res => {
        this.data_kitchen = res.data.data
      })
    },

    fetchDataLogsBarista(){
      this.$axios.get(`/timers_barista_all`).then(res => {
        this.data_barista = res.data.data
      })
    },

    fetchDataLogsPick(){
      this.$axios.get(`/timers_pick_all`).then(res => {
        this.data_pick = res.data.data
      })
    }

  }
}
</script>

<style>

</style>
