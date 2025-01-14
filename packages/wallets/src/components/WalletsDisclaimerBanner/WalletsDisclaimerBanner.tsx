import React, { useState } from 'react';
import { LabelPairedChevronDownLgBoldIcon, LabelPairedChevronUpLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './WalletsDisclaimerBanner.scss';

const WalletsMobileDisclaimerBannerContent = () => {
    const [isOpen, setIsOpen] = useState(false);
    if (isOpen) {
        return (
            <>
                <Text size='xs'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. <0>70% of retail investor accounts lose money when trading CFDs with this provider.</0> You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.'
                    />
                </Text>
                <div className='wallets-disclaimer-banner__content__icon'>
                    <LabelPairedChevronDownLgBoldIcon height={16} onClick={() => setIsOpen(false)} width={16} />
                </div>
            </>
        );
    }
    return (
        <>
            <Text size='xs' weight='bold'>
                <Localize i18n_default_text='70.78% of retail investor accounts lose money when trading CFDs with this provider. ' />
            </Text>
            <div className='wallets-disclaimer-banner__content__icon'>
                <LabelPairedChevronUpLgBoldIcon height={16} onClick={() => setIsOpen(true)} width={16} />
            </div>
        </>
    );
};

const WalletsDisclaimerBanner = () => {
    const { isDesktop } = useDevice();
    return (
        <section className='wallets-disclaimer-banner'>
            <div className='wallets-disclaimer-banner__container'>
                <div className='wallets-disclaimer-banner__content'>
                    {isDesktop ? (
                        <Text size='sm'>
                            <Localize
                                components={[<strong key={0} />]}
                                i18n_default_text='The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. <0>70% of retail investor accounts lose money when trading CFDs with this provider.</0> You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.'
                            />
                        </Text>
                    ) : (
                        <WalletsMobileDisclaimerBannerContent />
                    )}
                </div>
            </div>
        </section>
    );
};

export default WalletsDisclaimerBanner;
