import React, { useState } from 'react';
import { DerivLightDmt5PasswordIcon } from '@deriv/quill-icons';
// import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { Checkbox, InlineMessage } from '@deriv-com/ui';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TPlatforms } from '../../../../types';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, companyNamesAndUrls, getMarketTypeDetails, PlatformDetails, PRODUCT } from '../../constants';
import './CreatePasswordMT5.scss';

type TProps = {
    isLoading?: boolean;
    isVirtual?: boolean;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick: () => void;
    password: string;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    selectedJurisdiction?: THooks.AvailableMT5Accounts['shortcode'];
};

const CreatePasswordMT5: React.FC<TProps> = ({
    isLoading,
    isVirtual,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
    product,
    selectedJurisdiction,
}) => {
    const { isDesktop } = useDevice();
    const { title } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];
    const platformTitle = PlatformDetails[platform].title;
    const productTitle = getMarketTypeDetails(product).all.title;
    const [checked, setChecked] = useState(!(product === PRODUCT.ZEROSPREAD && !isVirtual));

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
                {product === PRODUCT.ZEROSPREAD && !isVirtual && (
                    <>
                        <InlineMessage
                            className='wallets-create-password-mt5__inline-message'
                            iconPosition='top'
                            variant='info'
                        >
                            <WalletText size={isDesktop ? '2xs' : 'xs'}>
                                You are adding your {platformTitle}
                                {productTitle} account under {selectedCompany.name}, regulated by Malta Financial
                                Services Authority (MFSA) (licence no. IS/70156).
                            </WalletText>
                        </InlineMessage>
                        <Checkbox
                            checked={checked}
                            label={
                                <WalletText size={isDesktop ? 'xs' : 'sm'}>
                                    I confirm and accept {selectedCompany.name}’s
                                    <a className='wallets-create-password-mt5__tnc-link' href={selectedCompany.tncUrl}>
                                        terms and conditions
                                    </a>
                                </WalletText>
                            }
                            name='zerospread-checkbox'
                            onChange={() => setChecked(prev => !prev)}
                        />
                    </>
                )}
            </div>

            {isDesktop && (
                <div className='wallets-create-password-mt5__footer'>
                    <WalletButton
                        disabled={!password || isLoading || disableButton || !checked}
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
