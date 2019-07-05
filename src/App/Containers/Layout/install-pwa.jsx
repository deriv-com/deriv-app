import PropTypes        from 'prop-types';
import React            from 'react';
import { website_name } from 'App/Constants/app-config';
import { connect }      from 'Stores/connect';
import { localize }     from 'App/i18n';
import Button           from '../../Components/Form/button.jsx';

const InstallPWA = ({
    onClose,
    pwa_prompt_event,
    removePWAPromptEvent,
}) => {
    const showPrompt = () => {
        if (pwa_prompt_event) {
            pwa_prompt_event.prompt();
            pwa_prompt_event.userChoice
                .then(choice_result => {
                    if (choice_result.outcome === 'accepted') {
                        removePWAPromptEvent();
                    }
                });
        }
    };

    return (
        <React.Fragment>
            <p>{localize('Install {{website_name}} app?', { website_name })}</p>
            <Button
                className='btn--secondary btn--secondary--orange btn--link notification-bar__button'
                has_effect
                text={localize('No')}
                onClick={onClose}
            />
            <Button
                className='btn--primary btn--primary--orange notification-bar__button'
                has_effect
                text={localize('Yes')}
                onClick={showPrompt}
            />
        </React.Fragment>
    );
};

InstallPWA.propTypes = {
    onClose             : PropTypes.func,
    pwa_prompt_event    : PropTypes.object,
    removePWAPromptEvent: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        pwa_prompt_event    : ui.pwa_prompt_event,
        removePWAPromptEvent: ui.removePWAPromptEvent,
    })
)(InstallPWA);
