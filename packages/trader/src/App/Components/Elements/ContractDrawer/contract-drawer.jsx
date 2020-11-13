import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import { routes, isUserSold, isMobile } from '@deriv/shared';
import ContractAudit from 'App/Components/Elements/ContractAudit';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import { connect } from 'Stores/connect';
import { getDurationPeriod, getDurationTime, getDurationUnitText } from 'Stores/Modules/Portfolio/Helpers/details';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import ContractDrawerCard from './contract-drawer-card.jsx';
import { SwipeableContractAudit } from './swipeable-components.jsx';

class ContractDrawer extends React.Component {
    contract_drawer_ref = React.createRef();
    contract_drawer_card_ref = React.createRef();

    state = {
        is_shade_on: false,
        should_show_contract_audit: false,
    };

    handleShade = shade => {
        this.setState({ is_shade_on: shade });
    };

    toggleContractAuditDrawer = () => {
        this.setState(state => ({ should_show_contract_audit: !state.should_show_contract_audit }));
    };

    onSwipedDown = () => this.setState({ should_show_contract_audit: false });
    onSwipedUp = () => this.setState({ should_show_contract_audit: true });

    get is_collapsed() {
        return this.state.should_show_contract_audit;
    }

    getBodyContent() {
        const { currency, exit_tick_display_value, is_sold } = this.props.contract_info;

        const {
            contract_info,
            contract_update,
            contract_update_history,
            is_mobile,
            is_sell_requested,
            is_dark_theme,
            is_multiplier,
            onClickCancel,
            onClickSell,
            server_time,
            status,
            toggleHistoryTab,
        } = this.props;

        const exit_spot = isUserSold(contract_info) && !is_multiplier ? '-' : exit_tick_display_value;

        const contract_audit = (
            <ContractAudit
                contract_info={contract_info}
                contract_update_history={contract_update_history}
                contract_end_time={getEndTime(contract_info)}
                is_dark_theme={is_dark_theme}
                is_multiplier={is_multiplier}
                is_open={true}
                is_shade_visible={this.handleShade}
                duration={getDurationTime(contract_info)}
                duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                exit_spot={exit_spot}
                has_result={!!is_sold || is_multiplier}
                toggleHistoryTab={toggleHistoryTab}
            />
        );

        return (
            <React.Fragment>
                <ContractDrawerCard
                    contract_info={contract_info}
                    contract_update={contract_update}
                    currency={currency}
                    is_mobile={is_mobile}
                    is_multiplier={is_multiplier}
                    is_sell_requested={is_sell_requested}
                    is_collapsed={this.is_collapsed}
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    onSwipedUp={this.onSwipedUp}
                    onSwipedDown={this.onSwipedDown}
                    server_time={server_time}
                    status={status}
                    toggleContractAuditDrawer={this.toggleContractAuditDrawer}
                />
                <DesktopWrapper>{contract_audit}</DesktopWrapper>
            </React.Fragment>
        );
    }

    redirectBackToReports = () => {
        // history.goBack() will go to the wrong location if user goes to contract by pasting it in the url.
        if (this.props.history.location.state) {
            this.props.history.goBack();
        } else {
            this.props.history.push(routes.reports);
        }
    };

    render() {
        if (!this.props.contract_info) return null;

        // For non-binary contract, the status is always null, so we check for is_expired in contract_info
        const fallback_result = this.props.contract_info.is_expired;

        const { exit_tick_display_value, is_sold } = this.props.contract_info;

        const { contract_info, contract_update_history, is_dark_theme, is_multiplier, toggleHistoryTab } = this.props;

        const exit_spot = isUserSold(contract_info) && !is_multiplier ? '-' : exit_tick_display_value;

        const contract_audit = (
            <ContractAudit
                contract_info={contract_info}
                contract_update_history={contract_update_history}
                contract_end_time={getEndTime(contract_info)}
                is_dark_theme={is_dark_theme}
                is_multiplier={is_multiplier}
                is_open={true}
                is_shade_visible={this.handleShade}
                duration={getDurationTime(contract_info)}
                duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                exit_spot={exit_spot}
                has_result={!!is_sold || is_multiplier}
                toggleHistoryTab={toggleHistoryTab}
            />
        );

        const body_content = (
            <React.Fragment>
                {this.props.contract_info.status || fallback_result ? (
                    this.getBodyContent()
                ) : (
                    <div className='contract-card'>
                        <PositionsCardLoader is_dark_theme={this.props.is_dark_theme} speed={2} />
                    </div>
                )}
            </React.Fragment>
        );

        const contract_drawer = (
            <CSSTransition
                in={this.state.should_show_contract_audit}
                timeout={250}
                classNames='contract-drawer__transition'
            >
                <div
                    id='dt_contract_drawer'
                    className={classNames('contract-drawer', {
                        'contract-drawer--with-collapsible-btn':
                            !!getEndTime(this.props.contract_info) || (is_multiplier && isMobile()),
                        'contract-drawer--is-multiplier': is_multiplier && isMobile(),
                        'contract-drawer--is-multiplier-sold':
                            is_multiplier && isMobile() && getEndTime(this.props.contract_info),
                    })}
                    style={{
                        transform:
                            this.state.should_show_contract_audit &&
                            this.contract_drawer_ref.current &&
                            this.contract_drawer_card_ref.current &&
                            `translateY(calc(${this.contract_drawer_card_ref.current.clientHeight}px - ${this.contract_drawer_ref.current.clientHeight}px))`,
                    }}
                    ref={this.contract_drawer_ref}
                >
                    <div className='contract-drawer__body' ref={this.contract_drawer_card_ref}>
                        {body_content}
                    </div>
                    {this.state.should_show_contract_audit && (
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
                            height: this.contract_drawer_card_ref.current?.clientHeight,
                        }}
                    >
                        <Div100vhContainer height_offset='40px' is_bypassed={!this.contract_drawer_card_ref.current}>
                            {contract_drawer}
                        </Div100vhContainer>
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }
}

ContractDrawer.propTypes = {
    contract_info: PropTypes.object,
    is_chart_loading: PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_history_tab_active: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
    onClickSell: PropTypes.func,
    status: PropTypes.string,
};

export default withRouter(
    connect(({ common, ui }) => ({
        server_time: common.server_time,
        is_mobile: ui.is_mobile,
    }))(ContractDrawer)
);
