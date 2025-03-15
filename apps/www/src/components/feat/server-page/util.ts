/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import { version } from "@/config/version";

export function convert(value: number) {
  let result: string = value.toString();
  if (value >= 1000000) {
    result = Math.floor(value / 1000000) + "m";
  } else if (value >= 1000) {
    result = Math.floor(value / 1000) + "k";
  }
  return result;
}

export const loadingList = [
  "Making gamer's safer",
  "Finding why Apple is so expensive",
  "Finding why MHSF v" + version + " is so bad",
  "Finding why MHSF is so slow",
  "Finding why MHSF is loading",
  "Finding why MHSF is open-source",
  "Changing the license of MHSF",
  "Going through the American school system",
  "Finding how TypeScript is clearly better than Clojure",
  "Convincing Valerie to use a web framework",
  "Joining the Minehut Discord server",
  "Putting the fries in the bag",
  "Finding why Minehut's auto-mod is garbage",
  "Convincing Emopedia to travel to America",
  "Telling people why Next.js is the best web framework",
  "Asking Tim about MHSF compliance",
  "Debating Minehut's rules",
  "Convincing Valerie that Apple is a light-hearted company",
  "Convincing the average 'I use arch btw' person that Macintosh isn't that bad",
  "Repeating history",
  "Inventing a time machine",
  "Reinventing SSH",
  "Reinventing MHSF",
  "Figuring out why 'emacs' is a good editor",
  "Taking a design class",
  "Making a passive aggressive comment",
  "Supporting transgender",
  "Installing hyfetch",
  "Upgrading from Apple M2 to M3",
  "Watching the newest Minehut live stream",
  "Transitioning MHSF from Vercel to self-hosted",
  // generic xD
  "Loading",

  "Opening Spotify",
  "Pinging another staff member because of a spam message",
  "Clarifying Minehut rules regarding APIs",
  "Breaking the Minehut TOS",
  "Figuring out why Skript is used in the first place",
  "Creating a new Velocity fork",
  "Convincing yet another person that Firefox doesn't support all MHSF features",
  "Reinventing accounts",
  "Redoing MHSF",
  "Typing that one Vesktop emoji",
  "Talking to my besties",
  "Explaining how I'm clearly a 'girly pop'",
  "Supporting GamerSafer's company values",
  "Welcoming a new staff member",
  "v2?",
  "Listening to Tyler The Creator",
  "Explaining to somebody why we don't need to hear your political ideas",
  "Hearing yet another person complaining about their punishment",
  "Explaining brainrot to somebody that clearly doesn't need to hear it",
  "Telling somebody 'ily' who clearly doesn't know you",
  "Figuring out how to get a random item out of a list",
  "Watching how your a beautiful person",
  "Listening to music",
  "Explaining how I wasn't trying to be mean",
  "Telling somebody how AI is going to take over the world",
  "'tolking 2 my frends on da cmputer'",
  "Explaining how I just get it",
  "Getting the 'Jamie Fan' role",
  "Finding where Minehut's peak was",
  "Making a new ticket on Minehut",
  "Contacting Minehut",
  "My bad man",
  "Adding 'use client' to a Next.js component file",
  "Blaming being annoying on the depression",
  "Explaining why Minehut needs to be PG13",
  "Explaining why Minehut needs a 4 hour limit on free servers",
  "Explaining how Minehut's API works",
  "Sleeping",
  "Complaining about how I can't eat lunch early",
  "Greeting you",
  "Creating a new Paper fork",
  "Creating the modern sever list",
  "Using all of the buzzwords",
  "Chatting in #queen-jamie-chat",
  "Asking for a new phone",
  "Asking to donate to an open-source project",
];
