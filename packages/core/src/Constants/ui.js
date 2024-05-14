import { isBot } from '@deriv/shared';

const is_bot = isBot();

export const MAX_MOBILE_WIDTH = is_bot ? 1279 : 767;
export const MAX_TABLET_WIDTH = is_bot ? 1279 : 1024;
