import classNames from 'classnames';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { toMoment } from 'Utils/Date';

class MarkerSpotTooltip extends React.Component {
    state = {};
    componentDidMount() {
        if (this.ref) {
            this.parent = this.findParent(this.ref);
            if (!this.parent) return;

            this.parent.addEventListener('mousemove', this.handleMousemove);
            this.parent.addEventListener('mouseleave', this.handleMouseleave);
        }
    }

    componentWillUnmount() {
        if (this.parent) {
            this.parent.removeEventListener('mousemove', this.handleMousemove);
            this.parent.removeEventListener('mouseleave', this.handleMouseleave);
        }
    }

    findParent(el) {
        if (!el) return null;
        if (el.classList.contains('smartcharts')) return el;

        return this.findParent(el.parentNode);
    }

    findNearestAdjacentMarker(x, index) {
        const { tick_markers } = this.props;

        const marker1 = tick_markers[index];
        const tick1X = marker1.content_config.marker_ref.div.getBoundingClientRect().left;
        if (!tick_markers[index + 1]) {
            return marker1;
        }

        const marker2 = tick_markers[index + 1];
        const tick2X = marker2.content_config.marker_ref.div.getBoundingClientRect().left;
        if (Math.abs(tick1X - x) < Math.abs(tick2X - x)) {
            return marker1;
        }
        return marker2;
    }

    searchNearestTickMarker = (x, startIndex, endIndex, prevIndex) => {
        const { tick_markers } = this.props;

        const middleIndex = parseInt((startIndex + endIndex) / 2);
        if (prevIndex === middleIndex) {
            return this.findNearestAdjacentMarker(x, prevIndex);
        }

        const marker = tick_markers[middleIndex];
        const tickX = marker.content_config.marker_ref.div.getBoundingClientRect().left;
        if (x > tickX) {
            return this.searchNearestTickMarker(x, middleIndex, endIndex, middleIndex);
        }
        return this.searchNearestTickMarker(x, startIndex, middleIndex, middleIndex);
    };

    handleMousemove = event => {
        const { marker_ref, tick_markers } = this.props;
        if (!marker_ref) return;

        const tick_length = tick_markers.length;
        const marker = this.searchNearestTickMarker(event.clientX, 0, tick_length);
        const is_last_tick = marker === tick_markers[tick_length - 1];

        if (this.state.marker !== marker || !this.state.show_tooltip) {
            marker_ref.setPosition({
                epoch: +marker.marker_config.x,
                price: +marker.marker_config.y,
            });
            this.setState({
                is_last_tick,
                marker,
                show_tooltip: true,
            });
        }
    };

    handleMouseleave = () => {
        this.setState({
            show_tooltip: false,
        });
    };

    render() {
        const { marker } = this.state;
        const { status } = this.props;
        const align_label = (marker && marker.content_config.align_label) || 'top';

        return (
            <div ref={el => (this.ref = el)}>
                {marker && (
                    <CSSTransition
                        in={this.state.show_tooltip}
                        timeout={150}
                        classNames={{
                            enter: `chart-spot-label__info-container-${align_label}--enter`,
                            enterDone: `chart-spot-label__info-container-${align_label}--enter-done`,
                            exit: `chart-spot-label__info-container-${align_label}--exit`,
                        }}
                        unmountOnExit
                    >
                        <div className='chart-spot-label__info-container'>
                            <div
                                className={`chart-spot-label__time-value-container chart-spot-label__time-value-container--${align_label}`}
                            >
                                <div className='chart-spot-label__time-container'>
                                    <Icon
                                        icon='IcClockOutline'
                                        height={10}
                                        width={10}
                                        className='chart-spot-label__time-icon'
                                    />
                                    <p className='chart-spot-label__time'>
                                        {toMoment(+marker.content_config.spot_epoch).format('HH:mm:ss')}
                                    </p>
                                </div>
                                <div
                                    className={classNames('chart-spot-label__value-container', {
                                        'chart-spot-label__value-container--won':
                                            this.state.is_last_tick && status === 'won',
                                        'chart-spot-label__value-container--lost':
                                            this.state.is_last_tick && status === 'lost',
                                    })}
                                >
                                    <p>{CurrencyUtils.addComma(marker.content_config.spot_value)}</p>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                )}
            </div>
        );
    }
}

MarkerSpotTooltip.propTypes = {
    marker_ref: PropTypes.object,
    status: PropTypes.string,
    tick_markers: MobxPropTypes.arrayOrObservableArray,
};

export default observer(MarkerSpotTooltip);
