<template>
  <div>

    <v-expansion-panels class="mb-2 pa-5" popout hover v-model="panel"
      multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Login With Pin</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card outlined class="pa-2">

            <v-row>
              <v-col v-for="(num, index) in outputs" :key="index">
                {{num}}
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(1)">
                  1
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(2)">
                  2
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(3)">
                  3
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(4)">
                  4
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(5)">
                  5
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(6)">
                  6
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(7)">
                  7
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(8)">
                  8
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(9)">
                  9
                </v-btn>
              </v-col>
              <v-col>
                <v-btn dark color="primary" tile block @click="enter(0)">
                  0
                </v-btn>
              </v-col>
            </v-row>
            <v-divider dark color="primary" class="mb-2"></v-divider>
              <v-row>
                <v-col>
                  <v-btn dark color="orange" tile block @click="clearInputs">
                    Clear
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn dark color="primary"
                  :loading="loading" :disabled="loading"
                  tile block @click="loginUsingKeypad">
                    Login
                  </v-btn>
                </v-col>
              </v-row>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Login With Pin</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card outlined class="pa-2">
            <v-text-field type="password" v-model.trim="pin" outlined label="Enter your login pin..."
            hint="E.g 1234"/>
            <v-btn dark color="primary" block @click="loginPin"><v-icon small>mdi-lock-open</v-icon> login</v-btn>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-model="panel">
        <v-expansion-panel-header>Login With Email and Password</v-expansion-panel-header>
        <v-expansion-panel-content>

          <v-card outlined>
                <v-col>
                  <v-text-field
                    label="Email"
                    outlined
                    v-model="email"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    type="password"
                    outlined
                    v-model="password"
                  ></v-text-field>

                  <v-btn block color="primary" @click="login" dark><v-icon small>mdi-lock-open</v-icon> Login</v-btn>

                </v-col>
              </v-card>

        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)
import moment from 'moment';

  export default {
    data () {
      return {
        loading: false,
        panel: [0],
        tab: 'login',
        email: '',
        password: '',
        name: '',
        pin: '',

        inputs: [],
        outputs: [],
        user: ''
      }
    },

    methods: {

      async login() {
          try {
            this.$toast.show('Logging in...', {
              duration: 1000,
            })

            await this.$auth.loginWith('local', {
              data: {
                email: this.email,
                password: this.password
              }
            })

            this.$toast.success('Successfully authenticated', {
              duration: 1000
            })

            let loggedInUser_data = {
                      name: this.$auth.user.data.name,
                      email: this.$auth.user.data.email,
                      department: this.$auth.user.data.department,
                      role: this.$auth.user.data.role,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      user_id: this.$auth.user.data.id
            }
            this.$axios.post('/loggedinusers', loggedInUser_data).then(res => {
                  socket.emit('recordLoggedInUser', loggedInUser_data);
            }).catch(err => {console.log(err)})

            this.$router.replace('/')

          } catch (e) {
            this.$toast.error('Authentication failed', {
              duration: 2000
            })
          }
        },

        loginPin() {
            let dataPin = {
                pin: this.pin,
            }

            this.$axios.post('/auth/pin_login', dataPin).then(res => {
              this.$toast.show('Logging in...', {
                duration: 2000,
              })
              this.$auth.loginWith('local', {
                data: {
                  email: res.data.data.email,
                  password: res.data.data.pwd_clr
                }
              })
              .then(res => {
                this.$toast.success('Successfully authenticated', {
                  duration: 1000
                })

                let loggedInUser_data = {
                      name: this.$auth.user.data.name,
                      email: this.$auth.user.data.email,
                      department: this.$auth.user.data.department,
                      role: this.$auth.user.data.role,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      user_id: this.$auth.user.data.id
                  }
                this.$axios.post('/loggedinusers', loggedInUser_data).then(res => {
                    socket.emit('recordLoggedInUser', loggedInUser_data);
                }).catch(err => {console.log(err)})

                this.$router.replace('/')
                })
                .catch(err=>{console.log(err)})
              })
              .catch(err=>{
                this.$toast.error('Authentication failed. Try again', {
                  duration: 2000
                })
                this.clearInputs();
              })
        },

      enter(num){
          this.inputs.push(num)
          this.outputs.push('*')
      },

      clearInputs(){
        this.loading = false
        this.input = 0
        this.inputs = []
        this.outputs = []
      },

      loginUsingKeypad(){
        this.loading = true
        let dataPin = {
            pin: this.inputs.join("")
        }

        this.$axios.post('/auth/pin_login', dataPin).then(res => {
              this.$toast.show('Logging in...', {
                duration: 2000,
              })
              this.$auth.loginWith('local', {
                data: {
                  email: res.data.data.email,
                  password: res.data.data.pwd_clr
                }
              })
              .then(res => {
                this.loading = false

                this.user = res.data.data.name

                this.$toast.success('Successfully authenticated', {
                  duration: 1000
                })

                this.clearInputs();

                let loggedInUser_data = {
                      name: this.$auth.user.data.name,
                      email: this.$auth.user.data.email,
                      department: this.$auth.user.data.department,
                      role: this.$auth.user.data.role,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      user_id: this.$auth.user.data.id
                  }
                this.$axios.post('/loggedinusers', loggedInUser_data).then(res => {
                    socket.emit('recordLoggedInUser', loggedInUser_data);
                }).catch(err => {console.log(err)})

                  if(this.user === "KITCHEN"){
                    this.$router.replace('/kitchen')
                  }else if(this.user === "BARISTA"){
                    this.$router.replace('/barista')
                  }else{
                    this.$router.replace('/')
                  }
                })
                .catch(err=>{console.log(err)})
              })
              .catch(err=>{
                this.loading = false
                this.$toast.error('Authentication failed. Try again', {
                  duration: 2000
                })
                this.clearInputs();
              })
      }

      // register(){
      //   let data = {
      //       name: this.name,
      //       email: this.email,
      //       password: this.password,
      //       pwd_clr: this.password
      //     }

      //     this.$axios.post('/auth/register', data).then((result) => {
      //       this.$toast.show('Registration successfull..', {
      //         duration: 1000
      //       })

      //       this.$auth.loginWith('local', {
      //         data: {
      //           email: this.email,
      //           password: this.password
      //         }
      //       }).then(res => {
      //         this.$toast.success('Successfully authenticated', {
      //           duration: 1000
      //         })
      //         this.$router.push('/')

      //         })
      //         .catch(err=>{console.log(err)})
      //       })
      //       .catch(err=>{console.log(err)})
      //   }
    }

  }
</script>
