import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const RecommendUser = ({ is_buy_order_for_user, onClickNotRecommended, onClickRecommended }) => {
    const [is_no_selected, setIsNoSelected] = React.useState(false);
    const [is_yes_selected, setIsYesSelected] = React.useState(false);

    const handleSelectNo = () => {
        if (is_yes_selected) {
            setIsYesSelected(false);
        }
        onClickNotRecommended();
        setIsNoSelected(true);
    };

    const handleSelectYes = () => {
        if (is_no_selected) {
            setIsNoSelected(false);
        }
        onClickRecommended();
        setIsYesSelected(true);
    };

    return (
        <div className='recommend-user'>
            <Text className='recommend-user--text' color='prominent' size='xs'>
                {is_buy_order_for_user ? (
                    <Localize i18n_default_text='Would you recommend this buyer?' />
                ) : (
                    <Localize i18n_default_text='Would you recommend this seller?' />
                )}
            </Text>
            <div className='recommend-user--row'>
                <Button className='recommend-user--block' onClick={handleSelectYes} secondary>
                    <Icon
                        className='recommend-user--block__icon'
                        color={!is_yes_selected && 'disabled'}
                        icon='IcThumbsUp'
                        size={16}
                    />
                    <Text color={is_yes_selected ? 'prominent' : 'less-prominent'} size='xs'>
                        <Localize i18n_default_text='Yes' />
                    </Text>
                </Button>
                <Button className='recommend-user--block' onClick={handleSelectNo} secondary>
                    <Icon
                        className='recommend-user--block__icon'
                        color={!is_no_selected && 'disabled'}
                        icon='IcThumbsDown'
                        size={16}
                    />
                    <Text color={is_no_selected ? 'prominent' : 'less-prominent'} size='xs'>
                        <Localize i18n_default_text='No' />
                    </Text>
                </Button>
            </div>
        </div>
    );
};

RecommendUser.propTypes = {
    is_buy_order_for_user: PropTypes.bool,
    onClickNotRecommended: PropTypes.func,
    onClickRecommended: PropTypes.func,
};

export default RecommendUser;
