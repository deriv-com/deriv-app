import { ComponentType, SVGAttributes } from 'react';

declare module '*.svg' {
    const content: ComponentType<SVGAttributes<SVGElement>>;
    export default content;
}
