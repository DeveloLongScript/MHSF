import { BrandingGenericIcon, Discord } from "../icons/branding-icons";
import { Link } from "../../util/link";
import { FooterStatus } from "./status";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Github from "@/components/ui/github";
import Image from "next/image"
import { usePathname } from "next/navigation";

const hideFooterPages = ["/home"];

export function Footer() {
  const pathname = usePathname();
  if (!hideFooterPages.includes(pathname ?? ""))
    return (
      <footer className="w-full mt-15 border-t border-neutral-500/20 bg-neutral-100 dark:border-neutral-700/50 dark:bg-neutral-900 text-muted-foreground">
        <div className="flex justify-between items-start p-[20px]">
          <span className="flex items-center gap-4">
            <Link href="Special:Root">
              <BrandingGenericIcon className="max-w-[32px] max-h-[32px]" />
            </Link>
            <ul className="grid grid-cols-2 md:flex gap-4 p-0 m-0 w-full md:items-center items-start list-none">
              <li className="text-sm">
                <Link
                  href="/home"
                  className="text-muted-foreground hover:text-shadcn-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-sm">
                <Link
                  href="/servers"
                  className="text-muted-foreground hover:text-shadcn-primary transition-colors"
                >
                  Servers
                </Link>
              </li>
              <li className="text-sm">
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-shadcn-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </span>
          <div className="block">
            <div className="flex items-center mb-2 justify-end gap-2">

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="tertiary" size="square-md" className="flex items-center">
                    <Discord className="w-[1.25em] h-[1.25em]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="https://t.mhsf.app/d/m" noExtraIcons>
                    <DropdownMenuItem className="py-2 flex items-center gap-2">
                      <Image className="max-w-[30px] max-h-[30px] rounded border border-muted-foreground" src="https://avatars.githubusercontent.com/u/16529253?s=200&v=4" alt="Minehut" width={30} height={30} />
                      <span className="block">
                        Minehut Discord
                        <small className="flex">Not officially owned by MHSF, however conversations about MHSF and related take place there.</small>
                      </span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="https://t.mhsf.app/d/u" noExtraIcons>
                    <DropdownMenuItem className="py-2 flex items-center gap-2">
                      <BrandingGenericIcon className="max-w-[30px] max-h-[30px] rounded border border-muted-foreground" width={30} height={30} />
                      <span className="block">
                        MHSF Discord
                        <small className="flex">A read-only server for updates related to MHSF.</small>
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="https://github.com/DeveloLongScript/MHSF" noExtraIcons>
                <Button variant="tertiary" size="square-md" className="flex items-center">
                  <Github className="w-[1.25em] h-[1.25em]" />
                </Button>
              </Link>

            </div>
            <FooterStatus />

          </div>
        </div>
        <span className="block px-4 -translate-y-12">
          <small className="text-[0.75rem]">
            MHSF is an open-source project licensed under the MIT license. MHSF is
            not officially affiliated with with Minehut, Super League Enterprise,
            or GamerSafer in any way. <br className="spacing-3" />
            Spamming, abusing or misusing the Minehut API and/or MHSF will get
            your IP blocked, we are not responsible for IP blocks.{" "}
            <strong>You have been warned.</strong>
            <br className="spacing-3" />
            If you're worried, please review the{" "}
            <Link href="https://support.minehut.com/hc/en-us/articles/27075816947731-Minehut-Rules">
              Rules
            </Link>
            , <Link href="https://minehut.com/terms-of-service">ToS</Link> &{" "}
            <Link href="https://t.mhsf.app/pr">Platform Rules</Link>.
          </small>
        </span>
      </footer>
    );

  return null;
}
