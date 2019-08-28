import { Button }           from 'deriv-components';
import React, { Component } from 'react';
import { localize }         from 'App/i18n';
import CurrencySelector     from './currency-selector.jsx';
import PersonalDetails      from './personal-details.jsx';

const usual_control_button = {
    next_button_label    : localize('Next'),
    has_previous_button  : true,
    has_next_button      : true,
    previous_button_label: localize('Previous'),
};

const items = [
    {
        header: {
            active_title: localize('Please choose your currency'),
            title       : localize('Account currency'),
        },
        body   : <CurrencySelector />,
        control: { ...usual_control_button, has_previous_button: false },
    },
    {
        header: {
            active_title: localize('Complete your personal details'),
            title       : localize('Personal details'),
        },
        body   : <PersonalDetails />,
        control: { ...usual_control_button },
    },
    {
        header: {
            active_title: localize('Terms of use'),
            title       : localize('Terms of use'),
        },
        body   : <PersonalDetails />,
        control: { ...usual_control_button, next_button_label: localize('Add account') },
    },
];

// eslint-disable-next-line no-shadow
const FormProgress = ({ items = [], current_step, nextStep, prevStep }) => {
    return (
        <div>
            {items.map((item, idx) => (
                <div key={idx} className='form-progress__step'>
                    {idx + 1 === current_step &&
                    <React.Fragment>
                        {item.header.active_title}
                        {item.control.has_next_button &&
                        <Button
                            text={item.control.next_button_label}
                            onClick={nextStep}
                        />
                        }
                        {item.control.has_previous_button &&
                        <Button
                            text={item.control.previous_button_label}
                            onClick={prevStep}
                        />
                        }
                    </React.Fragment>
                    }

                </div>
            ))}
        </div>
    );

};

class AccountWizard extends Component {
    state = {
        step: 1,
    };

    nextStep = () => {
        this.setState({
            step: this.state.step + 1,
        });
    };

    prevStep = () => {
        this.setState({
            step: this.state.step - 1,
        });
    }

    render() {
        return (
            <div>
                <FormProgress
                    items={items}
                    current_step={this.state.step}
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                />
            </div>
        );
    }
}

export default AccountWizard;
