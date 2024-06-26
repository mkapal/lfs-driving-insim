import { Button, ButtonProps } from "react-node-insim";
import { CircleWithBorder } from "./shapes/CircleWithBorder";
import lfsColor from "../lfsColor";

export function SpeedLimit({
  limit,
  left = 0,
  top = 0,
  ...buttonProps
}: { limit: number } & Pick<ButtonProps, "left" | "top" | "UCID">) {
  const limitHasMoreThanTwoDigits = limit >= 100;
  const topNumber = top + (limitHasMoreThanTwoDigits ? 27 : 25);
  const height = limitHasMoreThanTwoDigits ? 11 : 15;

  return (
    <>
      <CircleWithBorder {...buttonProps} left={left} top={top} />
      <Button
        {...buttonProps}
        left={left}
        top={topNumber}
        width={30}
        height={height}
      >
        {lfsColor.black(limit.toString(10))}
      </Button>
    </>
  );
}
