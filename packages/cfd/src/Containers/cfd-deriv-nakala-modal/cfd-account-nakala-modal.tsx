import React from 'react';

import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import TradingPlatformIcon from '../../Assets/svgs/trading-platform';

import './cfd-account-nakala-modal.scss';
import { observer, useStore } from '@deriv/stores';

import { TAdditionalDetailsOfEachMT5Loginid } from '@deriv/stores/types';
import { CFD_PLATFORMS } from '../../Helpers/cfd-config';
import PasswordBox from '../../Components/passwordbox';
import SpecBox from '../../Components/specbox';
import { TTradingPlatformAccounts } from '../../Components/props.types';
import NakalaQR from '../../Assets/svgs/ic-nakala-qr-code.svg';
import LinkedSuccess from '../../Assets/svgs/ic-nakala-linked-success.svg';

interface CFDDerivNakalaModalProps {
    onclickAction: () => void;
}

const CFDDerivNakalaInfo = (props: CFDDerivNakalaModalProps) => {
    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        <TradingPlatformIcon icon='DerivNakala' size={64} />
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
            <div className='cfd-nakala-modal__footer'>
                <Button type='button' onClick={props.onclickAction} primary medium>
                    <Localize i18n_default_text='Next' />
                </Button>
            </div>
        </React.Fragment>
    );
};

export const CFDDerivNakalaLinkAccount = observer(() => {
    const { traders_hub } = useStore();
    const { combined_cfd_mt5_accounts } = traders_hub;

    const mt5_trade_account = combined_cfd_mt5_accounts.find(
        account =>
            account.platform === CFD_PLATFORMS.MT5 && account.product === 'standard' && account.action_type !== 'get'
    );
    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        <TradingPlatformIcon icon='DerivNakala' size={64} />
                    </div>
                </div>

                <div className='cfd-nakala-modal__description'>
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='Link your MT5 Standard account to the Deriv Nakala app using these details:' />
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
                    {/* <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Password')}</Text>
                        <div className='cfd-nakala-modal--paragraph'>
                            <PasswordBox platform='mt5' onClick={() => null} />
                        </div>
                    </div> */}
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
                        <NakalaQR width='140' height='140' />
                    </div>
                    <div className='cfd-nakala-modal__qr-section-text'>
                        <Text size='xxs'>{localize('Scan to download the mobile app.')}</Text>
                    </div>
                </div>
            </div>
            <div className='cfd-nakala-modal__footer'>
                <Button type='button' onClick={() => window.open('https://onelink.to/uuuxmw', '_blank')} primary medium>
                    <Localize i18n_default_text='Open Deriv Nakala web' />
                </Button>
            </div>
        </React.Fragment>
    );
});

export const CFDDerivNakalaLinkAccountSuccess = observer(() => {
    const { traders_hub } = useStore();
    const { combined_cfd_mt5_accounts } = traders_hub;

    const mt5_trade_account = combined_cfd_mt5_accounts.find(
        account =>
            account.platform === CFD_PLATFORMS.MT5 && account.product === 'standard' && account.action_type !== 'get'
    );
    return (
        <React.Fragment>
            <div className='cfd-nakala-modal'>
                <div className='cfd-nakala-modal__logo-container'>
                    <div className='cfd-nakala-modal__logo'>
                        <LinkedSuccess width={64} height={64} />
                    </div>
                </div>

                <div className='cfd-nakala-modal__title'>
                    <Text as='h3' weight='bold' size='s'>
                        <Localize i18n_default_text='Your MT5 Standard account is ready' />
                    </Text>
                </div>

                <div className='cfd-nakala-modal__description'>
                    <Text as='p' size='s'>
                        <Localize i18n_default_text='Link your MT5 Standard account to the Deriv Nakala app using these details:' />
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
                    {/* <div className='cfd-nakala-modal__login-specs-item'>
                        <Text className='cfd-nakala-modal--paragraph'>{localize('Password')}</Text>
                        <div className='cfd-nakala-modal--paragraph'>
                            <PasswordBox platform='mt5' onClick={() => null} />
                        </div>
                    </div> */}
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
                        <NakalaQR width='140' height='140' />
                    </div>
                    <div className='cfd-nakala-modal__qr-section-text'>
                        <Text size='xxs'>{localize('Scan to download the mobile app.')}</Text>
                    </div>
                </div>
            </div>
            <div className='cfd-nakala-modal__footer'>
                <Button type='button' onClick={() => window.open('https://onelink.to/uuuxmw', '_blank')} primary medium>
                    <Localize i18n_default_text='Open Deriv Nakala app' />
                </Button>
            </div>
        </React.Fragment>
    );
});
export default CFDDerivNakalaInfo;
