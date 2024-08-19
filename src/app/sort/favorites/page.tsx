import FavoriteSortView from "@/components/FavoritesSortView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites Sort | MHSF",
  description: "See all of the servers on Minehut in order of favorites.",
};

export default function FavoritesSort() {
  return (
    <main>
      <div className="pt-[60px] p-4">
        <FavoriteSortView />
      </div>
    </main>
  );
}
