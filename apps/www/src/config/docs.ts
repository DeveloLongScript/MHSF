/*
 * MHSF, Minehut Server List
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

export const allFolders: DocsFolder[] = [
  {
    name: "General",
    docs: [
      {
        title: "Getting Started",
        url: "/docs/getting-started",
      },
      {
        title: "Reading",
        url: "/docs/reading",
      },
    ],
  },
  {
    name: "Guides",
    docs: [
      {
        title: "Linking",
        url: "/docs/guides/linking",
      },
      {
        title: "Owning a Server",
        url: "/docs/guides/owning-a-server",
      },
      {
        title: "Server Customization",
        url: "/docs/guides/customization",
      },
      { title: "Reporting a server", url: "/docs/guides/reporting-server" },
    ],
  },
  {
    name: "Advanced",
    docs: [
      { title: "Tech Stack", url: "/docs/advanced/tech-stack" },
      { title: "Using the Command-bar", url: "/docs/advanced/command-bar" },
      { title: "Tips with external servers", url: "/docs/advanced/external" },
      { title: "Achievements", url: "/docs/advanced/achievements" },
    ],
  },
  {
    name: "Legal",
    docs: [
      { title: "ECA Agreement", url: "/docs/legal/external-content-agreement" },
    ],
  },
];

export type Docs = {
  title: string;
  url: string;
};

export type DocsFolder = {
  name: string;
  docs: Array<Docs>;
};
