import { isMobile } from '@deriv/shared';

/**
 * Function to get desired text size based off responsive size
 * @function getTextSize
 * @returns {string} text size
 */
export const getTextSize = (mobile_size: string, desktop_size: string): string =>
    isMobile() ? mobile_size : desktop_size;

/**
 * Function to get desired icon size based off responsive size
 * @function getIconSize
 * @returns {number} icon size
 */
export const getIconSize = (mobile_size: number, desktop_size: number): number =>
    isMobile() ? mobile_size : desktop_size;

type TInlineTextSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Function to get desired inline text size based off responsive size
 * @function getInlineTextSize
 * @returns {TInlineTextSize} inline message text size
 */
export const getInlineTextSize = (mobile_size: TInlineTextSize, desktop_size: TInlineTextSize): TInlineTextSize =>
    isMobile() ? mobile_size : desktop_size;
