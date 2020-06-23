import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Link } from 'react-router-dom';
import { Button } from '@deriv/components';

const DeactivateAccountSteps = ({ redirectToReasons }) => (
    <div className='confirm-all-close'>
        <div className='confirm-all-close__information'>
            <p className='confirm-all-close__information--bold'>{localize('Deactivate account')}</p>
            <p>{localize('Before you deactivate your account, you need to do the following:')}</p>
        </div>
        <div className='confirm-all-close__steps'>
            <p className='confirm-all-close__steps__title'>{localize('1. Close all open positions')}</p>
            <p className='confirm-all-close__steps__content'>
                <Localize
                    i18n_default_text='If you have a Deriv real account, go to <0>Portfolio</0> to close any open positions.'
                    components={[
                        <Link to='/reports/positions' key={0} className='confirm-all-close__steps__content__link' />,
                    ]}
                />
            </p>
            <p className='confirm-all-close__steps__content'>
                {localize('If you have a DMT5 real account, log into it to close any open positions.')}
            </p>
        </div>
        <div className='confirm-all-close__steps'>
            <p className='confirm-all-close__steps__title'>{localize('2. Withdraw your funds')}</p>
            <p className='confirm-all-close__steps__content'>
                <Localize
                    i18n_default_text='If you have a Deriv real account, go to <0>Cashier</0> to withdraw your funds.'
                    components={[<Link to='/mt5' key={0} className='confirm-all-close__steps__content__link' />]}
                />
            </p>
            <p className='confirm-all-close__steps__content'>
                {localize('')}
                <Localize
                    i18n_default_text='If you have a DMT5 real account, go to <0>DMT5 Dashboard</0> to withdraw your funds.'
                    components={[
                        <Link to='/cashier/withdrawal' key={0} className='confirm-all-close__steps__content__link' />,
                    ]}
                />
            </p>
        </div>
        <Button className='confirm-all-close__button' primary large onClick={() => redirectToReasons()}>
            {localize('Continue to account deactivation')}
        </Button>
    </div>
);
export default DeactivateAccountSteps;
