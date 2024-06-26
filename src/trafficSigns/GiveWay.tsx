import { Button, ButtonProps } from "react-node-insim";
import lfsColor from "../lfsColor";

export function GiveWay({
  left = 0,
  top = 0,
  ...buttonProps
}: Pick<ButtonProps, "left" | "top" | "UCID">) {
  return (
    <>
      <Button width={30} height={20} left={left} top={top} {...buttonProps}>
        {lfsColor.red("▽")}
      </Button>
      <Button
        width={28}
        height={18}
        left={left + 1}
        top={top + 1}
        {...buttonProps}
      >
        {lfsColor.white("▼")}
      </Button>
    </>
  );
}
