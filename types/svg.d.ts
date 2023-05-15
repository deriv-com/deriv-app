declare module '*.svg' {
    const content: (props: React.SVGProps<SVGElement>) => React.ReactElement;
    export default content;
}
