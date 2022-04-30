import { Button, Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import * as React from 'react';
import ExpandedCard from './ExpandedCard.jsx';
import PropTypes from 'prop-types';
import paymentMethodConfig from './payment-method-config';

const Card = ({ card, handleChange, handleBlur, values, setFieldValue, index, error }) => {
    const onClick = e => {
        e.preventDefault();
        setIsOpen(!is_open);
    };
    const [is_open, setIsOpen] = React.useState(false);
    const icon = (
        <Icon
            icon={'IcChevronUpBold'}
            color='black'
            size={16}
            className={classNames('proof-of-ownership__card-item-icon', {
                'proof-of-ownership__card-item-icon--invert': !is_open,
            })}
        />
    );

    return (
        <div
            className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}
            data-testid={card.id}
        >
            <div className='proof-of-ownership__card-item' onClick={onClick}>
                <Icon
                    icon={paymentMethodConfig[card.payment_method]?.icon || paymentMethodConfig.other.icon}
                    className='proof-of-ownership__card-item-logo'
                    width={64}
                    height={58}
                />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {card?.payment_method || 'Payment method'} {/** TODO: || method is temporary, should be removed */}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={icon}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClick}
                    transparent
                    data-testid={'proof-of-ownership-button'}
                />
            </div>
            {is_open && (
                <ExpandedCard
                    cardDetails={paymentMethodConfig[card.payment_method] ?? paymentMethodConfig.other}
                    identifier={card.payment_method_identifier}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    setFieldValue={setFieldValue}
                    index={index}
                    error={error}
                />
            )}
        </div>
    );
};
export default Card;
Card.propTypes = {
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    index: PropTypes.number,
};
