import React from 'react';
import config from '../../../../../../app.config';
import { translate } from '../../../../../../common/i18n';

const MenuLinks = () => (
    <div className='header__menu-item header__menu-links client_logged_in'>
        {config.reports.visible && (
            <div>
                <a className='url-reports-positions header__menu-links-item' href={config.tradershub.url}>
                    <div className='header__icon-container'>
                        <img className='header__icon-text reports-icon' src='image/traders_hub.png' />
                    </div>
                    <div>
                        <p className='header__menu-item_label'>{translate(config.tradershub.label)}</p>
                    </div>
                </a>
            </div>
        )}
        {config.reports.visible && (
            <div>
                <a className='url-reports-positions header__menu-links-item' href={config.reports.url}>
                    <div className='header__icon-container'>
                        <img className='header__icon-text reports-icon' src='image/deriv/ic-reports.svg' />
                    </div>
                    <div>
                        <p className='header__menu-item_label'>{translate(config.reports.label)}</p>
                    </div>
                </a>
            </div>
        )}
        {config.reports.visible && (
            <div>
                <a className='url-cashier-deposit header__menu-links-item' href={config.cashier.url}>
                    <div className='header__icon-container'>
                        <img id='cashier_icon' className='header__icon-text' src='image/deriv/ic-cashier.svg' />
                    </div>
                    <p className='header__menu-item_label'>{translate(config.cashier.label)}</p>
                </a>
            </div>
        )}
    </div>
);

export default MenuLinks;
