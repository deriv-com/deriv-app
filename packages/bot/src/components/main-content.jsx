import React                from 'react';
import Flyout               from './flyout.jsx';
import Chart                from './chart/chart.jsx';
import NotificationMessages from './notification-messages.jsx';
import { tabs_title }       from '../constants/bot-contents';
import { connect }          from '../stores/connect';
import '../assets/sass/main-content.scss';
import '../assets/sass/scratch/workspace.scss';
import '../assets/sass/scratch/toolbox.scss';

class MainContent extends React.Component {
    render() {
        const { active_tab, width } = this.props;
        switch (active_tab) {
            case (tabs_title.WORKSPACE):
            default:
                return (
                    <div
                        id='scratch_div'
                        style={{
                            width,
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <NotificationMessages />
                        <Flyout />
                    </div>
                );
            case (tabs_title.CHART): {

                return (
                    <div
                        className='bot__chart-container'
                        style={{
                            width,
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <Chart />
                    </div>
                );
            }

        }
    }
}
export default connect(({ main_content }) => ({
    active_tab: main_content.active_tab,
    width     : main_content.width,
}))(MainContent);

