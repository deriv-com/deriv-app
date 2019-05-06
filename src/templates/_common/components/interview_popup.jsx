import React from 'react';
import HTMLComment from './html_comment.jsx';

const InterviewPopup = () => (
    <div id='interview_popup_container' className='invisible'>
        <HTMLComment>googleoff: all</HTMLComment>{/* https://support.google.com/gsa/answer/6329153?hl=en#82542 */}
        <div className='popup'>
            <div className='popup__head'>
                <div className='header-1'>{it.L('Can you spare 15 minutes?')}</div>
            </div>
            <div className='popup__body'>
                <div className='header-2'>{it.L('We\'d love to hear what you think.')}</div>
                <p>
                    {it.L('We\'re looking to improve our products and services, and we want to understand your needs better. We\'d like to interview you via phone, to know what you like about us, what you don\'t like, and where we can do better.')}
                </p>
                <div className='popup__options'>
                    <div className='popup__secondary_options'>
                        <a id='interview_no_thanks'>{it.L('No thanks')}</a>
                        <span className='popup__separator' />
                        <a id='interview_ask_later'>{it.L('Ask me later')}</a>
                    </div>
                    <a id='interview_interested' className='button'>
                        <span>{it.L('I\'m interested')}</span>
                    </a>
                </div>
            </div>
        </div>
        <HTMLComment>googleon: all</HTMLComment>
    </div>
);

export default InterviewPopup;
