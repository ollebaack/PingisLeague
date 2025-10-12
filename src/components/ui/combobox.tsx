"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Item = { id: string; label: string };

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  exclude,
  className,
}: {
  items: Item[];
  value?: string | null;
  onValueChange: (id?: string) => void;
  placeholder?: string;
  exclude?: (id: string) => boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const selected = items.find((i) => i.id === value) || null;

  function ItemList() {
    return (
      <Command>
        <CommandInput placeholder={`Filter ${placeholder.toLowerCase()}`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items
              .filter((it) => (exclude ? !exclude(it.id) : true))
              .map((it) => (
                <CommandItem
                  key={it.id}
                  value={it.label} // used for filtering
                  onSelect={() => {
                    onValueChange?.(it.id); // send ID back to parent
                    setOpen(false);
                  }}
                >
                  {it.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  const triggerContent = (
    <Button
      variant="outline"
      className={"justify-start " + (className || "") + " w-full"}
      disabled={items.length === 0}
    >
      {selected ? selected.label : placeholder}
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <ItemList />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTitle></DrawerTitle>
      <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
      <DrawerOverlay />
      <DrawerPortal>
        <DrawerContent>
          <div className="mt-4 border-t">
            <ItemList />
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
