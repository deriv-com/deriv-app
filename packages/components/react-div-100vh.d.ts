// import React from 'react'
declare module 'react-div-100vh' {
    export default function Div100vh(
        props: React.PropsWithChildren<{
            className: string | undefined;
            id: string | undefined;
            style: {
                height?: string | null;
                maxHeight?: string | null;
            };
        }>
    ): JSX.Element;
}
