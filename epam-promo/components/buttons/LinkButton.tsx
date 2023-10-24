import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface LinkButtonMods {
    color?: 'blue' | 'green' | 'amber' | 'red' | 'gray60' | 'gray10';
}

export type LinkButtonProps = uui.LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = createSkinComponent<uui.LinkButtonProps, LinkButtonProps>(
    uui.LinkButton,
    () => [],
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<LinkButtonProps, 'color'>({
                component: 'LinkButton',
                propName: 'color',
                propValue: props.color,
                condition: () => ['green', 'amber', 'red'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color ?? 'blue',
        };
    },
);
