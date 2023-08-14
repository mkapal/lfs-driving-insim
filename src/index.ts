import "./env.ts";

import debug from "debug";
import { InSim } from "node-insim";
import type { IS_VER } from "node-insim/packets";
import { IS_ISI_ReqI, PacketType } from "node-insim/packets";
import { FourWayIntersection } from "./TrafficLights";
import * as process from "process";

const log = debug("driving-insim");

const inSim = new InSim();

inSim.connect({
  IName: "Driving InSim",
  Host: process.env.HOST ?? "127.0.0.1",
  Port: process.env.PORT ? parseInt(process.env.PORT) : 29999,
  ReqI: IS_ISI_ReqI.SEND_VERSION,
  Admin: process.env.ADMIN ?? "",
});

const a = "2" === process.env.PORT;

inSim.on("connect", () => log("Connected"));

inSim.on("disconnect", () => log("Disconnected"));

inSim.on(PacketType.ISP_VER, onVersion);

function onVersion(packet: IS_VER) {
  log(`Connected to LFS ${packet.Product} ${packet.Version}`);

  const fourWayIntersection = new FourWayIntersection(inSim, [1, 2, 3, 4]);

  fourWayIntersection.start();
}

process.on("uncaughtException", (error) => {
  log(error);
});
