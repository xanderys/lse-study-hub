export const APP_TITLE = "LSE Study Hub";
export const APP_LOGO = "📚";

// Simple local auth - no OAuth needed
export const getLoginUrl = () => {
  // In local mode, we don't need login
  return "#";
};
