import React from 'react';

type TVideoStreamProps = Pick<React.ComponentProps<'iframe'>, 'height' | 'width' | 'onLoad'> & {
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
    test_id?: string;
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
    letterbox_color = 'transparent', // unsets the default black background of the iframe
    loop,
    muted,
    poster,
    preload = 'auto',
    primary_color,
    src,
    start_time,
    test_id,
    width = '100%',
    height = '100%',
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
            allow={`accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture${
                disable_picture_in_picture ? ' "none"' : ' *'
            };`}
            allowFullScreen={allow_full_screen}
            src={`https://iframe.cloudflarestream.com/${src}?${params}`}
            data-testid={test_id}
            width={width}
            height={height}
            {...props}
        />
    );
};

export default React.memo(VideoStream);
