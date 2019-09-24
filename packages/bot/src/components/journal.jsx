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

const MessageItem = ({
    message,
}) => {
    return (
        <div>
            <span> {message} </span>
        </div>
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
