export default function ({store, redirect}){
  let user = store.getters['loggedInUser'];
  let barista = user.data.name == "BARISTA";

  if(barista){
    return redirect('/barista');
  }
}
