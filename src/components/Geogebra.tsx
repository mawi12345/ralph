import { useEffect } from "react";

export function Geogebra({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const elementId = `ggb-element-${id}`;
  useEffect(() => {
    const app = new (window as any).GGBApplet(
      {
        appName: "geometry",
        scaleContainerClass: "ggb-container",
        // width: 800,
        // height: 400,
        showToolBar: false,
        showAlgebraInput: false,
        showMenuBar: false,
        // allowStyleBar: false,
        showResetIcon: false,
        // showToolBarHelp: false,
        // enableUndoRedo: false,
        // preventFocus: true,
        // enableLabelDrags: false,
        // enableShiftDragZoom: false,
        // enableRightClick: false,
        borderColor: "#ffffff",
        material_id: id,
      },
      true,
    );
    app.inject(elementId);
  }, [id]);
  return (
    <div className={`ggb-container ${className}`}>
      <div id={elementId}></div>
    </div>
  );
}
