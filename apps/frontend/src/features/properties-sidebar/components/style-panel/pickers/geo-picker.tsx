import { useEditor, useRelevantStyles, GeoShapeGeoStyle } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckSquare,
  Circle,
  Cloud,
  Diamond,
  DotsThreeVertical,
  Heart,
  Hexagon,
  Octagon,
  Pentagon,
  Rectangle,
  Star,
  Triangle,
  XSquare,
} from "@phosphor-icons/react";
import { useCallback, useMemo } from "react";
import { Menu, MenuItemProps, NavButton } from "@synergycodes/axiom";

type GeoStyles = ExtractStyleOptions<typeof GeoShapeGeoStyle>;

export function GeoPicker() {
  const editor = useEditor();
  const handleClick = useCallback(
    (geo: GeoStyles) => {
      editor.run(
        () => {
          editor.setStyleForSelectedShapes(GeoShapeGeoStyle, geo);
          editor.markHistoryStoppingPoint();
        },
        { history: "record" }
      );
    },
    [editor]
  );

  const items: MenuItemProps[] = useMemo(
    () => [
      {
        label: "arrow-down",
        icon: <ArrowDown size={16} />,
        onClick: () => handleClick("arrow-down"),
      },
      {
        label: "arrow-left",
        icon: <ArrowLeft size={16} />,
        onClick: () => handleClick("arrow-left"),
      },
      {
        label: "arrow-right",
        icon: <ArrowRight size={16} />,
        onClick: () => handleClick("arrow-right"),
      },
      {
        label: "arrow-up",
        icon: <ArrowUp size={16} />,
        onClick: () => handleClick("arrow-up"),
      },
      {
        label: "check-box",
        icon: <CheckSquare size={16} />,
        onClick: () => handleClick("check-box"),
      },
      {
        label: "cloud",
        icon: <Cloud size={16} />,
        onClick: () => handleClick("cloud"),
      },
      {
        label: "diamond",
        icon: <Diamond size={16} />,
        onClick: () => handleClick("diamond"),
      },
      {
        label: "ellipse",
        icon: <Circle size={16} />,
        onClick: () => handleClick("ellipse"),
      },
      {
        label: "heart",
        icon: <Heart size={16} />,
        onClick: () => handleClick("heart"),
      },
      {
        label: "hexagon",
        icon: <Hexagon size={16} />,
        onClick: () => handleClick("hexagon"),
      },
      {
        label: "octagon",
        icon: <Octagon size={16} />,
        onClick: () => handleClick("octagon"),
      },
      {
        label: "oval",
        icon: <Circle size={16} />,
        onClick: () => handleClick("oval"),
      },
      {
        label: "pentagon",
        icon: <Pentagon size={16} />,
        onClick: () => handleClick("pentagon"),
      },
      {
        label: "rectangle",
        icon: <Rectangle size={16} />,
        onClick: () => handleClick("rectangle"),
      },
      {
        label: "rhombus-2",
        icon: <Diamond size={16} />,
        onClick: () => handleClick("rhombus-2"),
      },
      {
        label: "rhombus",
        icon: <Diamond size={16} />,
        onClick: () => handleClick("rhombus"),
      },
      {
        label: "star",
        icon: <Star size={16} />,
        onClick: () => handleClick("star"),
      },
      {
        label: "trapezoid",
        icon: <Rectangle size={16} />,
        onClick: () => handleClick("trapezoid"),
      },
      {
        label: "triangle",
        icon: <Triangle size={16} />,
        onClick: () => handleClick("triangle"),
      },
      {
        label: "x-box",
        icon: <XSquare size={16} />,
        onClick: () => handleClick("x-box"),
      },
    ],
    [handleClick]
  );

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(GeoShapeGeoStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;

  const firstFive = items.slice(0, 5);
  const activeItem = items.find((el) => el.label === active);

  const isInFirstFive = firstFive.some((el) => el.label === active);

  const result = isInFirstFive
    ? firstFive
    : [...firstFive.slice(0, 4), activeItem || firstFive[4]];

  const remainingItems = items.filter(
    (el) => !result.some((first) => first.label === el.label)
  );

  return (
    <div>
      <span>Geometry</span>
      <div className={classes.options}>
        {result.map(({ label, icon, onClick }) => (
          <button
            key={label}
            className={clsx(classes.button, {
              [classes.active]: label === active,
            })}
            onClick={onClick}
          >
            <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
              {icon}
            </div>
          </button>
        ))}

        <Menu items={remainingItems}>
          <NavButton tooltip="More" icon={<DotsThreeVertical />} />
        </Menu>
      </div>
    </div>
  );
}
