# MHSF Cron Tasks

In version 1.0, MHSF moved from using Inngest to collect statistics to a self-hosted `crontab` Node.js script.

## Why the move?

When running Inngest, on Vercel's servers, when doing the `/servers` Minehut API endpoint to grab the currently online servers, a Cloudflare pop-up appeared. This made it so the JSON data expected, was blocked. This appeared to only run on Vercel's servers, and the only real solution (without spending a lot of money) was to run a minimal script every 30 minutes to grab the server data.

## How do you run this?

If you're on a Unix based machine, just type the following:

```
# Make sure you already cloned the repo and are in the /cron directory.
# This project uses NPM instead of Yarn for the website
npm install

crontab -e
```

and in `vi` go into insert mode (type `i`) and type the following:

```
*/30 * * * * cd "<INSERT_REPO_DIR_HERE>/cron/" && npm start
```
