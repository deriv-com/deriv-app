import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { Link } from 'react-router-dom';
import { Button, Text, StaticUrl } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';

const ClosingAccountSteps = observer(({ redirectToReasons }) => {
    const { common } = useStore();
    const { is_from_derivgo } = common;
    const { is_appstore } = React.useContext(PlatformContext);

    return (
        <div>
            <div className='closing-account__information'>
                <Text size='xs' weight='bold' className='closing-account__information--bold' as='p'>
                    <Localize i18n_default_text='Are you sure?' />
                </Text>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' className='closing-account__title'>
                    <Localize i18n_default_text='If you close your account:' />
                </Text>
                <ul>
                    <li>{localize("You can't trade on Deriv.")}</li>
                    <li>{localize("You can't make transactions.")}</li>
                </ul>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' line_height='s' className='closing-account__title'>
                    <Localize i18n_default_text='Before closing your account:' />
                </Text>
                <ul>
                    <li>{localize('Close all your positions.')}</li>
                    <li>{localize('Withdraw your funds.')}</li>
                </ul>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' line_height='s'>
                    <Localize
                        i18n_default_text='We shall delete your personal information as soon as our legal obligations are met, as mentioned in the section on Data Retention in our <0>Security and privacy policy</0>'
                        components={[
                            <StaticUrl key={0} className='link' href='tnc/security-and-privacy.pdf' is_document />,
                        ]}
                    />
                </Text>
            </div>
            {is_from_derivgo ? (
                <div className='closing-account__buttons-container'>
                    <Button
                        className={classNames('closing-account__button--close-account', {
                            'closing-account__button--dashboard': is_appstore,
                        })}
                        large
                        onClick={() => redirectToReasons()}
                        primary
                    >
                        <Localize i18n_default_text='Close my account' />
                    </Button>
                </div>
            ) : (
                <div className='closing-account__buttons-container'>
                    <Link to='/'>
                        <Button
                            className={classNames('closing-account__button--cancel', {
                                'closing-account__button--dashboard': is_appstore,
                            })}
                            large
                            secondary
                        >
                            <Localize i18n_default_text='Cancel' />
                        </Button>
                    </Link>
                    <Button
                        className={classNames('closing-account__button--close-account', {
                            'closing-account__button--dashboard': is_appstore,
                        })}
                        large
                        onClick={() => redirectToReasons()}
                        primary
                    >
                        <Localize i18n_default_text='Close my account' />
                    </Button>
                </div>
            )}
        </div>
    );
});
export default ClosingAccountSteps;
