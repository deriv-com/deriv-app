import { Button, Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import * as React from 'react';
import ExpandedCard from './ExpandedCard.jsx';

const Card = ({ handleChange, handleBlur, values, setFieldValue, index }) => {
    const onClick = () => setIsOpen(!is_open);
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
        <div className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}>
            <div className='proof-of-ownership__card-item'>
                <Icon
                    icon={values.static_data.icon}
                    className='proof-of-ownership__card-item-logo'
                    width={64}
                    height={58}
                />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {values.static_data.cardTitle || 'Credit/debit card'}{' '}
                    {/** TODO: || method is temporary, should be removed */}
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
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values.data}
                    setFieldValue={setFieldValue}
                    index={index}
                />
            )}
        </div>
    );
};
export default Card;
