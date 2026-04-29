import {
	DefaultColorStyle,
	DefaultFontStyle,
	isFontEntry,
	type TLTheme,
	type TLThemeColors,
	type TLThemeFont,
} from '@tldraw/editor'
import { TLUiIconJsx } from './ui/components/primitives/TldrawUiIcon'

/** @public */
export type StyleValuesForUi<T> = readonly {
	readonly value: T
	readonly icon: string | TLUiIconJsx
}[]

function isPaletteColor(value: unknown): boolean {
	return typeof value === 'object' && value !== null && 'solid' in value
}

/**
 * Returns the current list of color style items for the style panel,
 * derived from the theme's color palette. Only palette colors are included;
 * utility colors like `text`, `background`, etc. are excluded.
 *
 * Colors are ordered by their position in {@link @tldraw/tlschema#DefaultColorStyle},
 * followed by any additional theme colors in their object key order.
 *
 * @public
 */
export function getColorStyleItems(colors: TLThemeColors): StyleValuesForUi<string> {
	const result: StyleValuesForUi<string>[number][] = []
	const seen = new Set<string>()

	// First, add colors in the preferred order from DefaultColorStyle
	for (const name of DefaultColorStyle.values) {
		if (name in colors && isPaletteColor(colors[name as keyof typeof colors])) {
			// we remove white here temporarily, it's an easter egg color that the panel does not yet account for
			if (name === 'white') continue
			result.push({ value: name, icon: 'color' as const })
			seen.add(name)
		}
	}

	// Then, append any remaining palette colors from the theme
	for (const [key, value] of Object.entries(colors)) {
		if (!seen.has(key) && key !== 'white' && isPaletteColor(value)) {
			result.push({ value: key, icon: 'color' as const })
		}
	}

	return result
}

const defaultFontIcons: Record<string, string> = {
	draw: 'font-draw',
	sans: 'font-sans',
	serif: 'font-serif',
	mono: 'font-mono',
}

/**
 * Returns the current list of font style items for the style panel,
 * derived from the theme's font palette.
 *
 * Fonts are ordered by their position in {@link @tldraw/tlschema#DefaultFontStyle},
 * followed by any additional theme fonts in their object key order.
 *
 * @public
 */
export function getFontStyleItems(theme: TLTheme): StyleValuesForUi<string> {
	const result: StyleValuesForUi<string>[number][] = []
	const seen = new Set<string>()

	for (const name of DefaultFontStyle.values) {
		const entry = theme.fonts[name as keyof typeof theme.fonts]
		if (name in theme.fonts && isFontEntry(entry)) {
			result.push({ value: name, icon: fontIcon(entry, name) })
			seen.add(name)
		}
	}

	for (const [key, value] of Object.entries(theme.fonts)) {
		if (!seen.has(key) && isFontEntry(value)) {
			result.push({ value: key, icon: fontIcon(value, key) })
		}
	}

	return result
}

function fontIcon(font: TLThemeFont, name: string): string | TLUiIconJsx {
	if (font.icon != null) return font.icon as string | TLUiIconJsx
	return defaultFontIcons[name] ?? 'font-draw'
}

