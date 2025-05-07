import React from 'react';
import ContentLoader from 'react-content-loader';

type TAccountsInfoLoaderWallets = {
    is_mobile: boolean;
    is_logged_in: boolean;
    speed: number;
};

const AccountsInfoLoaderWallets = ({ is_mobile, is_logged_in, speed }: TAccountsInfoLoaderWallets) => (
    <ContentLoader
        height={is_mobile ? 42 : 46}
        width={is_mobile ? 216 : 450}
        speed={speed}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        {is_logged_in ? <LoggedInPreloader is_mobile={is_mobile} /> : <LoggedOutPreloader is_mobile={is_mobile} />}
    </ContentLoader>
);

const LoggedOutPreloader = ({ is_mobile }: Pick<TAccountsInfoLoaderWallets, 'is_mobile'>) => (
    <React.Fragment>
        <rect x={is_mobile ? 42 : 166} y='8' rx='4' ry='4' width='66' height='32' />
        <rect x={is_mobile ? 120 : 250} y='8' rx='4' ry='4' width='80' height='32' />
    </React.Fragment>
);

const LoggedInPreloader = ({ is_mobile }: Pick<TAccountsInfoLoaderWallets, 'is_mobile'>) =>
    is_mobile ? (
        <React.Fragment>
            <circle cx='97' cy='22' r='13' />
            <circle cx='59' cy='22' r='13' />
        </React.Fragment>
    ) : (
        <React.Fragment>
            <circle cx='14' cy='22' r='12' />
            <circle cx='58' cy='22' r='12' />
            <circle cx='118' cy='22' r='11' />
        </React.Fragment>
    );

export default AccountsInfoLoaderWallets;
