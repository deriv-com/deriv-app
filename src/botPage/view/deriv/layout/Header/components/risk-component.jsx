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
            id: 1,
            title: translate('Non-EU Deriv account'),
            option: translate('Options & Multipliers'),
            label: translate('Add'),
            url: config.add_account.url,
            should_show: is_country_low_risk && !has_non_eu_accounts,
            acc_open: false,
        },
        {
            id: 2,
            title: translate('EU Deriv account'),
            option: translate('Multipliers'),
            label: translate('Add'),
            url: config.add_account_multiplier.url,
            should_show: is_country_low_risk && !has_eu_accounts,
            acc_open: false,
        },
        {
            id: 3,
            title: is_country_low_risk ? translate('Non-EU Deriv account') : translate('Deriv accounts'),
            option: translate('Options & Multipliers'),
            label: translate('Add'),
            url: config.add_account.url,
            should_show: !is_country_low_risk && !is_eu_country && !has_non_eu_accounts,
            acc_open: false,
        },
        {
            id: 4,
            title: is_country_low_risk ? translate('EU Deriv account') : translate('Deriv accounts'),
            option: translate('Multipliers'),
            label: translate('Add'),
            url: config.add_account_multiplier.url,
            should_show: !is_country_low_risk && is_eu_country && !has_eu_accounts,
            acc_open: false,
        },
    ];

    const [accordion_array, setAccordionArray] = React.useState(risk_array);
    const toggleAccordion = (id) => {
        const newTodos = accordion_array.slice();
        const objIndex = newTodos.findIndex((obj => obj.id === id));
        newTodos[objIndex].acc_open = !newTodos[objIndex].acc_open;
        setAccordionArray(newTodos);
    };

    return (
        <>
            {accordion_array.map(({ title, should_show = false, option, label, url, id, acc_open }, index) => {
                const is_end = accordion_array.length === index + 1;
                if (should_show) {
                    return (
                        <React.Fragment key={title + index}>
                            <div onClick={() => toggleAccordion(id)}
                                className='account__switcher-container__title'>
                                {title}
                                <img className={classNames('header__expand open', {
                                    'header__expand--close open': acc_open,
                                })}
                                    src="image/deriv/ic-chevron-down.svg"
                                />
                            </div>
                            <div className={classNames('account__switcher-container__content', {
                                'account__switcher-container__content--close': acc_open,
                            })}>
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

