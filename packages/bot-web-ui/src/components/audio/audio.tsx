import React from 'react';

const Audio = () => (
    <>
        <audio id='announcement' aria-label='audio' src={`${__webpack_public_path__}media/announcement.mp3`} />
        <audio id='earned-money' aria-label='audio' src={`${__webpack_public_path__}media/coins.mp3`} />
        <audio id='job-done' aria-label='audio' src={`${__webpack_public_path__}media/job-done.mp3`} />
        <audio id='error' aria-label='audio' src={`${__webpack_public_path__}media/out-of-bounds.mp3`} />
        <audio id='severe-error' aria-label='audio' src={`${__webpack_public_path__}media/i-am-being-serious.mp3`} />
    </>
);

export default Audio;
