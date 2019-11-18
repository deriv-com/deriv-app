import ContentLoader from 'react-content-loader';
import React         from 'react';
import PropTypes     from 'prop-types';

const AccountsInfoLoader = ({ is_logged_in, speed }) => (
    <ContentLoader
        height={46}
        width={350}
        speed={speed}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
    >
        {is_logged_in ?
            <React.Fragment>
                <circle cx='14' cy='22' r='12' />
                <circle cx='58' cy='22' r='12' />
                <rect x='150' y='20' rx='0' ry='0' width='76' height='7' />
                <circle cx='118' cy='24' r='13' />
                <rect x='87' y='8' rx='0' ry='0' width='1' height='30' />
                <rect x='250' y='8' rx='0' ry='0' width='82' height='32' />
            </React.Fragment>
            :
            <React.Fragment>
                <rect x='166' y='8' rx='0' ry='0' width='66' height='32' />
                <rect x='250' y='8' rx='0' ry='0' width='80' height='32' />
            </React.Fragment>
        }
    </ContentLoader>
);

AccountsInfoLoader.propTypes = {
    speed: PropTypes.number,
};

export default AccountsInfoLoader;
