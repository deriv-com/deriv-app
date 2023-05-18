import React from 'react';
import { observer } from 'mobx-react';
import { Text, Icon, PageOverlay } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router-dom';

const CompareCFDs = () => {
    const history = useHistory();

    const Header = (
        <div className='compare-cfd-header'>
            <div
                className='compare-cfd-header-navigation'
                onClick={() => {
                    history.push(routes.traders_hub);
                }}
            >
                <Icon icon='IcArrowLeftBold' />
                <Text size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's hub" />
                </Text>
            </div>
            <h1 className='compare-cfd-header-title'>
                <Text size='m' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Compare all available accounts' />
                </Text>
            </h1>
        </div>
    );

    const Cards = (
        <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, doloremque?</p>
        </div>
    );

    return (
        <PageOverlay header={Header} is_from_app={routes.traders_hub}>
            {Cards}
        </PageOverlay>
    );
};

export default observer(CompareCFDs);
