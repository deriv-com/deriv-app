import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import config from '../../../../../../app.config';
import { translate } from '../../../../../../common/utils/tools';

const Separator = () => <div className='account__switcher-seperator'></div>;

const RiskComponent = ({ low_risk_without_non_eu, low_risk_without_eu, non_eu_accounts, eu_accounts, type }) => {
    const { url } = config.add_account;
    const { account_type } = useSelector(state => state.client);
    const { low_risk_without_account, high_risk_without_account, high_risk_or_eu } = account_type;

    const risk_array = [
        {
            title: translate('Non-EU Deriv Account'),
            switcher_type: low_risk_without_account && !non_eu_accounts?.length,
            option: translate('Options & Multipliers'),
            label: translate('Add'),
        },
        {
            title: translate('EU Deriv Account'),
            switcher_type: low_risk_without_account && !non_eu_accounts?.length,
            option: translate('Multipliers'),
            label: translate('Add'),
        },
        {
            title: translate('Deriv Account'),
            switcher_type: (high_risk_without_account || high_risk_or_eu) && eu_accounts?.length,
            option: type === high_risk_or_eu ? translate('Multipliers') : translate('Options & Multipliers'),
            label: translate('Add'),
        },
        {
            title: translate('Non-EU Deriv Account'),
            switcher_type: low_risk_without_non_eu && !non_eu_accounts?.length,
            option: translate('Options & Multipliers'),
            label: translate('Add'),
        },
        {
            title: translate('EU Deriv Account'),
            switcher_type: low_risk_without_eu && eu_accounts?.length,
            option: translate('Options & Multipliers'),
            label: translate('Add'),
        },
    ];

    return (
        <>
            {risk_array.map(({ title, switcher_type, option, label }, index) => {
                const is_end = risk_array.length === (index + 1);
                if (switcher_type) {
                    return (
                        <React.Fragment key={title + index}>
                            <div className='account__switcher-container__title'>{title}</div>
                            <div className='account__switcher-container__content'>
                                <div
                                    className={classNames('account__switcher-container__content', {
                                        'account__switcher-container__content--low-risk': switcher_type === low_risk_without_account,
                                        'account__switcher-container__content--high-risk': switcher_type === high_risk_without_account || high_risk_or_eu,
                                    })}
                                >
                                    <img src={'image/options-and-multipliers.png'} />
                                    <div className='account__switcher-container__content__option'>{option}</div>
                                </div>
                                <a href={url} rel='noopener noreferrer'>
                                    <button className='account__switcher-container__content__action'>
                                        {label}
                                    </button>
                                </a>
                            </div>
                            {!is_end && <Separator />}
                        </React.Fragment>
                    )
                }
                }
            )}
        </>
    );
};

export default RiskComponent;
