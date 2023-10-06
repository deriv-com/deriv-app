import React from 'react';
import { TrackJS } from 'trackjs';
import { symbolPromise } from '@blockly/blocks/shared';
import GTM from '@utilities/integrations/gtm';
import trackjs_config from '../botPage/view/trackJs_config';
import Routes from '../routes';

// Todo create symbol slice and update/add info from here;
const App = () => {
    const [has_symbols, setHasSymbols] = React.useState(false);
    TrackJS.install(trackjs_config);
    GTM.init();
    $.ajaxSetup({
        cache: false,
    });

    React.useEffect(() => {
        symbolPromise.then(() => {
            setHasSymbols(true);
        });
    }, []);

    if (!has_symbols) return null; // Todo: add fallback

    return <Routes />;
};

export default App;
