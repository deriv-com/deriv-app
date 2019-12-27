import classnames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Checkbox,
    Icon,
    Popover,
    ThemedScrollbars,
}                           from 'deriv-components';
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

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_open: false,
            checked      : this.props.defaultChecked,
        };
    }

    onChange(checked, item_id, onChange) {
        const checked_items = this.state.checked;
        if (checked) {
            checked_items.push(item_id);
        } else {
            checked_items.splice(checked_items.indexOf(item_id), 1);
        }

        this.setState({ checked: checked_items });

        onChange(this.state.checked);
    }

    render() {
        return (
            <div className='filter__container'>
                <Popover
                    alignment='bottom'
                    message={localize('Filter')}
                >
                    <Icon
                        icon='IcTrade'
                        className='filter__icon'
                        onClick={() => this.setState({ dropdown_open: !this.state.dropdown_open })}
                    />
                </Popover>
                <div className={classnames(
                    'filter__dropdown',
                    { 'filter__dropdown--active': this.state.dropdown_open },
                )}
                >
                    {
                        this.props.items.map(item => {
                            return (
                                <Checkbox
                                    key={item.id}
                                    className='filter__dropdown-item'
                                    classNameLabel='filter__dropdown-text'
                                    defaultChecked={this.state.checked.indexOf(item.id) >= 0}
                                    label={item.label}
                                    onChange={e => this.onChange(e.target.checked, item.id, item.onChange)}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

const Journal = ({
    checked_filter,
    messages,
    filter_list,
}) => {
    return (
        <ThemedScrollbars
            className='journal'
            autoHide
            style={{ height: 'calc(var(--drawer-scroll-height) + 41px)' }}
        >
            <table className='journal__table'>
                <thead className='journal__table--header'>
                    <tr>
                        <th className='journal__table--th'>{localize('Date')}</th>
                        <th className='journal__table--th journal__table--th-icon'>
                            <div>{localize('Message')}</div>
                            <Filter items={filter_list} defaultChecked={checked_filter} />
                        </th>
                    </tr>
                </thead>
                <tbody className='journal__table--body'>
                    {
                        messages.length ?
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
                            :
                            <tr className='journal-empty__container'>
                                <td className='journal-empty'>
                                    <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                    <div className='journal-empty__content'>
                                        <h4 className='journal-empty__header'>
                                            {localize('No messages')}
                                        </h4>
                                        <span className='journal-empty__message'>
                                            {localize('You have not run the bot yet')}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </ThemedScrollbars>
    );
};

Journal.propTypes = {
    checked_filter: PropTypes.array,
    filter_list   : PropTypes.array,
    messages      : PropTypes.array,
};

export default connect(({ journal }) => ({
    checked_filter: journal.checked_filter,
    filter_list   : journal.filter_list,
    messages      : journal.messages,
}))(Journal);
