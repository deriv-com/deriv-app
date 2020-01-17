import classNames        from 'classnames';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon }          from '@deriv/components';
import CurrencyUtils     from '@deriv/shared/utils/currency';
import { toMoment }      from 'Utils/Date';
import MarkerSpot        from './marker-spot.jsx';

class MarkerSpotLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_label: !this.props.has_hover_toggle,
        };
    }

    handleHoverToggle = () => {
        this.setState((state) =>  ({ show_label: !state.show_label }));
    }

    render() {
        const {
            align_label,
            has_hover_toggle,
            icon,
            spot_className,
            spot_count,
            spot_epoch,
            spot_value,
            status,
        } = this.props;

        let marker_spot =
            <MarkerSpot
                className={classNames(spot_className, {
                    [`${spot_className}--won`] : status === 'won',
                    [`${spot_className}--lost`]: status === 'lost',
                })}
                icon={icon}
                status={status}
                spot_count={spot_count}
            />;

        if (has_hover_toggle) {
            marker_spot =
                <div className='marker-hover-container' onMouseEnter={this.handleHoverToggle} onMouseLeave={this.handleHoverToggle}>
                    { marker_spot }
                </div>;
        }

        return (
            <div className={'chart-spot-label'}>
                <CSSTransition
                    in={this.state.show_label}
                    timeout={150}
                    classNames={{
                        enter    : `chart-spot-label__info-container-${align_label}--enter`,
                        enterDone: `chart-spot-label__info-container-${align_label}--enter-done`,
                        exit     : `chart-spot-label__info-container-${align_label}--exit`,
                    }}
                    unmountOnExit
                >
                    <div className='chart-spot-label__info-container'>
                        <div className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${align_label}`}>
                            <div className='chart-spot-label__time-container'>
                                <Icon icon='IcClockOutline' height={10} width={10} className='chart-spot-label__time-icon' />
                                <p className='chart-spot-label__time'>{toMoment(+spot_epoch).format('HH:mm:ss')}</p>
                            </div>
                            <div
                                className={classNames('chart-spot-label__value-container', {
                                    'chart-spot-label__value-container--won' : status === 'won',
                                    'chart-spot-label__value-container--lost': status === 'lost',
                                })}
                            >
                                <p>{CurrencyUtils.addComma(spot_value)}</p>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                { marker_spot }
            </div>
        );
    }
}

MarkerSpotLabel.defaultProps = {
    align_label: 'top',
};

MarkerSpotLabel.propTypes = {
    align_label     : PropTypes.oneOf(['top', 'bottom']),
    has_hover_toggle: PropTypes.bool,
    icon            : PropTypes.string,
    spot_className  : PropTypes.string,
    spot_count      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_epoch      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_value      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    status          : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpotLabel);
