# MHSF

An open-source Minehut server viewer/finder made in React + Next.js. Is much better than the Minehut one, as has many filters and is improving everyday.

## Tech-stack

[React](https://react.dev): Component based syntaxing for the web
[Next.js](https://nextjs.org): Handles API, server-based metadata, and so much more.
[Clerk](https://clerk.com): Authentication for MHSF (very cool library)
[TailwindCSS](https://tailwindcss.com): Styling without CSS, simplified
[shadcn/ui](https://ui.shadcn.com): Provides the awesome UI for MHSF
And many other smaller libraries are in use to make sure MHSF is feature-packed.

## Contributing

If you'd like to contribute, you must follow the guidelines below:

- Make sure to lint (`npm run lint`) every time you finish lines of code
- Use common sense! Don't make comments that could offend someone, or just seems like a bad ideaa
- Be respectful when making your PR. We would love to take your code, but if you argue, it doesn't help.

## Building

Clone the repo!

First, you must supply the following services with API keys:

- [Clerk](https://clerk.com): Create an app and put the respective keys in `.env.local`

Second, run `npm i` and `npm run build`. To start the app, run `npm run start`.

### Dev

Swap `npm run build` for `npm run dev`.
