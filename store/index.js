export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  isAdmin(state){
    return state.auth.user.data.role == 'Administrator'
  }
}
