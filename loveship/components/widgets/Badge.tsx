import { devLogger, withMods } from '@epam/uui-core';
import * as types from '../../components/types';
import { Badge as UuiBadge, BadgeMods as UuiBadgeMods, BadgeProps as UuiBadgeProps } from '@epam/uui';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

const defaultSize = '18';

export interface BadgeMods {
    /** @default 'sky' */
    color?: EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600';
    /** @default 'square' */
    shape?: types.ControlShape;
    /** @default 'solid' */
    fill?: UuiBadgeMods['fill'] | 'white' | 'light' | 'none';
    /** @default '18' */
    size?: UuiBadgeMods['size'] | '12';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css['style-' + (mods.shape || 'square')], css['fill-' + (mods.fill || 'solid')], css['size-' + (mods.size || defaultSize)], css.root,
    ];
}

export type BadgeProps = Omit<UuiBadgeProps, 'color' | 'fill' | 'size'> & BadgeMods;

export const Badge = withMods<Omit<UuiBadgeProps, 'color' | 'fill' | 'size'>, BadgeMods>(
    UuiBadge,
    applyBadgeMods,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'color'>({
                component: 'Badge',
                propName: 'color',
                propValue: props.color,
                condition: () => ['night200', 'night400', 'night500'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color || 'sky',
            size: props.size || defaultSize,
        } as BadgeProps;
    },
);
