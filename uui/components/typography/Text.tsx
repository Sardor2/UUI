import css from './Text.module.scss';
import * as types from '../types';
import { Text as uuiText, TextProps as UuiTextProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';

export interface TextMods extends TextSettings {
    /**
     * @default '36'
     */
    size?: types.TextSize | '42';
    /**
     * @default 'regular'
     */
    font?: types.FontStyle;
    /**
     * @default 'primary'
     */
    color?: 'info' | 'warning' | 'error' | 'success' | 'brand' | 'primary' | 'secondary' | 'disabled' | 'contrast' | 'white';
}

export type TextProps = UuiTextProps & TextMods;

function applyTextMods(mods: TextMods) {
    const textClasses = getTextClasses(
        {
            size: mods.size || '36',
            lineHeight: mods.lineHeight,
            fontSize: mods.fontSize,
        },
        false,
    );

    return [
        `uui-font-${mods.font || 'regular'}`,
        `uui-text-${mods.color || 'primary'}`,
        css.root,
    ].concat(textClasses);
}

export const Text = withMods<UuiTextProps, TextMods>(uuiText, applyTextMods);
