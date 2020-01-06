import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React, { useCallback }         from 'react';
import { NavLink }                    from 'react-router-dom';
import { VariableSizeList as List }   from 'react-window';
import { Icon, ThemedScrollbars }     from '@deriv/components';
import { localize }                   from '@deriv/translations';
import routes                         from 'Constants/routes';
import EmptyPortfolioMessage          from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import { connect }                    from 'Stores/connect';
import { isMultiplierContract }       from 'Stores/Modules/Contract/Helpers/multiplier';
import PositionsDrawerCard            from './PositionsDrawerCard';

const ListScrollbar = React.forwardRef((props, ref) => (
    <ExtendedScrollbars {...props} forwardedRef={ref} />
));

// Display name is required by Developer Tools to give a name to the components we use.
// If a component doesn't have a displayName is will be shown as <Unknown />. Hence, name is set.
ListScrollbar.displayName = 'ListScrollbar';

const ExtendedScrollbars = ({ onScroll, forwardedRef, style, children }) => {
    const refSetter = useCallback(scrollbarsRef => {
        if (scrollbarsRef) {
            forwardedRef(scrollbarsRef.view);
        } else {
            forwardedRef(null);
        }
    }, []);

    return (
        <ThemedScrollbars
            ref={refSetter}
            style={{ ...style, overflow: 'hidden' }}
            onScroll={onScroll}
            autoHide
        >
            {children}
        </ThemedScrollbars>
    );
};

class PositionsDrawer extends React.Component {
    state = {}
    
    componentDidMount()    {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    setBodyRef = (elem) => {
        if (elem) {
            // Todo: Handle Resizing
            this.setState({
                body_height: elem.clientHeight,
            });
        }
    }

    itemRender = ({
        data,
        index,       // Index of row
        style,
    }) => {
        const {
            currency,
            onClickCancel,
            onClickSell,
            onClickRemove,
            onHoverPosition,
            toggleUnsupportedContractModal,
        } = this.props;
        const portfolio_position = data[index];
        return (
            <div
                key={portfolio_position.id}
                style={style}
            >
                <PositionsDrawerCard
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    onClickRemove={onClickRemove}
                    onMouseEnter={() => {
                        onHoverPosition(true, portfolio_position);
                    }}
                    onMouseLeave={() => {
                        onHoverPosition(false, portfolio_position);
                    }}
                    key={portfolio_position.id}
                    currency={currency}
                    toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                    {...portfolio_position}
                />
            </div>
        );
    }

    render() {
        const {
            all_positions,
            error,
            is_empty,
            is_multiplier,
            is_positions_drawer_on,
            symbol,
            symbol_display_name,
            toggleDrawer,
        } = this.props;

        let positions;

        if (is_multiplier) {
            positions = all_positions.filter((p) => {
                if (p.contract_info) {
                    return isMultiplierContract(p.contract_info.contract_type) && symbol === p.contract_info.underlying;
                }
                return true;
            });
        } else {
            positions = all_positions.slice(0, 5);
        }

        // Show only 5 most recent open contracts
        const body_content = (
            <React.Fragment>
                <div style={{ 'height': '100%' }} ref={this.setBodyRef}>
                    {this.state.body_height > 0 &&
                        <List
                            itemCount={positions.length}
                            itemData={positions}
                            itemSize={() => 240}
                            height={this.state.body_height}
                            outerElementType={is_empty ? null : ListScrollbar}
                        >
                            {this.itemRender}
                        </List>
                    }
                </div>
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <div className={classNames(
                    'positions-drawer__bg', {
                        'positions-drawer__bg--open': is_positions_drawer_on,
                    })}
                />
                <div
                    id='dt_positions_drawer'
                    className={classNames(
                        'positions-drawer', {
                            'positions-drawer--open': is_positions_drawer_on,
                        })}
                >
                    <div className='positions-drawer__header'>
                        {is_multiplier ?
                            <div className='positions-drawer__title'>
                                <p>{localize('Multiplier options on')}</p>
                                <p>{symbol_display_name}</p>
                            </div>
                            :
                            <span className='positions-drawer__title'>
                                {localize('Recent Positions')}
                            </span>
                        }
                        <div
                            id='dt_positions_drawer_close_icon'
                            className='positions-drawer__icon-close'
                            onClick={toggleDrawer}
                        >
                            <Icon icon='IcMinusBold' />
                        </div>
                    </div>
                    <div className='positions-drawer__body'>
                        {(positions.length === 0 || error) ? <EmptyPortfolioMessage error={error} />  : body_content}
                    </div>
                    <div className='positions-drawer__footer'>
                        <NavLink id='dt_positions_drawer_report_button' className='btn btn--secondary btn__large' to={routes.reports}>
                            <span className='btn__text'>
                                {localize('Go to Reports')}
                            </span>
                        </NavLink>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PositionsDrawer.propTypes = {
    all_positions         : MobxPropTypes.arrayOrObservableArray,
    children              : PropTypes.any,
    currency              : PropTypes.string,
    error                 : PropTypes.string,
    is_empty              : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_multiplier         : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate : PropTypes.func,
    onClickRemove         : PropTypes.func,
    onClickSell           : PropTypes.func,
    onHoverPosition       : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    symbol                : PropTypes.string,
    symbol_display_name   : PropTypes.string,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, client, ui }) => ({
        currency                      : client.currency,
        all_positions                 : modules.portfolio.all_positions,
        error                         : modules.portfolio.error,
        is_empty                      : modules.portfolio.is_empty,
        is_loading                    : modules.portfolio.is_loading,
        onClickCancel                 : modules.portfolio.onClickCancel,
        onClickSell                   : modules.portfolio.onClickSell,
        onClickRemove                 : modules.portfolio.removePositionById,
        onHoverPosition               : modules.portfolio.onHoverPosition,
        onMount                       : modules.portfolio.onMount,
        onUnmount                     : modules.portfolio.onUnmount,
        is_multiplier                 : modules.trade.is_multiplier,
        symbol                        : modules.trade.symbol,
        symbol_display_name           : modules.trade.symbol_display_name,
        is_positions_drawer_on        : ui.is_positions_drawer_on,
        toggleDrawer                  : ui.togglePositionsDrawer,
        toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    })
)(PositionsDrawer);
