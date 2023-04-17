import React from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { message_types } from '@deriv/bot-skeleton';
import { useNewRowTransition } from '@deriv/shared';
import { TJournalItemExtra, TJournalItemProps } from '../journal.types';
import { DateItem, FormatMessage } from '.';

const getJournalItemContent = (
    message: string | ((value: () => void) => string),
    type: string,
    className: string,
    extra: TJournalItemExtra,
    measure: () => void
) => {
    switch (type) {
        case message_types.SUCCESS: {
            return <FormatMessage logType={message as string} extra={extra} className={className} />;
        }
        case message_types.NOTIFY: {
            if (typeof message === 'function') {
                return <div className={classnames('journal__text', className)}>{message(measure)}</div>;
            }
            return <div className={classnames('journal__text', className)}>{message}</div>;
        }
        case message_types.ERROR: {
            return <div className='journal__text--error journal__text'>{message as string}</div>;
        }
        default:
            return null;
    }
};

const JournalItem = ({ row, is_new_row, measure }: TJournalItemProps) => {
    const { in_prop } = useNewRowTransition(is_new_row);
    const { date, time, message, message_type, className, extra } = row;
    const date_el = DateItem({ date, time });

    return (
        <CSSTransition in={in_prop} timeout={500} classNames='list__animation'>
            <div className='journal__item'>
                <div className='journal__item-content'>
                    {getJournalItemContent(message, message_type, className, extra as TJournalItemExtra, measure)}
                </div>
                <div className='journal__text-datetime'>{date_el}</div>
            </div>
        </CSSTransition>
    );
};

export default JournalItem;
