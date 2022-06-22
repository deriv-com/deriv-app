import React from 'react';
import { TDateItemProps } from '../journal.types';

export const DateItem = ({ date, time }: TDateItemProps) => (
    <>
        <span className='journal__text-date'>{date}</span> | <span className='journal__text-time'>{time}</span>
    </>
);
