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
              <v-list-item-title><v-icon>mdi-chef-hat</v-icon> Expenses</v-list-item-title>
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
                <v-icon class="mr-1">mdi-cancel</v-icon> Expense Category</v-card-title>
                <v-divider></v-divider>

              <v-card-actions>
                <v-btn text :to="{name: 'expenses-expense_categories'}">View More</v-btn>
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
                <v-icon class="mr-1">mdi-cancel</v-icon> Expenses</v-card-title>
                <v-divider></v-divider>

              <v-card-actions>
                <v-btn text :to="{name: 'expenses-expenses'}">View More</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script>

export default {
  middleware: ['auth', 'admin'],

  methods: {
    back(){
      this.$router.back();
    }
  }
}
</script>

<style>

</style>
