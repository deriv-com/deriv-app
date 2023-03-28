import React from 'react';
import classNames from 'classnames';
import config from '../../../../../../app.config';
import { translate } from '../../../../../../common/utils/tools';

const Separator = () => <div className='account__switcher-seperator'></div>;

const RiskComponent = param => {
    const { url } = config.add_account;

    const risk_array = [
        {
            id: 1,
            title: translate('Non-EU Deriv Account'),
            type: 'low_risk_without_account',
            option: translate('Options & Multipliers'),
            button_name: translate('Add'),
            has_seperator: true,
        },
        {
            id: 2,
            title: translate('EU Deriv Account'),
            type: 'low_risk_without_account',
            option: translate('Multipliers'),
            button_name: translate('Add'),
            has_seperator: false,
        },
        {
            id: 3,
            title: translate('Deriv Account'),
            type: 'high_risk_without_account' || 'high_risk_or_eu',
            option: param.type === 'high_risk_or_eu' ? translate('Multipliers') : translate('Options & Multipliers'),
            button_name: translate('Add'),
            has_seperator: true,
        },
    ];

    return (
        <>
            {risk_array.map(risk => {
                const { title, type, option, button_name, has_seperator } = risk;
                if (param.type === type) {
                    return (
                        <>
                            <div className='account__switcher-container__title'>{title}</div>
                            <div className='account__switcher-container__content'>
                                <div
                                    className={classNames('account__switcher-container__content', {
                                        'account__switcher-container__content--low-risk': type === 'low_risk',
                                        'account__switcher-container__content--high-risk': type === 'high_risk',
                                    })}
                                >
                                    <img src={'image/options-and-multipliers.png'} />
                                    <div className='account__switcher-container__content__option'>{option}</div>
                                </div>
                                <a href={url} rel='noopener noreferrer'>
                                    <button className='account__switcher-container__content__action'>
                                        {button_name}
                                    </button>
                                </a>
                            </div>
                            {has_seperator && <Separator />}
                        </>
                    );
                }
            })}
        </>
    );
};

export default RiskComponent;
