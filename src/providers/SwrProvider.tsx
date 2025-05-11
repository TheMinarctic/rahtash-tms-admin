import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { useApi } from "@/contexts/ApiProvider";

const SwrProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi();

  return (
    <SWRConfig
      value={{
        fetcher: (src, query?: Record<string, any>) => api.get(src, query).then((res) => res),
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
