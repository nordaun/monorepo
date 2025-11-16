# Nordaun Monorepo

The Nordaun development monorepo that stores all Nordaun Applications and Packages.

## Apps

Apps are defined as the building blocks of the infrastructure that our users can interact with.

- `web`: The web appliction of this project with both a server and a client for our users.

## Packages

Packages are the glue that hold these apps together and provide control over databases, storage etc.

- `bucket`: The bucket of our Google Cloud storage that contains attachments and essential files.
- `cache`: The Redis-based cache that can be used on the server to enable a lower response time.
- `config`: The global configuration for the whole monorepo.
- `database`: The Prisma-based PostgreSQL database that stored all of our data.
- `email`: The Nodemailer-based emailing service that enables us to send emails to our users.
- `eslint`: The Eslint configuration for our whole monorepo.
- `ratelimit`: The Redis-based ratelimiter that is used in middlewares to supress malicious and spam requests.
- `redis`: The Redis database that uses memory to store data closer to the user lowering process time.
- `socket`: The Pusher-based websocket solution for both the client and the server.
- `typescript`: The Typescript configuration for our whole monorepo.

## Scripts

Scripts are executable commands on the command line or terminal that run different tasks.

- `build`: Builds the Javascript code of the monorepo.
- `dev`: Executes all applications in a Typescript environment.
- `lint`: Uses eslint to highlight potential issues in our whole codebase.
- `db:generate`: Generates types based on the Prisma schema file.
- `db:studio`: Opens a new browser page where you can interact with the database directly.
- `db:pull`: Pulls the latest schema from the local database.
- `db:push`: Pushes the latest schema to the local database.
