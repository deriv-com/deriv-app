import React from 'react';
import config from '../../../../../../app.config';

const HighRisk = param => {
    const { url } = config.add_account_multiplier;
    return (
        <>
            <div className='account__switcher-container__title'>Deriv Account</div>
            <div className='account__switcher-container__content'>
                <div className='account__switcher-container__content__high-risk'>
                    <img src={'image/options-and-multipliers.png'} />
                    <div className='account__switcher-container__content__option'>
                        {param.type === 'high_risk_or_eu' ? 'Multipliers' : 'Options & Multipliers'}
                    </div>
                </div>
                <a href={url} rel='noopener noreferrer'>
                    <button className='account__switcher-container__content__action'>Add</button>
                </a>
            </div>
        </>
    );
};

export default HighRisk;
