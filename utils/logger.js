const info = (...params) => {
  if(process.env.NODE_ENV !== 'test'){
    console.info(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }