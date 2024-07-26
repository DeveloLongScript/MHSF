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
import Link from "next/link";

export default function Favorites() {
  return (
    <main>
      <div className="  pt-[60px] p-4">
        <FavoritesView />
      </div>
    </main>
  );
}
