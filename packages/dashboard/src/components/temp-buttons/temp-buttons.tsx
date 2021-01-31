import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useStores } from 'Stores';

const TempButtons: React.FC = () => {
    const history = useHistory();
    const { config_store } = useStores();

    return (
        <div className='dw-temp-buttons'>
            <Button.Group>
                <Button primary large blue onClick={() => history.push(config_store.routes.explore)}>
                    <Localize i18n_default_text='Explore' />
                </Button>
                <Button primary large blue onClick={() => history.push(config_store.routes.about_us)}>
                    <Localize i18n_default_text='About us' />
                </Button>
                <Button primary large blue onClick={() => history.push(config_store.routes.resources)}>
                    <Localize i18n_default_text='Resources' />
                </Button>
                <Button primary large blue onClick={() => history.push(config_store.routes.platform_dmt5_synthetic)}>
                    <Localize i18n_default_text='Platform DMT5 Synthetic' />
                </Button>
            </Button.Group>
        </div>
    );
};

export default TempButtons;
