/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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

import { Book, ExternalLink, NotebookText } from "lucide-react";
import type { SVGProps } from "react";
import { Card, CardContent } from "../ui/card";
import { formalNames } from "@/config/achievements";

type MDXElementType = {
  [key: string]: (props: any) => JSX.Element;
};

const Discord = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 199"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className="inline-block mb-1"
    {...props}
  >
    <path
      d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
      fill="#5865F2"
    />
  </svg>
);
function AchievementPreview({ title }: { title: string }) {
  const Icon = formalNames[title].icon;
  return (
    <div>
      <Card>
        <CardContent className="pt-4">
          <span
            className="flex items-center"
            style={{ color: formalNames[title].color }}
          >
            <Icon size={16} className="mr-2" />
            <span
              dangerouslySetInnerHTML={{
                __html: formalNames[title].title,
              }}
            />
          </span>
          <p>{formalNames[title].description}</p>
          <span className="text-sm text-muted-foreground">
            Achieved on {new Date().getMonth()}/{new Date().getDate()}/
            {new Date().getFullYear()}{" "}
            <span className="text-muted-foreground/70">
              {new Date().toLocaleTimeString()}
            </span>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

export const MDXElements: MDXElementType = {
  Discord,
  AchievementPreview,
  Book: (props) => <Book {...props} />,
  Notebook: (props) => <NotebookText {...props} />,
  ExternalLink: (props) => <ExternalLink {...props} />,
};
