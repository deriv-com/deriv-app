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
    const activeSymbols = useSelector(state => state.client.active_symbols);

    React.useEffect(() => {
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
    }, []);

    TrackJS.install(trackjs_config);
    GTM.init();
    $.ajaxSetup({
        cache: false,
    });

    if (activeSymbols.length === 0) return null;

    return <Routes />;
};

export default App;
