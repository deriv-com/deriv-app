import classnames from 'classnames';
import React from 'React';
import Proptypes from 'prop-types';
import { translate } from '../utils/tools';

const DateItem = ({
    date, time
}) => {
    return (
        <div>
            <span> {date} </span>
            <span> {time} </span>
        </div>
    )
}

const MessageItem = ({
    text
}) => {
    return (
        <div>
            <span> {text} </span>
        </div>
    )
}

const Journal = ({
    messages,
}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th> {translate('Date')} </th>
                    <th> {translate('Message')} </th>
                </tr>
            </thead>
            <tbody>
                {
                    messages.map((item) => {
                        const { date , time , text } = item;
                        const dateEl = DateItem({date , time})
                        const messageEl = MessageItem({text})

                        return (
                            <tr>
                                <td>{dateEl}</td>
                                <td>{messageEl}</td>
                            </tr>)
                    })
                }
            </tbody>
        </table>
    );
};
Journal.Proptypes = {
    messages : proptypes.array
}

export default connect (({journal}) => ({
    messages: journal.messages
}))(Journal)