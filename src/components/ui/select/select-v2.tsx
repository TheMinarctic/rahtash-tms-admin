import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "../label";
import { FormMessage } from "../form";
import { Input } from "../input";
import { Search } from "lucide-react";

type Value = string | number;

interface SelectItem {
  name: string;
  value: Value;
}

interface Props {
  dir?: "ltr" | "rtl";
  value?: Value;
  defaultValue?: Value;
  selectGroupLabel?: string;
  triggerPlaceholder?: string;
  onValueChange?: (val: Value) => void;
  resetOption?: {
    title?: string;
    onClick: () => void;
  };
  selectItems: SelectItem[];
  trigger?: {
    size?: "default" | "sm" | "xs";
    variant?: "muted" | "background";
  };
  classNames?: {
    trigger?: string;
  };
  label?: string;
  isRequired?: boolean;
  error?: string;
  showSearch?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const SelectV2 = ({
  dir = "ltr",
  label,
  error,
  value,
  trigger,
  disabled,
  classNames,
  showSearch,
  isRequired,
  selectItems,
  resetOption,
  placeholder,
  defaultValue,
  onValueChange,
  selectGroupLabel,
  triggerPlaceholder,
}: Props) => {
  const [search, setSearch] = useState("");
  const memoizedSearch = useMemo(() => search, [search]);

  return (
    <div className="flex w-full flex-col">
      {/* LABEL */}
      {label && <Label>{label}</Label>}

      {/* SELECT */}
      <Select
        dir={dir}
        disabled={disabled}
        defaultValue={JSON.stringify(defaultValue)}
        value={JSON.stringify(value)}
        onValueChange={(v) => {
          const value = JSON.parse(v);
          if (value === null && resetOption) {
            resetOption.onClick();
          } else if (onValueChange && value !== null) {
            onValueChange(value);
          }
        }}
      >
        <SelectTrigger
          dir={dir}
          className={cn(
            "capitalize",
            trigger?.variant === "background" ? "bg-background" : "bg-muted",
            classNames?.trigger,
          )}
        >
          <SelectValue placeholder={triggerPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {showSearch && (
              <SelectSearch
                search={memoizedSearch}
                setSearch={(v) => setSearch(v)}
                placeholder={placeholder}
              />
            )}

            {selectItems.length <= 0 ||
            !selectItems?.filter((item) => item.name.includes(search)).length ? (
              <SelectLabel className={cn(showSearch && "my-1")}>
                No results found to show.
              </SelectLabel>
            ) : selectGroupLabel ? (
              <SelectLabel>{selectGroupLabel}</SelectLabel>
            ) : null}

            {resetOption && (
              <SelectItem value={JSON.stringify(null)}>
                {resetOption.title || "Select the desired item"}
              </SelectItem>
            )}

            {selectItems
              ?.filter((item) => item.name.includes(search))
              ?.map((item) => (
                <SelectItem className="capitalize" key={item.value} value={String(item.value)}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* ERROR */}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
};

export default SelectV2;

const SelectSearch = ({
  search,
  setSearch,
  placeholder,
}: {
  search: string;
  setSearch: (v: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="sticky top-0 z-20 flex items-center border-b bg-white">
      <div className="flex-1">
        <Input
          autoFocus
          value={search}
          placeholder={placeholder}
          className="border-0"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="pe-2 text-neutral-500">
        <Search size={16} />
      </div>
    </div>
  );
};
