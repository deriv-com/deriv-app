import proptypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect } from '../stores/connect';
import { translate } from '../utils/tools';

const DateItem = ({
    date, time,
}) => {
    return (
        <div>
            <span> {date} </span>
            <span> {time} </span>
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
            autoHeightMax={450} // As specified by design spec
        >
            <table className='journal__table'>
                <thead>
                    <tr>
                        <th> {translate('Date')} </th>
                        <th> {translate('Message')} </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        messages.map((item, index) => {
                            const { date, time, message } = item;
                            const dateEl = DateItem({ date, time });
                            const messageEl = MessageItem({ message });

                            return (
                                <tr key={`${item.date}-${index}`}>
                                    <td>{dateEl}</td>
                                    <td>{messageEl}</td>
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
