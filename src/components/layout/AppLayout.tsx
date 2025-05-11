import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  classNames?: {
    container?: string;
    containerParent?: string;
  };
}

const AppLayout = ({ classNames, children }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full bg-white dark:bg-background">
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={cn(
          "flex-1 overflow-auto bg-white bg-gradient-to-r p-5 text-foreground dark:from-muted dark:to-background md:h-screen",
          classNames?.containerParent,
        )}
      >
        <div className={cn("mx-auto max-w-7xl", classNames?.container)}>{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
