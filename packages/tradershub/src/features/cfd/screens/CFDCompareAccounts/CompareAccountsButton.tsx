import React, { useEffect, useMemo } from 'react';
import {
    useActiveTradingAccount,
    useAuthentication,
    useCreateOtherCFDAccount,
    useMT5AccountsList,
    useSettings,
} from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { THooks, TPlatforms } from '../../../../types';
import { DummyComponent } from '../../components/DummyComponent';
import { Category, CFDPlatforms, MarketType } from '../../constants';
import { DxtradePasswordModal } from '../../modals';
import { CTraderSuccessModal } from '../../modals/CTraderSuccessModal';
import {
    getAccountVerificationStatus,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
} from './CompareAccountsConfig';

type TCompareAccountButton = {
    isAccountAdded: boolean;
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

/*
 * This is a button component for Compare Accounts that is used to add a CFD account.
@params {boolean} isAccountAdded - Whether the account is added or not.
@params {string} platform - The platform of the account.
@params {string} shortCode - The short code of the account.
@params {string} marketType - The market type of the account. //Removed for now as it is needed by Verification flow
 */
const CompareAccountsButton = ({ isAccountAdded, platform, shortCode }: TCompareAccountButton) => {
    const { show } = Provider.useModal();

    const { data: accountSettings } = useSettings();
    const { data: authenticationInfo } = useAuthentication();
    const {
        error: createAccountError,
        isSuccess: isAccountCreated,
        mutate: createAccount,
    } = useCreateOtherCFDAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const { is_virtual: isDemo = false } = activeTradingAccount ?? {};

    const {
        account_opening_reason: accountOpeningReason,
        citizen,
        place_of_birth: placeOfBirth,
        tax_identification_number: taxIdentificationNumber,
        tax_residence: taxResidence,
    } = accountSettings;

    const hasSubmittedPersonalDetails = !!(
        citizen &&
        placeOfBirth &&
        taxResidence &&
        taxIdentificationNumber &&
        accountOpeningReason
    );

    const restrictBviAccountCreation = useMemo(
        () => shouldRestrictBviAccountCreation(mt5Accounts ?? []),
        [mt5Accounts]
    );

    const restrictVanuatuAccountCreation = useMemo(
        () => shouldRestrictVanuatuAccountCreation(mt5Accounts ?? []),
        [mt5Accounts]
    );

    const isAccountStatusVerified = getAccountVerificationStatus(
        shortCode,
        restrictBviAccountCreation,
        restrictVanuatuAccountCreation,
        hasSubmittedPersonalDetails,
        authenticationInfo,
        isDemo
    );

    useEffect(() => {
        if (isAccountCreated) {
            show(<CTraderSuccessModal isDemo={isDemo} />);
        }
        if (createAccountError) {
            // Error Component to be implemented
            show(<DummyComponent />);
        }
    }, [createAccountError, isAccountCreated, isDemo, show]);

    const onClickAdd = () => {
        if (platform === CFDPlatforms.MT5) {
            // Going to remove Placeholder once the MT5PasswordModal
            // and Verification flow is implemented
            if (isAccountStatusVerified) show(<DummyComponent />);

            // if (isAccountStatusVerified) {
            //     show(<MT5PasswordModal)
            // } else {
            //     show(<Verifaication />);
            // }
        } else if (platform === CFDPlatforms.DXTRADE) {
            show(<DxtradePasswordModal />);
        } else {
            createAccount({
                payload: {
                    account_type: isDemo ? Category.DEMO : Category.REAL,
                    market_type: MarketType.ALL,
                    platform: CFDPlatforms.CTRADER,
                },
            });
        }
    };
    return (
        <div className='h-2000 m-1000 w-[calc(100%-40px)]'>
            <Button
                className='w-full text-system-light-primary-background'
                data-testid='dt_compare_cfd_account_button'
                disabled={isAccountAdded}
                onClick={onClickAdd}
            >
                {isAccountAdded ? 'Added' : 'Add'}
            </Button>
        </div>
    );
};

export default CompareAccountsButton;
