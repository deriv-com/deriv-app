/** Function to transform a nickname to a 2-letter character. Most commonly used inside Avatars */
export const getShortNickname = (nickname: string): string => nickname?.substring(0, 2).toUpperCase();
