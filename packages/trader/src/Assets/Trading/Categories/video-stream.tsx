import React from 'react';

type TVideoStreamProps = React.ComponentProps<'iframe'> & {
    ad_url?: string;
    allow_full_screen?: boolean;
    autoplay?: boolean;
    controls?: boolean;
    default_text_track?: string;
    disable_picture_in_picture?: boolean;
    letterbox_color?: string;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    preload?: string;
    primary_color?: string;
    src: string;
    start_time?: string | number;
};

/* TODO [maryia-deriv]: This temporary component was created because the official Stream component
   doesn't support disablePictureInPicture. Please remove it when creating custom player
   because disablePictureInPicture will not matter when we disable controls and add our own ones instead. */
const VideoStream = ({
    ad_url,
    allow_full_screen = true,
    autoplay,
    controls,
    default_text_track,
    disable_picture_in_picture,
    letterbox_color,
    loop,
    muted,
    poster,
    preload,
    primary_color,
    src,
    start_time,
    ...props
}: TVideoStreamProps) => {
    const params = [
        poster && `poster=${encodeURIComponent(poster)}`,
        ad_url && `ad-url=${encodeURIComponent(ad_url)}`,
        default_text_track && `defaultTextTrack=${encodeURIComponent(default_text_track)}`,
        primary_color && `primaryColor=${encodeURIComponent(primary_color)}`,
        letterbox_color && `letterboxColor=${encodeURIComponent(letterbox_color)}`,
        start_time && `startTime=${start_time}`,
        muted && 'muted=true',
        preload && `preload=${preload}`,
        loop && 'loop=true',
        autoplay && 'autoplay=true',
        !controls && 'controls=false',
    ]
        .filter(Boolean)
        .join('&');

    return (
        <iframe
            {...props}
            allow={`accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture${
                disable_picture_in_picture ? " 'none'" : ' *'
            };`}
            allowFullScreen={allow_full_screen}
            src={`https://iframe.cloudflarestream.com/${src}?${params}`}
        />
    );
};

VideoStream.displayName = 'VideoStream';

export default React.memo(VideoStream);
