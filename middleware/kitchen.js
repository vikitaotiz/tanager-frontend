export default function ({store, redirect}){
  let user = store.getters['loggedInUser'];
  let kitchen = user.data.name == "KITCHEN";

  if(kitchen){
    return redirect('/kitchen');
  }
}
