import React from 'react';
import clsx from 'clsx';
import { Skeleton } from '@deriv-com/quill-ui';

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

const ASPECT_RATIO = 0.5625;

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
    const [is_loading, setIsLoading] = React.useState(true);

    const params = [
        `letterboxColor=${encodeURIComponent(letterbox_color)}`,
        `muted=${muted}`,
        `preload=${preload}`,
        `loop=${loop}`,
        `autoplay=${autoplay}`,
        `controls=${controls}`,
    ].join('&');

    return (
        <div className={clsx('stream__wrapper', is_loading && 'stream__wrapper--is-loading')}>
            {is_loading && <Skeleton.Square height={`calc(100vw * ${ASPECT_RATIO})`} />}
            <iframe
                allowFullScreen={false}
                className='stream__iframe'
                width='100%'
                height='100%'
                src={`https://iframe.cloudflarestream.com/${src}?${params}`}
                data-testid={test_id}
                title={title}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        </div>
    );
};

export default StreamIframe;
