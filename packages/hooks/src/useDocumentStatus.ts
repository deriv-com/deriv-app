import type { AccountStatusResponse } from '@deriv/api-types';

type TDocument = NonNullable<NonNullable<AccountStatusResponse['get_account_status']>['authentication']>;

const useDocumentStatus = (document: TDocument['document']) => {
    // Todo: Should get the data from `useStore` hook and remove the parameter.
    const is_none = document?.status === 'none';
    const is_pending = document?.status === 'pending';
    const is_verified = document?.status === 'verified';
    const is_expired = document?.status === 'expired';
    const is_rejected = document?.status === 'rejected';
    const is_suspected = document?.status === 'suspected';

    return {
        expiry_date: document?.expiry_date,
        status: document?.status,
        is_none,
        is_pending,
        is_verified,
        is_expired,
        is_rejected,
        is_suspected,
    };
};

export default useDocumentStatus;
