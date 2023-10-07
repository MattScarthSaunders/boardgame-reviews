# NC-Games Project

Link to hosted version:
https://boardgame-reviews.cyclic.app/api

# Summary

This is an API built for a boardgame reviews site, featuring multiple endpoints for use in defining user interaction. It features a database comprising of boardgame categories, user comments, user reviews and users themselves. For a rundown on the available endpoints please see the endpoints.json or use the link above to see it in a browser in the hosted version.

# Cloning

To clone this project, make a new folder and navigate to it in the terminal. Then, run:

```
git clone https://github.com/MattScarthSaunders/boardgame-reviews
```

Or, you can navigate to that url on github and clone it using one of github's other options.

# Installing Dependencies

To install all the required dependencies, make sure that the package.json file is present and that you're in the correct directory in the terminal, then run:

```
npm install
```

# Required Versions:

Please make sure that your Node.js version is: 19.0.0, and your Postgres version is: 14.5.

# Environment Variable Setup

When initialising the project, create both .env.development and .env.test files and add the required PGDATABASE fields. Ensure that .env.\* is added to the .gitignore file.

# Seeding Database

To seed the database, run:

```
npm run setup-dbs
npm run seed
```

# Testing

To run the tests, enter:

```
npm test
```

or, if you just want to run the endpoint tests, enter:

```
npm t app.test.js
```

# Environment

Environment variables needed to perform all actions:

```
export PGDATABASE='<db name>'
export DATABASE_URL='<url for hosting a db>' (optional - if hosting locally you don't need this)
```

Once these are set, run `npm run seed-prod` to seed your hosted db.
