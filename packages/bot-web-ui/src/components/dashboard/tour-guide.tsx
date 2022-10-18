import React from 'react';
import { Text } from '@deriv/components';
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
        setTimeout(() => {
            setActiveTab(setJoyrideStepIndex);
        }, 50);
    }, [setJoyrideStepIndex]);
    return (
        <React.Fragment>
            <div style={{ textAlign: 'left', marginBottom: '2.4rem' }}>
                <Text as='h' align='left' size='s' line_height='l' weight='bold' className='intial_bot_tour'>
                    {Label}
                </Text>
            </div>

            {img && (
                <div className={className}>
                    <img src={window.location.origin + img} />
                </div>
            )}

            <div style={{ textAlign: 'left' }}>
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
