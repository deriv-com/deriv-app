import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Text from '../text';

class FormProgress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el_completed_bar = React.createRef();
    }

    componentDidMount() {
        this.animateCompleteBar();
    }

    componentDidUpdate() {
        this.animateCompleteBar();
    }

    animateCompleteBar() {
        const el_first_identifier = document.querySelector('.identifier') || {
            offsetLeft: 0,
            clientWidth: 1,
        };
        const each = 100 / this.props.steps.length;
        this.el_completed_bar.current.style.width = `${this.props.current_step * each}%`;
        this.el_completed_bar.current.style.transform = `translateX(${
            el_first_identifier.offsetLeft + el_first_identifier.clientWidth / 2
        }px)`;
    }

    render() {
        const { current_step, steps } = this.props;
        let { active } = false;
        return (
            <div className='dc-form-progress'>
                <div className='dc-form-progress__header'>
                    <h2>{steps[current_step].header.active_title}</h2>
                    <div className='dc-form-progress__steps'>
                        <div
                            className='dc-form-progress__steps--before'
                            style={{
                                width: `calc(100% * ${steps.length - 1} / ${steps.length})`,
                            }}
                        />
                        {steps.map((item, idx) => (
                            <React.Fragment key={idx + 1}>
                                {(active = idx === current_step)}
                                <div className='dc-form-progress__step'>
                                    <Text
                                        align='center'
                                        size='xs'
                                        weight='bold'
                                        color='colored-background'
                                        className={classNames('identifier', {
                                            'identifier--active': idx <= current_step,
                                        })}
                                    >
                                        {idx + 1}
                                    </Text>
                                    <Text
                                        as='p'
                                        align='center'
                                        size='xxs'
                                        weight={active ? 'bold' : 'unset'}
                                        color={active ? 'loss-danger' : 'prominent'}
                                    >
                                        {item.header.title}
                                    </Text>
                                </div>
                            </React.Fragment>
                        ))}
                        <div ref={this.el_completed_bar} className='dc-form-progress__steps--after' />
                    </div>
                </div>
            </div>
        );
    }
}

FormProgress.propTypes = {
    current_step: PropTypes.any,
    nextStep: PropTypes.any,
    prevStep: PropTypes.any,
    steps: PropTypes.array,
};

FormProgress.defaultProps = { steps: [] };

export default FormProgress;
