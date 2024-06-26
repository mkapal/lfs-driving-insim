import "./env";
import {
  IS_MTC,
  IS_TINY,
  MessageSound,
  PacketType,
  TinyType,
} from "node-insim/packets";
import { createRoot } from "react-node-insim";
import * as trafficLights from "./trafficLights/trafficLights";
import { App } from "./App";
import { log } from "./log";

const root = createRoot({
  name: "Driving InSim",
  host: process.env.HOST ?? "127.0.0.1",
  port: process.env.PORT ? parseInt(process.env.PORT) : 29999,
  adminPassword: process.env.ADMIN ?? "",
});

root.render(<App />);

root.inSim.on("connect", () => log("Connected"));
root.inSim.on("disconnect", () => log("Disconnected"));

root.inSim.on(PacketType.ISP_VER, (packet) => {
  log(`Connected to LFS ${packet.Product} ${packet.Version}`);

  root.inSim.send(
    new IS_MTC({
      Text: "Driving InSim Connected",
      UCID: 255,
      Sound: MessageSound.SND_SYSMESSAGE,
    }),
  );

  root.inSim.send(
    new IS_TINY({
      ReqI: 1,
      SubT: TinyType.TINY_NPL,
    }),
  );

  trafficLights.initialize(root.inSim);
});

process.on("uncaughtException", (error) => {
  log(error);
});
