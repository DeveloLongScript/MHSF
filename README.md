<img src="https://i.imgur.com/H7GhfNM.png" align="center">

An open-source Minehut server viewer/finder made in React + Next.js. Is much better than the Minehut one, as has many filters and is improving everyday.

## Tech-stack

[React](https://react.dev): Component based syntaxing for the web <br/>
[Next.js](https://nextjs.org): Handles API, server-based metadata, and so much more.<br/>
[Clerk](https://clerk.com): Authentication for MHSF (very cool library) <br/>
[TailwindCSS](https://tailwindcss.com): Styling without CSS, simplified<br/>
[shadcn/ui](https://ui.shadcn.com): Provides the awesome UI for MHSF<br/>
And many other smaller libraries are in use to make sure MHSF is feature-packed.<br/>

## Contributing

If you'd like to contribute, you must follow the guidelines below:

- Make sure to lint (`yarn lint`) every time you finish lines of code
- Use common sense! Don't make comments that could offend someone, or just seems like a bad ideaa
- Be respectful when making your PR. We would love to take your code, but if you argue, it doesn't help.

## Building

Clone the repo!

First, you must supply the following services with API keys:

- [Clerk](https://clerk.com): Create an app and put the respective keys in `.env.local`
- MongoDB: Create a database, can be anywhere, and put the location to connect in `.env.local` for the key `MONGO_DB` (this isn't required by any means, but if you want to store any short term or historical data, use this.)

_This project uses `yarn` as the main package manager. If `package-lock.json` is present, your pull request will get denied._
Second, run `yarn` and `yarn build`. To start the app, run `yarn start`.

### Dev

Swap `yarn build` for `yarn dev`.
