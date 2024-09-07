# MHSF Cron Tasks

In version 1.0, MHSF moved from using Inngest to collect statistics to a self-hosted `crontab` Node.js script.

## Why the move?

When running Inngest, on Vercel's servers, when doing the `/servers` Minehut API endpoint to grab the currently online servers, a Cloudflare pop-up appeared. This made it so the JSON data expected, was blocked. This appeared to only run on Vercel's servers, and the only real solution (without spending a lot of money) was to run a minimal script every 30 minutes to grab the server data.

## How do you run this?

Make sure you have a MongoDB database set-up and ready with a file **in the previous directory (..)** named `.env.local` with the key `MONGO_DB` as the database URL. You can also just set an environment variable.
Simply run the following to test:

```
npm install
npm run dev
```

and to deploy using Docker:

```
npm run build
docker build -t mhsf-dbref .

# run the container
docker run --name mhsf-dbref <name for container>
```
