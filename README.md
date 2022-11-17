# nc-games project

Link to hosted version:
https://boardgame-reviews.cyclic.app/api

# summary

This is an API built for a boardgame reviews site, featuring multiple endpoints for use in defining user interaction. It features a database comprising of boardgame categories, user comments, user reviews and users themselves. For a rundown on the available endpoints please see the endpoints.json or use the link above to see it in a browser in the hosted version.

# Cloning

To clone this project, make a new folder and navigate to it in the terminal. Then, run:

```
git clone https://github.com/MattScarthSaunders/boardgame-reviews
```

Or, you can navigate to that url on github and clone it using one of github's other options.

# installing dependencies

To install all the required dependencies, make sure that the package.json file is present, then run:

```
npm install
```

# required versions:

Please make sure that your Node.js version is: 19.0.0, and your Postgres version is: 14.5.

# environment variable setup

When initialising the project, create both .env.development and .env.test files and add the required PGDATABASE fields. Ensure that .env.\* is added to the .gitignore file.

# seeding database

To seed the database, run:

```
npm run setup-dbs
npm run seed
```

# testing

To run the tests, enter:

```
npm test
```
