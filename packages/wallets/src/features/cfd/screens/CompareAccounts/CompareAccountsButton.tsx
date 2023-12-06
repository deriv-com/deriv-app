import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useActiveWalletAccount,
    useAuthentication,
    useAuthorize,
    useCreateOtherCFDAccount,
    useMT5AccountsList,
    useSettings,
    useWalletAccountsList,
} from '@deriv/api';
import { WalletButton, WalletError } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../constants';
import { Verification } from '../../flows/Verification';
import { DxtradeEnterPasswordModal, MT5PasswordModal } from '../../modals';
import { CTraderSuccessModal } from '../../modals/CTraderSuccessModal';
import {
    getAccountVerificationStatus,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
} from './compareAccountsConfig';
import { JURISDICTION } from './constants';
import './CompareAccountsButton.scss';

type TCompareAccountButton = {
    isAccountAdded: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsButton = ({ isAccountAdded, marketType, platform, shortCode }: TCompareAccountButton) => {
    const history = useHistory();
    const { show } = useModal();

    const { switchAccount } = useAuthorize();
    const { data: accountSettings } = useSettings();
    const { data: authenticationInfo } = useAuthentication();
    const {
        error: createAccountError,
        isSuccess: isAccountCreated,
        mutate: createAccount,
    } = useCreateOtherCFDAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: walletAccounts } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();

    const {
        is_crypto: isCrypto,
        is_virtual: isDemo = false,
        wallet_currency_type: walletCurrencyType,
    } = activeWallet ?? {};

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

    const USDSVGWallet = useMemo(
        () =>
            walletAccounts?.find(
                account => account.currency_config?.is_USD && account.landing_company_name === JURISDICTION.SVG
            ),
        [walletAccounts]
    );

    useEffect(() => {
        if (isAccountCreated) {
            show(<CTraderSuccessModal isDemo={isDemo} walletCurrencyType={walletCurrencyType ?? 'USD'} />);
        }
        if (createAccountError) {
            show(
                <WalletError
                    errorMessage={createAccountError?.error?.message ?? 'Something went wrong. Please try again'}
                    title={createAccountError?.error?.message ?? 'Error'}
                />
            );
        }
    }, [createAccountError, isAccountCreated, isDemo, show, walletCurrencyType]);

    const onClickAdd = () => {
        if (isCrypto && USDSVGWallet) {
            switchAccount(USDSVGWallet.loginid);
            history.push('/wallets');
        }
        if (platform === CFD_PLATFORMS.MT5) {
            if (isAccountStatusVerified) {
                show(<MT5PasswordModal marketType={marketType ?? 'synthetic'} platform={platform} />);
            } else {
                show(<Verification selectedJurisdiction={shortCode} />);
            }
        } else if (platform === CFD_PLATFORMS.DXTRADE) {
            show(<DxtradeEnterPasswordModal />);
        } else {
            createAccount({
                payload: {
                    account_type: isDemo ? 'demo' : 'real',
                    market_type: MARKET_TYPE.ALL,
                    platform: CFD_PLATFORMS.CTRADER,
                },
            });
        }
    };
    return (
        <div className='wallets-compare-accounts-button'>
            <WalletButton
                color='primary-light'
                data-testid='dt_compare_cfd_account_button'
                disabled={isAccountAdded}
                isFullWidth
                onClick={onClickAdd}
            >
                {isAccountAdded ? 'Added' : 'Add'}
            </WalletButton>
        </div>
    );
};

export default CompareAccountsButton;
