import React from 'react';
import { Localize } from '@deriv/translations';
import { Link } from 'react-router-dom';
import { Button, Text } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import classNames from 'classnames';
import { connect } from 'Stores/connect';

const DeactivateAccountSteps = ({ redirectToReasons, is_dxtrade_allowed }) => {
    const { is_appstore } = React.useContext(PlatformContext);

    return (
        <div>
            <div className='deactivate-account__information'>
                <Text size='xs' weight='bold' className='deactivate-account__information--bold' as='p'>
                    <Localize i18n_default_text='Deactivate account' />
                </Text>
                <Text size='xs' as='p' line_height='s'>
                    <Localize i18n_default_text='Before you deactivate your account, you’ll need to:' />
                </Text>
            </div>
            <div className='deactivate-account__steps'>
                <Text size='xs' as='p' weight='bold' className='deactivate-account__title'>
                    <Localize i18n_default_text='1. Ensure to close all your positions' />
                </Text>
                <Text size='xs' as='p' line_height='s'>
                    <Localize
                        i18n_default_text='If you have a Deriv real account, go to <0>Reports</0> to close or sell any open positions.'
                        components={[<Link to='/reports/positions' key={0} className='deactivate-account__link' />]}
                    />
                </Text>
                <Text size='xs' as='p'>
                    {is_dxtrade_allowed ? (
                        <Localize i18n_default_text='If you have a DMT5 or Deriv X real account, log in to close any open positions.' />
                    ) : (
                        <Localize i18n_default_text='If you have a DMT5 real account, log in to close any open positions.' />
                    )}
                </Text>
            </div>
            <div className='deactivate-account__steps'>
                <Text size='xs' as='p' weight='bold' line_height='s' className='deactivate-account__title'>
                    <Localize i18n_default_text='2. Withdraw your funds' />
                </Text>
                <Text size='xs' as='p' line_height='s'>
                    <Localize
                        i18n_default_text='If you have a Deriv real account, go to <0>Cashier</0> to withdraw your funds.'
                        components={[<Link to='/cashier/withdrawal' key={0} className='deactivate-account__link' />]}
                    />
                </Text>
                <Text size='xs' as='p'>
                    {is_dxtrade_allowed ? (
                        <Localize
                            i18n_default_text='If you have a DMT5 or Deriv X real account, go to your <0>DMT5</0> or <1>Deriv X</1> dashboard to withdraw your funds'
                            components={[
                                <Link to='/mt5' key={0} className='deactivate-account__link' />,
                                <Link to='/derivx' key={1} className='deactivate-account__link' />,
                            ]}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='If you have a DMT5 real account, go to your <0>DMT5</0> dashboard to withdraw your funds'
                            components={[<Link to='/mt5' key={0} className='deactivate-account__link' />]}
                        />
                    )}
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
