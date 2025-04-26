import { toast } from "react-toastify";

export function showToast(
  message: string,
  type: "success" | "error" | "info" | "warn" = "success"
) {
  const config = {
    position: "top-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "info":
      toast.info(message, config);
      break;
    case "warn":
      toast.warn(message, config);
      break;
  }
}
