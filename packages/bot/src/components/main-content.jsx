import React from 'react';
import Flyout from './flyout.jsx';
import Chart from './chart/chart.jsx';
import { tabs_title } from '../constants/bot-contents';
import { connect } from '../stores/connect';
import '../assets/sass/main-content.scss';
import '../assets/sass/scratch/workspace.scss';
import '../assets/sass/scratch/toolbox.scss';

class MainContent extends React.Component {
    componentDidMount() {
        if (this.props.active_tab === tabs_title.WORKSPACE) {
            this.props.componentDidUpdate();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.active_tab !== prevProps.active_tab) {
            this.props.componentDidUpdate();
        }
    }

    render() {
        const { active_tab, width } = this.props;
        switch (active_tab) {
            case (tabs_title.WORKSPACE):
            default:
                return (
                    <div id='scratch_div'>
                        <Flyout />
                    </div>
                );
            case (tabs_title.CHART): {
              
                return (
                    <div
                        className='bot__chart-container'
                        style={{
                            width,
                            height: 'calc(100vh - (var(--header-footer-height) * 1px))',
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
    active_tab        : main_content.active_tab,
    componentDidUpdate: main_content.componentDidUpdate,
    width             : main_content.width,
}))(MainContent);

