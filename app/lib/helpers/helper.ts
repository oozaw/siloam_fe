export const formatSearchParams = (params: Record<string, any>) => {
  if (!params || typeof params !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();

  // Add parameters to search params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};
