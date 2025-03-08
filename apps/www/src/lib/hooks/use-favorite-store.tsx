import { useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  favoriteServer,
  getAccountFavorites,
  getCommunityServerFavorites,
  isFavorited,
} from "../api";

export function useFavoriteStore(server?: string) {
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [favoriteNumber, setFavoriteNumber] = useState<number | null>(null);
  const { isSignedIn } = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      getAccountFavorites().then((favorites) => setFavorites(favorites));
    }
    if (server) {
      getCommunityServerFavorites(server).then((number) =>
        setFavoriteNumber(number)
      );
      if (isFavorite === null) {
        isFavorited(server).then((isFavorite) => setIsFavorite(isFavorite));
      }
    }
  }, [isSignedIn, server, isFavorite]);

  return {
    reloadFavorites: () => {
      if (isSignedIn) {
        getAccountFavorites().then((favorites) => setFavorites(favorites));
      } else throw new Error("Not signed in");
    },
    favorites,
    loading: favorites === null,
    loadingNumber: favoriteNumber === null,
    favoriteNumber,
    isFavorite,
    toggleFavorite: async (server: string) => {
      if (isFavorite === null) throw new Error("Hold up lemme load rq");
      if (favoriteNumber === null) throw new Error("Nah");
      await favoriteServer(server);

      // Resolve remote differences
      if (isFavorite === true) {
        setIsFavorite(false);
        setFavoriteNumber(favoriteNumber - 1);
      }
      if (isFavorite === false) {
        setIsFavorite(true);
        setFavoriteNumber(favoriteNumber + 1);
      }
    },
    getServerFavoritesNumber: async (server: string) =>
      await getCommunityServerFavorites(server),
  };
}
