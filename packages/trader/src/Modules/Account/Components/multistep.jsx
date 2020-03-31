import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon } from '@deriv/components';
import { isDesktop } from '@deriv/shared/utils/screen';
import { localize } from '@deriv/translations';

class MultiStep extends React.Component {
    state = {
        step: 0,
        component: this.props.steps[0].component,
    };

    nextStep = () => {
        this.setState(
            {
                step: this.state.step + 1,
            },
            () =>
                this.setState({
                    component: this.props.steps[this.state.step].component,
                })
        );
    };

    prevStep = () => {
        this.setState(
            {
                step: this.state.step - 1,
            },
            () =>
                this.setState({
                    component: this.props.steps[this.state.step].component,
                })
        );
    };

    prevButton = () =>
        this.state.step !== 0 && (
            <div className='multistep__header'>
                <a onClick={this.prevStep} className='multistep__btn'>
                    <Icon icon='IcArrowLeftBold' className='multistep__btn-icon' />
                    {localize('Back')}
                </a>
            </div>
        );

    render() {
        return (
            <div className={classNames('multistep', this.props.className)}>
                {this.prevButton()}
                <div className='multistep__component'>{this.state.component}</div>
            </div>
        );
    }
}

export default MultiStep;
