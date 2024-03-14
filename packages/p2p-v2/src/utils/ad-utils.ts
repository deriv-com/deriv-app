import { ERROR_CODES } from '@/constants';

/**
 * Determines whether to show a tooltip icon based on the visibility status.
 * A tooltip icon should be shown if:
 * - There is only one visibility status and it is not equal to `ERROR_CODES.ADVERT_INACTIVE`
 *   or `ERROR_CODES.ADVERTISER_ADS_PAUSED`.
 * - There are multiple visibility statuses.
 *
 * @param {string[]} visibilityStatus - The array of visibility statuses.
 * @returns {boolean} Returns `true` if a tooltip icon should be shown, otherwise `false`.
 */
export const shouldShowTooltipIcon = (visibilityStatus: string[]) =>
    (visibilityStatus?.length === 1 &&
        visibilityStatus[0] !== ERROR_CODES.ADVERT_INACTIVE &&
        visibilityStatus[0] !== ERROR_CODES.ADVERTISER_ADS_PAUSED) ||
    visibilityStatus.length > 1;

/**
 * Determines the visibility error codes based on the provided parameters.
 *
 * @param {string[]} visibilityStatus - The array of existing visibility status codes.
 * @param {boolean} enableActionPoint - A boolean indicating whether the action point is enabled.
 * @param {boolean} isAdvertListed - A boolean indicating whether the advert is listed.
 * @returns {string[]} Returns an updated array of visibility status codes.
 */
export const getVisibilityErrorCodes = (
    visibilityStatus: string[],
    enableActionPoint: boolean,
    isAdvertListed: boolean
) => {
    let updatedVisibilityStatus = [...visibilityStatus];
    if (!isAdvertListed && !updatedVisibilityStatus.includes(ERROR_CODES.ADVERTISER_ADS_PAUSED))
        updatedVisibilityStatus = [...updatedVisibilityStatus, ERROR_CODES.ADVERTISER_ADS_PAUSED];
    if (!enableActionPoint && updatedVisibilityStatus.includes(ERROR_CODES.ADVERT_INACTIVE))
        updatedVisibilityStatus = updatedVisibilityStatus.filter(status => status !== ERROR_CODES.ADVERT_INACTIVE);
    if (enableActionPoint && !updatedVisibilityStatus.includes(ERROR_CODES.ADVERT_INACTIVE))
        updatedVisibilityStatus = [...updatedVisibilityStatus, ERROR_CODES.ADVERT_INACTIVE];
    return updatedVisibilityStatus;
};
