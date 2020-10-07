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
              <v-list-item-title><v-icon>mdi-chef-hat</v-icon> Procurements</v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-card>

      <v-row>
       <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon>Categories</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'procurements-procurementcats'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Procurements</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'procurements-procurements'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

        <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> User Requests</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'user-requests'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Accepted Requests</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'procurements-accepts'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            color="cyan"
            dark
            outlined
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cancel</v-icon> Purchases</v-card-title>
              <v-divider></v-divider>

            <v-card-actions>
              <v-btn text :to="{name: 'purchases'}">View More</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>
      </v-row>
  </div>
</template>

<script>

export default {
  middleware: ['auth'],

  methods: {
    back(){
      this.$router.back();
    }
  }
}
</script>

<style>

</style>
