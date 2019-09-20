import classNames       from 'classnames';
import React            from 'react';
import PropTypes        from 'prop-types';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/tools';
import                       '../assets/sass/trade-animation.scss';

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

    render() {
        const {
            className,
            contract_status,
            status_class,
            status_title,
        } = this.props;
        
        return (
            <div className={classNames(
                'animation__container',
                {
                    [className]         : !!className,
                    'animation--running': contract_status > 0,
                },
            )}
            >
                <span className='animation__text'>
                    {translate(status_title)}
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line' >
                        <div className={`animation__progress-bar animation__progress-${contract_status}`} />
                    </div>
                    {
                        status_class.map((status_c, index) => {
                            return <CircularWrapper key={index} className={status_c} />;
                        })
                    }
                </div>
            </div>
        );
    }
}

TradeAnimation.propTypes = {
    className      : PropTypes.string,
    contract_status: PropTypes.number,
    onMount        : PropTypes.func,
    status_class   : PropTypes.array,
    status_title   : PropTypes.string,
};

export default connect(({ animation, flyout }) => ({
    onMount        : animation.onMount,
    contract_status: flyout.contract_status,
    status_class   : animation.status_class,
    status_title   : animation.status_title,
}))(TradeAnimation);
