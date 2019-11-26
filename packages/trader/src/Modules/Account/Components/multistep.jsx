
import React                   from 'react';
import { localize }            from 'deriv-translations';
import Icon                    from 'Assets/icon.jsx';

class MultiStep extends React.Component {
    state = {
        step     : 0,
        component: this.props.steps[0].component,
    };

    nextStep = () => {
        this.setState({
            step: this.state.step + 1,
        }, () => this.setState({
            component: this.props.steps[this.state.step].component,
        }));
    }

    prevStep = () => {
        this.setState({
            step: this.state.step - 1,
        }, () => this.setState({
            component: this.props.steps[this.state.step].component,
        }));
    }

    prevButton = () => (
        this.state.step !== 0 &&
            <div className='multistep__header'>
                <a onClick={this.prevStep} className='multistep__btn'>
                    <Icon icon='IconBack' className='multistep__btn-icon' />
                    {localize('Back')}
                </a>
            </div>
    );

    render() {
        return (
            <>
                {this.prevButton()}
                <div className='multistep__component'>
                    {this.state.component}
                </div>
            </>
        );
    }
}

export default MultiStep;
