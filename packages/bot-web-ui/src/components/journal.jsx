import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox, Icon, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { message_types } from '@deriv/bot-skeleton';
import { connect } from '../stores/connect';
import '../assets/sass/journal.scss';

const DateItem = ({ date, time }) => {
    return (
        <>
            <span className='journal__text-date'> {date} </span> |<span className='journal__text-time'> {time} </span>
        </>
    );
};

const FormatMessage = ({ message }) => {
    if (typeof message !== 'string' || !message.includes(':')) {
        return <div className='journal__text'>{message}</div>;
    }

    const messages = message.split(':');

    const title = messages[0];
    const value = messages.slice(1).join(':');

    let title_color, value_color;

    switch (title) {
        case 'Bought': {
            title_color = 'info';
            break;
        }
        case 'Sold': {
            title_color = 'error';
            break;
        }
        case 'Profit amount': {
            value_color = 'success';
            break;
        }
        case 'Loss amount': {
            value_color = 'error';
            break;
        }
        default: {
            title_color = value_color = undefined;
        }
    }

    return (
        <div className='journal__text-row'>
            <div
                className={classnames('journal__text', {
                    [`journal__text--bold journal__text--${title_color}`]: title_color,
                })}
            >
                {title}
            </div>
            <span>:</span>
            <div className={classnames('journal__text', { [`journal__text--${value_color}`]: value_color })}>
                {value}
            </div>
        </div>
    );
};

const Tools = ({ checked_filters, filters, filterMessage }) => (
    <div className='journal-tools__container'>
        <div className='journal-tools__container-filter'>
            {filters.map(item => {
                return (
                    <Checkbox
                        key={item.id}
                        classNameLabel='journal-tools__text'
                        defaultChecked={checked_filters.includes(item.id)}
                        label={item.label}
                        onChange={e => filterMessage(e.target.checked, item.id)}
                    />
                );
            })}
        </div>
        {/* <div className='tools__container-download'>
            <Icon icon='IcDownload' />
        </div> */}
    </div>
);

const getJournalItemContent = (message, type, className) => {
    switch (type) {
        case message_types.SUCCESS: {
            return <FormatMessage message={message} />;
        }
        case message_types.NOTIFY: {
            return <div className={classnames('journal__text', className)}>{message}</div>;
        }
        case message_types.ERROR: {
            return <div className='journal__text--error journal__text'>{message}</div>;
        }
        case message_types.COMPONENT: {
            return <>{message}</>;
        }
        default:
            return <></>;
    }
};

const Journal = ({ filtered_messages, ...props }) => {
    return (
        <div className='journal run-panel-tab__content'>
            <Tools {...props} />
            <ThemedScrollbars autoHide style={{ height: 'calc(100% - 42px)' }}>
                <div className='journal__item-list'>
                    {filtered_messages.length ? (
                        filtered_messages.map((item, index) => {
                            const { date, time, message, message_type, className } = item;
                            const date_el = DateItem({ date, time });

                            return (
                                <div className='journal__item' key={`${date}${time}__${index}`}>
                                    <div className='journal__item-content'>
                                        {getJournalItemContent(message, message_type, className)}
                                    </div>
                                    <div className='journal__text-datetime'>{date_el}</div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='journal-empty__container'>
                            <div className='journal-empty'>
                                <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                <h4 className='journal-empty__header'>
                                    {localize('There are no messages to display')}
                                </h4>
                                <div className='journal-empty__message'>
                                    <span>{localize('Here are the possible reasons:')}</span>
                                    <ul className='journal-empty__list'>
                                        <li>{localize('The bot is not running')}</li>
                                        <li>{localize('The stats are cleared')}</li>
                                        <li>{localize('All messages are filtered out')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ThemedScrollbars>
        </div>
    );
};

Journal.propTypes = {
    checked_filters: PropTypes.array,
    filtered_messages: PropTypes.array,
    filterMessage: PropTypes.func,
    filters: PropTypes.array,
};

export default connect(({ journal }) => ({
    checked_filters: journal.checked_filters,
    filterMessage: journal.filterMessage,
    filters: journal.filters,
    filtered_messages: journal.filtered_messages,
}))(Journal);
