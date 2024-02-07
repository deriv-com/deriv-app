import React, { ChangeEvent } from 'react';
import { useActiveTradingAccount } from '@deriv/api';
import { useBreakpoint } from '@deriv/quill-design';
import { Button, PasswordInput, Text } from '@deriv-com/ui';
import { useUIContext } from '../../../../components';
import useRegulationFlags from '../../../../hooks/useRegulationFlags';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password';
import { MarketTypeDetails, PlatformDetails } from '../../constants';

type TEnterPasswordProps = {
    isLoading?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
};

/**
 * Component to display the enter password screen
 * @param {boolean} isLoading - loading state
 * @param {TMarketTypes.CreateOtherCFDAccount} marketType - market type all or synthetic or financial
 * @param {Function} onPasswordChange - callback to handle password change
 * @param {Function} onPrimaryClick - callback to handle primary button click
 * @param {Function} onSecondaryClick - callback to handle secondary button click
 * @param {string} password - password value
 * @param {boolean} passwordError - password error state
 * @param {TPlatforms.All} platform - platform Mt5 or Dxtrade
 * @returns {ReactNode} - returns the enter password screen component
 */

const EnterPassword = ({
    isLoading,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
}: TEnterPasswordProps) => {
    const { isDesktop } = useBreakpoint();
    const title = PlatformDetails[platform].title;
    const { uiState } = useUIContext();
    const activeRegulation = uiState.regulation;

    const { isEU } = useRegulationFlags(activeRegulation);

    const { data } = useActiveTradingAccount();
    const accountType = data?.is_virtual ? 'Demo' : 'Real';
    const marketTypeDetails = MarketTypeDetails(isEU);

    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : marketTypeDetails[marketType]?.title;

    return (
        <div className='flex w-full lg:inline-flex lg:w-[400px] flex-col justify-center items-start rounded-400 border-sm bg-system-light-primary-background'>
            <Text weight='bold'>Enter your {title} password</Text>
            <div className='flex flex-col gap-800 lg:gap-400 lg:py-1200'>
                <Text size='sm'>
                    Enter your {title} password to add a {title} {marketTypeTitle} account.
                </Text>
                <PasswordInput
                    className='text-body-sm'
                    label={`${title} password`}
                    onChange={onPasswordChange}
                    value={password}
                />
            </div>
            {isDesktop && (
                <div className='flex items-center justify-end w-full gap-400 pt-1200'>
                    <Button onClick={onSecondaryClick} size='lg' variant='outlined'>
                        Forgot password?
                    </Button>
                    <Button
                        disabled={!password || isLoading || !validPassword(password) || passwordError}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        Add account
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
