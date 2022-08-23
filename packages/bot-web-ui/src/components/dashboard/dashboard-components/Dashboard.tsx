import React from 'react';
import Content from './Content';
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';

interface DashboardProps {
    checkIfSidebarOpen: boolean;
    setSideBarState: (state: boolean) => void;
}

const Dashboard = (props: DashboardProps) => {
    return (
        <div>
            <Content />
        </div>
    );
};

export default Dashboard;
