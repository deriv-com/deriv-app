import React from 'react';
import LaunchModalChartImageDark from 'Assets/SvgComponents/launch/ic-chart-launch-dark.svg';
import LaunchModalChartImage from 'Assets/SvgComponents/launch/ic-chart-launch.svg';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalInfo = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className='modal-content' data-testid='launch-modal'>
            {isDarkMode ? (
                <LaunchModalChartImageDark className='chart-image' />
            ) : (
                <LaunchModalChartImage className='chart-image' />
            )}
            <Text as='h1' weight='bold' align='center' size='sm'>
                <Localize i18n_default_text='Deriv Trader Chart v2.0.' />
            </Text>
            <Text as='p' align='center'>
                <Localize i18n_default_text='Smoother charts. Smarter insights.' />
            </Text>
        </div>
    );
};

export default LaunchModalInfo;
