import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type Error401Props = PropsWithChildren<{
  title?: string;
}>;

export function Error401(props: Error401Props) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-col">
        <Typography variant="code">401</Typography>
        <CardTitle>{props.title ?? "Unauthorized"}</CardTitle>
        <CardDescription>
          You don't have permission to access this resource. Please sign in or
          contact your administrator if you believe this is a mistake.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row gap-2">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go back home
        </Link>
      </CardFooter>
    </Card>
  );
}
