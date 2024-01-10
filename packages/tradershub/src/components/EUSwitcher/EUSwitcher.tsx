import React from 'react';
import { Tab } from '@deriv/quill-design';
import InfoIcon from '../../public/images/ic-info-outline.svg';

const EUSwitcher = () => (
    <div className='flex items-center gap-400'>
        <InfoIcon className='h-auto w-800' />
        <Tab.Container size='sm'>
            <Tab.List>
                <Tab.Trigger className='aria-selected:border-b-brand-coral active:border-b-brand-coral'>
                    Non - EU
                </Tab.Trigger>
                <Tab.Trigger className='aria-selected:border-b-brand-coral active:border-b-brand-coral'>EU</Tab.Trigger>
            </Tab.List>
        </Tab.Container>
    </div>
);

export default EUSwitcher;
