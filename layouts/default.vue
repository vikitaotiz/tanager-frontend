<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      width="170"
    >
    <v-list dense>
       <v-list-item class="pb-1">
        <v-list-item-content>
          <v-list-item-title class="title">
            Point of Sale
          </v-list-item-title>
          <v-list-item-subtitle>
            <code>version 0.1</code>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider color="orange"></v-divider>

      <div v-if="isAuthenticated">
        <v-list-item link :to="{name: 'index'}" exact color="primary" v-if="loggedInUser.data.name !== 'KITCHEN' && loggedInUser.data.name !== 'BARISTA'">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'pos'}" exact color="primary" v-if="loggedInUser.data.name !== 'KITCHEN' && loggedInUser.data.name !== 'BARISTA'">
          <v-list-item-action>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>POS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'kitchen'}" exact color="primary" v-if="loggedInUser.data.name !== 'BARISTA'">
          <v-list-item-action>
            <v-icon>mdi-chef-hat</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kitchen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'barista'}" exact color="primary" v-if="loggedInUser.data.name !== 'KITCHEN'">
          <v-list-item-action>
            <v-icon>mdi-glass-cocktail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Barista</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'picks'}" exact color="primary">
          <v-list-item-action>
            <v-icon>mdi-hand</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Picks</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'ready'}" exact color="primary" v-if="loggedInUser.data.name !== 'KITCHEN' && loggedInUser.data.name !== 'BARISTA'">
          <v-list-item-action>
            <v-icon>mdi-read</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ready</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'menu_items'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-cart-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Menu Items</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'addons'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-cart-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Addons</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'supplies'}" exact color="primary">
          <v-list-item-action>
            <v-icon>mdi-cart-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Supplies</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'categories'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-clipboard-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'tables'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-file-table</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tables</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

         <v-list-item link :to="{name: 'sales'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-chart-line</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'settings'}" exact color="primary" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-cog-sync</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </div>

      <div v-if="!isAuthenticated">
        <v-list-item link :to="{name: 'login'}" exact color="primary">
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isAuthenticated"></v-app-bar-nav-icon>
      <v-toolbar-title><v-icon class="mr-2" large>mdi-dlna</v-icon>Tanager Hotel</v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
          {{ loggedInUser.data.name }}

          <v-tooltip bottom color="orange">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="logout">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>

      </div>
      <div v-if="!isAuthenticated">
        <small>Point of Sale</small>
        <br><small><code>version 0.1</code></small>
      </div>

    </v-app-bar>

    <v-main>
      <v-container>
        <!-- <nuxt keep-alive/> -->
        <nuxt />
      </v-container>
    </v-main>

    <v-bottom-navigation
      horizontal
    >
      <v-btn color="disabled" text >
        <span>Tanager Hotel &copy; 2020. All rights reserved.</span>
      </v-btn>

    </v-bottom-navigation>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import moment from 'moment'

  export default {
    computed: {
        ...mapGetters(['isAuthenticated', 'loggedInUser', 'isAdmin'])
      },

    data: () => ({
      drawer: false,
      logged_in_users: null
    }),

    created(){
      // this.fetchLoggedInUsers()
    },

    methods: {
      fetchLoggedInUsers(){
          this.$axios.get('/loggedinusers').then(res => {
            this.logged_in_users = res.data.data
            console.log('In', this.logged_in_users.length)
          })
      },

      async logout() {

        // this.$axios.get('/loggedinusers').then(res => {
        //     let logged_in_users = res.data.data

        //     let loggedInUser_data = {
        //               name: this.$auth.user.data.name,
        //               email: this.$auth.user.data.email,
        //               department: this.$auth.user.data.department,
        //               role: this.$auth.user.data.role,
        //               time: moment().format('MMMM Do YYYY, h:mm:ss a'),
        //               user_id: this.$auth.user.data.id
        //     }

        //     this.logged_in_users.forEach(val => {

        //         if(auth_user_id === val.user_id){

        //             this.$axios.delete(`/loggedinusers/${val.id}`).then(res => {

        //                 socket.emit('recordLoggedOutUser', loggedInUser_data);
        //                 this.$auth.logout()
        //                 this.$toast.show('Logged out...', {
        //                    duration: 1000,
        //                 })
        //                 this.$router.push('/login')
        //             }).catch(err => {console.log(err)})
        //         }
        //       })

        //   })

        // if(this.logged_in_users.length > 0){
        //   console.log('Out ',this.logged_in_users.length)
        // } else {
        //   this.$auth.logout()
        //   this.$toast.show('Logged out...', {
        //     duration: 1000
        //   })
        //   this.$router.push('/login')
        // }

          this.$auth.logout()
          this.$toast.show('Logged out...', {
            duration: 1000
          })
          // this.$auth.strategies.local.options.endpoints.user = null
          this.$router.push('/login')


      }
    }
  }
</script>
