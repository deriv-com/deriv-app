import React from 'react';

const CurrencySwitcherLoader = () => (
    <div className='flex items-center justify-between border-solid gap-800 h-3600 p-800 rounded-400 border-sm border-system-light-active-background w-full lg:w-auto'>
        <div className='rounded-full animate-pulse bg-solid-slate-100 w-2000 h-2000 rounded-1500' />
        <div className='grow space-y-500'>
            <div className='animate-pulse bg-solid-slate-100 w-2500 h-500 rounded-200' />
            <div className='animate-pulse bg-solid-slate-100 w-5000 h-500 rounded-200' />
        </div>
    </div>
);

export default CurrencySwitcherLoader;
