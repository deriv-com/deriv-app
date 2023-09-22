import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import ExpandedCard from './expanded-card';
import { TPaymentMethodInfo } from '../../Types';

type TCardProps = {
    details: TPaymentMethodInfo;
    index: number;
    updateErrors: (index: number, item_index: number, sub_index: number) => void;
};

/**
 * Renders Chevron Icon which is used to expand card
 * @name ExpansionIcon
 * @param is_open - status to check if card is open
 * @returns React Component
 */
const ExpansionIcon = ({ is_open }: { is_open: boolean }) => (
    <Icon
        icon='IcChevronUpBold'
        size={16}
        className={classNames('proof-of-ownership__card-item-icon', {
            'proof-of-ownership__card-item-icon--invert': !is_open,
        })}
    />
);

/**
 * Renders payment method
 * @name Card
 * @param details - payment method details
 * @param index - index of payment method
 * @param updateErrors - function to update errors
 * @returns React Component
 */
const Card = ({ details, index, updateErrors }: TCardProps) => {
    const [is_open, setIsOpen] = React.useState(false);

    const onClickHandler = () => {
        setIsOpen(!is_open);
    };

    return (
        <div
            className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}
            data-testid={details.payment_method}
            role='card-item'
        >
            <div className='proof-of-ownership__card-item' onClick={onClickHandler}>
                <Icon icon={details?.icon} className='proof-of-ownership__card-item-logo' width={68} height={58} />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {details.payment_method}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={<ExpansionIcon is_open={is_open} />}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClickHandler}
                    transparent
                    data-testid='dt_proof-of-ownership-button'
                />
            </div>
            {is_open && <ExpandedCard card_details={details} index={index} updateErrors={updateErrors} />}
        </div>
    );
};

export default Card;
