import { IntersectionController } from "./IntersectionController";
import {
  IS_OCO,
  ObjectIndex,
  OCOAction,
  OCOAutocrossStartLights,
} from "node-insim/packets";
import { InSim } from "node-insim";

export function initialize(inSim: InSim) {
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
