// import classNames from 'classnames';
import { Button, Icon } from '@deriv/components';
// import { Field, Formik, Form } from 'formik';
// import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
// import { connect } from 'Stores/connect';

import 'Sass/app/modules/account-types.scss';

const Description = ({ title, children, learnMore }) => {
    return (
        <React.Fragment>
            <h4>{title}</h4>
            {children}
            {learnMore.length && <h6>{localize('Learn more:')}</h6>}
            {learnMore.map((item, index) => {
                return (
                    <a key={index} href='#'>
                        {item}
                    </a>
                );
            })}
        </React.Fragment>
    );
};

Description.propTypes = {};

const AccountCard = ({ title, subtitle, items }) => {
    return (
        <div className='account-card'>
            <h3 className='account-card__title'>{title}</h3>
            <h4 className='account-card__subtitle'>
                {subtitle} <Icon className='account-card__help' icon='IcUnknownOutline' />
            </h4>
            {items.length && (
                <table className='account-card__items'>
                    <tbody>
                        {items.map((item, index) => {
                            return (
                                <tr key={index} className='account-card__item'>
                                    <td className='account-card__item__label'>{item.label}</td>
                                    <td className='account-card__item__value'>{item.value}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <Button
                className='account-card__button'
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

AccountCard.propTypes = {};

export default AccountCard;
