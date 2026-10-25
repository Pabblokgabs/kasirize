"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserRole } from "@/constants/roles";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatic role saving and onboarding routing
  const handleSelectRole = (role: UserRole) => {
    if (role === "role-user") {
      router.push("/build-profile");
    } else if (role === "role-requester") {
      router.push("/onboarding?role=requester");
    } else if (role === "role-employer") {
      router.push("/onboarding?role=employer");
    } else if (role === "role-mentor") {
      router.push("/onboarding?role=mentor");
    }
  };

  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#why-choose-us", label: "Why Youth Choose Us" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/92 backdrop-blur border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <span className="font-heading">K</span>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Kasirize
          </span>
        </Link>

        {/* Desktop nav - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA area */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:inline-block"
          >
            Sign In
          </Link>
          <button
            onClick={() => handleSelectRole("role-user")}
            className="items-center justify-center px-4 py-2 text-sm font-semibold rounded-btn bg-brand-deep text-white hover:opacity-90 transition-opacity shadow-sm cursor-pointer hidden md:inline-flex"
          >
            Create My Profile
          </button>

          {/* Mobile hamburger trigger */}
          <div className="md:hidden">
            <Drawer
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
              swipeDirection="down"
              showSwipeHandle
            >
              <DrawerTrigger
                render={
                  <button
                    className="p-2 rounded-btn text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Open menu"
                  />
                }
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader className="border-b border-border pb-4">
                  <DrawerTitle className="text-left flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold">
                      <span className="font-heading text-sm">K</span>
                    </div>
                    <span>Kasirize</span>
                  </DrawerTitle>
                </DrawerHeader>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <DrawerClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className="flex items-center px-3 py-3 rounded-btn text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      }
                    >
                      {link.label}
                    </DrawerClose>
                  ))}
                </nav>

                {/* Mobile CTAs */}
                <div className="flex flex-col gap-3 px-4 pb-6 mt-auto">
                  <DrawerClose
                    render={
                      <Link
                        href="/sign-in"
                        className="flex items-center justify-center px-4 py-2.5 rounded-btn border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    }
                  >
                    Sign In
                  </DrawerClose>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSelectRole("role-user");
                    }}
                    className="flex items-center justify-center px-4 py-2.5 rounded-btn bg-brand-deep text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Create My Profile
                  </button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}
