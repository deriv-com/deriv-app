import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import {
    isUserSold,
    isMobile,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText,
    getEndTime,
} from '@deriv/shared';
import ContractAudit from 'App/Components/Elements/ContractAudit';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import { connect } from 'Stores/connect';
import ContractDrawerCard from './contract-drawer-card.jsx';
import { SwipeableContractAudit } from './swipeable-components.jsx';

const ContractDrawer = ({
    contract_info,
    contract_update,
    contract_update_history,
    is_accumulator,
    is_mobile,
    is_sell_requested,
    is_dark_theme,
    is_market_closed,
    is_multiplier,
    is_vanilla,
    onClickCancel,
    onClickSell,
    server_time,
    status,
    toggleHistoryTab,
}) => {
    const { currency, exit_tick_display_value, is_sold } = contract_info;
    const contract_drawer_ref = React.useRef();
    const contract_drawer_card_ref = React.useRef();
    const [should_show_contract_audit, setShouldShowContractAudit] = React.useState(false);

    const getBodyContent = () => {
        const exit_spot =
            isUserSold(contract_info) && !is_multiplier && !is_accumulator ? '-' : exit_tick_display_value;

        const contract_audit = (
            <ContractAudit
                contract_info={contract_info}
                contract_update_history={contract_update_history}
                contract_end_time={getEndTime(contract_info)}
                is_accumulator={is_accumulator}
                is_dark_theme={is_dark_theme}
                is_multiplier={is_multiplier}
                is_open
                duration={getDurationTime(contract_info)}
                duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                exit_spot={exit_spot}
                has_result={!!is_sold || is_multiplier || is_vanilla || is_accumulator}
                toggleHistoryTab={toggleHistoryTab}
                is_vanilla={is_vanilla}
            />
        );

        return (
            <React.Fragment>
                <ContractDrawerCard
                    contract_info={contract_info}
                    contract_update={contract_update}
                    currency={currency}
                    is_accumulator={is_accumulator}
                    is_mobile={is_mobile}
                    is_market_closed={is_market_closed}
                    is_multiplier={is_multiplier}
                    is_vanilla={is_vanilla}
                    is_sell_requested={is_sell_requested}
                    is_collapsed={should_show_contract_audit}
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    onSwipedUp={() => setShouldShowContractAudit(true)}
                    onSwipedDown={() => setShouldShowContractAudit(false)}
                    server_time={server_time}
                    status={status}
                    toggleContractAuditDrawer={() => setShouldShowContractAudit(!should_show_contract_audit)}
                />
                <DesktopWrapper>{contract_audit}</DesktopWrapper>
            </React.Fragment>
        );
    };

    if (!contract_info) return null;

    // For non-binary contract, the status is always null, so we check for is_expired in contract_info
    const fallback_result = contract_info.status || contract_info.is_expired;

    const exit_spot = isUserSold(contract_info) && !is_multiplier && !is_accumulator ? '-' : exit_tick_display_value;

    const contract_audit = (
        <ContractAudit
            contract_info={contract_info}
            contract_update_history={contract_update_history}
            contract_end_time={getEndTime(contract_info)}
            is_accumulator={is_accumulator}
            is_dark_theme={is_dark_theme}
            is_multiplier={is_multiplier}
            is_open
            duration={getDurationTime(contract_info)}
            duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
            exit_spot={exit_spot}
            has_result={!!is_sold || is_multiplier || is_vanilla || is_accumulator}
            toggleHistoryTab={toggleHistoryTab}
            is_vanilla={is_vanilla}
        />
    );

    const body_content = fallback_result ? (
        getBodyContent()
    ) : (
        <div className='contract-card'>
            <PositionsCardLoader is_dark_theme={is_dark_theme} speed={2} />
        </div>
    );

    const contract_drawer = (
        <CSSTransition in={should_show_contract_audit} timeout={250} classNames='contract-drawer__transition'>
            <div
                id='dt_contract_drawer'
                className={classNames('contract-drawer', {
                    'contract-drawer--with-collapsible-btn':
                        !!getEndTime(contract_info) || ((is_multiplier || is_vanilla || is_accumulator) && isMobile()),
                    'contract-drawer--is-multiplier': is_multiplier && isMobile(),
                    'contract-drawer--is-multiplier-sold': is_multiplier && isMobile() && getEndTime(contract_info),
                })}
                style={{
                    transform:
                        should_show_contract_audit &&
                        contract_drawer_ref.current &&
                        contract_drawer_card_ref.current &&
                        `translateY(calc(${contract_drawer_card_ref.current.clientHeight}px - ${contract_drawer_ref.current.clientHeight}px))`,
                }}
                ref={contract_drawer_ref}
            >
                <div className='contract-drawer__body' ref={contract_drawer_card_ref}>
                    {body_content}
                </div>
                {should_show_contract_audit && (
                    <MobileWrapper>
                        <div id='dt_contract_drawer_audit'>
                            <SwipeableContractAudit is_multiplier={is_multiplier}>
                                {contract_audit}
                            </SwipeableContractAudit>
                        </div>
                    </MobileWrapper>
                )}
            </div>
        </CSSTransition>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>{contract_drawer}</DesktopWrapper>
            <MobileWrapper>
                <div
                    style={{
                        height: contract_drawer_card_ref.current?.clientHeight,
                    }}
                >
                    <Div100vhContainer height_offset='40px' is_bypassed={!contract_drawer_card_ref.current}>
                        {contract_drawer}
                    </Div100vhContainer>
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

ContractDrawer.propTypes = {
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    contract_update_history: PropTypes.array,
    is_accumulator: PropTypes.bool,
    is_chart_loading: PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_market_closed: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    is_history_tab_active: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
    onClickSell: PropTypes.func,
    server_time: PropTypes.object,
    status: PropTypes.string,
    toggleHistoryTab: PropTypes.func,
};

export default withRouter(
    connect(({ common, ui }) => ({
        server_time: common.server_time,
        is_mobile: ui.is_mobile,
    }))(ContractDrawer)
);
