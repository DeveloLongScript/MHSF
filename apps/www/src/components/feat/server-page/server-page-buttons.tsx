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

import { Button } from "@/components/ui/button";
import { ServerResponse } from "@/lib/types/mh-server";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Heart, Star } from "lucide-react";
import { useFavoriteStore } from "@/lib/hooks/use-favorite-store";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ServerPageButtons({ server }: { server: ServerResponse }) {
  const clerk = useClerk();
  const favoritesStore = useFavoriteStore(server.name);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SignedIn>
        <Button
          className="flex items-center gap-2 text-sm"
          variant={favoritesStore.isFavorite ? "secondary" : "default"}
          onClick={async () => {
            setLoading(true);
            await favoritesStore.toggleFavorite(server.name);
            setLoading(false);
          }}
          disabled={loading || favoritesStore.isFavorite === null}
        >
          <Heart
            size={16}
            fill={favoritesStore.isFavorite ? "red" : "transparent"}
            color="red"
          />
          Favorite
          {favoritesStore.favoriteNumber !== null && (
            <code>{favoritesStore.favoriteNumber}</code>
          )}
          {loading && <Spinner />}
        </Button>
      </SignedIn>
      <SignedOut>
        <Button
          className="flex items-center gap-2 text-sm"
          onClick={() => clerk.openSignUp()}
        >
          <Star size={16} />
          Favorite
          {favoritesStore.favoriteNumber !== null && (
            <code>{favoritesStore.favoriteNumber}</code>
          )}
        </Button>
      </SignedOut>
    </>
  );
}
