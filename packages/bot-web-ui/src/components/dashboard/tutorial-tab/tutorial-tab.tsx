import React from 'react';
import { observer, useStore } from '@deriv/stores';
import TutorialsTabMobile from './tutorials-tab-mobile';
import TutorialsTabDesktop from './tutorials-tab-desktop';

const TutorialsTab = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return is_mobile ? <TutorialsTabMobile /> : <TutorialsTabDesktop />;
});

export default TutorialsTab;
