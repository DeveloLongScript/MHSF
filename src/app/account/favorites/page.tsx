import { banner } from "@/banner";
import TopBar from "@/components/clerk/Topbar";
import FavoritesView from "@/components/FavoritesView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Server } from "lucide-react";

export default function Favorites() {
  return (
    <main>
      {banner.isBanner && (
        <div className="bg-orange-600 w-screen h-8 border-b fixed text-black flex items-center text-center font-medium pl-2">
          {banner.bannerText}
        </div>
      )}

      <div
        className={
          "w-screen h-12 border-b fixed backdrop-blur flex " +
          (banner.isBanner == true ? "mt-8" : "")
        }
      >
        <div className="me-auto mt-3 pl-7">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="max-sm:hidden">
                <Server />
              </BreadcrumbItem>
              <BreadcrumbSeparator className="max-sm:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage>Favorites</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <TopBar />
      </div>
      <div className="  pt-[60px] p-4">
        <FavoritesView />
      </div>
    </main>
  );
}
