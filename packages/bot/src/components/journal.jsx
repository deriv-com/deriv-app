import classnames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import { ThemedScrollbars } from 'deriv-components';
import { localize }         from 'deriv-translations';
import { message_types }    from '../constants/messages';
import { connect }          from '../stores/connect';
import '../assets/sass/journal.scss';

const DateItem = ({
    date, time,
}) => {
    return (
        <div>
            <span className='journal__table--date'> {date} </span>
            <span className='journal__table--time'> {time} </span>
        </div>
    );
};

const FormatMessage = ({
    message,
}) => {
    if (typeof message !== 'string') {
        return message;
    }

    const key_words = ['Bought', 'Sold', 'Profit amount', 'Loss amount'];
    const messages = message.split(':');

    if (messages.length < 2) {
        return message;
    }

    const title = messages[0];
    const value = messages.slice(1).join(':');

    let title_color,
        value_color;

    switch (title) {
        case (key_words[0]): {
            // Bought
            title_color = 'blue';
            break;
        }
        case (key_words[1]): {
            // Sold
            title_color = 'red';
            break;
        }
        case (key_words[2]): {
            // Profit amount
            value_color = 'green';
            break;
        }
        case (key_words[3]): {
            // Loss amount
            value_color = 'red';
            break;
        }
        default: {
            title_color = value_color = undefined;
        }
    }

    return (
        <p>
            <span className={classnames(
                { [`journal__table--bold journal__table--${title_color}`]: title_color })}
            >
                {title}
            </span>
            <span>:</span>
            <span className={classnames(
                { [`journal__table--bold journal__table--${value_color}`]: value_color })}
            >
                {value}
            </span>
        </p>
    );
};

const MessageItem = ({
    message,
}) => {
    return (
        <FormatMessage message={message} />
    );
};

const Journal = ({
    messages,
}) => {
    return (
        <ThemedScrollbars
            className='journal'
            autoHide
            style={{ height: 'calc(100vh - 324px)' }}
        >
            <table className='journal__table'>
                <thead className='journal__table--header'>
                    <tr>
                        <th className='journal__table--th'>{localize('Date')}</th>
                        <th className='journal__table--th'>{localize('Message')}</th>
                    </tr>
                </thead>
                <tbody className='journal__table--body'>
                    {
                        messages.map((item, index) => {
                            const { date, time, message, message_type } = item;
                            const date_el = DateItem({ date, time });
                            const message_el = MessageItem({ message });

                            return (
                                <tr className='journal__table--tr' key={`${item.date}-${index}`}>
                                    <td className='journal__table--td'>{date_el}</td>
                                    <td className={classnames(
                                        'journal__table--td',
                                        { 'journal__table--red': message_type === message_types.ERROR })}
                                    >{message_el}
                                    </td>
                                </tr>);
                        })
                    }
                </tbody>
            </table>
        </ThemedScrollbars>
    );
};

Journal.propTypes = {
    messages: PropTypes.array,
};

export default connect(({ journal }) => ({
    messages: journal.messages,
}))(Journal);
