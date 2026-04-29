import {
	BaseFrameLikeShapeUtil,
	HTMLContainer,
	Rectangle2d,
	TLFlexShape,
	TLFlexShapeProps,
	TLShapePartial,
	flexShapeMigrations,
	flexShapeProps,
	lerp,
	resizeBox,
	useEditor,
	useValue,
} from '@tldraw/editor'
import { useLayoutEffect, useRef } from 'react'
import {
	FLEX_ITEM_DEFAULTS,
	FLEX_SPACE_VALUES,
	FlexMeasuredChildBounds,
	getFlexContainerStyleWithCssVars,
	getFlexItemProps,
	getFlexItemStyle,
	getFlexShapeChildUpdates,
} from './flexLayout'

/** @public */
export class FlexShapeUtil extends BaseFrameLikeShapeUtil<TLFlexShape> {
	static override type = 'flex' as const
	static override props = flexShapeProps
	static override migrations = flexShapeMigrations

	override canResize() {
		return true
	}

	override canResizeChildren() {
		return false
	}

	override getDefaultProps(): TLFlexShape['props'] {
		return {
			w: 320,
			h: 180,
			direction: 'row',
			wrap: 'nowrap',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			alignContent: 'flex-start',
			gap: 'm',
			padding: 'm',
			itemProps: {},
		}
	}

	override getGeometry(shape: TLFlexShape) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,
		})
	}

	override component(shape: TLFlexShape) {
		return <FlexShapeComponent shape={shape} />
	}

	override toSvg(shape: TLFlexShape) {
		return (
			<rect
				width={shape.props.w}
				height={shape.props.h}
				fill="transparent"
				stroke="currentColor"
				strokeWidth={1}
			/>
		)
	}

	override getIndicatorPath(shape: TLFlexShape): Path2D {
		const path = new Path2D()
		path.rect(0, 0, shape.props.w, shape.props.h)
		return path
	}

	override getInterpolatedProps(
		startShape: TLFlexShape,
		endShape: TLFlexShape,
		t: number
	): TLFlexShapeProps {
		return {
			...(t > 0.5 ? endShape.props : startShape.props),
			w: lerp(startShape.props.w, endShape.props.w, t),
			h: lerp(startShape.props.h, endShape.props.h, t),
		}
	}

	override onResize(shape: TLFlexShape, info: Parameters<typeof resizeBox<TLFlexShape>>[1]) {
		return resizeBox(shape, info)
	}

	override onChildrenChange(shape: TLFlexShape): TLShapePartial | void {
		const childIds = new Set(this.editor.getSortedChildIdsForParent(shape.id))
		const nextItemProps = Object.fromEntries(
			Object.entries(shape.props.itemProps).filter(([id]) => childIds.has(id as any))
		)
		if (Object.keys(nextItemProps).length === Object.keys(shape.props.itemProps).length) return
		return {
			id: shape.id,
			type: shape.type,
			props: { itemProps: nextItemProps },
		}
	}
}

function FlexShapeComponent({ shape }: { shape: TLFlexShape }) {
	const editor = useEditor()
	const rContainer = useRef<HTMLDivElement>(null)
	const children = useValue(
		'flex shape children',
		() =>
			editor
				.getSortedChildIdsForParent(shape.id)
				.map((id) => editor.getShape(id))
				.filter(Boolean),
		[editor, shape.id]
	)
	const childLayoutKey = children.map((child) => `${child.id}:${child.x}:${child.y}`).join('|')

	useLayoutEffect(() => {
		const elm = rContainer.current
		if (!elm) return

		const measureAndUpdate = () => {
			const measured: FlexMeasuredChildBounds[] = []
			for (const childElm of elm.querySelectorAll<HTMLElement>('.tl-flex__measure-item')) {
				const childId = childElm.dataset.shapeId as TLFlexShape['id'] | undefined
				if (!childId) continue
				measured.push({
					id: childId,
					x: childElm.offsetLeft,
					y: childElm.offsetTop,
					w: childElm.offsetWidth,
					h: childElm.offsetHeight,
				})
			}

			const updates = getFlexShapeChildUpdates(editor, shape, measured)
			if (updates.length === 0) return
			editor.updateShapes(updates)
		}

		measureAndUpdate()
		const resizeObserver = new ResizeObserver(measureAndUpdate)
		resizeObserver.observe(elm)
		for (const childElm of elm.querySelectorAll<HTMLElement>('.tl-flex__measure-item')) {
			resizeObserver.observe(childElm)
		}

		return () => resizeObserver.disconnect()
	}, [editor, shape, childLayoutKey])

	const style = getFlexContainerStyleWithCssVars(shape)

	return (
		<HTMLContainer
			className="tl-flex"
			style={
				{
					'--tl-flex-gap': `${FLEX_SPACE_VALUES[shape.props.gap]}px`,
					'--tl-flex-padding': `${FLEX_SPACE_VALUES[shape.props.padding]}px`,
					width: shape.props.w,
					height: shape.props.h,
				} as React.CSSProperties
			}
		>
			<div className="tl-flex__border" />
			<div ref={rContainer} className="tl-flex__measure" style={style}>
				{children.map((child) => {
					const itemProps = getFlexItemProps(shape, child)
					const bounds = editor.getShapeGeometry(child).bounds
					return (
						<div
							key={child.id}
							className="tl-flex__measure-item"
							data-shape-id={child.id}
							style={{
								boxSizing: 'border-box',
								width: bounds.width,
								height: bounds.height,
								...getFlexItemStyle(itemProps),
							}}
						/>
					)
				})}
				{children.length === 0 ? (
					<div className="tl-flex__empty">Flex</div>
				) : (
					<div className="tl-flex__defaults" style={getFlexItemStyle(FLEX_ITEM_DEFAULTS)} />
				)}
			</div>
		</HTMLContainer>
	)
}
