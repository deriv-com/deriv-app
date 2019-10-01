import classNames               from 'classnames';
import React                    from 'react';
import PropTypes                from 'prop-types';
import ContractResultOverlay    from './contract-result-overlay.jsx';
import { connect }              from '../stores/connect';
import { translate }            from '../utils/tools';
import '../assets/sass/trade-animation.scss';

const CircularWrapper = ({ className }) => (
    <div className={classNames(
        'circular-wrapper',
        { [className]: !!className }
    )}
    >
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

class TradeAnimation extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnMount();
    }

    render() {
        const {
            className,
            contract_stage,
            status_class,
            show_overlay,
            profit,
        } = this.props;
        const { index, text } = contract_stage;
        const completed = index >= 4;
        
        return (
            <div className={classNames(
                'animation__container',
                className,
                {
                    'animation--running'  : index > 0,
                    'animation--completed': show_overlay && completed,
                },
            )}
            >
                {
                    show_overlay &&
                    completed &&
                    <ContractResultOverlay profit={profit} />
                }
                <span className='animation__text'>
                    {translate(text)}
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line' >
                        <div className={`animation__progress-bar animation__progress-${index}`} />
                    </div>
                    {
                        status_class.map((status_c, i) => {
                            return <CircularWrapper key={i} className={status_c} />;
                        })
                    }
                </div>
            </div>
        );
    }
}

TradeAnimation.propTypes = {
    className     : PropTypes.string,
    contract_stage: PropTypes.any,
    onMount       : PropTypes.func,
    onUnMount     : PropTypes.func,
    profit        : PropTypes.number,
    status_class  : PropTypes.array,
};

export default connect(({ run_panel, animation, contract_card }) => ({
    contract_stage: run_panel.contract_stage,
    onMount       : animation.onMount,
    onUnMount     : animation.onUnMount,
    profit        : contract_card.profit,
    status_class  : animation.status_class,
}))(TradeAnimation);
