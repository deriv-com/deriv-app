/**
 * Function to get desired text size based off responsive size
 * @function getTextSize
 * @returns {string} text size
 */
export const getTextSize = (mobile_size: string, desktop_size: string, is_mobile = false): string =>
    is_mobile ? mobile_size : desktop_size;

/**
 * Function to get desired icon size based off responsive size
 * @function getIconSize
 * @returns {number} icon size
 */
export const getIconSize = (mobile_size: number, desktop_size: number, is_mobile = false): number =>
    is_mobile ? mobile_size : desktop_size;

type TInlineTextSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Function to get desired inline text size based off responsive size
 * @function getInlineTextSize
 * @returns {TInlineTextSize} inline message text size
 */
export const getInlineTextSize = (
    mobile_size: TInlineTextSize,
    desktop_size: TInlineTextSize,
    is_mobile = false
): TInlineTextSize => (is_mobile ? mobile_size : desktop_size);
