import React from 'react';
import { Text } from '@deriv/components';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TTourGuide = {
    label: string | boolean;
    content: string[];
    img?: string;
    className: string;
    dashboardTabIndex: number;
    setActiveTab: (param: number) => void;
};

const TourGuide = ({ label, content, img, className, dashboardTabIndex, setActiveTab }: TTourGuide) => {
    React.useEffect(() => {
        setTimeout(() => {
            setActiveTab(dashboardTabIndex);
        }, 50);
    }, [dashboardTabIndex]);
    return (
        <React.Fragment>
            <div>
                <Text as='h' line_height='l' weight='bold' className='intial_bot_tour'>
                    {label}
                </Text>
            </div>

            {img && (
                <div className={className}>
                    <img src={window.location.origin + img} />
                </div>
            )}

            <div>
                <Text as='h' size='xs' line_height='l' className='load-strategy__google-drive-text-content'>
                    {content}
                </Text>
            </div>
        </React.Fragment>
    );
};
export default connect(({ dashboard }: RootStore) => ({
    setActiveTab: dashboard.setActiveTab,
    active_tab: dashboard.active_tab,
}))(TourGuide);
