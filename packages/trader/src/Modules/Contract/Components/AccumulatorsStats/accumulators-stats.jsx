import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon, MobileDialog, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import TicksHistoryCounter from './ticks-history-counter';
import { AccumulatorsStatsManualModal } from './accumulators-stats-manual-modal';
import 'Sass/app/modules/contract/accumulators-stats.scss';

export const CONTRACT_TYPES = {
    STAY_IN: 'Stay in',
    BREAK_OUT: 'Break out',
};
export const ROW_SIZES = {
    DESKTOP_COLLAPSED: 10,
    DESKTOP_EXPANDED: 10,
    MOBILE_COLLAPSED: 6,
    MOBILE_EXPANDED: 5,
};

const AccumulatorsStats = ({ is_expandable = true, ticks_history_stats = {} }) => {
    const [is_collapsed, setIsCollapsed] = React.useState(true);
    const [is_manual_open, setIsManualOpen] = React.useState(false);
    const [displayed_contract_name, setDisplayedContractName] = React.useState(CONTRACT_TYPES.STAY_IN);
    const widget_title = localize('{{displayed_contract_name}} history', { displayed_contract_name });
    const ticks_history =
        (displayed_contract_name === CONTRACT_TYPES.STAY_IN
            ? ticks_history_stats.ACCU?.ticks_stayed_in
            : ticks_history_stats.DECCU?.ticks_stayed_in) || [];
    const history_text_size = isDesktop() || !is_collapsed ? 'xxs' : 'xxxs';

    const rows = ticks_history.reduce((acc, _el, index) => {
        const desktop_row_size = is_collapsed ? ROW_SIZES.DESKTOP_COLLAPSED : ROW_SIZES.DESKTOP_EXPANDED;
        const mobile_row_size = is_collapsed ? ROW_SIZES.MOBILE_COLLAPSED : ROW_SIZES.MOBILE_EXPANDED;
        const row_size = isDesktop() ? desktop_row_size : mobile_row_size;
        if (index % row_size === 0) {
            acc.push(ticks_history.slice(index, index + row_size));
        }
        return acc;
    }, []);

    const handleSwitchBetweenContracts = () => {
        setDisplayedContractName(Object.values(CONTRACT_TYPES).find(name => name !== displayed_contract_name));
    };

    const DynamicWrapper = {
        Component: isMobile() ? MobileDialog : React.Fragment,
        props: isMobile()
            ? {
                  onClose: () => setIsCollapsed(!is_collapsed),
                  portal_element_id: 'modal_root',
                  title: widget_title,
                  visible: !is_collapsed,
                  wrapper_classname: 'accumulators-stats',
              }
            : null,
    };

    if (!ticks_history.length) return null;

    return (
        <div className='accumulators-stats'>
            <div className={classNames('accumulators-stats__container--collapsed')}>
                <div className='accumulators-stats__title'>
                    <AccumulatorsStatsManualModal
                        title={widget_title}
                        icon_classname='info'
                        is_manual_open={is_manual_open}
                        toggleManual={() => setIsManualOpen(!is_manual_open)}
                    />
                    <Text weight='bold' size={isMobile() ? 'xxxs' : 'xxs'} className='accumulators-stats__title-text'>
                        {widget_title}
                    </Text>
                    <div
                        data-testid='dt_accu_stats_switcher'
                        className='accumulators-stats__switcher'
                        onClick={handleSwitchBetweenContracts}
                    >
                        {['IcChevronUpNormal', 'IcChevronDown'].map(icon => (
                            <Icon key={icon} icon={icon} />
                        ))}
                    </div>
                </div>
                <Text size={history_text_size} className='accumulators-stats__history'>
                    {!is_collapsed ? (
                        <div className='accumulators-stats__history-heading'>{localize('Number of ticks')}</div>
                    ) : (
                        rows[0]?.map((el, i) => <TicksHistoryCounter key={i} value={el} has_progress_dots={i === 0} />)
                    )}
                </Text>
                {is_expandable && (
                    <Icon
                        icon={is_collapsed ? 'IcArrowUp' : 'IcArrowDown'}
                        onClick={() => setIsCollapsed(!is_collapsed)}
                        className='accordion-toggle-arrow'
                    />
                )}
            </div>
            {is_expandable && !is_collapsed && (
                <DynamicWrapper.Component {...DynamicWrapper.props}>
                    <Text size={history_text_size} className='accumulators-stats__history--expanded'>
                        {rows.map((row, i) => (
                            <div key={i} data-testid='dt_accu_stats_history_row' className='accumulators-stats__row'>
                                {row.map((counter, idx) => (
                                    <TicksHistoryCounter
                                        key={idx}
                                        value={counter}
                                        has_progress_dots={i === 0 && idx === 0}
                                    />
                                ))}
                            </div>
                        ))}
                    </Text>
                </DynamicWrapper.Component>
            )}
        </div>
    );
};

AccumulatorsStats.propTypes = {
    is_expandable: PropTypes.bool,
    ticks_history_stats: PropTypes.object,
};

export default connect(({ modules }) => ({
    ticks_history_stats: modules.trade.ticks_history_stats,
}))(AccumulatorsStats);
