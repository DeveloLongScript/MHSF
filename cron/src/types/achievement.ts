export type Achievement = {
  type:
    | "mostJoined"
    | "has1kFavorites"
    | "has1kTotalJoins"
    | "has100kFavorites"
    | "has100kTotalJoins";
  /** The ISO time of the gaining of the achievement.  */
  date: string;
};
