import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication",
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = searchParams.error as string

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            An error occurred during authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            {error === "Configuration"
              ? "There is a problem with the server configuration."
              : error === "AccessDenied"
              ? "You do not have permission to sign in."
              : error === "Verification"
              ? "The verification token has expired or has already been used."
              : "An error occurred during authentication."}
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 