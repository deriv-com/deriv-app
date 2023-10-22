import React from 'react';
import { TrackJS } from 'trackjs';
import { symbolPromise } from '@blockly/blocks/shared';
import GTM from '@utilities/integrations/gtm';
import { useSelector, useDispatch } from 'react-redux';
import { api_base } from '@api-base';
import { observer as globalObserver } from '@utilities/observer';
import trackjs_config from '../botPage/view/trackJs_config';
import Routes from '../routes';
import ActiveSymbols from '../botPage/common/symbolApi/activeSymbols';
import { setActiveSymbols } from '../redux-store/client-slice';

const App = () => {
    const dispatch = useDispatch();
    const has_active_symbols = useSelector(state => state.client.active_symbols);

    const generateActiveSymbols = () => {
        api_base.getActiveSymbols().then(data => {
            symbolPromise.then(() => {
                try {
                    /* eslint-disable no-new */
                    new ActiveSymbols(data.active_symbols);
                } catch (error) {
                    globalObserver.emit('Error', error);
                }
                dispatch(setActiveSymbols(data));
            });
        });
    };

    React.useEffect(() => {
        api_base.api.expectResponse('authorize').then(() => generateActiveSymbols());

        // This code listen is used to listen to active_symbols when user is logged out and load the app
        api_base.api.onMessage().subscribe(({ data }) => {
            if (data.msg_type === 'active_symbols') {
                symbolPromise.then(() => {
                    try {
                        /* eslint-disable no-new */
                        new ActiveSymbols(data.active_symbols);
                    } catch (error) {
                        globalObserver.emit('Error', error);
                    }
                    dispatch(setActiveSymbols(data));
                });
            }
        });
    }, []);

    TrackJS.install(trackjs_config);
    GTM.init();
    $.ajaxSetup({
        cache: false,
    });

    if (has_active_symbols.length === 0) return null;

    return <Routes />;
};

export default App;
