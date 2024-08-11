<img src="https://i.imgur.com/H7GhfNM.png" align="center">
<h1 align="center">MHSF</h1>

An open-source customizable server-list for Minehut built in React. Check it out at [list.mlnehut.com](https://list.mlnehut.com), and maybe give this repo a star! :)

> [!WARNING]
> If you want more of a explanation what this is, please use the built-in info popover. This README is mostly for contributing. Thanks!

## Info
![Alt](https://repobeats.axiom.co/api/embed/0ee8fb5584604adac02f04cff49f1091af45c3a8.svg "Repobeats analytics image")

## Tech-stack

[React](https://react.dev): Component based syntaxing for the web <br/>
[Next.js](https://nextjs.org): Handles API, server-based metadata, and so much more.<br/>
[Clerk](https://clerk.com): Authentication for MHSF (very cool library) <br/>
[TailwindCSS](https://tailwindcss.com): Styling without CSS, simplified<br/>
[shadcn/ui](https://ui.shadcn.com): Provides the awesome UI for MHSF<br/>
And many other smaller libraries are in use to make sure MHSF is feature-packed.<br/>

## Contributing
> [!NOTE]
> Do you use Java and not JavaScript/TypeScript? You can also contribute to [MHSFPV (Minehut Server List Player Validator)](https://github.com/DeveloLongScript/MHSFPV), a player validator plugin to link accounts. It's relatively small, but can use commits.

If you'd like to contribute, you must follow the guidelines below:

- Make sure to lint (`yarn lint`) every time you finish lines of code
- Use common sense! Don't make comments that could offend someone, or just seems like a bad ideaa
- Be respectful when making your PR. We would love to take your code, but if you argue, it doesn't help.

## Building

Clone the repo!

First, you must supply the following services with API keys:

- [Clerk](https://clerk.com): Create an app and put the respective keys in `.env.local`
- MongoDB: Create a database, can be anywhere, and put the location to connect in `.env.local` for the key `MONGO_DB` (this isn't required by any means, but if you want to store any short term or historical data, use this.)
- Inngest: Inngest is a smaller library, but runs the `cron` jobs which will make servers automaticly get added to the database.

> [!IMPORTANT]  
> This project uses `yarn` as the main package manager. If `package-lock.json` is present (or any other package manager's lockfile), your pull request will be harder to sort out, please save some work by using `yarn` at the start.


Second, run `yarn` and `yarn build`. To start the app, run `yarn start`.

### Dev

Swap `yarn build` for `yarn dev`.

## Licensing
MHSF (aka the Minehut Server List) is licensed under the [MIT License](https://github.com/DeveloLongScript/MHSF/blob/main/LICENSE). You are free to fork or modify this software _on your own terms_.
