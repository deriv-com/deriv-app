import classnames     from 'classnames';
import proptypes      from 'prop-types';
import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect }    from '../stores/connect';
import { translate }  from '../utils/tools';
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
    const keyWords = ['Bought', 'Sold' , 'Profit amount', 'Loss amount'];
    const messages = message.split(':');
    if (messages.count < 2) {
        return message;
    }

    let title_color,
        value_color;
    
    switch (messages[0]) {
        case (keyWords[0]) :{
        // Bought
            title_color = 'blue';
            break;
        }
        case (keyWords[1]): {
        // Sold
            title_color = 'red';
            break;
        }
        case (keyWords[2]): {
        // Profit amount
            value_color = 'green';
            break;
        }
        case (keyWords[3]): {
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
            <span className= {classnames(
                { [`journal__table--bold journal__table--${title_color}`]: title_color })}
            >
                {messages[0]}
            </span>
            <span>:</span>
            <span className={classnames(
                { [`journal__table--bold journal__table--${value_color}`]: value_color })}
            >
                {messages[1]}
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
        <Scrollbars
            className='journal'
            autoHeight
            autoHide
            autoHeightMax={400} // As specified by design spec
        >
            <table className='journal__table'>
                <thead className='journal__table--header'>
                    <tr>
                        <th className='journal__table--th'> {translate('Date')} </th>
                        <th className='journal__table--th'> {translate('Message')} </th>
                    </tr>
                </thead>
                <tbody className='journal__table--body'>
                    {
                        messages.map((item, index) => {
                            const { date, time, message } = item;
                            const dateEl = DateItem({ date, time });
                            const messageEl = MessageItem({ message });

                            return (
                                <tr className='journal__table--tr' key={`${item.date}-${index}`}>
                                    <td className='journal__table--td'>{dateEl}</td>
                                    <td className='journal__table--td'>{messageEl}</td>
                                </tr>);
                        })
                    }
                </tbody>
            </table>
        </Scrollbars>
    );
};
Journal.Proptypes = {
    messages: proptypes.array,
};

export default connect(({ journal }) => ({
    messages: journal.messages,
}))(Journal);
