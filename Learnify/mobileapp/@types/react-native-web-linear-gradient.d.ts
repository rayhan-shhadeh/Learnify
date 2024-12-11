declare module 'react-native-web-linear-gradient' {
    import type { ComponentProps } from 'react';
    import { View } from 'react-native';
    declare class LinearGradient extends View {
        static defaultProps: {
            colors: string[];
        };
        render(): JSX.Element;
    }
    declare type LinearGradientProps = ComponentProps<LinearGradient>;
    export { LinearGradient };
    export type { LinearGradientProps };
    }