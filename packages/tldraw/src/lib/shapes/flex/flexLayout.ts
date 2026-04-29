import {
	Editor,
	TLFlexShape,
	TLFlexShapeItemBasis,
	TLFlexShapeItemProps,
	TLShape,
	TLShapePartial,
} from '@tldraw/editor'
import type React from 'react'

export const FLEX_ITEM_DEFAULTS: TLFlexShapeItemProps = {
	alignSelf: 'auto',
	flexGrow: 0,
	flexShrink: 1,
	flexBasis: 'auto',
	order: 0,
}

export const FLEX_SPACE_VALUES = {
	none: 0,
	xs: 4,
	s: 8,
	m: 16,
	l: 24,
	xl: 32,
} as const

const FLEX_BASIS_VALUES: Record<TLFlexShapeItemBasis, string> = {
	auto: 'auto',
	zero: '0px',
	s: '64px',
	m: '128px',
	l: '256px',
}

export function getFlexItemProps(shape: TLFlexShape, child: TLShape): TLFlexShapeItemProps {
	return {
		...FLEX_ITEM_DEFAULTS,
		...shape.props.itemProps[child.id],
	}
}

export function getFlexItemStyle(
	itemProps: TLFlexShapeItemProps
): Pick<React.CSSProperties, 'alignSelf' | 'flexBasis' | 'flexGrow' | 'flexShrink' | 'order'> {
	return {
		alignSelf: itemProps.alignSelf,
		flexBasis: FLEX_BASIS_VALUES[itemProps.flexBasis],
		flexGrow: itemProps.flexGrow,
		flexShrink: itemProps.flexShrink,
		order: itemProps.order,
	}
}

export interface FlexMeasuredChildBounds {
	id: TLShape['id']
	x: number
	y: number
	w: number
	h: number
}

export function getFlexContainerStyle(shape: TLFlexShape): React.CSSProperties {
	const padding = FLEX_SPACE_VALUES[shape.props.padding]
	return {
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: shape.props.direction,
		flexWrap: shape.props.wrap,
		justifyContent: shape.props.justifyContent,
		alignItems: shape.props.alignItems,
		alignContent: shape.props.alignContent,
		gap: FLEX_SPACE_VALUES[shape.props.gap],
		padding,
		width: shape.props.w,
		height: shape.props.h,
	}
}

export function getFlexContainerStyleWithCssVars(shape: TLFlexShape): React.CSSProperties {
	return {
		...getFlexContainerStyle(shape),
		gap: `var(--tl-flex-gap)`,
		padding: `var(--tl-flex-padding)`,
	}
}

export function getFlexShapeChildUpdates(
	editor: Editor,
	flexShape: TLFlexShape,
	measuredBounds: readonly FlexMeasuredChildBounds[]
): TLShapePartial[] {
	const updates: TLShapePartial[] = []

	for (const bounds of measuredBounds) {
		const child = editor.getShape(bounds.id)
		if (!child || child.parentId !== flexShape.id) continue

		const update: TLShapePartial = {
			id: child.id,
			type: child.type,
			x: bounds.x,
			y: bounds.y,
		}

		if ('w' in child.props && 'h' in child.props) {
			const props: { w?: number; h?: number } = {}
			if (Math.abs((child.props.w as number) - bounds.w) > 0.5 && bounds.w > 0) props.w = bounds.w
			if (Math.abs((child.props.h as number) - bounds.h) > 0.5 && bounds.h > 0) props.h = bounds.h
			if (Object.keys(props).length > 0) {
				update.props = props as TLShapePartial['props']
			}
		}

		if (
			Math.abs(child.x - update.x!) > 0.5 ||
			Math.abs(child.y - update.y!) > 0.5 ||
			update.props
		) {
			updates.push(update)
		}
	}

	return updates
}

export function getPageBoundsForFlexItem(elm: HTMLElement): FlexMeasuredChildBounds | null {
	const childId = elm.dataset.shapeId as TLShape['id'] | undefined
	if (!childId) return null

	return {
		id: childId,
		x: elm.offsetLeft,
		y: elm.offsetTop,
		w: elm.offsetWidth,
		h: elm.offsetHeight,
	}
}
