import React from 'react';
import { observer } from '@deriv/stores';
import { BOT_BUILDER_TOUR } from '../config';
import ReactJoyrideWrapper from './common/react-joyride-wrapper';

const BotBuilderTour = observer(() => {
    const [is_tour_running] = React.useState<boolean>(true);

    return (
        <ReactJoyrideWrapper
            steps={BOT_BUILDER_TOUR}
            run={is_tour_running}
            showProgress
            styles={{
                options: {
                    arrowColor: 'transparent',
                    backgroundColor: 'var(--general-main-2)',
                    primaryColor: 'var(--brand-red-coral)',
                    textColor: 'var(--text-general)',
                },
            }}
        />
    );
});

export default BotBuilderTour;
