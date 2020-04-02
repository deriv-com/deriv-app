import classNames from 'classnames';
import { Button, Icon } from '@deriv/components';
// import { Field, Formik, Form } from 'formik';
// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { localize } from '@deriv/translations';
// import { connect } from 'Stores/connect';

import 'Sass/app/modules/account-types.scss';

const Description = ({ title, children, learnMore, setShowDescription }) => {
    return (
        <div className='account-card__description'>
            <h4 className='account-card__description__title'>
                <Icon
                    className='account-card__description__back'
                    icon='IcArrowLeftBold'
                    onClick={() => {
                        setShowDescription(false);
                    }}
                />
                <span className='account-card__description__title-text'>{title}</span>
            </h4>
            {children}
            {learnMore.length && <h6 className='account-card__description__learn-more'>{localize('Learn more:')}</h6>}
            {learnMore.map((item, index) => {
                return (
                    <a key={index} className='account-card__description__items' href='#'>
                        {item}
                    </a>
                );
            })}
        </div>
    );
};

const MainCard = ({ title, subtitle, items, setShowDescription }) => {
    return (
        <div className='account-card__main'>
            <h3 className='account-card__main__title'>{title}</h3>
            <h4 className='account-card__main__subtitle'>
                {subtitle}
                <Icon
                    className='account-card__main__help'
                    icon='IcUnknownOutline'
                    onClick={() => {
                        setShowDescription(true);
                    }}
                />
            </h4>
            {items.length && (
                <table className='account-card__main__items'>
                    <tbody>
                        {items.map((item, index) => {
                            return (
                                <tr key={index} className='account-card__main__item'>
                                    <td className='account-card__main__item__label'>{item.label}</td>
                                    <td className='account-card__main__item__value'>{item.value}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <Button
                className='account-card__main__button'
                text={localize('Ok')}
                onClick={() => {
                    console.log('clicked!');
                }}
                has_effect
                primary
            />
        </div>
    );
};

Description.propTypes = {};

const AccountCard = ({ title, subtitle, items }) => {
    const [descriptionShown, setShowDescription] = useState(false);

    return (
        <div className='account-card'>
            <div
                className={classNames('account-card__wrapper', {
                    'account-card__wrapper--show-description': descriptionShown,
                })}
            >
                <MainCard items={items} subtitle={subtitle} title={title} setShowDescription={setShowDescription} />
                <Description learnMore={['baghali', 'polo']} title={subtitle} setShowDescription={setShowDescription}>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque similique doloribus cumque hic{' '}
                    <br />
                    supported platforms: <br />
                    Naghi ans Taghi
                </Description>
            </div>
        </div>
    );
};

AccountCard.propTypes = {};

export default AccountCard;
