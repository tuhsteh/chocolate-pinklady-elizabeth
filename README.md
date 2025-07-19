# eetz

Application for Creating a Weekly Calendar for Meal Planning. Includes recipes, weekly schedule, ingredients and shopping lists, and family sharing.

## TODOs

### App Development

- [ ] Security
  - [ ] App Hardening (see [How to Harden Your Node.js APIs](https://www.freecodecamp.org/news/how-to-harden-your-nodejs-apis-security-best-practices/))
  - [ ] SSL (start with [Let'sEncrypt](https://letsencrypt.org))
- [ ] API for
  - [ ] users (registration, login, me)
  - [ ] recipe CRUD
  - [ ] schedule CRUD
  - [ ] shopping list CRUD
  - [ ] management (invitations, family members)
- [ ] UIs for
  - [ ] user sign-up/login
  - [ ] recipes
  - [ ] schedule
  - [ ] shopping list
  - [ ] management

### Infrastructure

- [ ] SSL (see [Let'sEncrypt](https://letsencrypt.org), or option provided by hosting service)
- [ ] Database (using MongoDB, but lots of hosting offers PostGRES primarily; can use JSON data type; requires migration/code-adaptation)
- [ ] injectable JSON data for initialization of a new install (e.g. `yarn init` => writes data from `roles.json` into database)
- [ ] containerization
- [ ] hosting (see [Render](https://render.com/), [Heroku](https://www.heroku.com/), other options)

### Testing

- [ ] Jest unit tests
- [ ] Cypress.io integration testing

Also, helpful starting points found in ["How To Authenticate Users and Implement CORS in NodeJS Applications"](https://www.freecodecamp.org/news/how-to-authenticate-users-and-implement-cors-in-nodejs-applications/).

## Config

Using `.env.example` as an example, create a `.env` file in your project root, and populate values you want to use for your DB and App startup. The same values are used by Docker-Compose, as the `docker-compose.yml` references the .env file you'll create.

For improved security, consider installing and using [`dotenvx`](https://dotenvx.com/). This encrypts your `.env` values, so that even if you were good and added environment files to your `.gitignore`, you are still protected from AI tools in your IDE that might leak your secrets, or from misspelling your `.enb` files!

## Testing

Coming soon(TM).  
Testing will be built in Jest, Cypress.io, or some combination thereof.

## Running

### 1. Database

Start with `docker-compose up -d`. Fix any errors you find there.

### 2. Application

In the project root, use `yarn`. Or if you prefer, you can use either `yarn` or `npm` to start. The preference is for `yarn`. Frankly, `yarn` is the way to go. Personally, `yarn` is the best choice.

```shell
$ yarn dev
```

A lot of the tools you'll need are available on [homebrew](https://brew.sh/); here, you can find `yarn`, `the_silver_searcher`, and `thefuck` for instance.

You'll also want [`nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating), to easily manage your install of the latest NodeJS LTS; this project calls for `^v22`.

## Contributing

If you'd like to join in, well, that's strange. This is a personal project; it originated in the needs of a specific household; it doesn't accomplish much; you could build your own thing instead. But hey, i'm not your _real_ dad.

### Keep Things Clean

In the `package.json`, there are a couple items you can use to make sure we get along when it comes to code style and such.

```shell
$ yarn prettier # format code according to '@stylistic/es-lint' rules
$ yarn lint # more rules, applied a slightly different way
```

### Westward Expansion

In the future, i'd like to add pre-commit hooks so you can't commit code that doesn't match the style, or has other JS issues. That probably won't happen in this project.

## Author

[`trs`](https://github.com/tuhsteh)  
started on or about `2025-07-08T17:38:00Z-0500`.  
Collaboration with `nas`.
