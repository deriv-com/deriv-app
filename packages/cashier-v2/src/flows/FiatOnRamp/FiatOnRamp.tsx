import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveAccount } from '@deriv/api-v2';
import { Dropdown, Loader, useDevice } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import { FiatOnRampModule } from '../../lib';
import { TRouteTypes } from '../../types';

type TProps = Pick<TRouteTypes.IRouteConfig, 'path' | 'routes' | 'title'>;

const FiatOnRamp: React.FC<TProps> = ({ path, routes }) => {
    const { data: activeAccount } = useActiveAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const isCrypto = activeAccount?.currency_config?.is_crypto;
    const routeList = routes?.map(route => ({ text: route.title, value: route.path })) ?? [];

    const onSelectRouteHandler = (value: React.SyntheticEvent<HTMLInputElement, Event> | string) => {
        if (value === path) return;
        history.push(value as TRouteTypes.TRoutes);
    };

    if (typeof isCrypto !== 'boolean') return <Loader />;

    if (!isCrypto) history.push('/cashier-v2/deposit');

    return (
        <PageContainer>
            {isMobile && (
                <Dropdown
                    data-testid='dt_routes_dropdown'
                    isFullWidth
                    list={routeList}
                    listHeight='sm'
                    name='routes'
                    onSelect={onSelectRouteHandler}
                    value={path}
                    variant='comboBox'
                />
            )}
            <FiatOnRampModule />
        </PageContainer>
    );
};

export default FiatOnRamp;
