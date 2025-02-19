const FrontChannelIframe = () => {
    return (
        <iframe
            src={`${window.location.origin}/front-channel.html`}
            style={{ display: 'none', visibility: 'hidden' }}
        />
    );
};

export default FrontChannelIframe;
