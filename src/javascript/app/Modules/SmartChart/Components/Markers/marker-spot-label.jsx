import classNames   from 'classnames';
import { observer }  from 'mobx-react';
import PropTypes     from 'prop-types';
import React         from 'react';
import { addComma }  from '_common/base/currency_base';
import { toMoment }  from 'Utils/Date';
import { IconClock } from 'Assets/Common/icon-clock.jsx';
import MarkerSpot    from './marker-spot.jsx';

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
        let marker_spot =
            <MarkerSpot
                className={this.props.spot_className}
                spot_count={this.props.spot_count}
            />;

        if (this.props.has_hover_toggle) {
            marker_spot =
                <div className='marker-hover-container' onMouseEnter={this.handleHoverToggle} onMouseLeave={this.handleHoverToggle}>
                    { marker_spot }
                </div>;
        }

        return (
            <div className={'chart-spot-label'}>
                {this.state.show_label &&
                    <div className='chart-spot-label__info-container'>
                        <div className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${this.props.align_label}`}>
                            <div className='chart-spot-label__time-container'>
                                <IconClock height='10' width='10' className='chart-spot-label__time-icon' />
                                <p className='chart-spot-label__time'>{toMoment(+this.props.spot_epoch).format('HH:mm:ss')}</p>
                            </div>
                            <div
                                className={classNames('chart-spot-label__value-container', {
                                    'chart-spot-label__value-container--won' : this.props.status === 'won',
                                    'chart-spot-label__value-container--lost': this.props.status === 'lost',
                                })}
                            >
                                <p>{addComma(this.props.spot_value)}</p>
                            </div>
                        </div>
                    </div>
                }
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
    spot_className  : PropTypes.string,
    spot_count      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_epoch      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    spot_value      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    status          : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpotLabel);
