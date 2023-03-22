import React from 'react';
import config from '../../../../../../app.config';

const Separator = () => <div className='account__switcher-seperator'></div>;

const LowRisk = () => {
    const { url } = config.add_account;
    return (
        <>
            <div className='account__switcher-container__title'>Non-EU Deriv Account</div>
            <div className='account__switcher-container__content'>
                <div className='account__switcher-container__content--low-risk'>
                    <img src={'image/options-and-multipliers.png'} />
                    <div className='account__switcher-container__content__option'>Options & Multipliers</div>
                </div>
                <a href={url} rel='noopener noreferrer'>
                    <button className='account__switcher-container__content__action'>Add</button>
                </a>
            </div>
            <Separator />
            <div className='account__switcher-container__title'>EU Deriv Account</div>
            <div className='account__switcher-container__content'>
                <div className='account__switcher-container__content--low-risk'>
                    <img src={'image/options-and-multipliers.png'} />
                    <div className='account__switcher-container__content__option'>Multipliers</div>
                </div>
                <a href={url} rel='noopener noreferrer'>
                    <button className='account__switcher-container__content__action'>Add</button>
                </a>
            </div>
        </>
    );
};
export default LowRisk;
