export default function ({store, redirect}){
  let user = store.getters['loggedInUser'];
  let admin = user.data.role == "Administrator";

  if(!admin){
    return redirect('/');
  }
}
