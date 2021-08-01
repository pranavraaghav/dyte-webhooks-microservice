[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Dyte Webhooks Microservice
This is a [Moleculer](https://moleculer.services/)-based microservices project made for Dyte's Backend (JavaScript/TypeScript) problem statement of 2021 for VIT.

The project satisfies all requirements while also implementing 1 out of 2 of the bonus requirements (Dockerization).

## Problem Description
API Implementation -
- [X]  `GET /list` - Return all registered webhooks with their IDs
- [X]  `GET /register` - takes `targetUrl` parameter, registers and returns ID
- [X]  `GET /update` - takes `newTargetUrl` and `id` parameters, updates url at ID
- [X]  `POST /ip` - takes `ipAddress` in request body JSON, triggers webhooks and sends `{ ipAddress, timestamp: UNIX timestamp }` to all URLs in parallel.
<br>

Bonus tasks -
- [X] Dockerize
- [ ] Perform 5 max retries if any webhook returns a non-success response code

## Setup and Usage
### NPM
Install required dependencies by running `npm install` <br/>
Start the project with command `npm run dev` 

You can begin by reading the docs at `localhost:8000/docs`
#### (OR)

### Docker
Run the command `docker-compose up -d`. 

Access the gateway from `localhost:8000`

## Terminal Command Examples
In the terminal (valid for both NPM and Docker), try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call webhooks.register --targetUrl http://targeturl.com` - Call the `webhooks.register` action with the `targetUrl` parameter.
- `call webhooks.list` - Call the `webhooks.list` action.

## Docs
You can access the docs for API usage at the `/docs` route.

## Services
- **nats**: Handles messaging between services (Docker only).
- **express-gateway**: API Gateway service build using express.
- **webhooks**: Webhooks service with `register`, `list`, `update`, `delete` and `trigger` actions. 

## Choice of database
The project uses the [sequelize](https://sequelize.org/) ORM paired with an sqlite3 database. I chose sqlite3 since it's in-memory database mode helps build and debug faster. In a production environment, this can easily be swapped for a postgres or mysql database.
