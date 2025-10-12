import { toast } from "sonner";

export type ShowToastOptions = {
  variant?: "success" | "error" | "info" | "default";
  // allow any other sonner options; keep flexible
  [key: string]: any;
};

export function showToast(message: string, options?: ShowToastOptions) {
  const variant = options?.variant ?? "default";
  const opts: Record<string, any> = { ...(options ?? {}) };

  // Remove our variant prop before forwarding
  if (opts.variant) delete opts.variant;

  switch (variant) {
    case "success":
      return toast.success(message, opts);
    case "error":
      return toast.error(message, opts);
    case "info":
      return toast(message, opts);
    default:
      return toast(message, opts);
  }
}

export const showSuccess = (message: string, options?: ShowToastOptions) =>
  showToast(message, { ...options, variant: "success" });

export const showError = (message: string, options?: ShowToastOptions) =>
  showToast(message, { ...options, variant: "error" });

export const showInfo = (message: string, options?: ShowToastOptions) =>
  showToast(message, { ...options, variant: "info" });

export default showToast;
