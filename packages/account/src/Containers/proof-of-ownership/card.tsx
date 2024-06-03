import React from 'react';
import clsx from 'clsx';
import { Button, Icon, Text } from '@deriv/components';
import ExpandedCard from './expanded-card';
import { TPaymentMethodInfo } from '../../Types';

type TCardProps = {
    details: TPaymentMethodInfo;
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
        className={clsx('proof-of-ownership__card-item-icon', {
            'proof-of-ownership__card-item-icon--invert': !is_open,
        })}
    />
);

/**
 * Renders payment method
 * @name Card
 * @param details - payment method details
 * @returns React Component
 */
const Card = ({ details }: TCardProps) => {
    const [is_open, setIsOpen] = React.useState(false);

    const onClickHandler = () => {
        setIsOpen(!is_open);
    };

    return (
        <div
            className={clsx('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}
            data-testid={details?.payment_method}
        >
            <div className='proof-of-ownership__card-item' onClick={onClickHandler} onKeyDown={onClickHandler}>
                {details?.icon && (
                    <Icon icon={details?.icon} className='proof-of-ownership__card-item-logo' width={68} height={58} />
                )}
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {details?.payment_method}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={<ExpansionIcon is_open={is_open} />}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClickHandler}
                    transparent
                    data-testid='dt_proof_of_ownership_button'
                    type='button'
                />
            </div>
            {is_open && <ExpandedCard card_details={details} />}
        </div>
    );
};

export default Card;
