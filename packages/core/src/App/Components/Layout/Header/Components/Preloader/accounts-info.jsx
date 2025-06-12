import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';

const AccountsInfoLoader = ({ is_desktop, is_logged_in, is_traders_hub_routes, speed }) => (
    <ContentLoader
        height={is_desktop ? 47 : 39}
        width={is_desktop ? 350 : 161}
        speed={speed}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        {is_logged_in ? (
            <LoggedInPreloader is_desktop={is_desktop} is_traders_hub_routes={is_traders_hub_routes} />
        ) : (
            <LoggedOutPreloader is_desktop={is_desktop} />
        )}
    </ContentLoader>
);

const LoggedOutPreloader = ({ is_desktop }) => (
    <React.Fragment>
        <rect x={is_desktop ? 172 : 0} y='8' rx='4' ry='4' width='66' height='30' />
        <rect x={is_desktop ? 254 : 74} y='8' rx='4' ry='4' width='80' height='30' />
    </React.Fragment>
);

const LoggedInPreloader = ({ is_desktop, is_traders_hub_routes }) => (
    <>
        {is_desktop ? (
            <React.Fragment>
                {!is_traders_hub_routes && (
                    <React.Fragment>
                        <rect x='0' y='6' rx='4' ry='4' width='82' height='32' />
                        <rect x='98' y='6' rx='4' ry='4' width='1' height='30' />
                        <circle cx='128' cy='22' r='13' />
                        <rect x='157' y='18' rx='4' ry='4' width='76' height='7' />
                        <rect x='249' y='6' rx='4' ry='4' width='1' height='30' />
                    </React.Fragment>
                )}
                <circle cx='279' cy='20' r='13' />
                <circle cx='321' cy='20' r='13' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                {!is_traders_hub_routes && (
                    <React.Fragment>
                        <circle cx='13' cy='20' r='13' />
                        <rect x='34' y='17' rx='4' ry='4' width='76' height='7' />
                        <rect x='118' y='6' rx='4' ry='4' width='1' height='30' />
                    </React.Fragment>
                )}
                <circle cx='140' cy='20' r='13' />
            </React.Fragment>
        )}
    </>
);

AccountsInfoLoader.propTypes = {
    speed: PropTypes.number,
    is_desktop: PropTypes.bool,
    is_logged_in: PropTypes.bool,
};

export { AccountsInfoLoader };
