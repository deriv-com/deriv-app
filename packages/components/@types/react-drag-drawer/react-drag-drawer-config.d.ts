declare module 'react-drag-drawer' {
    export default function DragDrawer(
        props: React.PropsWithChildren<{
            direction: 'left' | 'right';
            open: boolean;
            onRequestClose: () => void;
            containerElementClass: string;
            modalElementClass: string;
        }>
    ): JSX.Element;
}
