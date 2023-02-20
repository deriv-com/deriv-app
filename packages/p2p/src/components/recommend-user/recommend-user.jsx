import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const RecommendUser = ({
    is_buy_order_for_user,
    is_user_recommended_previously,
    onClickClearRecommendation,
    onClickNotRecommended,
    onClickRecommended,
}) => {
    const [is_no_selected, setIsNoSelected] = React.useState(false);
    const [is_yes_selected, setIsYesSelected] = React.useState(false);

    React.useEffect(() => {
        if (is_user_recommended_previously !== null) {
            if (is_user_recommended_previously) {
                setIsYesSelected(true);
                onClickRecommended();
            } else {
                setIsNoSelected(true);
                onClickNotRecommended();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectNo = () => {
        if (is_no_selected) {
            setIsNoSelected(false);
            onClickClearRecommendation();
            return;
        }
        if (is_yes_selected) {
            setIsYesSelected(false);
        }
        onClickNotRecommended();
        setIsNoSelected(true);
    };

    const handleSelectYes = () => {
        if (is_yes_selected) {
            setIsYesSelected(false);
            onClickClearRecommendation();
            return;
        }
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
                    <Localize i18n_default_text='Would you recommend this seller?' />
                ) : (
                    <Localize i18n_default_text='Would you recommend this buyer?' />
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
    is_user_recommended_previously: PropTypes.number,
    onClickClearRecommendation: PropTypes.func,
    onClickNotRecommended: PropTypes.func,
    onClickRecommended: PropTypes.func,
};

export default RecommendUser;
