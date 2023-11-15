import React, { useEffect, useState } from 'react';
import { translate } from '@i18n';
import GTM from '@utilities/integrations/gtm';
import { observer as globalObserver } from '@utilities/observer';
import { getActiveLoginId } from '@storage';
import DerivAppModal from '../common/deriv-app-modal';
import './move-to-dbot-banner.scss';

const updateLastPopupTime = () => {
    localStorage.setItem('last_deriv_redirect_popup_time', new Date().toString());
};

const daysBetween = (date1, date2) => {
    const one_day = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diff_days = Math.round(Math.abs((date1 - date2) / one_day));
    return diff_days;
};

const shouldShowPopup = () => {
    const last_deriv_redirect_popup_time = localStorage.getItem('last_deriv_redirect_popup_time');

    if (!last_deriv_redirect_popup_time) {
        updateLastPopupTime();
        return true;
    }

    const allowed_delay = 14; // Two weeks in days
    const last_popup_date = new Date(last_deriv_redirect_popup_time);
    const current_date = new Date();

    if (daysBetween(last_popup_date, current_date) >= allowed_delay) {
        updateLastPopupTime();
        return true;
    }

    return false;
};

const MoveToDbotBanner = () => {
    const container_class = 'mv-dbot-banner';
    const [open_modal, setOpenModal] = useState(false);

    useEffect(() => {
        try {
            const show_popup = shouldShowPopup();
            setOpenModal(!!show_popup);
        } catch (error) {
            globalObserver.emit('redirect pop-up error:', error);
        }
    }, []);

    const visitDerivBot = () => {
        const user_id = getActiveLoginId();
        GTM.pushDataLayer({ event: 'bbot_moved_to_deriv_bot', user_id: user_id ?? null });
        window.open('https://app.deriv.com/bot', '_self', 'noopener');
    };

    const closeModal = () => {
        const user_id = getActiveLoginId();
        GTM.pushDataLayer({ event: 'bbot_cancel_redirection_popup', user_id: user_id ?? null });
        setOpenModal(false);
    };

    return (
        <div>
            {open_modal && (
                <DerivAppModal
                    title={translate('Discover Deriv Bot')}
                    close_on_outside_click={false}
                    primary_button={{
                        title: translate('Explore Deriv Bot'),
                        onClick: visitDerivBot,
                    }}
                    secondary_button={{
                        title: translate('No, thanks'),
                        onClick: closeModal,
                    }}
                    onClose={closeModal}
                >
                    <div className={container_class}>
                        <div className={`${container_class}__icon-container`}>
                            <img alt='move to deriv' src='/public/images/move-to-deriv.svg' />
                        </div>
                        <div className={`${container_class}__title`}>
                            {translate('Take your bot trading to the next level')}
                        </div>
                        <div className={`${container_class}__content`}>
                            <div>{translate('On Deriv Bot, you\'ll enjoy:')}</div>
                            <ul>
                                <li>
                                    {translate('New features and tools with faster execution and enhanced stability')}
                                </li>
                                <li>{translate('The ability to use your existing XML files from Binary Bot')}</li>
                                <li>
                                    {translate(
                                        'A familiar drag-and-drop interface; create and customise your trading bot easily'
                                    )}
                                </li>
                            </ul>
                            <div>
                                <span>{translate('What are you waiting for?')}</span>{' '}
                                <span>
                                    <strong>{translate('Explore Deriv Bot')}</strong>
                                </span>{' '}
                                <span>{translate('today and unlock new trading possibilities!')}</span>
                            </div>
                        </div>
                    </div>
                </DerivAppModal>
            )}
        </div>
    );
};

export default MoveToDbotBanner;
