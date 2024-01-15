// TODO: Add logic to switch between EU and non-EU
import React from 'react';
import { Tab } from '@deriv/quill-design';
import InfoIcon from '../../public/images/ic-info-outline.svg';

const RegulationSwitcherMobile = () => {
    const activeClassName =
        'aria-selected:font-bold active:font-bold aria-selected:border-b-brand-coral active:border-b-brand-coral';
    return (
        <div className='flex items-center gap-400'>
            <InfoIcon className='h-auto w-800' />
            <Tab.Container size='sm'>
                <Tab.List>
                    <Tab.Trigger className={activeClassName}>Non - EU</Tab.Trigger>
                    <Tab.Trigger className={activeClassName}>EU</Tab.Trigger>
                </Tab.List>
            </Tab.Container>
        </div>
    );
};

export default RegulationSwitcherMobile;
