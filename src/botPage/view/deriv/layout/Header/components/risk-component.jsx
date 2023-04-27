import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import config from '../../../../../../app.config';
import { translate } from '../../../../../../common/utils/tools';
import { observer as globalObserver } from '../../../../../../common/utils/observer';

const Separator = () => <div className='account__switcher-seperator'></div>;

const RiskComponent = ({ non_eu_accounts = [], eu_accounts = [], is_country_low_risk }) => {
    const { account_type } = useSelector(state => state.client);

    const { low_risk_without_account, high_risk_without_account, high_risk_or_eu } = account_type;
    const has_non_eu_accounts = non_eu_accounts?.length || 0;
    const has_eu_accounts = eu_accounts?.length || 0;

    const is_eu_country = globalObserver.getState('is_eu_country');
    const risk_array = [
        {
            title: translate('Non EU Deriv account'),
            option: translate('Options & Multipliers'),
            label: translate('Add'),
            url: config.add_account.url,
            should_show: is_country_low_risk && !has_non_eu_accounts,
        },
        {
            title: translate('EU Deriv account'),
            option: translate('Multipliers'),
            label: translate('Add'),
            url: config.add_account_multiplier.url,
            should_show: is_country_low_risk && !has_eu_accounts,
        },
        {
            title: is_country_low_risk ? translate('Non-EU Deriv account') : translate('Deriv account'),
            option: translate('Options & Multipliers'),
            label: translate('Add'),
            url: config.add_account_multiplier.url,
            should_show: !is_country_low_risk && !is_eu_country && !has_non_eu_accounts,
        },
        {
            title: is_eu_country ? translate('EU Deriv account') : translate('Deriv account'),
            option: translate('Multipliers'),
            label: translate('Add'),
            url: config.add_account_multiplier.url,
            should_show: !is_country_low_risk && is_eu_country && !has_eu_accounts,
        },
    ];

    return (
        <>
            {risk_array.map(({ title, should_show = false, option, label, url }, index) => {
                const is_end = risk_array.length === index + 1;

                if (should_show) {
                    return (
                        <React.Fragment key={title + index}>
                            <div className='account__switcher-container__title'>{title}</div>
                            <div className='account__switcher-container__content'>
                                <div
                                    className={classNames('account__switcher-container__content', {
                                        'account__switcher-container__content--low-risk': low_risk_without_account,
                                        'account__switcher-container__content--high-risk':
                                            high_risk_without_account || high_risk_or_eu,
                                    })}
                                >
                                    <img src={'image/options-and-multipliers.png'} />
                                    <div className='account__switcher-container__content__option'>{option}</div>
                                </div>
                                <a href={url} rel='noopener noreferrer'>
                                    <button className='account__switcher-container__content__action'>{label}</button>
                                </a>
                            </div>
                            {!is_end && <Separator />}
                        </React.Fragment>
                    );
                }
            })}
        </>
    );
};

export default RiskComponent;
