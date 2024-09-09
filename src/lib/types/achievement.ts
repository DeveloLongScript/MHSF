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

export const orderOfAchievements = [
  "mostJoined",
  "has100kFavorites",
  "has100kTotalJoins",
  "has1kFavorites",
  "has1kTotalJoins",
];
