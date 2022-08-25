import React from 'react';
import Content from './Content';

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
