import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';

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
            <div className='multi-step__header'>
                <a onClick={this.prevStep} className='multi-step__btn'>
                    <Icon icon='IcArrowLeftBold' className='multi-step__btn-icon' />
                    {this.props.lbl_previous}
                </a>
            </div>
        );

    render() {
        return (
            <div className={classNames('multi-step', this.props.className)}>
                {this.prevButton()}
                <div className='multi-step__component'>{this.state.component}</div>
            </div>
        );
    }
}

MultiStep.propTypes = {
    className: PropTypes.string,
    lbl_previous: PropTypes.string,
    steps: PropTypes.array,
};

export default MultiStep;
