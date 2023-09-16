import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { getDerivEzWebTerminalLink } from '../../Helpers/constants';
import { observer, useStore } from '@deriv/stores';
import { Icon } from '@deriv/components';

const DerivezWebTerminal = () => {
    const history = useHistory();
    const location = useLocation();
    const routeToPrevious = () => history.push(routes.traders_hub);
    const { traders_hub, ui } = useStore();
    const { is_real } = traders_hub;
    const { setDarkMode } = ui;
    const account_type = is_real ? 'real' : 'demo';

    const derivez_token = location.state.derivez_token || '';

    const derivezWebTraderUrl = getDerivEzWebTerminalLink(account_type, derivez_token);

    useEffect(() => {
        // listen to theme change from cloudfront(derivez) localStorage and update app.deriv theme
        window.addEventListener('message', function (e) {
            const key = e.data.key;
            const value = e.data.value;

            if (key === 'panda-forex__theme') {
                setDarkMode(value === 'theme-dark-deriv');
            }
        });

        // send theme change from app.deriv localStorage to cloudfront(derivez) localStorage
        window.addEventListener('storage', function (e) {
            if (e.key === 'ui_store') {
                const uiStore = JSON.parse(e.newValue || '');

                if (uiStore.ui_store.is_dark_mode_on !== localStorage.ui_store.is_dark_mode_on) {
                    const message = {
                        key: 'panda-forex__theme',
                        value: uiStore.ui_store.is_dark_mode_on ? 'theme-dark-deriv' : 'theme-white-deriv',
                    };

                    window.parent.postMessage(message, derivezWebTraderUrl);
                }
            }
        });
    }, []);

    return (
        <div className='derivez-web-terminal'>
            <span className='derivez-web-terminal-header'>
                <Icon icon='IcCross' onClick={routeToPrevious} className='derivez-web-terminal-header-icon' />
            </span>
            <iframe src={derivezWebTraderUrl} className='derivez-web-terminal-iframe' />
        </div>
    );
};

export default observer(DerivezWebTerminal);
