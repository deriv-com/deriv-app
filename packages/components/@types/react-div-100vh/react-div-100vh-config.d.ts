declare module 'react-div-100vh' {
    export default function Div100vh(
        props: React.PropsWithChildren<{
            className?: string;
            id?: string;
            style: {
                height?: string;
                maxHeight?: string;
            };
        }>
    ): JSX.Element;
}
