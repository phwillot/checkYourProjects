import fetch from 'node-fetch'

/* You have to export 2 variables in your environment or in ~/.bashrc file
	API_KEY: Your Holberton API key
	PASSWD: Your Holberton intranet password
*/

const informations = {
  api_key: process.env.API_KEY,
  email: '3684@holbertonschool.com',
  password: process.env.PASSWD,
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
    if (data.auth_token) {
      return data.auth_token
    } else {
      console.log(
        'Please check again your credentials, the auth_token was not created'
      )
      process.exit(1)
    }
  } catch (err) {
    console.error(err)
  }
}

const checkValidProject = async (projectId, authToken) => {
  try {
    const response = await fetch(
      `https://intranet.hbtn.io/projects/${projectId}.json?auth_token=${authToken}`
    )
    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      console.log(
        "The project you request don't exist or your don't have access to it"
      )
      process.exit(1)
    }
  } catch (err) {
    console.error(err)
  }
}

const addingNumberOnEachTask = tasks => {
  return tasks.map((task, i) => ({ ...task, numTask: i }))
}

const checkProject = async projectId => {
  const authToken = await getAuthToken()
  const projectData = await checkValidProject(projectId, authToken)
  const tasks = addingNumberOnEachTask(projectData.tasks)
  console.log(tasks)
}

/* Check if the program is correctly used before starting checking */
if (process.argv.length !== 3) {
  console.log('Usage: ./index.js <project_id>')
} else {
  const projectId = Number(process.argv[2])
  checkProject(projectId)
}
