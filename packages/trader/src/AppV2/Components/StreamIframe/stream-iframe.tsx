import React from 'react';

type TStreamIframeProps = Pick<React.ComponentProps<'iframe'>, 'height' | 'width' | 'onLoad'> & {
    autoplay?: boolean;
    controls?: boolean;
    letterbox_color?: string;
    loop?: boolean;
    muted?: boolean;
    preload?: string;
    src: string;
    test_id?: string;
    title?: string;
};

const StreamIframe = ({
    autoplay = true,
    controls = false,
    letterbox_color = 'transparent',
    loop = true,
    muted = true,
    preload = 'auto',
    src,
    test_id,
    title,
    ...props
}: TStreamIframeProps) => {
    const params = [
        `letterboxColor=${encodeURIComponent(letterbox_color)}`,
        `muted=${muted}`,
        `preload=${preload}`,
        `loop=${loop}`,
        `autoplay=${autoplay}`,
        `controls=${controls}`,
    ].join('&');

    return (
        <div className='stream__wrapper'>
            <iframe
                allowFullScreen={false}
                className='stream__iframe'
                width='100%'
                height='100%'
                src={`https://iframe.cloudflarestream.com/${src}?${params}`}
                data-testid={test_id}
                title={title}
                {...props}
            />
        </div>
    );
};

export default StreamIframe;
