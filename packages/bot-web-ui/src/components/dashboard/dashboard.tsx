import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import QStrategy from 'Components/dashboard/quick-strategy';

const Dashboard: React.FC = () => {
    //! later change to '0'
    const [active_index, setActiveTabIndex] = React.useState(1);

    return (
        <div className='dashboard__container'>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                {/* [Todo] needs to update tabs component children instead of using label property */}
                <div label={localize('Dashboard')}>
                    <div>
                        <h1>Create or start a bot</h1>
                    </div>
                </div>
                <div label='Quick Strategy'>
                    <QStrategy />
                </div>
                <div label='Bot Builder'>
                    <div>Contennt 3</div>
                </div>
                <div label='Tutorial'>
                    <div>Contennt 4</div>
                </div>
            </Tabs>
        </div>
    );
};

export default Dashboard;
