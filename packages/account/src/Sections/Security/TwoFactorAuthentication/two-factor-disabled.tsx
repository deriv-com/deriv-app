import React from 'react';
import QRCode from 'qrcode.react';
import { MobileWrapper, ThemedScrollbars, Text, Timeline, Loading, Clipboard, DesktopWrapper } from '@deriv/components';
import TwoFactorAuthenticationArticle from './two-factor-authentication-article';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import DigitForm from './digit-form';

type TTwoFactorDisabled = {
    secret_key: string;
    qr_secret_key: string;
    is_loading_secret: boolean;
    // setTwoFAStatus: (status: boolean) => void;
};

// { secret_key, qr_secret_key, is_loading_secret, setTwoFAStatus }
const TwoFactorDisabled = ({ secret_key, qr_secret_key, is_loading_secret }: TTwoFactorDisabled) => {
    return (
        <React.Fragment>
            <ThemedScrollbars
                is_bypassed={isMobile()}
                autoHide
                className='two-factor__scrollbars'
                hideHorizontal={true}
            >
                <MobileWrapper>
                    <TwoFactorAuthenticationArticle />
                </MobileWrapper>
                <Text as='h2' color='prominent' weight='bold' className='two-factor__title'>
                    {localize('How to set up 2FA for your Deriv account')}
                </Text>
                <div>
                    <Timeline className='two-factor__timeline' line_height='xs'>
                        <Timeline.Item
                            item_title={
                                <Localize
                                    i18n_default_text='Scan the QR code below with your 2FA app. We recommend <0>Authy</0> or <1>Google Authenticator</1>.'
                                    components={[
                                        <a
                                            className='link two-factor__link'
                                            href='https://authy.com/'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            key={0}
                                        />,
                                        <a
                                            className='link two-factor__link'
                                            href='https://github.com/google/google-authenticator/wiki#implementations'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            key={1}
                                        />,
                                    ]}
                                />
                            }
                        >
                            <div className='two-factor__qr'>
                                {is_loading_secret ? (
                                    <Loading is_fullscreen={false} />
                                ) : (
                                    <React.Fragment>
                                        {qr_secret_key && (
                                            <div className='two-factor__qr--wrapper'>
                                                <QRCode value={qr_secret_key} />
                                            </div>
                                        )}

                                        {secret_key && (
                                            <React.Fragment>
                                                <Text
                                                    as='h4'
                                                    size='xs'
                                                    align='center'
                                                    className='two-factor__qr--message'
                                                >
                                                    {localize(
                                                        'If you are unable to scan the QR code, you can manually enter this code instead:'
                                                    )}
                                                </Text>
                                                <div className='two-factor__qr--code' data-testid='2fa_clipboard'>
                                                    <Text size='xs'>{secret_key}</Text>
                                                    <Clipboard
                                                        text_copy={secret_key}
                                                        info_message={localize('Click here to copy key')}
                                                        success_message={localize('Key copied!')}
                                                        className='two-factor__qr--clipboard'
                                                    />
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        </Timeline.Item>
                        <Timeline.Item
                            item_title={localize('Enter the authentication code generated by your 2FA app:')}
                        >
                            <div data-testid='digitform_2fa_disabled'>
                                <DigitForm />
                                {/* setTwoFAStatus={setTwoFAStatus} */}
                            </div>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </ThemedScrollbars>
            <DesktopWrapper>
                <TwoFactorAuthenticationArticle />
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default TwoFactorDisabled;
