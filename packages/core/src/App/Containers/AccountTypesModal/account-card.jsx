import classNames from 'classnames';
import { Button, Icon } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { localize } from '@deriv/translations';

import 'Sass/app/modules/account-types.scss';

const Description = ({ children, learn_more, setShowDescription, title }) => {
    return (
        <div className='account-card__description'>
            <h4 className='account-card__description-title'>
                <Icon
                    className='account-card__description-back'
                    icon='IcArrowLeftBold'
                    onClick={() => {
                        setShowDescription(false);
                    }}
                />
                <span className='account-card__description-title-text'>{title}</span>
            </h4>
            {children}
            <div className='account-card__description-learn'>
                {learn_more.length && (
                    <h6 className='account-card__description-learn-title'>{localize('Learn more:')}</h6>
                )}
                {learn_more.map((item, index) => {
                    return (
                        <Link key={index} className='account-card__description-learn-items' to={item.path}>
                            {item.text}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

const MainCard = ({ button_text, buttonOnClick, items, setShowDescription, subtitle, title }) => {
    return (
        <div className='account-card__main'>
            <h3 className='account-card__main-title'>{title}</h3>
            <h4 className='account-card__main-subtitle'>
                {subtitle}
                <Icon
                    className='account-card__main-help'
                    icon='IcUnknownOutline'
                    onClick={() => {
                        setShowDescription(true);
                    }}
                />
            </h4>
            {Object.keys(items).length && (
                <table className='account-card__main-items'>
                    <tbody>
                        {Object.entries(items).map(([label, value], index) => {
                            return (
                                <tr key={index} className='account-card__main-item'>
                                    <td className='account-card__main-item-label'>{label}</td>
                                    <td className='account-card__main-item-value'>{value}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <Button
                className='account-card__main-button'
                text={button_text}
                onClick={buttonOnClick}
                has_effect
                primary
            />
        </div>
    );
};

const AccountCard = ({ button_text, buttonOnClick, children, items, learn_more, subtitle, title }) => {
    const [descriptionShown, setShowDescription] = React.useState(false);

    return (
        <div className='account-card'>
            <div
                className={classNames('account-card__wrapper', {
                    'account-card__wrapper--show-description': descriptionShown,
                })}
            >
                <MainCard
                    items={items}
                    subtitle={subtitle}
                    title={title}
                    setShowDescription={setShowDescription}
                    button_text={button_text}
                    buttonOnClick={buttonOnClick}
                />
                <Description learn_more={learn_more} setShowDescription={setShowDescription} title={subtitle}>
                    {children}
                </Description>
            </div>
        </div>
    );
};

AccountCard.propTypes = {
    button_text: PropTypes.string,
    buttonOnClick: PropTypes.func,
    items: PropTypes.object,
    learn_more: PropTypes.arrayOf(PropTypes.object),
    subtitle: PropTypes.string,
    title: PropTypes.string,
};

export default AccountCard;
