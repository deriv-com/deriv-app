import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const VideoFacility = () => {
    const support_link = '<a href=\'mailto:%\' rel=\'nofollow\'>%</a>'.replace(new RegExp('%', 'g'), 'authentications@binary.com');

    return (
        <React.Fragment>
            <div className='static_full'>
                <h1>{it.L('Video Room Facility')}</h1>

                <div id='loading'><Loading /></div>

                <div className='gr-padding-10' id='facility_content'>
                    <div className='invisible msg_authenticate'>
                        <p>{it.L('Authenticate your account by video conference call. Follow these steps to proceed:')}</p>
                        <ol>
                            <li>{it.L('[_1]Contact us[_2] to arrange a date and time for the video call.', `<a href="${it.url_for('contact')}">`, '</a>')}</li>
                            <li>{it.L('You will be asked to prove that you are the owner of the account being authenticated.')}</li>
                            <li>{it.L('Provide the customer support agent with the four-digit verification code below for confirmation.')}</li>
                            <li>{it.L('Display your proof of identity when prompted.')}</li>
                            <li>{it.L('Display your proof of address when prompted.')}</li>
                            <li>{it.L('Please wait for confirmation. Our customer support team will get back to you regarding your account status via email within four hours.')}</li>
                        </ol>
                    </div>

                    <div className='gr-padding-20 fill-bg-color center-text invisible'>
                        <span className='gr-gutter-right'>{it.L('Generated verification code:')}</span>
                        <strong id='generated_token' />
                    </div>

                    <div className='invisible msg_authenticate'>
                        <p><strong>{it.L('Important')}</strong></p>
                        <ul className='checked'>
                            <li>{it.L('Your webcam and microphone must be in good working condition')}</li>
                            <li>{it.L('Ensure that your original documents are ready when the video call starts')}</li>
                            <li>{it.L('You must have a fast and stable Internet connection as screenshots of your documents are required for our records')}</li>
                            <li className='invisible' id='not_authenticated'>{it.L('If your documents cannot be verified over video call for any reason, you will be required to send your documents to [_1]', support_link)}</li>
                        </ul>
                    </div>

                    <p className='center-text notice-msg invisible' id='error_message' />
                </div>
            </div>
        </React.Fragment>
    );
};

export default VideoFacility;
