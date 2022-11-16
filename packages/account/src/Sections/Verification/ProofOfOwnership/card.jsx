import { Button, Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import React from 'react';
import ExpandedCard from './expanded-card.jsx';
import PropTypes from 'prop-types';

const Card = ({ card, error, handleBlur, handleChange, index, setFieldValue, updateErrors, validateField, values }) => {
    const [is_open, setIsOpen] = React.useState(false);
    const onClickHandler = e => {
        e.preventDefault();
        setIsOpen(!is_open);
    };
    const icon = (
        <Icon
            icon='IcChevronUpBold'
            size={16}
            className={classNames('proof-of-ownership__card-item-icon', {
                'proof-of-ownership__card-item-icon--invert': !is_open,
            })}
        />
    );

    return (
        <div
            className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}
            data-testid={card.payment_method}
            role='card-item'
        >
            <div className='proof-of-ownership__card-item' onClick={onClickHandler}>
                <Icon icon={card?.icon} className='proof-of-ownership__card-item-logo' width={68} height={58} />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {card.payment_method}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={icon}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClickHandler}
                    transparent
                    data-testid='dt_proof-of-ownership-button'
                />
            </div>
            {is_open && (
                <ExpandedCard
                    card_details={card}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    setFieldValue={setFieldValue}
                    index={index}
                    error={error}
                    validateField={validateField}
                    updateErrors={updateErrors}
                />
            )}
        </div>
    );
};

Card.propTypes = {
    card: PropTypes.object,
    error: PropTypes.array,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    index: PropTypes.number,
    setFieldValue: PropTypes.func,
    updateErrors: PropTypes.func,
    validateField: PropTypes.func,
    values: PropTypes.object,
};

export default Card;
