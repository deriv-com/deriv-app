/**
 * Checks is the url passed as prop routes to external URL resource by checking if it starts with http, https or mailto
 * @param link string
 * @returns boolean
 */
export const isExternalLink = (link: string) => /^(http|https|mailto):/i.test(link);
