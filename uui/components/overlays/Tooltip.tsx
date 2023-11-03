import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui-components';
import css from './Tooltip.module.scss';

export interface TooltipMods {
    /**
     * Tooltip color
     * @default 'contrast'
     */
    color?: 'default' | 'contrast' | 'critical';
}

export type TooltipProps = UuiTooltipProps & TooltipMods;

function applyTooltipMods(mods: TooltipMods) {
    return [
        `tooltip-${mods.color || 'contrast'}`,
        css.root,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
