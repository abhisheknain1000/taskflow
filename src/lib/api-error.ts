import { isAxiosError } from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (error.code === "ERR_NETWORK" || !error.response) {
      return "Cannot reach server. Make sure the backend is running on port 5000.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
