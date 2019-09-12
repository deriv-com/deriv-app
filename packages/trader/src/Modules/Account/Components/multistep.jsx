import React        from 'react';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';

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
        <a onClick={this.prevStep} className='multistep-btn'>
            <Icon icon='IconBack' className='multistep-btn__icon' />
            {localize('Back')}
        </a>
    );

    render() {
        return (
            <>
                {this.prevButton()}
                <div className='multistep-component'>
                    {this.state.component}
                </div>
            </>
        );
    }
}

export default MultiStep;
