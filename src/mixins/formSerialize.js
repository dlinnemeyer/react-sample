// this was in use for our previous, non-redux-form forms. we should ditch it sometime.
export default {
  serialize(){
    let data = {}, refs = this.refs;
    this.fields.forEach(refName => {
      let ref = refs[refName];
      // this is really simplistic serialization. we should probably grab some serialization
      // function. or just write a non-crappy one. it's not that hard.
      data[refName] = ref.type == "checkbox" ? ref.checked : ref.value;
    });

    return data;
  }
}
