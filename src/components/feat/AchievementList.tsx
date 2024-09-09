import { getAchievements } from "@/lib/api";
import type { Achievement } from "@/lib/types/achievement";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Medal, Sparkle, Sparkles, Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import A from "../misc/Link";

export default function AchievementList({ server }: { server: string }) {
  const [achievements, setAchievements] = useState<
    Array<WithInterval<Achievement>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffectOnce(() => {
    setAchievements(() => []);
    getAchievements(server).then((v) => {
      for (const a of v)
        a.achievements.forEach((item, interval) =>
          setAchievements((prev) => [...prev, { interval, ...item }])
        );

      setLoading(false);
    });
  });

  if (loading)
    return (
      <div>
        <Skeleton className="w-full h-[112px] my-4" />
        <Skeleton className="w-full h-[112px] my-4" />
        <Skeleton className="w-full h-[112px] my-4" />
      </div>
    );

  return (
    <div>
      <span>
        Achievements are earned automatically when the server is online. See{" "}
        <A alt="Achievement collection">Special:Root</A>
      </span>
      {achievements
        .filter(
          (value, index) => listify(achievements).indexOf(value.type) === index
        )
        .map((a) => {
          const Icon = formalNames[a.type].icon;
          return (
            <div key={`${a.date}--${a.interval}`}>
              <Card className="my-4">
                <CardContent className="pt-4">
                  <span
                    className="flex items-center"
                    style={{ color: formalNames[a.type].color }}
                  >
                    <Icon size={16} className="mr-2" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formalNames[a.type].title,
                      }}
                    />
                  </span>
                  <p>{formalNames[a.type].description}</p>
                  <span className="text-sm text-muted-foreground">
                    Achieved on {new Date(a.date).getMonth()}/
                    {new Date(a.date).getDate()}/
                    {new Date(a.date).getFullYear()}{" "}
                    <span className="text-muted-foreground/70">
                      {new Date(a.date).toLocaleTimeString()}
                    </span>
                  </span>
                </CardContent>
              </Card>
            </div>
          );
        })}
    </div>
  );
}

const formalNames = {
  mostJoined: {
    title:
      "At one time, <b>this server had the most players on the platform!</b>",
    description:
      "This is awarded to servers that had the number 1 permission at the time of the achievements getting resolved.",
    color: "#9aedff",
    icon: Medal,
  },
  has1kFavorites: {
    title: "This server has more than <b>1,000 favorites on MHSF!</b>",
    description:
      "This is awarded to servers that had 1,000 favorites at the time of the achievements getting resolved.",
    color: "#d064ff",
    icon: Sparkle,
  },
  has1kTotalJoins: {
    title: "This server has more than <b>1,000 total joins on Minehut!</b>",
    description:
      "This is awarded to servers that had 1,000 total joins at the time of the achievements getting resolved.",
    color: "#aefa1f",
    icon: Users,
  },
  has100kFavorites: {
    title: "This server has more than <b>100,000 favorites on MHSF!</b>",
    description:
      "This is awarded to servers that had 100,000 favorites at the time of the achievements getting resolved.",
    color: "#fa5b07",
    icon: Sparkles,
  },
  has100kTotalJoins: {
    title: "This server has more than <b>100,000 total joins on Minehut!</b>",
    description:
      "This is awarded to servers that had 100,000 total joins at the time of the achievements getting resolved.",
    color: "#bdcffa",
    icon: Users,
  },
};

type WithInterval<K> = K & {
  interval: number;
};

const listify = (list: WithInterval<Achievement>[]) => {
  const newL: Array<string> = [];

  list.forEach((c) => newL.push(c.type));

  return newL;
};
