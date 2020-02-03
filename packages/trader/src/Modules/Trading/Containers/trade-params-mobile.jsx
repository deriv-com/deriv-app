import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Tabs }                       from '@deriv/components';
import { localize }                   from '@deriv/translations';
import Amount                         from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
// import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
// import LastDigit                      from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { connect }                    from 'Stores/connect';
import DurationMobile                 from 'Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile.jsx';
import                                     'Sass/app/modules/trading-mobile.scss';

const DEFAULT_DURATION = Object.freeze({
    t: 5,
    s: 15,
    m: 3,
    h: 1,
    d: 1,
});

const makeGetDefaultDuration = (trade_duration, trade_duration_unit) => duration_unit =>
    trade_duration_unit === duration_unit ? trade_duration : DEFAULT_DURATION[duration_unit];

class TradeParamsMobile extends React.Component {
    constructor(props) {
        super(props);

        const { duration, duration_unit } = this.props;
        const getDefaultDuration = makeGetDefaultDuration(duration, duration_unit);

        this.state = {
            active_tab_index: 0,
            duration_tab_idx: undefined,
            amount_tab_idx  : undefined,
            // duration unit values
            t_duration      : getDefaultDuration('t'),
            s_duration      : getDefaultDuration('s'),
            m_duration      : getDefaultDuration('m'),
            h_duration      : getDefaultDuration('h'),
            d_duration      : getDefaultDuration('d'),
        };
    }

    updateTabIndex = active_tab_index => this.setState({ active_tab_index })

    setDurationTabIdx = duration_tab_idx => this.setState({ duration_tab_idx })

    setAmountTabIdx = amount_tab_idx => this.setState({ amount_tab_idx })

    isVisible = component_key => this.props.form_components.includes(component_key);

    setSelectedDuration = (duration_unit, selected_duration) =>
        this.setState({ [`${duration_unit}_duration`]: selected_duration })

    render () {
        const { active_tab_index, amount_tab_idx, t_duration, s_duration, m_duration, h_duration, d_duration } = this.state;
    
        return (
            <Tabs
                active_index={active_tab_index}
                className='trade-params-duration-amount'
                onTabItemClick={this.updateTabIndex}
                top
            >
                {this.isVisible('duration') &&
                    <div label={localize('Duration')}>
                        <DurationMobile
                            toggleModal={this.props.toggleModal}
                            duration_tab_idx={this.state.duration_tab_idx}
                            setDurationTabIdx={this.setDurationTabIdx}
                            setSelectedDuration={this.setSelectedDuration}
                            t_duration={t_duration}
                            s_duration={s_duration}
                            m_duration={m_duration}
                            h_duration={h_duration}
                            d_duration={d_duration}
                        />
                    </div>
                }
                {this.isVisible('amount') &&
                    <div label={localize('Amount')}>
                        <Amount amount_tab_idx={amount_tab_idx} setAmountTabIdx={this.setAmountTabIdx} />
                    </div>
                }
            </Tabs>
        );
    }
}
TradeParamsMobile.propTypes = {
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized   : PropTypes.bool,
};

export default connect(({ modules }) => ({
    form_components: modules.trade.form_components,
    duration       : modules.trade.duration,
    duration_unit  : modules.trade.duration_unit,
    expiry_type    : modules.trade.expiry_type,
}))(TradeParamsMobile);
