import { useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getAccountFavorites } from "../api";
import { useMHSFServer } from "./use-mhsf-server";

export function useFavoriteStore(server?: ReturnType<typeof useMHSFServer>) {
  const [favorites, setFavorites] = useState<string[] | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [favoriteNumber, setFavoriteNumber] = useState<number | null>(null);
  const { isSignedIn } = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      getAccountFavorites().then((favorites) => setFavorites(favorites));
    }
    if (
      server !== null &&
      server?.loading === false &&
      server?.server !== null
    ) {
      setFavoriteNumber(server.server.favoriteData.favoriteNumber);
      if (isFavorite === null) {
        server
          .reloadServerData()
          .then(() =>
            setIsFavorite(
              server.server?.favoriteData.favoritedByAccount ?? false
            )
          );
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
    toggleFavorite: async () => {
      if (isFavorite === null) throw new Error("Hold up lemme load rq");
      if (favoriteNumber === null) throw new Error("Nah");
      const favoriteSync = await server?.favoriteServer();

      // Resolve remote differences
      await server?.reloadServerData();

      if (
        favoriteSync?.favorited !==
        (server?.server?.favoriteData.favoritedByAccount ?? false)
      )
        throw new Error(
          "Server is not synced between server data & server favorite response."
        );

      setIsFavorite(server?.server?.favoriteData.favoritedByAccount ?? false);

      if (isFavorite === true) {
        setIsFavorite(false);
        setFavoriteNumber(favoriteNumber - 1);
      }
      if (isFavorite === false) {
        setIsFavorite(true);
        setFavoriteNumber(favoriteNumber + 1);
      }
    },
  };
}
