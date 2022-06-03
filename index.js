import fetch from 'node-fetch'

let authToken = ''

const informations = {
  api_key: '',
  email: '',
  password: '',
  scope: 'checker',
}

const getAuthToken = async () => {
  try {
    const response = await fetch(
      'https://intranet.hbtn.io/users/auth_token.json',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(informations),
      }
    )
    const data = await response.json()
    return data.auth_token
  } catch (e) {
    console.log(e)
  }
}

getAuthToken().then(token => {
  authToken = token
})

setTimeout(() => {
  console.log(authToken)
}, 1000)
