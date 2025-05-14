import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSortedMT5Accounts } from '@deriv/api-v2';
import { LabelPairedCircleExclamationMdFillIcon, LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { TAddedMT5Account } from '../../../../types';
import { MT5TradeDetailsItem } from '../../screens/MT5TradeScreen/MT5TradeDetailsItem';
import './DerivNakalaModal.scss';

interface CFDDerivNakalaModalProps {
    onclickAction: () => void;
}

const ModalInfo = () => {
    return (
        <div className='wallets-nakala-modal-info'>
            <div className='wallets-nakala-modal-info_icon'>
                <LabelPairedCircleExclamationMdFillIcon fill='#377CFC' />
            </div>
            <Text size='xs'>
                <Localize i18n_default_text='Use your MT5 password when linking your account.' />
            </Text>
        </div>
    );
};

const CFDDerivNakalaInfo = (props: CFDDerivNakalaModalProps) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-cfd-nakala-modal'>
            {isDesktop && (
                <div className='wallets-cfd-nakala-modal__header'>
                    <Text as='h2' weight='bold'>
                        <Localize i18n_default_text='Deriv Nakala' />
                    </Text>
                </div>
            )}
            <div className='wallets-cfd-nakala-modal__body'>
                <div className='wallets-cfd-nakala-modal__logo-container'>
                    <div className='wallets-cfd-nakala-modal__logo'>
                        <span>TEST ICON</span>
                    </div>
                </div>

                <div className='wallets-cfd-nakala-modal__description'>
                    <Text as='p' size='md'>
                        <Localize i18n_default_text='Follow top global traders and copy their strategies.' />
                    </Text>
                    <Text as='p' size='md'>
                        <Localize i18n_default_text='Become a signal provider and earn from your expertise.' />
                    </Text>
                </div>

                <div className='wallets-cfd-nakala-modal__getting-started'>
                    <Text as='h3' size='md' weight='bold'>
                        <Localize i18n_default_text='Getting started with Deriv Nakala' />
                    </Text>

                    <div className='wallets-cfd-nakala-modal__steps'>
                        <div className='wallets-cfd-nakala-modal__step'>
                            <div className='wallets-cfd-nakala-modal__step-number'>
                                <Text color='white' size='sm' weight='bold'>
                                    1
                                </Text>
                            </div>
                            <Text size='sm'>
                                <Localize i18n_default_text='Enable your MT5 Standard account.' />
                            </Text>
                        </div>

                        <div className='wallets-cfd-nakala-modal__step'>
                            <div className='wallets-cfd-nakala-modal__step-number'>
                                <Text color='white' size='sm' weight='bold'>
                                    2
                                </Text>
                            </div>
                            <Text size='sm'>
                                <Localize i18n_default_text='Open a Deriv Nakala account, and link your MT5 Standard account to Deriv Nakala.' />
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            {isDesktop && (
                <div className='wallets-cfd-nakala-modal__footer'>
                    <Button color='primary' onClick={props.onclickAction} size='lg' type='button' variant='contained'>
                        <Localize i18n_default_text='Next' />
                    </Button>
                </div>
            )}
        </div>
    );
};

interface CFDDerivNakalaAccountModalProps extends CFDDerivNakalaModalProps {
    isSuccess?: boolean;
}

export const CFDDerivNakalaLinkAccount = (props: CFDDerivNakalaAccountModalProps) => {
    const { isDesktop } = useDevice();
    const { isSuccess = false, onclickAction } = props;

    const { data: mt5AccountsList } = useSortedMT5Accounts();
    const StandardMt5 =
        mt5AccountsList && (mt5AccountsList.find(account => account.product === 'standard') as TAddedMT5Account);
    const details = StandardMt5;

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
        <div className='wallets-cfd-nakala-modal'>
            <div className='wallets-cfd-nakala-modal__header'>
                <Text as='h2' weight='bold'>
                    <Localize i18n_default_text='Deriv Nakala' />
                </Text>
                <div className='wallets-cfd-nakala-modal__close' onClick={onclickAction}>
                    <LegacyClose2pxIcon iconSize='xs' />
                </div>
            </div>

            <div className='wallets-cfd-nakala-modal__body'>
                <div className='wallets-cfd-nakala-modal__logo-container'>
                    <div className='wallets-cfd-nakala-modal__logo'>
                        <span>TEST ICON</span>
                    </div>
                </div>

                {isSuccess && (
                    <div className='wallets-cfd-nakala-modal__title'>
                        <Text as='h3' size='lg' weight='bold'>
                            <Localize i18n_default_text='Your MT5 Standard account is ready' />
                        </Text>
                    </div>
                )}

                <div className='wallets-cfd-nakala-modal__description'>
                    <Text align='center' as='p' size='md'>
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

                <div className='wallets-cfd-nakala-modal__login-specs'>
                    <MT5TradeDetailsItem label={localize('Server')} value={details?.server_info?.environment ?? ''} />
                    <MT5TradeDetailsItem label={localize('Login ID')} value={details?.display_login ?? ''} />

                    <ModalInfo />
                </div>

                <div className='wallets-cfd-nakala-modal__qr-section'>
                    <div className='wallets-cfd-nakala-modal__qr-section-help'>
                        <Text size='xs'>
                            {localize('Need help?')}{' '}
                            <a href='https://deriv.copytrade-resource.com/' rel='noreferrer' target='_blank'>
                                {localize('Check the guide')}
                            </a>
                        </Text>
                    </div>
                    <div className='wallets-cfd-nakala-modal__qr-section-code'>
                        <span />
                    </div>
                    <div className='wallets-cfd-nakala-modal__qr-section-text'>
                        <Text size='xs'>{localize('Scan to download the mobile app.')}</Text>
                    </div>
                </div>
            </div>
            <div
                className={`wallets-cfd-nakala-modal__footer ${!isDesktop && 'wallets-cfd-nakala-modal__footer--mobile'}`}
            >
                <Button
                    color='primary'
                    onClick={() => window.open('https://onelink.to/uuuxmw', '_blank')}
                    size='lg'
                    type='button'
                >
                    <Localize i18n_default_text='Open Deriv Nakala app' />
                </Button>
            </div>
        </div>
    );
};

export default CFDDerivNakalaInfo;
