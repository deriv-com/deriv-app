import React from 'react';
import HeaderItemsLoader from 'App/Components/Layout/Header/Components/Preloader/header-items';

const DashboardHeaderPreloader = () => (
    <div className={'dashboard-header__preloader'}>
        <HeaderItemsLoader speed={3} />
    </div>
);

export default DashboardHeaderPreloader;
