import { BaseBoxShapeTool, TLShape, TLShapeId } from '@tldraw/editor'

/** @public */
export class FlexShapeTool extends BaseBoxShapeTool {
	static override id = 'flex'
	static override initial = 'idle'
	override shapeType = 'flex' as const

	override onCreate(shape: TLShape | null): void {
		if (!shape) return

		const bounds = this.editor.getShapePageBounds(shape)!
		const shapesToAddToFlex: TLShapeId[] = []
		const ancestorIds = this.editor.getShapeAncestors(shape).map((shape) => shape.id)

		for (const siblingShapeId of this.editor.getSortedChildIdsForParent(shape.parentId)) {
			const siblingShape = this.editor.getShape(siblingShapeId)
			if (!siblingShape) continue
			if (siblingShape.id === shape.id) continue
			if (siblingShape.isLocked) continue
			if (ancestorIds.includes(siblingShape.id)) continue

			const pageShapeBounds = this.editor.getShapePageBounds(siblingShape)
			if (pageShapeBounds && bounds.contains(pageShapeBounds)) {
				shapesToAddToFlex.push(siblingShape.id)
			}
		}

		this.editor.reparentShapes(shapesToAddToFlex, shape.id)

		if (this.editor.getInstanceState().isToolLocked) {
			this.editor.setCurrentTool('flex')
		} else {
			this.editor.setCurrentTool('select.idle')
		}
	}
}
