import React from 'react';
import { localize } from '@deriv/translations';

const ConnectedApps = () => {
    return (
        <section className='connected-apps'>
            <div className='connected-apps__header'>
                <p>{localize('Authorised applications')}</p>
            </div>
            <div className='connected-apps__column'>
                <div className='connected-apps__column__name'>
                    <p>{localize('Name')}</p>
                </div>
                <div className='connected-apps__column__permission'>
                    <p>{localize('Permission')}</p>
                </div>
                <div className='connected-apps__column__last-login'>
                    <p>{localize('Last login')}</p>
                </div>
                <div className='connected-apps__column__action'>
                    <p>{localize('Action')}</p>
                </div>
            </div>
        </section>
    );
};

export default ConnectedApps;
