import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const TradeParamsLoader = ({ speed }) => (
    <>
        <MobileWrapper>
            <ContentLoader
                height={214}
                width={344}
                speed={speed}
                backgroundColor={'var(--general-section-1)'}
                foregroundColor={'var(--general-hover)'}
                viewBox='0 0 344 176'
            >
                <rect x='148' y='24' rx='3' ry='3' width='40' height='4' />
                <rect x='8' y='40' rx='4' ry='4' width='328' height='40' />
                <rect x='8' y='88' rx='4' ry='4' width='328' height='40' />
                <rect x='8' y='136' rx='4' ry='4' width='160' height='70' />
                <rect x='176' y='136' rx='4' ry='4' width='160' height='70' />
            </ContentLoader>
        </MobileWrapper>
        <DesktopWrapper>
            <ContentLoader
                height={548}
                width={240}
                speed={speed}
                backgroundColor={'var(--general-section-1)'}
                foregroundColor={'var(--general-hover)'}
            >
                <rect x='0' y='0' rx='4' ry='4' width='240' height='76' />
                <rect x='0' y='84' rx='4' ry='4' width='240' height='132' />
                <rect x='0' y='224' rx='4' ry='4' width='240' height='120' />
                <rect x='0' y='352' rx='4' ry='4' width='240' height='194' />
            </ContentLoader>
        </DesktopWrapper>
    </>
);

TradeParamsLoader.propTypes = {
    speed: PropTypes.number,
};

export { TradeParamsLoader };
