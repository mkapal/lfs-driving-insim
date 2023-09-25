import {
  BehaviorSubject,
  concatMap,
  delayWhen,
  from,
  of,
  repeat,
  Subscription,
  timer,
} from "rxjs";

export type ConstructorParams = {
  sequence: LightID[][];
  activeDurationMs: number;
  pendingDurationMs: number;
};

type LightID = number;

export type IntersectionState = {
  isRunning: boolean;
  activeLights: LightID[];
  pendingLights: LightID[];
};

export class IntersectionController {
  private readonly sequence: LightID[][];
  private readonly activeDurationMs;
  private readonly pendingDurationMs;

  private sequenceSubscription: Subscription | null = null;
  private state = new BehaviorSubject<IntersectionState>({
    isRunning: false,
    activeLights: [],
    pendingLights: [],
  });

  constructor({
    sequence,
    activeDurationMs,
    pendingDurationMs,
  }: ConstructorParams) {
    this.sequence = sequence;
    this.activeDurationMs = activeDurationMs;
    this.pendingDurationMs = pendingDurationMs;
  }

  start() {
    if (this.sequenceSubscription) {
      return;
    }

    this.sequenceSubscription = from<IntersectionState[]>([
      {
        isRunning: true,
        pendingLights: [],
        activeLights: [],
      },
      ...this.sequence.flatMap((lightIds) => [
        {
          isRunning: true,
          pendingLights: lightIds,
          activeLights: [],
        },
        {
          isRunning: true,
          pendingLights: [],
          activeLights: lightIds,
        },
        {
          isRunning: true,
          pendingLights: lightIds,
          activeLights: lightIds,
        },
        {
          isRunning: true,
          pendingLights: [],
          activeLights: [],
        },
      ]),
    ])
      .pipe(
        concatMap((value) =>
          of(value).pipe(
            delayWhen(({ pendingLights }) => {
              const delayTime =
                pendingLights.length > 0
                  ? this.activeDurationMs
                  : this.pendingDurationMs;

              return timer(delayTime);
            }),
          ),
        ),
        repeat(),
      )
      .subscribe((state) => {
        this.state.next(state);
      });
  }

  stop() {
    if (this.sequenceSubscription === null) {
      return;
    }

    this.sequenceSubscription.unsubscribe();
    this.sequenceSubscription = null;
    this.state.next({
      isRunning: false,
      activeLights: [],
      pendingLights: [],
    });
  }

  subscribe(observer?: (value: IntersectionState) => void): Subscription {
    return this.state.asObservable().subscribe(observer);
  }
}
