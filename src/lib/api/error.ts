import type { ApiFailure } from "@/types/api";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details: string[] = [],
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function normalizeResponseError(response: Response): Promise<AppError> {
  let body: Partial<ApiFailure> | undefined;
  try {
    body = (await response.json()) as Partial<ApiFailure>;
  } catch {
    /* empty response */
  }
  const fallback =
    response.status >= 500
      ? "MediFlow is temporarily unavailable. Please try again."
      : response.status === 403
        ? "You do not have permission to do that."
        : response.status === 401
          ? "Your session has expired. Please sign in again."
          : "We could not complete your request.";
  return new AppError(body?.message || fallback, response.status, body?.errors || []);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
