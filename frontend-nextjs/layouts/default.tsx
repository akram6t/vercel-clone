import { Link } from "@nextui-org/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { ThemeSwitch } from "@/components/theme-switch";
import React from "react";
import { Session } from "next-auth";
import { Avatar } from "@nextui-org/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
    // window.location.href = "https://github.com/logout";
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar>
        <NavbarBrand>
          <Link href="/" className="font-bold text-xl">
            Hobby
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <ThemeSwitch />
          {!router.pathname.startsWith('/dashboard') &&
            <NavbarItem>
              <Link href="/dashboard" className="text-gray-700">
                {session && <Button as={'button'} variant="bordered" color="secondary">
                  Dashboard
                </Button>}
              </Link>
            </NavbarItem>
          }
          <NavbarItem>
            {session ? (
              <UserProfilePopover session={session} handleSignOut={handleSignOut} />
            ) : (
              <Link href="/login" className="text-gray-700">
                <Button as={'button'} variant="solid" color="primary">
                  Login
                </Button>
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="flex-grow w-full max-w-5xl mx-auto">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <span className="text-default-600">Powered by Next.js and NextUI</span>
      </footer>
    </div>
  );
}

const UserProfilePopover:React.FC<{session: Session, handleSignOut: () => void}> = ({ session, handleSignOut }) => {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Avatar
          src={session.user.avatar as string}
          alt={session.user.name as string}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <p className="font-medium text-sm">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
          <Button
            onClick={handleSignOut}
            className="w-full justify-center text-sm"
          >
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};