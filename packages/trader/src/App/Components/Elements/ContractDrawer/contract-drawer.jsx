import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React, { Component }     from 'react';
import { withRouter }           from 'react-router';
import Icon                     from 'Assets/icon.jsx';
import routes                   from 'Constants/routes';
import Localize                 from 'App/Components/Elements/localize.jsx';
import ContractAudit            from 'App/Components/Elements/ContractAudit';
import { PositionsCardLoader }  from 'App/Components/Elements/ContentLoader';
import {
    ContractDetailsCardBody,
    ContractDetailsCardFooter,
    ContractDetailsCardHeader } from 'Modules/Contract/Components/ContractDetailsCard';
import {
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText }       from 'Stores/Modules/Portfolio/Helpers/details';
import {
    getEndTime,
    isUserSold     }            from 'Stores/Modules/Contract/Helpers/logic';
import ContractCardBody         from './contract-card-body.jsx';
import ContractCardFooter       from './contract-card-footer.jsx';
import ContractCardHeader       from './contract-card-header.jsx';
import ContractCard             from './contract-card.jsx';

class ContractDrawer extends Component {
    state = {
        is_shade_on: false,
    };

    handleShade = (shade) => {
        this.setState({ is_shade_on: shade });
    };

    redirectBackToReports = () => this.props.history.push(routes.reports);

    getBodyContent () {
        const {
            currency,
            exit_tick_display_value,
            is_sold,
            profit,
        } = this.props.contract_info;
        const {
            contract_info,
            is_dark_theme,
            is_sell_requested,
            onClickSell,
        } = this.props;
        const exit_spot = isUserSold(contract_info) ? '-' : exit_tick_display_value;

        return (
            <React.Fragment>
                <ContractCard
                    contract_info={contract_info}
                    profit_loss={+profit}
                    is_sold={!!(is_sold)}
                >
                    <ContractCardHeader>
                        <ContractDetailsCardHeader
                            contract_info={contract_info}
                        />
                    </ContractCardHeader>
                    <ContractCardBody>
                        <ContractDetailsCardBody
                            currency={currency}
                            contract_info={contract_info}
                            status={this.props.status}
                        />
                    </ContractCardBody>
                    <ContractCardFooter>
                        <ContractDetailsCardFooter
                            contract_info={contract_info}
                            is_sell_requested={is_sell_requested}
                            onClickSell={onClickSell}
                        />
                    </ContractCardFooter>
                </ContractCard>
                {!!(is_sold) &&
                <ContractAudit
                    contract_info={contract_info}
                    contract_end_time={getEndTime(contract_info)}
                    is_dark_theme={is_dark_theme}
                    is_open={true}
                    is_shade_visible={this.handleShade}
                    duration={getDurationTime(contract_info)}
                    duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                    exit_spot={exit_spot}
                    has_result={!!(is_sold)}
                />}
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
        const body_content = (
            <React.Fragment>
                {(this.props.contract_info.status) ?
                    this.getBodyContent()
                    :
                    <div className='contract-card'>
                        <PositionsCardLoader
                            is_dark_theme={this.props.is_dark_theme}
                            speed={2}
                        />
                    </div>
                }
            </React.Fragment>
        );
        return (
            <div id='dt_contract_drawer' className={classNames('contract-drawer', {})}>
                <div className='contract-drawer__heading'>
                    {
                        this.props.is_from_reports &&
                        <div
                            className='contract-drawer__heading-btn'
                            onClick={this.redirectBackToReports}
                        >
                            <Icon
                                icon='IconBack'
                            />
                        </div>
                    }
                    <h2><Localize i18n_default_text='Contract details' /></h2>
                </div>
                <div className='contract-drawer__body'>{body_content}</div>
            </div>
        );
    }
}

ContractDrawer.propTypes = {
    contract_info    : PropTypes.object,
    is_dark_theme    : PropTypes.bool,
    is_from_reports  : PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickSell      : PropTypes.func,
    status           : PropTypes.string,
};

export default withRouter(ContractDrawer);
