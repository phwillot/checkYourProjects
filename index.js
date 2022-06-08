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
      console.log('AuthToken correctly created')
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
      console.log('You have access to this project')
      console.log(`Checking all tasks of ${data.name}`)
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

const requestCorrection = async (tasks, authToken) => {
  console.log('Requesting corrections...')
  const correctionIds = []
  try {
    for (const task of tasks) {
      if (task.checker_available === false) {
        continue
      }
      const taskUrl = `https://intranet.hbtn.io/tasks/${task.id}/start_correction.json?auth_token=${authToken}`
      const response = await fetch(taskUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(''),
      })
      const data = await response.json()
      if (data.error) {
        console.log(
          'Limit of request correction reached: max 30 per hour, please try later'
        )
        process.exit(1)
      }
      correctionIds.push(data.id)
    }
    return correctionIds
  } catch (err) {
    console.error(err)
  }
}

const getResults = async (correctionIds, authToken) => {
  const taskDatas = []
  for (const id of correctionIds) {
    const url = `https://intranet.hbtn.io/correction_requests/${id}.json?auth_token=${authToken}`
    const task = await waitForDone(url)
    taskDatas.push(task)
  }
  return taskDatas
}

const waitForDone = async url => {
  let retries = 10
  let timeout = 2000

  try {
    while (retries > 0) {
      const response = await fetch(url)
      const data = await response.json()
      if (data.status === 'Done') {
        return data
      }
      await wait(timeout)
      retries--
      timeout *= 1.5
    }
  } catch (err) {
    console.error(err)
  }
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms))
}

const checkProject = async projectId => {
  const authToken = await getAuthToken()
  const projectData = await checkValidProject(projectId, authToken)
  const tasks = addingNumberOnEachTask(projectData.tasks)
  const correctionIds = await requestCorrection(tasks, authToken)
  const resultTasks = await getResults(correctionIds, authToken)

  let difference = 0
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].checker_available === false) {
      console.log(`Task ${i} (${tasks[i].title}) needs a manual review`)
      difference++
      continue
    }
    if (resultTasks[i - difference]['result_display']['all_passed']) {
      console.log(`Task ${i} (${tasks[i].title}) passed successfully`)
    } else {
      console.log(`Task ${i} (${tasks[i].title}) has some failed checks`)
    }
  }
}

/* Check if the program is correctly used before starting checking */
if (process.argv.length !== 3) {
  console.log('Usage: ./index.js <project_id>')
} else {
  const projectId = Number(process.argv[2])
  checkProject(projectId)
}
