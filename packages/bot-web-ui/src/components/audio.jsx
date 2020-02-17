import React from 'react';

const Audio = () => (
    <>
        <audio id='announcement' src={`${__webpack_public_path__}media/announcement.ogg`} autostart='false' />
        <audio id='earned-money' src={`${__webpack_public_path__}media/coins.ogg`} autostart='false' />
        <audio id='job-done' src={`${__webpack_public_path__}media/job-done.ogg`} autostart='false' />
        <audio id='error' src={`${__webpack_public_path__}media/out-of-bounds.ogg`} autostart='false' />
        <audio id='severe-error' src={`${__webpack_public_path__}media/i-am-being-serious.ogg`} autostart='false' />
    </>
);

export default Audio;
