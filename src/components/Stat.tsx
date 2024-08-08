import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component(props: {
  title: string | JSX.Element;
  desc: string | JSX.Element;
  icon: any;
  className?: string;
  children?: any;
}) {
  return (
    <Card className={props.className}>
      {props.children}
      <CardHeader className="  flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="  text-sm font-medium m-0">
          {props.title}
        </CardTitle>
        <props.icon className="  h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="  text-2xl font-bold">{props.desc}</div>
      </CardContent>
    </Card>
  );
}
