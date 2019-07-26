import React from 'react';

class FlyoutVideo extends React.PureComponent {
    render() {
        const { url } = this.props;

        return (
            <iframe
                src={url}
                frameBorder='0'
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                width={'100%'}
            />
        );
    }
}

export default FlyoutVideo;
