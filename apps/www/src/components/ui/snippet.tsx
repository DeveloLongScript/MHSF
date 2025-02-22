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

"use client";

import { useState } from "react";
import { Button } from "./button";
import { Check, Clipboard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type SnippetProps = {
  value: string;
  copy?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function Snippet(props: SnippetProps) {
  const [copied, setCopied] = useState(false);
  const copy = props.copy === undefined ? true : props.copy;

  return (
    <div
      className={`px-4 py-1 flex justify-between max-w-full box-border bg-slate-100 dark:bg-zinc-950 items-center gap-4 rounded-md border dark:border-zinc-800 ${props.className}`}
      {...props}
    >
      <pre className="overflow-auto max-w-full whitespace-nowrap w-max">
        {props.value}
      </pre>
      {copy && (
        <Button
          size="square-md"
          variant="tertiary"
          aria-label="Copy"
          onClick={() => {
            setCopied(true);
            navigator.clipboard.writeText(props.value);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <div className="relative w-full h-full grid place-items-center">
            <AnimatePresence>
              {copied ? (
                <motion.div
                  key="check"
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.2, ease: "linear" }}
                  className="top-0 left-0"
                  style={{ gridRow: 1, gridColumn: 1 }}
                >
                  <Check size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="clipboard"
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.2, ease: "linear" }}
                  className="top-0 left-0"
                  style={{ gridRow: 1, gridColumn: 1 }}
                >
                  <Clipboard size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>
      )}
    </div>
  );
}

export { Snippet };
