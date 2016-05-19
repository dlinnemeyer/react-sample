export default function createRollbarMiddleware(config, env){
  const sendStuff = env === "production"
  const Rollbar = sendStuff
    ? require("./rollbar.min.js").init(rollbarConfig)
    : {}

  return store => next => action => {
    try {
      return next(action)
    } catch (err) {
      const scope = {
        redux: {
          action,
          state: store.getState()
        }
      }

      if(sendStuff){
        console.error('[rollbar-middleware] Reporting error to Rollbar: ', err)
        Rollbar.scope(scope).error("An error occurred in redux", err)
      }
      else {
        console.error('[rollbar-middleware] Would send error to Rollbar: ', err)
        console.error('[rollbar-middleware] It would include this scope: ', scope)
      }
    }
  }
}
