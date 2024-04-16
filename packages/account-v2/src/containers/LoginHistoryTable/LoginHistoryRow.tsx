import React from 'react';

type TRenderLoginHistoryRowProps = {
    action: string;
    browser: string;
    date: string;
    ip: string;
    status: string;
};

export const LoginHistoryRow = ({ action, browser, date, ip, status }: TRenderLoginHistoryRowProps) => (
    <div className='grid grid-flow-col text-default'>
        <span>{date}</span>
        <span>{action}</span>
        <span>{browser}</span>
        <span>{ip}</span>
        <span>{status}</span>
    </div>
);
