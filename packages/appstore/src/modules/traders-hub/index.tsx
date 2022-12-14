import React from 'react';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import './traders-hub.scss';

const TradersHub = () => {
    return (
        <div id='traders-hub' className='traders-hub'>
            <MainTitleBar />
            <div className='traders-hub__main-container'>
                <OptionsAndMultipliersListing />
                <CFDsListing />
            </div>
            <ModalManager />
        </div>
    );
};

export default TradersHub;
