# MHSF Backend API

This has only one function, which is to get the server list from Minehut's API, but locally so it doesn't get blocked by Cloudflare.

To set it up, there is only one API key:
```dotenv
# Make a secret token to put in here
MHSF_SECRET="..."
```
And make sure its also set up in the Next.js server:
```dotenv
# MHSF Backend API
MHSF_BACKEND_API_LOCATION="http://..."
MHSF_BACKEND_SECRET="..."
```

You shouldn't ever really need this unless your server is blocked by Cloudflare.