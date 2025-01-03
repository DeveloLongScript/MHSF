# Contributing to MHSF
Hey! Thank you for wanting to contribute to MHSF, it means a lot to me that you decided to spend your time fixing up a project like this one :) <br>
This project has many parts, and as so, it's not as easy to get it running as you might think. We try and make the project have as many optional dependencies as possible,
but sometimes it might not be possible to not include a dependency that we are using in the project. 

## Node.js
Make sure you have [Node.js](https://nodejs.org) installed, perferably a version above 20. This allows MHSF to run tasks that use modern Node standards like async functions
and other functions that are ran in MHSF. *Make sure you also have NPM installed.*

## Getting Started
Run the folllowing commands in your terminal
```bash
# Clone the repo
git clone https://github.com/DeveloLongScript/MHSF

# If you do not already have Yarn installed, install it:
npm install -g yarn

# Install dependencies
yarn
```

> [!CAUTION]
> Do not create a pull request without using `yarn`, it is hard to get packages back and to remove alternative package locks.

## Next.js
The primary stack for MHSF is Next.js, a React framework, which you can start by running `yarn run dev`.
[You can also opt out of telemetry if you'd like.](https://nextjs.org/telemetry)

## Clerk
If you want to test out accounts, [you must create an Clerk key from their website.](https://clerk.com)
Set the following variables in the .env.local file:
```dotenv
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_IS_AUTH="true"
```

## MongoDB
We use [Atlas](https://www.mongodb.com/atlas) to host our MongoDB database, but you do need one. Add the following to your .env.local with your database:
```dotenv
MONGO_DB="mongodb+srv://..."
```
You can also set `CUSTOM_MONGO_DB` to a database name that will apply to all operations except statistical operations.

## Smaller things (for production-ready servers)

### Cron
Cron can run in either a docker container or just be run in the background. To run it through Docker, use the following:
```bash
# Install dependencies and build script on your local machine
yarn
yarn run build

docker build .
```
To run it without Docker, use the following:
```bash
yarn run build
```

> [!NOTE]
> You must have a `.env.local` with a MongoDB database (same `MONGO_DB` key) in the previous directory (for monorepo like management) running without Docker, and
> the same `.env.local` *but in the same directory when* using Docker.

### Reporting
Reporting inside MHSF uses [Linear](https://linear.app). Create an API key inside a team, and add it to the `LINEAR`
key inside of `.env.local`
```dotenv
LINEAR="ln_api_..."
```
MHSF will start adding issues automatically, displaying all information
about a server & the user reporting.

For more information about Linear's authentication, refer to the [API
documentation](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#personal-api-keys).

### Inngest
Inngest also runs periodic tasks like Cron, but has less important tasks that may occur. Create an account on Inngest, or just use the dev server.
Do the following tasks and set the endpoint to `<server url>/api/inngest`

## Creating a pull request
Make sure you abide to our [code of conduct](https://github.com/DeveloLongScript/MHSF/blob/main/CODE_OF_CONDUCT.md) and you may make a pull request. You *do not*
have to contact anybody if your making big changes, if they are what we won't add, we will just decline your PR.
