import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Button, Text, StaticUrl } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import classNames from 'classnames';
import { connect } from 'Stores/connect';

const DeactivateAccountSteps = ({ redirectToReasons }) => {
    const { is_appstore } = React.useContext(PlatformContext);

    return (
        <div>
            <div className='deactivate-account__information'>
                <Text size='xs' weight='bold' className='deactivate-account__information--bold' as='p'>
                    <Localize i18n_default_text='Are you sure?' />
                </Text>
            </div>
            <div className='deactivate-account__steps'>
                <Text size='xs' as='p' className='deactivate-account__title'>
                    <Localize i18n_default_text='If you close your account:' />
                </Text>
                <ul>
                    <li>{localize("You can't trade on Deriv.")}</li>
                    <li>{localize("You can't make transactions.")}</li>
                </ul>
            </div>
            <div className='deactivate-account__steps'>
                <Text size='xs' as='p' line_height='s' className='deactivate-account__title'>
                    <Localize i18n_default_text='Before closing your account:' />
                </Text>
                <ul>
                    <li>{localize('Close all your positions.')}</li>
                    <li>{localize('Withdraw your funds.')}</li>
                </ul>
            </div>
            <div className='deactivate-account__steps'>
                <Text size='xs' as='p' line_height='s'>
                    <Localize
                        i18n_default_text='We shall delete your personal information as soon as our legal obligations are met, as mentioned in the section on Data Retention in our <0>Security and privacy policy</0>'
                        components={[
                            <StaticUrl key={0} className='link' href='tnc/security-and-privacy.pdf' is_document />,
                        ]}
                    />
                </Text>
            </div>
            <Button
                className={classNames('deactivate-account__button', {
                    'deactivate-account__button--dashboard': is_appstore,
                })}
                large
                onClick={() => redirectToReasons()}
                primary
            >
                <Localize i18n_default_text='Continue to account deactivation' />
            </Button>
        </div>
    );
};
export default connect(({ client }) => ({ is_dxtrade_allowed: client.is_dxtrade_allowed }))(DeactivateAccountSteps);
