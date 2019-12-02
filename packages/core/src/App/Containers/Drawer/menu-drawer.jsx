import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from 'deriv-translations';
import {
    DrawerItem,
    DrawerToggle }       from 'App/Components/Elements/Drawer';
import Icon              from 'Assets/icon.jsx';
import routes            from 'Constants/routes';
import { connect }       from 'Stores/connect';

const MenuDrawer = ({
    is_dark_mode,
    is_logged_in,
    is_mobile,
    is_positions_drawer_on,
    // is_purchase_confirmed,
    // is_purchase_locked,
    logoutClient,
    toggleDarkMode,
    togglePositionsDrawer,
    // togglePurchaseLock,
    // togglePurchaseConfirmation,
}) => (
    <div className='drawer__items-container'>
        <div className='list-items-container'>
            {is_mobile &&
            <React.Fragment>
                <DrawerItem
                    text={localize('Trade')}
                    icon={<Icon icon='IconTrade' className='drawer__icon' />}
                    link_to={routes.trade}
                />
                <DrawerItem
                    text={localize('Portfolio')}
                    icon={<Icon icon='IconPortfolio' className='drawer__icon' />}
                    link_to={routes.portfolio}
                />
                <DrawerItem
                    text={localize('Statement')}
                    icon={<Icon icon='IconReports' className='drawer__icon' />}
                    link_to={routes.statement}
                />
                <hr className='hr' />
                <DrawerToggle
                    text={localize('Dark Mode')}
                    toggle={toggleDarkMode}
                    to_toggle={is_dark_mode}
                />
                {/* Disabled until design is ready
                <DrawerToggle
                    text={localize('Purchase Confirmation')}
                    toggle={togglePurchaseConfirmation}
                    to_toggle={is_purchase_confirmed}
                />
                */}
                {/* <DrawerToggle */}
                {/* text={localize('Purchase Lock')} */}
                {/* toggle={togglePurchaseLock} */}
                {/* to_toggle={is_purchase_locked} */}
                {/* /> */}
            </React.Fragment>}
        </div>
        {!!(is_logged_in && is_mobile) &&
        <div className='drawer__footer'>
            <DrawerItem
                icon={<Icon icon='IconLogout' className='drawer__icon' />}
                text={localize('Logout')}
                custom_action={() => {
                    if (is_positions_drawer_on) {
                        togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
                    }
                    logoutClient();
                }}
            />
        </div>
        }
    </div>
);

MenuDrawer.propTypes = {
    is_dark_mode          : PropTypes.bool,
    is_logged_in          : PropTypes.bool,
    is_mobile             : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    // is_purchase_confirmed     : PropTypes.bool,
    // is_purchase_locked        : PropTypes.bool,
    logoutClient          : PropTypes.func,
    toggleDarkMode        : PropTypes.func,
    togglePositionsDrawer : PropTypes.func,
    // togglePurchaseConfirmation: PropTypes.func,
    // togglePurchaseLock        : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        is_logged_in          : client.is_logged_in,
        logoutClient          : client.logout,
        is_dark_mode          : ui.is_dark_mode_on,
        is_mobile             : ui.is_mobile,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        // is_purchase_confirmed     : ui.is_purchase_confirm_on,
        // is_purchase_locked        : ui.is_purchase_lock_on,
        toggleDarkMode        : ui.toggleDarkMode,
        togglePositionsDrawer : ui.togglePositionsDrawer,
        // togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        // togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(MenuDrawer);
