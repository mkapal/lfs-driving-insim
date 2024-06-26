import { SpeedLimit } from "./SpeedLimit";
import { Button, useOnPacket } from "react-node-insim";
import { PacketType } from "node-insim/packets";
import { log } from "../log";
import { GiveWay } from "./GiveWay";

export function TrafficSigns() {
  useOnPacket(PacketType.ISP_MSO, (packet) => {
    log(packet.Msg);
  });

  const left = 120;
  const top = 30;

  return (
    <>
      <Button
        UCID={255}
        left={left}
        top={top}
        width={10}
        height={16}
        background="dark"
      />
      <SpeedLimit UCID={255} left={left} top={top} limit={99} />
      <GiveWay UCID={255} left={left} top={top} />
    </>
  );
}
