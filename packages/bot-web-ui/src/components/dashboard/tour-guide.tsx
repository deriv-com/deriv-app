import React from 'react';
import { localize } from '@deriv/translations';
import { storeSetting, getSetting } from '../../utils/settings';
import { Text } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TTourGuide = {
    Label: string | boolean;
    Content: string[];
    img?: string;
    className: string;
    setJoyrideStepIndex: number;
    setActiveTab: (param: number) => void;
};

const TourGuide = ({ Label, Content, img, className, setJoyrideStepIndex, setActiveTab }: TTourGuide) => {
    React.useEffect(() => {
        setActiveTab(setJoyrideStepIndex);
    }, [setJoyrideStepIndex]);
    return (
        <React.Fragment>
            <div>
                <Text as='h' align='left' size='s' line_height='l' weight='bold' className='intial_bot_tour'>
                    {Label}
                </Text>
            </div>

            {img && (
                <div className={className}>
                    <img src={window.location.origin + img} />
                </div>
            )}

            <div>
                <Text
                    as='h'
                    align='left'
                    size='xs'
                    line_height='l'
                    className='load-strategy__google-drive-text-content'
                >
                    {Content}
                </Text>
            </div>
        </React.Fragment>
    );
};
export default connect(({ dashboard }: any) => ({
    setActiveTab: dashboard.setActiveTab,
    active_tab: dashboard.active_tab,
}))(TourGuide);
