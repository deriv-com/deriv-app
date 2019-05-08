import React from 'react';

const AuthenticateMessageFinancial = () => (
    <p>{it.L('As an EU resident, you are also required to verify the above documents by [_1]video call[_2].', `<a href="${it.url_for('user/video-facility')}">`, '</a>')}</p>
);

export default AuthenticateMessageFinancial;
