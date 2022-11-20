type TSize = {
    width: number;
    height: number;
};

type TProps = {
    children?: ((props: TSize) => React.ReactNode) | React.ReactNode;
};

declare module '@enykeev/react-virtualized/dist/es/AutoSizer' {
    export const AutoSizer = (props: TProps): JSX.Element => JSX.Element;

    export default AutoSizer;
}
