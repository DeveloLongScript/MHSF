"use client";
import { allFolders, Docs, DocsFolder } from "@/config/docs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "@/lib/useRouter";
import { AnimatePresence, motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {allFolders.map((docs) => {
        const [folderOpen, setOpen] = useState(false);
        const router = useRouter();

        return (
          <div>
            <Button
              size="sm"
              className="w-full font-normal tracking-normal mt-1"
              noJustify
              variant={
                "url" in docs
                  ? pathname == docs.url
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
                    <motion.div
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  )}
                  {"docs" in docs && !folderOpen && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 90 }}
                    >
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
      })}
    </>
  );
}

function Subdocs({ docs }: { docs: (Docs | DocsFolder)[] }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      {docs.map((doc) => {
        if ("docs" in doc) {
          return <Subdocs docs={doc.docs} />;
        } else {
          return (
            <>
              <Button
                size="sm"
                className="w-full font-normal tracking-normal mt-1"
                noJustify
                onClick={() => {
                  router.push(doc.url);
                }}
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
              <br />
            </>
          );
        }
      })}
    </>
  );
}
