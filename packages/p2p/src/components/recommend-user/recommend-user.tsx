import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TRecommendUserProps = {
    is_buy_order_for_user: boolean;
    is_user_recommended_previously: number | null;
    onClickClearRecommendation: () => void;
    onClickNotRecommended: () => void;
    onClickRecommended: () => void;
};

const RecommendUser = ({
    is_buy_order_for_user,
    is_user_recommended_previously,
    onClickClearRecommendation,
    onClickNotRecommended,
    onClickRecommended,
}: TRecommendUserProps) => {
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
            <Text className='recommend-user__text' color='prominent' size='xs'>
                {is_buy_order_for_user ? (
                    <Localize i18n_default_text='Would you recommend this seller?' />
                ) : (
                    <Localize i18n_default_text='Would you recommend this buyer?' />
                )}
            </Text>
            <div className='recommend-user__row'>
                <Button className='recommend-user__block' onClick={handleSelectYes} secondary>
                    <Icon
                        className='recommend-user__block__icon'
                        color={!is_yes_selected ? 'disabled' : undefined}
                        icon='IcThumbsUp'
                        size={16}
                    />
                    <Text color={is_yes_selected ? 'prominent' : 'less-prominent'} size='xs'>
                        <Localize i18n_default_text='Yes' />
                    </Text>
                </Button>
                <Button className='recommend-user__block' onClick={handleSelectNo} secondary>
                    <Icon
                        className='recommend-user__block__icon'
                        color={!is_no_selected ? 'disabled' : undefined}
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

export default RecommendUser;
