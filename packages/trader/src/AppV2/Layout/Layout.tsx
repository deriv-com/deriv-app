import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import {
    StandaloneChartAreaFillIcon,
    StandaloneChartAreaRegularIcon,
    StandaloneClockThreeFillIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import { Badge } from '@deriv-com/quill-ui';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import BottomNav from 'AppV2/Components/BottomNav';
import Router from './Routes/router';

const Layout = observer(() => {
    const { portfolio, client } = useStore();
    const { is_logged_in } = client;
    const { active_positions_count } = portfolio;
    const { isMobile } = useDevice();

    const bottomNavItems = [
        {
            icon: <StandaloneChartAreaRegularIcon iconSize='sm' />,
            activeIcon: <StandaloneChartAreaFillIcon iconSize='sm' />,
            label: <Localize i18n_default_text='Trade' />,
            path: routes.trade,
        },
        {
            icon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                        className='bottom-nav-item__position-badge'
                    >
                        <StandaloneClockThreeRegularIcon iconSize='sm' />
                    </Badge>
                ) : (
                    <StandaloneClockThreeRegularIcon iconSize='sm' />
                ),
            activeIcon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                        className='bottom-nav-item__position-badge'
                    >
                        <StandaloneClockThreeFillIcon iconSize='sm' />
                    </Badge>
                ) : (
                    <StandaloneClockThreeFillIcon iconSize='sm' />
                ),
            label: (
                <React.Fragment>
                    <span className='user-guide__anchor' />
                    <Localize i18n_default_text='Positions' />
                </React.Fragment>
            ),
            path: routes.trader_positions,
        },
    ];

    return (
        <React.Fragment>
            <Router />
            {isMobile && is_logged_in && <BottomNav bottomNavItems={bottomNavItems} />}
        </React.Fragment>
    );
});

export default Layout;
