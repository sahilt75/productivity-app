import { showLoader, hideLoader } from "@/components/GlobalLoader";

export function useGlobalLoader() {
  return {
    show: showLoader,
    hide: hideLoader,
  };
}
