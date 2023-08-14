import { InSim } from "node-insim";
import {
  IS_OCO,
  ObjectIndex,
  OCOAction,
  OCOAutocrossStartLights as LightColor,
} from "node-insim/packets";

export class GuardedIntersection {
  protected readonly inSim: InSim;

  constructor(inSim: InSim) {
    this.inSim = inSim;
  }

  protected setLights(colors: LightColor | 0, ...ids: number[]) {
    ids.forEach((id) => {
      this.inSim.send(
        new IS_OCO({
          Index: ObjectIndex.AXO_START_LIGHTS,
          OCOAction: OCOAction.OCO_LIGHTS_SET,
          Data: colors,
          Identifier: id,
        }),
      );
    });
  }
}

export class FourWayIntersection extends GuardedIntersection {
  private readonly lightIds;

  constructor(inSim: InSim, lightIds: [number, number, number, number]) {
    super(inSim);
    this.lightIds = lightIds;
  }

  start() {
    // Start the sequence with all reds on
    this.setLights(
      LightColor.RED,
      this.lightIds[0],
      this.lightIds[1],
      this.lightIds[2],
      this.lightIds[3],
    );
  }

  stop() {
    // Flash amber light
  }
}
