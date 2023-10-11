import React from 'react';
import classNames from 'classnames';
import { Dialog, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from '../../../../stores/useDBotStore';
import { setTourSettings, tour_status_ended, tour_type } from '../utils';

const TourEndDialog = observer(() => {
    const { dashboard } = useDBotStore();
    const { active_tab, has_tour_ended, is_tour_dialog_visible, setTourDialogVisibility, toggleOnConfirm } = dashboard;

    const is_mobile = isMobile();

    const toggleTour = (value: boolean, type: string) => {
        if (tour_type.key === 'bot_builder') {
            if (type === 'onConfirm') {
                toggleOnConfirm(active_tab, value);
            } else {
                setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
            }
        }
        setTourDialogVisibility(false);
    };

    const getTourContent = () => {
        return (
            <>
                <div className='dc-dialog__content__description__text' data-testid='tour-success-message'>
                    <Localize
                        key={0}
                        i18n_default_text={'You have successfully created your bot using a simple strategy.'}
                    />
                </div>
                <div className='dc-dialog__content__description__text'>
                    <Localize
                        key={0}
                        i18n_default_text={'Now, <0>run the bot</0> to test out the strategy.'}
                        components={[<strong key={0} />]}
                    />
                </div>
                <div className='dc-dialog__content__description__text'>
                    <Localize
                        key={0}
                        i18n_default_text={
                            'Note: If you wish to learn more about the Bot Builder, you can proceed to the <0>Tutorials</0> tab.'
                        }
                        components={[<strong key={0} />]}
                    />
                </div>
            </>
        );
    };

    const onHandleConfirm = React.useCallback(() => {
        toggleTour(tour_status_ended.key === 'finished', 'onConfirm');
        tour_status_ended.key = '';
        return tour_status_ended.key;
    }, [has_tour_ended, active_tab]);

    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour(false, 'onCancel')}
                confirm_button_text={localize('OK')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className={classNames('dc-dialog tour-dialog', {
                    'tour-dialog--end': has_tour_ended,
                })}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size={is_mobile ? 'xs' : 's'}>
                        {localize('Congratulations')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={is_mobile ? 'xxs' : 'xs'} color='prominent'>
                        {getTourContent()}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default TourEndDialog;
