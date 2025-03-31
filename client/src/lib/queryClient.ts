import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    
    // Clone the response before reading its body to avoid 'body already read' errors
    const resClone = res.clone();
    
    try {
      // Try to parse the response as JSON first
      const errorData = await resClone.json();
      
      if (res.status === 429) {
        // Rate limit error - include the reset time if available
        const resetTime = errorData.resetTime ? new Date(errorData.resetTime) : null;
        const resetTimeStr = resetTime ? ` Try again at ${resetTime.toLocaleTimeString()}.` : '';
        errorMessage = `Rate limit exceeded.${resetTimeStr} Please wait before making another request.`;
      } else {
        // Other errors
        errorMessage = errorData.message || `${res.status}: ${res.statusText}`;
      }
    } catch (e) {
      // If response is not JSON, use text
      try {
        const text = await res.text();
        errorMessage = text || `${res.status}: ${res.statusText}`;
      } catch (textError) {
        // If we can't read the body at all, just use the status
        errorMessage = `${res.status}: ${res.statusText}`;
      }
    }
    
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
