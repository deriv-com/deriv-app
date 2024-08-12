import React from 'react';
import { DerivLightDmt5PasswordIcon, DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { Checkbox, InlineMessage } from '@deriv-com/ui';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';
import './CreatePassword.scss';

type TProps = {
    isLoading?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
};

const CreatePasswordIcon = {
    dxtrade: <DerivLightIcDxtradePasswordIcon height={120} width={120} />,
    mt5: <DerivLightDmt5PasswordIcon height={120} width={120} />,
} as const;

const CreatePassword: React.FC<TProps> = ({ isLoading, onPasswordChange, onPrimaryClick, password, platform }) => {
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);
    // const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-create-password'>
            <div className='wallets-create-password__header'>
                <WalletText lineHeight='xl' weight='bold'>
                    Create a {title} password
                </WalletText>
            </div>
            <div className='wallets-create-password__body'>
                {CreatePasswordIcon[platform as keyof typeof CreatePasswordIcon]}
                <WalletText align='center' size='sm'>
                    You can use this password for all your {title} accounts.
                </WalletText>
                <WalletPasswordFieldLazy
                    label={`${title} password`}
                    mt5Policy={isMT5}
                    onChange={onPasswordChange}
                    password={password}
                />
                <InlineMessage className='wallets-create-password__inline-message' iconPosition='top' variant='info'>
                    <WalletText size='2xs'>
                        You are adding your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited, regulated
                        by Malta Financial Services Authority (MFSA) (licence no. IS/70156).
                    </WalletText>
                </InlineMessage>
                <Checkbox
                    className='wallets-create-password__checkbox'
                    label={
                        <WalletText size='xs'>
                            I confirm and accept Deriv (BVI) Ltd’s{' '}
                            <a className='wallets-create-password__tnc-link' href=''>
                                terms and conditions
                            </a>
                        </WalletText>
                    }
                    name='example-checkbox'
                    onChange={() => null}
                />
            </div>

            {isDesktop && (
                <div className='wallets-create-password__footer'>
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

export default CreatePassword;
