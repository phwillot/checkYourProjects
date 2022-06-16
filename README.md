# checkYourProjects

## Description

At Holberton School, we have a checker who checks our code for the project's tasks.

It ensures that we have covered all cases and although edge cases. But you don't have a button to check every tasks. You have to do them one by one.

I built this project to make life easier for students at Holberton to check their projects. In one command you can check every tasks on the project of your choice.

In order to achieve this I used Holberton's API.
I was really motivated to built this because I love working with API's and I learned how to use asynchronous code and how an auth_token works when you use an API.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

I made this project on **Ubuntu 20.04 LTS.**

In order to use it please clone the repo and run these commands on your terminal:

```
cd checkYourProjects/
npm install
```

## Usage

In order to use this program, you have to be a Holberton's student.

Firstly, get your API key in your Holberton profile and your email | password.

There is 3 ways of doing it:

- On your terminal, please create two environment variables called **API_KEY** and **PASSWD**. Assign them the correct values.

  Examples:

  ```
  export API_KEY="YOUR_API_KEY"
  export PASSWD="YOUR_PASSWORD"
  ```

- You can also use the **.bashrc** file located at home directory and enter the same commands at the end of the file.\
  Save the file and run `source .bashrc` to refresh the file.

- Or you can edit directly the object **informations** at the beginning of the file by passing your credentials as a string.

Once you have setup this, in your terminal run

```
node index.js <project_id>
```

:information_source: You can find the project id on the url just after /projects

![Check project id](https://i.imgur.com/ekEhKZY.png)

If everything is correctly setup you'll get the results of the checker for every tasks on the id asked.

If not you'll receive a message printing out the reason of failed:

- It can be an error in your credentials
- The project id don't exist or you don't have access to this project yet.
- The Holberton's API has limited to **30 corrections requests per hour**. Before starting the program, be sure that everything is working on your machine.

## Credits

I used [node-fetch](https://www.npmjs.com/package/node-fetch) for the HTTP requests.

## Authors

Made by [Philippe Willot](https://github.com/phwillot/)

## License

MIT License
