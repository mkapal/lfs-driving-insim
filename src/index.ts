import "./env";

import debug from "debug";
import { InSim } from "node-insim";
import type { IS_VER } from "node-insim/packets";
import {
  IS_ISI_ReqI,
  IS_MTC,
  IS_OCO,
  IS_TINY,
  MessageSound,
  ObjectIndex,
  OCOAction,
  OCOAutocrossStartLights,
  PacketType,
  TinyType,
} from "node-insim/packets";
import { IntersectionController } from "./IntersectionController";

const log = debug("lfs-driving-insim");

const inSim = new InSim();

inSim.connect({
  IName: "Driving InSim",
  Host: process.env.HOST ?? "127.0.0.1",
  Port: process.env.PORT ? parseInt(process.env.PORT) : 29999,
  ReqI: IS_ISI_ReqI.SEND_VERSION,
  Admin: process.env.ADMIN ?? "",
});

inSim.on("connect", () => log("Connected"));
inSim.on("disconnect", () => log("Disconnected"));
inSim.on(PacketType.ISP_VER, onVersion);

function onVersion(packet: IS_VER) {
  log(`Connected to LFS ${packet.Product} ${packet.Version}`);

  inSim.send(
    new IS_MTC({
      Text: "Driving InSim Connected",
      UCID: 255,
      Sound: MessageSound.SND_SYSMESSAGE,
    }),
  );

  inSim.send(
    new IS_TINY({
      ReqI: 1,
      SubT: TinyType.TINY_NPL,
    }),
  );

  const lights = [1, 2];

  const intersectionController = new IntersectionController({
    sequence: [[1], [2]],
    activeDurationMs: 10_000,
    pendingDurationMs: 3_000,
  });

  intersectionController.start();

  intersectionController.subscribe(
    ({ isRunning, activeLights, pendingLights }) => {
      lights.forEach((lightID) => {
        const isActive = activeLights.includes(lightID);
        const isPending = pendingLights.includes(lightID);

        const red = isRunning && !isActive;
        const yellow = isRunning && isPending;
        const green = isRunning && isActive && !isPending;

        inSim.send(
          new IS_OCO({
            OCOAction: OCOAction.OCO_LIGHTS_SET,
            Index: ObjectIndex.AXO_START_LIGHTS,
            Identifier: lightID,
            Data:
              (red ? OCOAutocrossStartLights.RED : 0) |
              (yellow ? OCOAutocrossStartLights.AMBER : 0) |
              (green ? OCOAutocrossStartLights.GREEN : 0),
          }),
        );
      });
    },
  );
}

process.on("uncaughtException", (error) => {
  log(error);
});
