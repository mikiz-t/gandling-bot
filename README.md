#Gandling Discord Bot

##Requirements
- Nodejs 14.15.5+
- Postgres 11+
- Postgres trigram extension

##Set up
- Run `npm install`
- Run `cp .env.exmaple.env` and fill out the env variables  
- Run `./node_modules/bin/knex:latest` to migrate DB
- Log into postgres and run `CREATE EXTENSION pg_trgm;` to enable the trigram extension.
- Run `node index.js` to start the bot
