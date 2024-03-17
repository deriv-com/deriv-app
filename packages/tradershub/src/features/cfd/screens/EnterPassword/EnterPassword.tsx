import React, { ChangeEvent } from 'react';
import { useRegulationFlags } from '@/hooks';
import { TMarketTypes, TPlatforms } from '@/types';
import { MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Modal, PasswordInput, Text } from '@deriv-com/ui';
import MT5PasswordFooter from '../../modals/MT5PasswordModal/MT5PasswordFooter';

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
 * @param {TMarketTypes.CreateOtherCFDAccount} marketType - market type all or synthetic or financial
 * @param {Function} onPasswordChange - callback to handle password change
 * @param {string} password - password value
 * @param {TPlatforms.All} platform - platform Mt5 or Dxtrade
 */

const EnterPassword = ({ marketType, onPasswordChange, password, platform }: TEnterPasswordProps) => {
    const title = PlatformDetails[platform].title;
    const { isEU } = useRegulationFlags();

    const { data } = useActiveTradingAccount();
    const accountType = data?.is_virtual ? 'Demo' : 'Real';
    const marketTypeDetails = MarketTypeDetails(isEU);

    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : marketTypeDetails[marketType]?.title;

    return (
        <React.Fragment>
            <Modal.Header>
                <Text weight='bold'>{`Enter your ${title} password`}</Text>
            </Modal.Header>
            <Modal.Body>
                <div className='flex lg:inline-flex lg:w-[400px] flex-col justify-center items-start rounded-default border-sm bg-system-light-primary-background'>
                    <div className='flex flex-col gap-16 lg:gap-8 lg:pt-24 lg:px-24'>
                        <Text size='sm'>
                            Enter your {title} password to add a {title} {marketTypeTitle} account.
                        </Text>
                        <PasswordInput
                            isFullWidth
                            label={`${title} password`}
                            onChange={onPasswordChange}
                            value={password}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <MT5PasswordFooter password={password} />
            </Modal.Footer>
        </React.Fragment>
    );
};

export default EnterPassword;
