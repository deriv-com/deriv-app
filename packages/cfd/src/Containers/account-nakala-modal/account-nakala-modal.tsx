import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import { Button, Icon, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import SpecBox from '../../Components/specbox';

import './account-nakala-modal.scss';

interface CFDDerivNakalaModalProps {
    onclickAction: () => void;
}

const ModalInfo = () => {
    return (
        <React.Fragment>
            <div className='nakala-modal-maintenance'>
                <div className='nakala-modal-maintenance_icon'>
                    <Icon icon='IcInfoYellow' />
                </div>
                <Text size='xxxs'>
                    <Localize i18n_default_text='Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                </Text>
            </div>
        </React.Fragment>
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
                                <Localize i18n_default_text='Open an MT5 Standard account on our trading platform.' />
                            </Text>
                        </div>

                        <div className='cfd-nakala-modal__step'>
                            <div className='cfd-nakala-modal__step-number'>
                                <Text weight='bold' color='colored-background'>
                                    2
                                </Text>
                            </div>
                            <Text size='xs'>
                                <Localize i18n_default_text='Download the Nakala app and create your account.' />
                            </Text>
                        </div>
                        <div className='cfd-nakala-modal__step'>
                            <div className='cfd-nakala-modal__step-number'>
                                <Text weight='bold' color='colored-background'>
                                    3
                                </Text>
                            </div>
                            <Text size='xs'>
                                <Localize i18n_default_text='Link your MT5 account in the Deriv Nakala app.' />
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
    nakalaInfo: {
        loginId: string | null;
        serverName: string | null;
    };
}

export const CFDDerivNakalaLinkAccount = observer((props: TCFDDerivNakalaLinkAccountProps) => {
    const { isSuccess = false, nakalaInfo } = props;

    const manageNakalaCookie = () => {
        const nakalaLinkedCookie = 'nakala_linked';

        const nakalaLinkedCookieExist = Cookies.get(nakalaLinkedCookie);
        if (nakalaLinkedCookieExist) return;

        const nakalaLinkedCookieValue = 'true';
        const nakalaLinkedCookieExpiry = 365; // days

        Cookies.set(nakalaLinkedCookie, nakalaLinkedCookieValue, {
            domain: '.deriv.com',
            expires: nakalaLinkedCookieExpiry,
        });
    };

    const isDesktopDevice = isDesktop();

    useEffect(() => {
        isDesktopDevice && manageNakalaCookie();
    }, [isDesktopDevice]);

    const onClickOpenApp = () => {
        manageNakalaCookie();
        window.open('https://onelink.to/uuuxmw', '_blank');
    };

    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        <Icon icon='IcRebrandingNakalaMt5Linked' className='linked' />
                    </div>
                </div>

                {isSuccess && (
                    <div className='cfd-nakala-modal__title'>
                        <Text as='h3' weight='bold' align='center'>
                            <Localize i18n_default_text='Your MT5 Standard account is ready' />
                        </Text>
                    </div>
                )}

                <div className='cfd-nakala-modal__steps cfd-nakala-modal__steps--with-line'>
                    <div className='cfd-nakala-modal__step'>
                        <div className='cfd-nakala-modal__step-number'>
                            <Text weight='bold' color='colored-background'>
                                1
                            </Text>
                        </div>
                        <div className='cfd-nakala-modal__step-content'>
                            <Text as='p'>
                                <Localize i18n_default_text='To copy trade, create your Deriv Nakala account in the mobile app. ' />
                                {isDesktopDevice && (
                                    <Localize i18n_default_text='Scan the below QR to download the mobile app.' />
                                )}
                            </Text>
                        </div>
                    </div>

                    {isDesktopDevice && (
                        <div className='cfd-nakala-modal__qr-section'>
                            <div className='cfd-nakala-modal__qr-section-code'>
                                <Icon icon='IcRebrandingNakalaQrCode' height={120} width={120} />
                            </div>
                        </div>
                    )}

                    <div className='cfd-nakala-modal__step'>
                        <div className='cfd-nakala-modal__step-number'>
                            <Text weight='bold' color='colored-background'>
                                2
                            </Text>
                        </div>
                        <div className='cfd-nakala-modal__step-content'>
                            <Text as='p'>
                                <Localize i18n_default_text='Then, link your MT5 Standard account using these details and your MT5 password:' />
                            </Text>
                        </div>
                    </div>
                </div>

                <div className='cfd-nakala-modal__login-specs'>
                    <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Server')}</Text>
                        <SpecBox is_bold value={nakalaInfo.serverName ?? ''} />
                    </div>
                    <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Account no.')}</Text>
                        <SpecBox is_bold value={nakalaInfo.loginId ?? ''} />
                    </div>
                    <ModalInfo />
                </div>

                <div className='cfd-nakala-modal__help-section'>
                    <Text size='xs'>
                        {localize('Need help?')}{' '}
                        <a href='https://deriv.copytrade-resource.com/' target='_blank' rel='noreferrer'>
                            {localize('Check the guide')}
                        </a>
                    </Text>
                </div>
            </div>
            {!isDesktopDevice && (
                <div className={`cfd-nakala-modal__footer cfd-nakala-modal__footer--info-mobile`}>
                    <Button type='button' onClick={onClickOpenApp} primary large>
                        <Localize i18n_default_text='Open Deriv Nakala mobile app' />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
});
export default CFDDerivNakalaInfo;
