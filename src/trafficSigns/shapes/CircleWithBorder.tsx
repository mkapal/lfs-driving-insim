import { Button, ButtonProps } from "react-node-insim";
import lfsColor from "../../lfsColor";

type CircleProps = Omit<ButtonProps, "width" | "height" | "align">;

export function CircleWithBorder({
  top = 0,
  left = 0,
  ...buttonProps
}: CircleProps) {
  return (
    <>
      <Button
        top={top}
        left={left}
        width={62}
        height={62}
        align="left"
        {...buttonProps}
      >
        {lfsColor.red("•")}
      </Button>
      <Button
        top={top + 6}
        left={left + 3}
        width={50}
        height={50}
        align="left"
        {...buttonProps}
      >
        {lfsColor.white("•")}
      </Button>
    </>
  );
}
