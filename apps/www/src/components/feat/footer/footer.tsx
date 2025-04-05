import { BrandingGenericIcon } from "../icons/branding-icons";
import { Link } from "../../util/link";
import { FooterStatus } from "./status";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Footer() {
  return (
    <footer className="w-full border-t p-[20px] mt-15">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-4 text-muted-foreground">
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
            <li className="text-sm">
              <DropdownMenu

              >
                <DropdownMenuTrigger>
                  <a className="text-muted-foreground hover:text-shadcn-primary transition-colors cursor-pointer">Discord</a>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="https://t.mhsf.app/d/m" noExtraIcons>
                    <DropdownMenuItem className="block py-2">
                      Minehut Discord
                      <small className="flex">Not officially owned by MHSF, however conversations about MHSF and related take place there.</small>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="https://t.mhsf.app/d/u" noExtraIcons>
                    <DropdownMenuItem className="block py-2">
                      MHSF Discord
                      <small className="flex">A read-only server for updates related to MHSF.</small>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </span>
        <FooterStatus />
      </div>
      <span className="block mt-4">
        <small className="text-muted-foreground text-[0.75rem]">
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
}