// todo: default styles prop?
export const STYLES = {
	flexDirection: [
		{ value: 'row', icon: 'stack-horizontal' },
		{ value: 'column', icon: 'stack-vertical' },
	],
	flexWrap: [
		{ value: 'nowrap', icon: 'stretch-horizontal' },
		{ value: 'wrap', icon: 'pack' },
	],
	flexJustifyContent: [
		{ value: 'flex-start', icon: 'align-left' },
		{ value: 'center', icon: 'align-center-horizontal' },
		{ value: 'flex-end', icon: 'align-right' },
		{ value: 'space-between', icon: 'distribute-horizontal' },
		{ value: 'space-around', icon: 'distribute-horizontal' },
		{ value: 'space-evenly', icon: 'distribute-horizontal' },
	],
	flexAlignItems: [
		{ value: 'flex-start', icon: 'align-top' },
		{ value: 'center', icon: 'align-center-vertical' },
		{ value: 'flex-end', icon: 'align-bottom' },
		{ value: 'stretch', icon: 'stretch-vertical' },
	],
	flexAlignContent: [
		{ value: 'flex-start', icon: 'align-top' },
		{ value: 'center', icon: 'align-center-vertical' },
		{ value: 'flex-end', icon: 'align-bottom' },
		{ value: 'stretch', icon: 'stretch-vertical' },
		{ value: 'space-between', icon: 'distribute-vertical' },
		{ value: 'space-around', icon: 'distribute-vertical' },
	],
	flexGap: [
		{ value: 'none', icon: 'minus' },
		{ value: 'xs', icon: 'size-small' },
		{ value: 's', icon: 'size-small' },
		{ value: 'm', icon: 'size-medium' },
		{ value: 'l', icon: 'size-large' },
		{ value: 'xl', icon: 'size-extra-large' },
	],
	flexPadding: [
		{ value: 'none', icon: 'minus' },
		{ value: 'xs', icon: 'corners' },
		{ value: 's', icon: 'corners' },
		{ value: 'm', icon: 'corners' },
		{ value: 'l', icon: 'corners' },
		{ value: 'xl', icon: 'corners' },
	],
	flexAlignSelf: [
		{ value: 'auto', icon: 'minus' },
		{ value: 'flex-start', icon: 'align-top' },
		{ value: 'center', icon: 'align-center-vertical' },
		{ value: 'flex-end', icon: 'align-bottom' },
		{ value: 'stretch', icon: 'stretch-vertical' },
	],
	flexGrow: [
		{ value: '0', icon: 'minus' },
		{ value: '1', icon: 'plus' },
	],
	flexShrink: [
		{ value: '0', icon: 'lock' },
		{ value: '1', icon: 'unlock' },
	],
	flexBasis: [
		{ value: 'auto', icon: 'corners' },
		{ value: 'zero', icon: 'minus' },
		{ value: 's', icon: 'size-small' },
		{ value: 'm', icon: 'size-medium' },
		{ value: 'l', icon: 'size-large' },
	],
	flexOrder: [
		{ value: '-1', icon: 'send-backward' },
		{ value: '0', icon: 'minus' },
		{ value: '1', icon: 'bring-forward' },
	],
	fill: [
		{ value: 'none', icon: 'fill-none' },
		{ value: 'semi', icon: 'fill-semi' },
		{ value: 'solid', icon: 'fill-solid' },
	],
	fillExtra: [
		{ value: 'pattern', icon: 'fill-pattern' },
		{ value: 'lined-fill', icon: 'fill-lined-fill' },
		{ value: 'fill', icon: 'fill-fill' },
	],
	dash: [
		{ value: 'draw', icon: 'dash-draw' },
		{ value: 'dashed', icon: 'dash-dashed' },
		{ value: 'dotted', icon: 'dash-dotted' },
		{ value: 'solid', icon: 'dash-solid' },
	],
	size: [
		{ value: 's', icon: 'size-small' },
		{ value: 'm', icon: 'size-medium' },
		{ value: 'l', icon: 'size-large' },
		{ value: 'xl', icon: 'size-extra-large' },
	],
	font: [
		{ value: 'draw', icon: 'font-draw' },
		{ value: 'sans', icon: 'font-sans' },
		{ value: 'serif', icon: 'font-serif' },
		{ value: 'mono', icon: 'font-mono' },
	],
	textAlign: [
		{ value: 'start', icon: 'text-align-left' },
		{ value: 'middle', icon: 'text-align-center' },
		{ value: 'end', icon: 'text-align-right' },
	],
	horizontalAlign: [
		{ value: 'start', icon: 'horizontal-align-start' },
		{ value: 'middle', icon: 'horizontal-align-middle' },
		{ value: 'end', icon: 'horizontal-align-end' },
	],
	verticalAlign: [
		{ value: 'start', icon: 'vertical-align-start' },
		{ value: 'middle', icon: 'vertical-align-middle' },
		{ value: 'end', icon: 'vertical-align-end' },
	],
	geo: [
		{ value: 'rectangle', icon: 'geo-rectangle' },
		{ value: 'ellipse', icon: 'geo-ellipse' },
		{ value: 'triangle', icon: 'geo-triangle' },
		{ value: 'diamond', icon: 'geo-diamond' },
		{ value: 'star', icon: 'geo-star' },
		{ value: 'pentagon', icon: 'geo-pentagon' },
		{ value: 'hexagon', icon: 'geo-hexagon' },
		{ value: 'octagon', icon: 'geo-octagon' },
		{ value: 'rhombus', icon: 'geo-rhombus' },
		{ value: 'rhombus-2', icon: 'geo-rhombus-2' },
		{ value: 'oval', icon: 'geo-oval' },
		{ value: 'trapezoid', icon: 'geo-trapezoid' },
		{ value: 'arrow-left', icon: 'geo-arrow-left' },
		{ value: 'arrow-up', icon: 'geo-arrow-up' },
		{ value: 'arrow-down', icon: 'geo-arrow-down' },
		{ value: 'arrow-right', icon: 'geo-arrow-right' },
		{ value: 'cloud', icon: 'geo-cloud' },
		{ value: 'x-box', icon: 'geo-x-box' },
		{ value: 'check-box', icon: 'geo-check-box' },
		{ value: 'heart', icon: 'geo-heart' },
	],
	arrowKind: [
		{ value: 'arc', icon: 'arrow-arc' },
		{ value: 'elbow', icon: 'arrow-elbow' },
	],
	arrowheadStart: [
		{ value: 'none', icon: 'arrowhead-none' },
		{ value: 'arrow', icon: 'arrowhead-arrow' },
		{ value: 'triangle', icon: 'arrowhead-triangle' },
		{ value: 'square', icon: 'arrowhead-square' },
		{ value: 'dot', icon: 'arrowhead-dot' },
		{ value: 'diamond', icon: 'arrowhead-diamond' },
		{ value: 'inverted', icon: 'arrowhead-triangle-inverted' },
		{ value: 'bar', icon: 'arrowhead-bar' },
	],
	arrowheadEnd: [
		{ value: 'none', icon: 'arrowhead-none' },
		{ value: 'arrow', icon: 'arrowhead-arrow' },
		{ value: 'triangle', icon: 'arrowhead-triangle' },
		{ value: 'square', icon: 'arrowhead-square' },
		{ value: 'dot', icon: 'arrowhead-dot' },
		{ value: 'diamond', icon: 'arrowhead-diamond' },
		{ value: 'inverted', icon: 'arrowhead-triangle-inverted' },
		{ value: 'bar', icon: 'arrowhead-bar' },
	],
	spline: [
		{ value: 'line', icon: 'spline-line' },
		{ value: 'cubic', icon: 'spline-cubic' },
	],
	flexItemOrder: [
		{ value: '-1', icon: 'send-backward' },
		{ value: '0', icon: 'minus' },
		{ value: '1', icon: 'bring-forward' },
	],
} as const satisfies Record<string, StyleValuesForUi<string>>
