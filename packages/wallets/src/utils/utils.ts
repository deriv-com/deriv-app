import { TAddedMT5Account, TAvailableMT5Account, TWalletsMFAccountStatus } from '../types';

type TServerError = {
    code: string;
    details?: { [key: string]: string };
    fields?: string[];
    message: string;
};

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const defineViewportHeight = () => {
    const viewportHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--wallets-vh', `${viewportHeight}px`);
};

export const defineSwitcherWidth = (realWidth: number, demoWidth: number) => {
    document.documentElement.style.setProperty('--wallets-real-width', `${realWidth}px`);
    document.documentElement.style.setProperty('--wallets-demo-width', `${demoWidth}px`);
    document.documentElement.style.setProperty('--wallets-switcher-width', `${demoWidth + realWidth + 16}px`);
};

const requiredDocumentStatuses = ['expired', 'none', 'rejected', 'suspected'];

export const getClientVerification = (account: TAddedMT5Account | TAvailableMT5Account | TWalletsMFAccountStatus) => {
    const hasClientKycStatus = 'client_kyc_status' in account;
    const documentStatuses = account.client_kyc_status;

    const hasPoiStatus = hasClientKycStatus && 'poi_status' in documentStatuses;
    const hasPoaStatus = hasClientKycStatus && 'poa_status' in documentStatuses;
    const hasTinStatus = hasClientKycStatus && 'valid_tin' in documentStatuses;
    const hasRequiredTin = hasClientKycStatus && 'required_tin' in documentStatuses;

    const isPoiRequired = hasPoiStatus && requiredDocumentStatuses.includes(documentStatuses.poi_status);
    const isPoaRequired = hasPoaStatus && requiredDocumentStatuses.includes(documentStatuses.poa_status);
    const isTinRequired =
        hasRequiredTin && hasTinStatus && Boolean(documentStatuses.required_tin) && !documentStatuses.valid_tin;

    return {
        hasClientKycStatus,
        hasPoaStatus,
        hasPoiStatus,
        isPoaRequired,
        isPoiRequired,
        isTinRequired,
        isVerificationRequired: isPoiRequired || isPoaRequired || isTinRequired,
        statuses: documentStatuses,
    };
};
