import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthentication, useCreateOtherCFDAccount, useMT5AccountsList, useSettings } from '@deriv/api';
import { WalletButton } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { Verification } from '../../flows/Verification';
import { DxtradeEnterPasswordModal, MT5PasswordModal } from '../../modals';
import {
    getAccountVerificationStatus,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
} from './compareAccountsConfig';
import { CFD_PLATFORMS, MARKET_TYPE } from './constants';
import './CompareAccountsButton.scss';

type TCompareAccountButton = {
    isAccountAdded: boolean;
    isDemo: boolean;
    marketType: typeof MARKET_TYPE[keyof typeof MARKET_TYPE];
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    shortCode: string;
};

const CompareAccountsButton = ({ isAccountAdded, isDemo, marketType, platform, shortCode }: TCompareAccountButton) => {
    const history = useHistory();
    const { show } = useModal();

    const { data: accountSettings } = useSettings();
    const { data: authenticationInfo } = useAuthentication();
    const { mutate: createAccount } = useCreateOtherCFDAccount();
    const { data: mt5Accounts } = useMT5AccountsList();

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

    const onClickAdd = () => {
        if (platform === CFD_PLATFORMS.MT5) {
            if (isAccountStatusVerified) {
                show(<MT5PasswordModal marketType={marketType} platform={platform} />);
            } else {
                show(<Verification selectedJurisdiction={shortCode} />);
            }
        } else if (platform === CFD_PLATFORMS.DXTRADE) {
            show(<DxtradeEnterPasswordModal />);
        } else {
            createAccount({
                payload: {
                    account_type: isDemo ? 'demo' : 'real',
                    market_type: 'all',
                    platform: 'ctrader',
                },
            });
        }
        history.push('/wallets');
    };
    return (
        <div className='wallets-compare-accounts-button'>
            <WalletButton
                color='primary-light'
                data-testid='dt_compare_cfd_account_button'
                disabled={isAccountAdded}
                isFullWidth
                onClick={onClickAdd}
                text={isAccountAdded ? 'Added' : 'Add'}
            />
        </div>
    );
};

export default CompareAccountsButton;
