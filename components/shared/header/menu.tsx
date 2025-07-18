  import { Button } from "@/components/ui/button";
  import ModeToggle from "./mode-toggle";
  import Link from "next/link";
  import { EllipsisVertical, ShoppingCart } from "lucide-react";
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import UserButton from "./user-button";
  const Menu = () => {
    return (
      <div className="flex justify-end gap-3">
        {/* Desktop Menu */}
        <nav className="hidden md:flex w-full max-w-xs gap-1 items-center">
          <ModeToggle />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart className="mr-1" />
              Cart
            </Link>
          </Button>
          <UserButton />
        </nav>

        {/* Mobile Menu */}
        <nav className="md:hidden ">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start gap-4 p-6">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart />
                  Cart
                </Link>
              </Button>
              <UserButton />
              <SheetDescription />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    );
  };

  export default Menu;
