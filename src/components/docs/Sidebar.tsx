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

"use client";
import { allFolders, Docs, DocsFolder } from "@/config/docs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "@/lib/useRouter";
import { AnimatePresence, motion } from "framer-motion";

export function Sidebar() {
  return (
    <>
      {allFolders.map((docs) => (
        <Folder docs={docs} key={"url" in docs ? docs.title : docs.name} />
      ))}
    </>
  );
}

function Folder({ docs }: { docs: any }) {
  const [folderOpen, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div key={"url" in docs ? docs.title : docs.name}>
      <Button
        size="sm"
        className="w-full font-normal tracking-normal mt-1"
        noJustify
        variant={
          "url" in docs
            ? pathname === docs.url
              ? "default"
              : "ghost"
            : "ghost"
        }
        onClick={() => {
          if ("docs" in docs) {
            setOpen(!folderOpen);
          } else {
            router.push(docs.url);
          }
        }}
      >
        {"url" in docs ? docs.title : docs.name}
        <div className="flex items-center ml-auto text-muted-foreground">
          <AnimatePresence>
            {"docs" in docs && folderOpen && (
              <motion.div initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
                <ChevronRight size={18} />
              </motion.div>
            )}
            {"docs" in docs && !folderOpen && (
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: 90 }}>
                <ChevronRight size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>
      <div className="ml-2">
        {folderOpen && <Subdocs docs={"docs" in docs ? docs.docs : []} />}
      </div>
    </div>
  );
}

function Subdocs({ docs }: { docs: (Docs | DocsFolder)[] }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      {docs.map((doc) => {
        if ("docs" in doc) {
          return <Subdocs docs={doc.docs} key={doc.name} />;
        }
        return (
          <>
            <Button
              size="sm"
              className="w-full font-normal tracking-normal mt-1"
              noJustify
              onClick={() => {
                router.push(doc.url);
              }}
              key={doc.title}
              variant={
                "url" in doc
                  ? pathname == doc.url
                    ? "default"
                    : "ghost"
                  : "ghost"
              }
            >
              {doc.title}
            </Button>
            <br key={doc.url} />
          </>
        );
      })}
    </>
  );
}
