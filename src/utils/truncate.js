// Truncate long text
export function truncate(params) {
  return params?.length > 60 ? params.substring(0, 60) + '....' : params;
}
