import React from 'react';
import { DerivLightDmt5PasswordIcon } from '@deriv/quill-icons';
import { Checkbox, InlineMessage } from '@deriv-com/ui';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';
import './CreatePasswordMT5.scss';

type TProps = {
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

const CreatePasswordMT5: React.FC<TProps> = ({ isLoading, onPasswordChange, onPrimaryClick, password, platform }) => {
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);
    // const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-create-password-mt5'>
            {isDesktop && (
                <div className='wallets-create-password-mt5__header'>
                    <WalletText lineHeight='xl' weight='bold'>
                        Create a {title} password
                    </WalletText>
                </div>
            )}
            <div className='wallets-create-password-mt5__body'>
                <DerivLightDmt5PasswordIcon height={120} width={120} />
                <WalletText size={isDesktop ? 'sm' : 'md'}>
                    Note: You can use this password for all your {title} accounts.
                </WalletText>
                <WalletPasswordFieldLazy
                    label={`${title} password`}
                    mt5Policy={isMT5}
                    onChange={onPasswordChange}
                    password={password}
                />
                <InlineMessage
                    className='wallets-create-password-mt5__inline-message'
                    iconPosition='top'
                    variant='info'
                >
                    <WalletText size={isDesktop ? '2xs' : 'xs'}>
                        You are adding your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited, regulated
                        by Malta Financial Services Authority (MFSA) (licence no. IS/70156).
                    </WalletText>
                </InlineMessage>
                <Checkbox
                    label={
                        <WalletText size={isDesktop ? 'xs' : 'sm'}>
                            I confirm and accept Deriv (BVI) Ltd’s{' '}
                            <a className='wallets-create-password-mt5__tnc-link' href=''>
                                terms and conditions
                            </a>
                        </WalletText>
                    }
                    name='example-checkbox'
                    onChange={() => null}
                />
            </div>

            {isDesktop && (
                <div className='wallets-create-password-mt5__footer'>
                    <WalletButton
                        disabled={!password || isLoading || disableButton}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        {`Create ${title} password`}
                    </WalletButton>
                </div>
            )}
        </div>
    );
};

export default CreatePasswordMT5;
