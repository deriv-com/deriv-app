import React from 'react';
import { useAccountStatus, useCreateMT5Account, useTradingPlatformPasswordChange } from '@deriv/api';
import { Provider } from '@deriv/library';
import { SentEmailContent } from '../../../../components';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { PlatformDetails, TTM5FilterLandingCompany } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
import { useSubmitHandler } from './useSubmitHandler';

type TPasswordComponentProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    platform: TPlatforms.All;
    selectedJurisdiction: TTM5FilterLandingCompany;
    setPassword: (password: string) => void;
};

const PasswordComponent = ({
    marketType,
    password,
    platform,
    selectedJurisdiction,
    setPassword,
}: TPasswordComponentProps) => {
    const { isLoading: tradingPlatformPasswordChangeLoading } = useTradingPlatformPasswordChange();
    const { data: accountStatus } = useAccountStatus();
    const { show } = Provider.useModal();
    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const { error, isLoading: createMT5AccountLoading } = useCreateMT5Account();
    const submitHandler = useSubmitHandler({ marketType, password, selectedJurisdiction });

    return isMT5PasswordNotSet ? (
        <CreatePassword
            icon={<MT5PasswordIcon />}
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => submitHandler}
            password={password}
            platform={PlatformDetails.mt5.platform}
        />
    ) : (
        <EnterPassword
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            marketType={marketType}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => submitHandler}
            onSecondaryClick={() => show(<SentEmailContent platform={platform} />)}
            password={password}
            passwordError={error?.error?.code === 'PasswordError'}
            platform={PlatformDetails.mt5.platform}
        />
    );
};

export default PasswordComponent;
