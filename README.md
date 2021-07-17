[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# dyte-webhooks-microservice
This is a [Moleculer](https://moleculer.services/)-based microservices project made for Dyte's problem statement VIT 2022 Batch. 
Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
### NPM based
Start the project with `npm run dev` command. 
In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.

### Docker based
Run the command `docker-compose up -d` 
This will build a docker image and spin up a container with 3 services.

## Services
- **nats**: Handles messaging between services (Docker only)
- **express-gateway**: API Gateway service build using express
- **webhooks**: Webhooks service with `register`, `update`, `list`, `delete` and `trigger` actions. 

## Choice of database
The project uses the [sequelize](https://sequelize.org/) ORM paired with an sqlite3 database. I chose sqlite3 since it's in-memory database mode helps build and debug faster. In a production environment, this can easily be swapped for a postgres or mysql database.
