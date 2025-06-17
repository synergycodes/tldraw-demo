import ELK from "elkjs/lib/elk.bundled.js";
import {
  createShapeId,
  Editor,
  TLArrowBinding,
  TLArrowShape,
  TLShapeId,
  Vec,
} from "tldraw";
import { LinkData, NodeData } from "../types";

const elk = new ELK();

export default async function createModelWithElk(
  editor: Editor,
  nodeDataArray: NodeData[],
  linkDataArray: LinkData[]
) {
  if (!editor) return;

  const layoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.spacing.nodeNode": "50",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "elk.layered.spacing.edgeNodeBetweenLayers": "50",
    "elk.layered.spacing.baseValue": "50",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
  };
  const graph = {
    id: "root",
    layoutOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children: nodeDataArray.map(({ key, parent, ...rest }) => ({
      id: key.toString(),
      width: rest.w,
      height: rest.h,
      props: { ...rest },
    })),
    edges: linkDataArray.map(({ from, to }) => ({
      id: `e-${from}-${to}`,
      sources: [from.toString()],
      targets: [to.toString()],
    })),
  };

  const layoutedGraph = await elk.layout(graph); // <- await!

  layoutedGraph.children?.forEach((child) => {
    if (!child.x || !child.y || !child.props) return;

    editor.createShape({
      id: createShapeId(child.id),
      type: "family-member",
      x: child.x,
      y: child.y,
      props: {
        ...child.props,
        w: child.width ?? 250,
        h: child.height ?? 60,
      },
    });
  });

  layoutedGraph.edges.forEach(({ sources, targets }) =>
    createArrowBetweenShapes(
      editor,
      createShapeId(sources[0]),
      createShapeId(targets[0])
    )
  );

  return editor.getSnapshot();
}

function createArrowBetweenShapes(
  editor: Editor,
  startShapeId: TLShapeId,
  endShapeId: TLShapeId,
  options = {} as {
    parentId?: TLShapeId;
    start?: Partial<Omit<TLArrowBinding["props"], "terminal">>;
    end?: Partial<Omit<TLArrowBinding["props"], "terminal">>;
  }
) {
  const { start = {}, end = {}, parentId } = options;

  const {
    normalizedAnchor: startNormalizedAnchor = { x: 0.5, y: 1 },
    isExact: startIsExact = false,
    isPrecise: startIsPrecise = false,
  } = start;
  const {
    normalizedAnchor: endNormalizedAnchor = { x: 0.5, y: 0 },
    isExact: endIsExact = true,
    isPrecise: endIsPrecise = true,
  } = end;

  const startTerminalNormalizedPosition = Vec.From(startNormalizedAnchor);
  const endTerminalNormalizedPosition = Vec.From(endNormalizedAnchor);

  const parent = parentId ? editor.getShape(parentId) : undefined;

  if (parentId && !parent)
    throw Error(`Parent shape with id ${parentId} not found`);

  const startShapePageBounds = editor.getShapePageBounds(startShapeId);
  const endShapePageBounds = editor.getShapePageBounds(endShapeId);

  const startShapePageRotation = editor
    .getShapePageTransform(startShapeId)
    .rotation();
  const endShapePageRotation = editor
    .getShapePageTransform(endShapeId)
    .rotation();

  if (!startShapePageBounds || !endShapePageBounds) return;

  const startTerminalPagePosition = Vec.Add(
    startShapePageBounds.point,
    Vec.MulV(
      startShapePageBounds.size,
      Vec.Rot(startTerminalNormalizedPosition, startShapePageRotation)
    )
  );
  const endTerminalPagePosition = Vec.Add(
    endShapePageBounds.point,
    Vec.MulV(
      startShapePageBounds.size,
      Vec.Rot(endTerminalNormalizedPosition, endShapePageRotation)
    )
  );

  const arrowPointInParentSpace = Vec.Min(
    startTerminalPagePosition,
    endTerminalPagePosition
  );
  if (parent) {
    arrowPointInParentSpace.setTo(
      editor
        .getShapePageTransform(parent.id)!
        .applyToPoint(arrowPointInParentSpace)
    );
  }

  const arrowId = createShapeId();

  editor.createShape<TLArrowShape>({
    id: arrowId,
    type: "arrow",
    x: arrowPointInParentSpace.x,
    y: arrowPointInParentSpace.y,
    props: {
      start: {
        x: arrowPointInParentSpace.x - startTerminalPagePosition.x,
        y: arrowPointInParentSpace.y - startTerminalPagePosition.y,
      },
      end: {
        x: arrowPointInParentSpace.x - endTerminalPagePosition.x,
        y: arrowPointInParentSpace.y - endTerminalPagePosition.y,
      },
      color: "grey",
      size: "s",
    },
  });

  editor.createBindings<TLArrowBinding>([
    {
      fromId: arrowId,
      toId: startShapeId,
      type: "arrow",
      props: {
        terminal: "start",
        normalizedAnchor: startNormalizedAnchor,
        isExact: startIsExact,
        isPrecise: startIsPrecise,
      },
    },
    {
      fromId: arrowId,
      toId: endShapeId,
      type: "arrow",
      props: {
        terminal: "end",
        normalizedAnchor: endNormalizedAnchor,
        isExact: endIsExact,
        isPrecise: endIsPrecise,
      },
    },
  ]);
}
