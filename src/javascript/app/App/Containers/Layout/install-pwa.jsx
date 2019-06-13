import PropTypes        from 'prop-types';
import React            from 'react';
import { website_name } from 'App/Constants/app-config';
import { connect }      from 'Stores/connect';
import { localize }     from '_common/localize';
import Button           from '../../Components/Form/button.jsx';
import Checkbox         from '../../Components/Form/Checkbox';

class InstallPWA extends Component {
    state = {
        is_ask_checked: false,
    }

    showPrompt() {
        const { pwa_prompt_event, removePWAPromptEvent } = this.props;
        if (pwa_prompt_event) {
            pwa_prompt_event.prompt();
            pwa_prompt_event.userChoice
                .then(choice_result => {
                    if (choice_result.outcome === 'accepted') {
                        removePWAPromptEvent();
                    }
                });
        }
    }

    toggleAsk() {
        this.setState((state) => ({
            is_ask_checked: !state.is_ask_checked,
        }));
    }

    render() {
        return (
            <React.Fragment>
                <h2>{localize('Install [_1] app?', website_name)}</h2>
                <div className='notification-bar__wrapper'>
                    <Checkbox
                        value={this.state.is_ask_checked}
                        label={localize('Never ask again')}
                        onClick={this.toggleAsk}
                    />
                    <div className='notification-bar__wrapper--button'>
                        <Button
                            className='btn--secondary btn--secondary--orange btn--link notification-bar__button'
                            has_effect
                            text={localize('No')}
                            onClick={this.props.onClose}
                        />
                        <Button
                            className='btn--primary btn--primary--orange notification-bar__button'
                            has_effect
                            text={localize('Yes')}
                            onClick={this.showPrompt}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

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
