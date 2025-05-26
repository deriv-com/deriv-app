import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import { Button, Icon, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { TAdditionalDetailsOfEachMT5Loginid } from '@deriv/stores/types';
import { Localize, localize } from '@deriv/translations';

import { TTradingPlatformAccounts } from '../../Components/props.types';
import SpecBox from '../../Components/specbox';
import { CFD_PLATFORMS } from '../../Helpers/cfd-config';

import './account-nakala-modal.scss';

interface CFDDerivNakalaModalProps {
    onclickAction: () => void;
}

const ModalInfo = () => {
    return (
        <div className='nakala-modal-info'>
            <div className='nakala-modal-info_icon'>
                <Icon icon='IcInfoLight' />
            </div>
            <Text size='xxxs'>
                <Localize i18n_default_text='Use your MT5 password when linking your account.' />
            </Text>
        </div>
    );
};

const CFDDerivNakalaInfo = (props: CFDDerivNakalaModalProps) => {
    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        <Icon icon='IcRebrandingDerivNakala' size={64} />
                    </div>
                </div>

                <div className='cfd-nakala-modal__description'>
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='Follow top global traders and copy their strategies.' />
                    </Text>
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='Become a signal provider and earn from your expertise.' />
                    </Text>
                </div>

                <div className='cfd-nakala-modal__getting-started'>
                    <Text as='h3' weight='bold' size='s'>
                        <Localize i18n_default_text='Getting started with Deriv Nakala' />
                    </Text>

                    <div className='cfd-nakala-modal__steps'>
                        <div className='cfd-nakala-modal__step'>
                            <div className='cfd-nakala-modal__step-number'>
                                <Text weight='bold' color='colored-background'>
                                    1
                                </Text>
                            </div>
                            <Text size='xs'>
                                <Localize i18n_default_text='Enable your MT5 Standard account.' />
                            </Text>
                        </div>

                        <div className='cfd-nakala-modal__step'>
                            <div className='cfd-nakala-modal__step-number'>
                                <Text weight='bold' color='colored-background'>
                                    2
                                </Text>
                            </div>
                            <Text size='xs'>
                                <Localize i18n_default_text='Open a Deriv Nakala account, and link your MT5 Standard account to Deriv Nakala.' />
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`cfd-nakala-modal__footer ${!isDesktop() && 'cfd-nakala-modal__footer--mobile'}`}>
                <Button type='button' onClick={props.onclickAction} primary large>
                    <Localize i18n_default_text='Next' />
                </Button>
            </div>
        </React.Fragment>
    );
};

interface TCFDDerivNakalaLinkAccountProps {
    isSuccess?: boolean;
}

export const CFDDerivNakalaLinkAccount = observer((props: TCFDDerivNakalaLinkAccountProps) => {
    const { isSuccess = false } = props;
    const { traders_hub } = useStore();
    const { combined_cfd_mt5_accounts } = traders_hub;

    const mt5_trade_account = combined_cfd_mt5_accounts.find(
        account =>
            account.platform === CFD_PLATFORMS.MT5 && account.product === 'standard' && account.action_type !== 'get'
    );

    useEffect(() => {
        const nakalaLinkedCookie = 'nakala_linked';

        const nakalaLinkedCookieExist = Cookies.get(nakalaLinkedCookie);
        if (nakalaLinkedCookieExist) return;

        const nakalaLinkedCookieValue = 'true';
        const nakalaLinkedCookieExpiry = 365; // days

        Cookies.set(nakalaLinkedCookie, nakalaLinkedCookieValue, {
            domain: '.deriv.com',
            expires: nakalaLinkedCookieExpiry,
        });
    }, []);

    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        {isSuccess ? (
                            <Icon icon='IcRebrandingNakalaLinkedSuccess' width={64} height={64} />
                        ) : (
                            <Icon icon='IcRebrandingDerivNakala' size={64} />
                        )}
                    </div>
                </div>

                {isSuccess && (
                    <div className='cfd-nakala-modal__title'>
                        <Text as='h3' weight='bold'>
                            <Localize i18n_default_text='Your MT5 Standard account is ready' />
                        </Text>
                    </div>
                )}

                <div className='cfd-nakala-modal__description'>
                    <Text align='center' as='p'>
                        {isSuccess ? (
                            <Localize
                                components={[<strong key={0} />]}
                                i18n_default_text='Link your MT5 Standard account to the <0>Deriv Nakala app</0> using these details:'
                            />
                        ) : (
                            <Localize
                                components={[<strong key={0} />]}
                                i18n_default_text='<0>Deriv Nakala app</0> should be linked to your MT5 Standard Account, using these details:'
                            />
                        )}
                    </Text>
                </div>

                <div className='cfd-nakala-modal__login-specs'>
                    <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Server')}</Text>
                        <SpecBox
                            is_bold
                            value={(mt5_trade_account as TAdditionalDetailsOfEachMT5Loginid)?.server_info?.environment}
                        />
                    </div>
                    <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Login id')}</Text>
                        <SpecBox is_bold value={(mt5_trade_account as TTradingPlatformAccounts)?.display_login} />
                    </div>
                    <ModalInfo />
                </div>

                <div className='cfd-nakala-modal__qr-section'>
                    <div className='cfd-nakala-modal__qr-section-help'>
                        <Text size='xs'>
                            {localize('Need help?')}{' '}
                            <a href='https://deriv.copytrade-resource.com/' target='_blank' rel='noreferrer'>
                                {localize('Check the guide')}
                            </a>
                        </Text>
                    </div>
                    <div className='cfd-nakala-modal__qr-section-code'>
                        <Icon icon='IcRebrandingNakalaQrCode' height={80} width={80} />
                    </div>
                    <div className='cfd-nakala-modal__qr-section-text'>
                        <Text size='xxs'>{localize('Scan to download the mobile app.')}</Text>
                    </div>
                </div>
            </div>
            {!isDesktop() && (
                <div className={`cfd-nakala-modal__footer cfd-nakala-modal__footer--info-mobile`}>
                    <Button
                        type='button'
                        onClick={() => window.open('https://onelink.to/uuuxmw', '_blank')}
                        primary
                        large
                    >
                        <Localize i18n_default_text='Open Deriv Nakala app' />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
});
export default CFDDerivNakalaInfo;
