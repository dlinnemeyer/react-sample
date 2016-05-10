import {error} from "./general"

// toss this into a promise chain for ajax-y stuff
export function globalErrorize(dispatch){
  // I guess we could do something with the error?
  return err => {
    if(err.code == 99){
      dispatch(error("global", "Something went wrong. Refresh? You could also try that action again if we added a close button to this dialog."))
    }
    return err
  }
}
