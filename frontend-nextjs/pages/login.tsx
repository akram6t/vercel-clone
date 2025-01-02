import { GithubIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { Card } from '@nextui-org/card';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login to Your Account</h1>
        <Button
          color="primary"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="bg-black text-white"
        >
          <GithubIcon /> Login with GitHub
        </Button>
      </Card>
    </div>
  );
}