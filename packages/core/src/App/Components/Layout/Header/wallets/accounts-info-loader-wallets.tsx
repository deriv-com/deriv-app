import React from 'react';
import ContentLoader from 'react-content-loader';

type TAccountsInfoLoaderWallets = {
    is_mobile: boolean;
    is_logged_in: boolean;
    is_traders_hub_routes: boolean;
    speed: number;
};

const AccountsInfoLoaderWallets = ({
    is_mobile,
    is_logged_in,
    is_traders_hub_routes,
    speed,
}: TAccountsInfoLoaderWallets) => (
    <ContentLoader
        height={is_mobile ? 42 : 46}
        width={is_mobile ? 161 : 350}
        speed={speed}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        {is_logged_in ? (
            <LoggedInPreloader is_mobile={is_mobile} is_traders_hub_routes={is_traders_hub_routes} />
        ) : (
            <LoggedOutPreloader is_mobile={is_mobile} />
        )}
    </ContentLoader>
);

const LoggedOutPreloader = ({ is_mobile }: Pick<TAccountsInfoLoaderWallets, 'is_mobile'>) => (
    <React.Fragment>
        <rect x={is_mobile ? 0 : 172} y='8' rx='4' ry='4' width='66' height='30' />
        <rect x={is_mobile ? 74 : 254} y='8' rx='4' ry='4' width='80' height='30' />
    </React.Fragment>
);

const LoggedInPreloader = ({
    is_mobile,
    is_traders_hub_routes,
}: Pick<TAccountsInfoLoaderWallets, 'is_mobile' | 'is_traders_hub_routes'>) =>
    is_mobile ? (
        <React.Fragment>
            {!is_traders_hub_routes && (
                <React.Fragment>
                    <circle cx='13' cy='22' r='13' />
                    <rect x='34' y='19' rx='4' ry='4' width='76' height='7' />
                    <rect x='118' y='8' rx='4' ry='4' width='1' height='30' />
                </React.Fragment>
            )}
            {is_traders_hub_routes && <circle cx='106' cy='22' r='13' />}
            <circle cx='140' cy='22' r='13' />
        </React.Fragment>
    ) : (
        <React.Fragment>
            {!is_traders_hub_routes && (
                <React.Fragment>
                    <rect x='0' y='8' rx='4' ry='4' width='82' height='32' />
                    <rect x='98' y='8' rx='4' ry='4' width='1' height='30' />
                    <circle cx='128' cy='24' r='13' />
                    <rect x='157' y='20' rx='4' ry='4' width='76' height='7' />
                    <rect x='249' y='8' rx='4' ry='4' width='1' height='30' />
                </React.Fragment>
            )}
            {is_traders_hub_routes && <circle cx='237' cy='22' r='13' />}
            <circle cx='279' cy='22' r='13' />
            <circle cx='321' cy='22' r='13' />
        </React.Fragment>
    );

export default AccountsInfoLoaderWallets;
