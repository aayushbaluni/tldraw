import { T } from '@tldraw/validate'
import { createShapePropsMigrationIds, createShapePropsMigrationSequence } from '../records/TLShape'
import { RecordProps } from '../recordsWithProps'
import { StyleProp } from '../styles/StyleProp'
import { TLBaseShape } from './TLBaseShape'

/** @public */
export const FlexShapeDirectionStyle = StyleProp.defineEnum('tldraw:flexDirection', {
	defaultValue: 'row',
	values: ['row', 'column'],
})

/** @public */
export type TLFlexShapeDirection = T.TypeOf<typeof FlexShapeDirectionStyle>

/** @public */
export const FlexShapeWrapStyle = StyleProp.defineEnum('tldraw:flexWrap', {
	defaultValue: 'nowrap',
	values: ['nowrap', 'wrap'],
})

/** @public */
export type TLFlexShapeWrap = T.TypeOf<typeof FlexShapeWrapStyle>

/** @public */
export const FlexShapeJustifyContentStyle = StyleProp.defineEnum('tldraw:flexJustifyContent', {
	defaultValue: 'flex-start',
	values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
})

/** @public */
export type TLFlexShapeJustifyContent = T.TypeOf<typeof FlexShapeJustifyContentStyle>

/** @public */
export const FlexShapeAlignItemsStyle = StyleProp.defineEnum('tldraw:flexAlignItems', {
	defaultValue: 'flex-start',
	values: ['flex-start', 'center', 'flex-end', 'stretch'],
})

/** @public */
export type TLFlexShapeAlignItems = T.TypeOf<typeof FlexShapeAlignItemsStyle>

/** @public */
export const FlexShapeAlignContentStyle = StyleProp.defineEnum('tldraw:flexAlignContent', {
	defaultValue: 'flex-start',
	values: ['flex-start', 'center', 'flex-end', 'stretch', 'space-between', 'space-around'],
})

/** @public */
export type TLFlexShapeAlignContent = T.TypeOf<typeof FlexShapeAlignContentStyle>

/** @public */
export const FlexShapeGapStyle = StyleProp.defineEnum('tldraw:flexGap', {
	defaultValue: 'm',
	values: ['none', 'xs', 's', 'm', 'l', 'xl'],
})

/** @public */
export type TLFlexShapeGap = T.TypeOf<typeof FlexShapeGapStyle>

/** @public */
export const FlexShapePaddingStyle = StyleProp.defineEnum('tldraw:flexPadding', {
	defaultValue: 'm',
	values: ['none', 'xs', 's', 'm', 'l', 'xl'],
})

/** @public */
export type TLFlexShapePadding = T.TypeOf<typeof FlexShapePaddingStyle>

/** @public */
export type TLFlexShapeItemAlignSelf = 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch'

/** @public */
export type TLFlexShapeItemBasis = 'auto' | 'zero' | 's' | 'm' | 'l'

/** @public */
export interface TLFlexShapeItemProps {
	alignSelf: TLFlexShapeItemAlignSelf
	flexGrow: number
	flexShrink: number
	flexBasis: TLFlexShapeItemBasis
	order: number
}

/** @public */
export interface TLFlexShapeProps {
	w: number
	h: number
	direction: TLFlexShapeDirection
	wrap: TLFlexShapeWrap
	justifyContent: TLFlexShapeJustifyContent
	alignItems: TLFlexShapeAlignItems
	alignContent: TLFlexShapeAlignContent
	gap: TLFlexShapeGap
	padding: TLFlexShapePadding
	itemProps: Record<string, TLFlexShapeItemProps>
}

/** @public */
export type TLFlexShape = TLBaseShape<'flex', TLFlexShapeProps>

/** @public */
export const flexShapeItemPropsValidator: T.ObjectValidator<TLFlexShapeItemProps> = T.object({
	alignSelf: T.literalEnum('auto', 'flex-start', 'center', 'flex-end', 'stretch'),
	flexGrow: T.number,
	flexShrink: T.number,
	flexBasis: T.literalEnum('auto', 'zero', 's', 'm', 'l'),
	order: T.number,
})

/** @public */
export const flexShapeProps: RecordProps<TLFlexShape> = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	direction: FlexShapeDirectionStyle,
	wrap: FlexShapeWrapStyle,
	justifyContent: FlexShapeJustifyContentStyle,
	alignItems: FlexShapeAlignItemsStyle,
	alignContent: FlexShapeAlignContentStyle,
	gap: FlexShapeGapStyle,
	padding: FlexShapePaddingStyle,
	itemProps: T.dict(T.string, flexShapeItemPropsValidator),
}

/** @internal */
const Versions = createShapePropsMigrationIds('flex', {})

/** @public */
export { Versions as flexShapeVersions }

/** @public */
export const flexShapeMigrations = createShapePropsMigrationSequence({
	sequence: [],
})
