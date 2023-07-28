// 9
// 36
/**
 * @name WorldWeatherEngine
 * @description
 *  It's weather engine that will be used to generate weather events on the map.
 *  All the actions take a place by the world timer (each 1 second). The world timer is responsible for the sun impact, clouds movement, cyclones movement, rains, snows, droughts, etc.
 *  The timer calls the weather engine and all subscribers are called to update all the weather entities.
 *  Sun impact is generated based on the sun activity (based on day time and the region multiplier).
 *  Each map regione (the same as biome) has different sun impact multiplier.
 *  Each region accumulate / loses heat. When sun impact is higher than the heat the region will gain heat. When sun impact is lower than the heat the region will lose heat.
 *  Each region accumulate water during rain and release it during the drought.
 *  Each region has different temperature (heat) and water level.
 *  Once region loses amount of wather a cloud is generated.
 *  Regions are connected with each other. The connection is used to move cyclones from one region to another.
 *  Region connection have directions (north, south, east, west, north-east, north-west, south-east, south-west).
 *  Weather events are generated based on the sun impact. Cyclones are generated based on the temperature difference between two regions.
 *  The cyclone will move from the region with higher temperature to the region with lower temperature.
 *  The direction of cyclone movement is based on the region connection.
 *  The cyclone will move faster if the temperature difference is higher.
 *  The cyclone will move slower if the temperature difference is lower.
 *  Movement speed is also affected by the sun impact.
 *  Movement of cyclons set the wind direction and speed.
 *  The wind direction and speed affect the movement of clouds.
 *  Rains are generated based on cluds state and temperature.
 *  Snow is generated based on cluds state and temperature.
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

// Constants
const WORLD_DAY_TIME = 10 * 60 // 10 mins
const WORLD_NIGHT_TIME = 10 * 60 // 10 mins
const WORLD_24H_TIME = WORLD_DAY_TIME + WORLD_NIGHT_TIME // 20 mins
const SUN_ACTIVITY_MIN = -100 // lack of sun activity means cosmos freeze
const SUN_ACTIVITY_MAX = 100
const CLOUD_WATHER_COST = 1000 // items of water
const GAS_PORTION = 15 // items of water pe tick
const MAX_CLOUDS_TO_AFFECT_SUN = 100 // if more than 100 clouds then sun impact no more reduced

// Enum of world weather event names
enum EWorldWeatherEventName {
  CreateCloud = 'create-cloud',
  MoveCycone = 'move-cyclone',
  WeatherEventEnd = 'weather-event-end',
  Wind = 'wind',
  Rain = 'rain',
  Snow = 'snow',
  Blizzard = 'blizzard',
  Drought = 'drought',
  Storm = 'storm',
  Fog = 'fog',
}

// Interface of world event bus
interface IWorldEventBus {
  on(eventName: EWorldWeatherEventName, callback: Function): void;
  off(eventName: EWorldWeatherEventName, callback: Function): void;
  emit(eventName: EWorldWeatherEventName, data: any): void;
}

// Type timer tick
type TTimerTick = {
  // day starts from 0 and ends at WORLD_DAY_TIME, then NIGHT starts and ends at WORLD_24H_TIME
  worldTime: number; // world "hour" from 0 to WORLD_24H_TIME
}

// Enum of directions
enum EDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  NorthEast = 'north-east',
  NorthWest = 'north-west',
  SouthEast = 'south-east',
  SouthWest = 'south-west'
}

// Interface of sun
interface ISun {
  sunActivity: number;
  update(tick: TTimerTick): void;
}

// Interface of region connection
interface IRegionConnection {
  region: IRegion;
  direction: EDirection;
}

// Interface of region with sun impact multiplier, heat (temperature) and water level
interface IRegion {
  sunImpactMultiplier: number;
  sunImpactAdder: number;
  heat: number; // temperature
  waterLevel: number;
  connectedRegionList: IRegionConnection[];
  eventList: IWeatherEvent[];
  size: number; // used to calculate when cyclone will move to another region
  update(tick: TTimerTick, weatherEngine: IWeatherEngine): void;
}

// Interface of map (array of regions)
interface IMap {
  regionList: IRegion[];
}

// Interface of cyclone
interface ICyclone {
  region: IRegion;
  direction: EDirection;
  speed: number;
  set regionSize(size: number);
  update(tick: TTimerTick, weatherEngine: IWeatherEngine): void;
}

// Interface of cloud. Cloud is generated when region loses water.
interface ICloud {
  region: IRegion;
  сyclone?: ICyclone;
}

// Enum of weather events types (wind, rain, snow, drought, etc.)
enum EWeatherEventType {
  Wind = 'wind',
  Rain = 'rain',
  Snow = 'snow',
  Drought = 'drought',
  Storm = 'storm',
  Blizzard = 'blizzard',
  Fog = 'fog',
  // simplified so far
  // Tornado = 'tornado', 
  // Hurricane = 'hurricane',
  // Hail = 'hail',
  // Fog = 'fog',
}

// Interface of weather event
interface IWeatherEvent {
  type: EWeatherEventType;
  region: IRegion;
  cyclone?: ICyclone;
}

// Interface of weather engine
interface IWeatherEngine {
  sun: ISun;
  map: IMap;
  cycloneList: ICyclone[];
  cloudList: ICloud[];
  bus: IWorldEventBus;
  update(tick: TTimerTick): void;
}


// Class of the sun
class Sun implements ISun {
  protected _sunActivity: number = SUN_ACTIVITY_MIN;

  public get sunActivity(): number {
    return this._sunActivity;
  }

  public update(tick: TTimerTick) {
    // calculate sun activity based on the world time, the higher at the middle of the day, the lower at the middle of the night
    // sun activity is less than zero at the middle of the night and max positive at the middle of the day

    const currHalfDayTime = tick.worldTime > WORLD_DAY_TIME ? tick.worldTime - WORLD_DAY_TIME : tick.worldTime;
    const mul = Math.sin(Math.PI * currHalfDayTime / (tick.worldTime > WORLD_DAY_TIME ? WORLD_NIGHT_TIME : WORLD_DAY_TIME))

    this._sunActivity = mul * (tick.worldTime > WORLD_DAY_TIME ? SUN_ACTIVITY_MIN : SUN_ACTIVITY_MAX);
  }
}

// Class of the region
class Region implements IRegion {

  protected _sunImpactMultiplier: number = 1;
  protected _sunImpactAdder: number = 0;
  protected _heat: number = 0;
  protected _waterLevel: number = 0;
  protected _gasWaterLevel: number = 0;
  protected _connectedRegionList: IRegionConnection[] = [];
  protected _eventList: IWeatherEvent[] = [];
  protected _size: number = 0;


  constructor(size: number, sunImpactMultiplier: number, sunImpactAddedr: number, heat: number, waterLevel: number) {
    this._sunImpactMultiplier = sunImpactMultiplier;
    this._sunImpactAdder = sunImpactAddedr;
    this._heat = heat;
    this._waterLevel = waterLevel;
    this._size = size;
  }

  public get sunImpactMultiplier(): number {
    return this._sunImpactMultiplier;
  }

  public get sunImpactAdder(): number {
    return this._sunImpactAdder;
  }

  public get heat(): number {
    return this._heat;
  }

  public get waterLevel(): number {
    return this._waterLevel;
  }

  public get connectedRegionList(): IRegionConnection[] {
    return this._connectedRegionList;
  }

  public get eventList(): IWeatherEvent[] {
    return this._eventList;
  }

  public get size(): number {
    return this._size;
  }

  protected processSun(sun: ISun, cloudCount: number) {
    // calculate sun impact based on sun activity and sun impact multiplier and adder
    let sunImpact = sun.sunActivity * this._sunImpactMultiplier + this._sunImpactAdder;

    // if too many clouds then positive sun impact is reduced
    if (sunImpact > 0) {
      sunImpact = sunImpact - ((sunImpact / 2) * (cloudCount > MAX_CLOUDS_TO_AFFECT_SUN ? MAX_CLOUDS_TO_AFFECT_SUN : cloudCount));
    }

    // calculate heat based on sun impact
    // heat is accumulated or lost based on sun impact TODO REFACTOR?
    if (this._heat > sunImpact) {
      this._heat -= sunImpact;
    } else if (this._heat < sunImpact) {
      this._heat += sunImpact;
    }
  }

  public update(tick: TTimerTick, weatherEngine: IWeatherEngine): void {
    // process sun impact
    this.processSun(weatherEngine.sun, weatherEngine.cloudList.filter(cloud => cloud.region === this).length);

    // if its hot as heat > 30 then water goes to gas
    // if it's cold as heat < 0 then water goes back to water level as ice
    // if it's warm as heat > 0 and heat < 30 then water level not affected, but clouds are generated from gas water, if not enough gas to generate cloud, the gas create a fog

    switch (true) {
      case this._heat > 30:
        // max heat will gasify twice GAS_PORTION
        const gasPortion = this._heat / (SUN_ACTIVITY_MAX / 2) * GAS_PORTION;
        this._gasWaterLevel += gasPortion > this._waterLevel ? this._waterLevel : gasPortion;
        this._waterLevel -= gasPortion;
        break;
      case this._heat < 0:
        this._waterLevel += this._gasWaterLevel;
        this._gasWaterLevel = 0;
        break;
      case this._heat > 0 && this._heat < 30:
        // generate clouds
        const cloudGas = Math.floor(this._gasWaterLevel / CLOUD_WATHER_COST);
        if (cloudGas > 0) {
          this._gasWaterLevel -= cloudGas * CLOUD_WATHER_COST;
          weatherEngine.bus.emit(EWorldWeatherEventName.CreateCloud, { region: this })
        }
        if (this._gasWaterLevel > 0) {
          weatherEngine.bus.emit(EWorldWeatherEventName.Fog, { region: this })

          // return water immediately
          this._waterLevel += this._gasWaterLevel;
          this._gasWaterLevel = 0;
        }
        break;
    }
  }
}

// Class of the map
class WorldMap implements IMap {
  protected _regionList: IRegion[] = [];

  constructor(regionList: IRegion[]) {
    this._regionList = regionList;
  }

  public get regionList(): IRegion[] {
    return this._regionList;
  }

  public addRegion(region: IRegion) {
    this._regionList.push(region);
  }
}

// Class of the cyclone
class Cyclone implements ICyclone {
  protected _region: IRegion;
  protected _direction: EDirection;
  protected _speed: number;

  protected _leftSize: number = 0;

  set regionSize(size: number) {
    this._leftSize = size;
  }

  constructor(region: IRegion, direction: EDirection, speed: number) {
    this._region = region;
    this._direction = direction;
    this._speed = speed;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get direction(): EDirection {
    return this._direction;
  }

  public get speed(): number {
    return this._speed;
  }

  public update(tick: TTimerTick, weatherEngine: IWeatherEngine): void {
    // decrease size, if 0 or less then move to another region or dissapear
    this._leftSize -= this._speed;

    if (this._leftSize <= 0) {
      // move to another region or dissapear
      weatherEngine.bus.emit(EWorldWeatherEventName.MoveCycone, { cyclone: this, region: this._region })
    }

    // if heat allows then create rain or snow
    if (this._region.heat > 0 && this.region.heat < 60) {
      // if cloud count is more than 20 create rain if more than 60 create storm
      const cloudCount = weatherEngine.cloudList.filter(cloud => cloud.region === this._region).length;
      if (cloudCount > 60) {
        weatherEngine.bus.emit(EWorldWeatherEventName.Storm, { cyclone: this, region: this._region })
      } else if (cloudCount > 20) {
        weatherEngine.bus.emit(EWorldWeatherEventName.Rain, { cyclone: this, region: this._region })
      }
    } else if (this._region.heat < 0) {
      // if cloud count is more than 20 create snow if more than 60 create blizzard
      const cloudCount = weatherEngine.cloudList.filter(cloud => cloud.region === this._region).length;
      if (cloudCount > 60) {
        weatherEngine.bus.emit(EWorldWeatherEventName.Blizzard, { cyclone: this, region: this._region })
      } else if (cloudCount > 20) {
        weatherEngine.bus.emit(EWorldWeatherEventName.Snow, { cyclone: this, region: this._region })
      }
    }
  }
}

// Class of the cloud
class Cloud implements ICloud {
  protected _region: IRegion;
  protected _cyclone?: ICyclone;

  constructor(region: IRegion) {
    this._region = region;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get сyclone(): ICyclone | undefined {
    return this._cyclone;
  }
}

// World event bus
class WorldEventBus extends EventEmitter implements IWorldEventBus {
  constructor() {
    super();
  }
}

// Class of the weather engine
class WeatherEngine implements IWeatherEngine {
  protected _sun: ISun;
  protected _map: IMap;
  protected _bus: IWorldEventBus;
  protected _cycloneList: ICyclone[] = [];
  protected _cloudList: ICloud[] = [];
  protected _weatherEventMap: Map<IRegion, Map<EWeatherEventType, IWeatherEvent | undefined>> = new Map();

  constructor(sun: ISun, map: IMap, bus: IWorldEventBus) {
    this._sun = sun;
    this._map = map;
    this._bus = bus;

    // subscribe to events
    this._bus.on(EWorldWeatherEventName.CreateCloud, (data: any) => {
      this._cloudList.push(new Cloud(data.region));
    });

    this._bus.on(EWorldWeatherEventName.MoveCycone, (data: { cyclone: ICyclone, region: IRegion }) => {

      // TODO Important! merge cyclones if they got into the same region
      // now the latest one replaces the previous one
      // for that porpose 
      // 1. first tick loop all cyclones calculate movements
      // 2. the same tick second loop merge all cyclones that got into the same region
      // 3. the same tick third loop persist all cyclones, apply fogs, clouds, wather migration
      // * keep in mind that dissapearing cyclones 
      //   remove wather with clouds permanently, 
      //   there must be a way to return it back (sea/ocean/ground water level)


      const currentRegion = data.region
      // as no cyclone in region, then start drought
      const droughtMap = this._weatherEventMap.get(currentRegion) || new Map();
      droughtMap.set(EWeatherEventType.Drought, new Drought(currentRegion));
      this._weatherEventMap.set(currentRegion, droughtMap);

      // found connected region for the closest cyclone direction
      let connection: IRegionConnection | undefined = currentRegion.connectedRegionList.find(connection => connection.direction === data.cyclone.direction);
      // if no forward direction then found connected region for the closest cyclone direction
      if (!connection) {
        connection = currentRegion.connectedRegionList.find(
          connection => connection.direction
            .split('-')
            .some(p => new RegExp(p).test(data.cyclone.direction))
        );
      }

      // remove wind from the current region
      this._weatherEventMap.get(currentRegion)?.set(EWeatherEventType.Wind, void 0);

      if (!connection) {
        // remove cyclone
        this._cycloneList = this._cycloneList.filter(cyclone => cyclone !== data.cyclone);
        return
      }

      // move cyclone to the connected region
      data.cyclone.region = connection.region;
      data.cyclone.regionSize = connection.region.size;

      // remove drought from the connected region
      this._weatherEventMap.get(connection.region)?.set(EWeatherEventType.Drought, void 0);

      // add wind to the connected region
      const windMap = this._weatherEventMap.get(connection.region) || new Map();
      windMap.set(EWeatherEventType.Wind, data.cyclone);
      this._weatherEventMap.set(connection.region, windMap);
    });

    this._bus.on(EWorldWeatherEventName.WeatherEventEnd, (data: { event: IWeatherEvent }) => {
      // remove event from the region
      this._weatherEventMap.get(data.event.region)?.set(data.event.type, void 0);
    }
    );

    this._bus.on(EWorldWeatherEventName.Rain, (data: { cyclone: ICyclone, region: IRegion }) => {
      // add rain to the region
      const rainMap = this._weatherEventMap.get(data.region) || new Map();

      // get numbner of clouds in the region
      const cloudCount = this._cloudList.filter(cloud => cloud.region === data.region).length;
      // get returning water from clouds
      const cloudWater = cloudCount * CLOUD_WATHER_COST;

      // random duration from 15 seconds till 5 minutes
      const eventDurion = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      rainMap.set(EWeatherEventType.Rain, new Rain(data.region, data.cyclone, this._bus, eventDurion, cloudWater));
      this._weatherEventMap.set(data.region, rainMap);

      // remove clouds from the region (they still be drawn because of rain animation, but will not affect sun)
      this._cloudList = this._cloudList.filter(cloud => cloud.region !== data.region);

      // remove fog from the region
      this._weatherEventMap.get(data.region)?.set(EWeatherEventType.Fog, void 0);
    });

    this._bus.on(EWorldWeatherEventName.Snow, (data: { cyclone: ICyclone, region: IRegion }) => {
      // add snow to the region
      const snowMap = this._weatherEventMap.get(data.region) || new Map();

      // get numbner of clouds in the region
      const cloudCount = this._cloudList.filter(cloud => cloud.region === data.region).length;
      // get returning water from clouds
      const cloudWater = cloudCount * CLOUD_WATHER_COST;

      // random duration from 15 seconds till 5 minutes
      const eventDurion = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      snowMap.set(EWeatherEventType.Snow, new Snow(data.region, data.cyclone, this._bus, eventDurion, cloudWater));
      this._weatherEventMap.set(data.region, snowMap);

      // remove clouds from the region (they still be drawn because of rain animation, but will not affect sun)
      this._cloudList = this._cloudList.filter(cloud => cloud.region !== data.region);

      // remove fog from the region
      this._weatherEventMap.get(data.region)?.set(EWeatherEventType.Fog, void 0);
    });

    this._bus.on(EWorldWeatherEventName.Blizzard, (data: { cyclone: ICyclone, region: IRegion }) => {
      // add blizzard to the region
      const blizzardMap = this._weatherEventMap.get(data.region) || new Map();

      // get numbner of clouds in the region
      const cloudCount = this._cloudList.filter(cloud => cloud.region === data.region).length;
      // get returning water from clouds
      const cloudWater = cloudCount * CLOUD_WATHER_COST;

      // random duration from 15 seconds till 5 minutes
      const eventDurion = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      blizzardMap.set(EWeatherEventType.Blizzard, new Blizzard(data.region, data.cyclone, this._bus, eventDurion, cloudWater));
      this._weatherEventMap.set(data.region, blizzardMap);

      // remove clouds from the region (they still be drawn because of rain animation, but will not affect sun)
      this._cloudList = this._cloudList.filter(cloud => cloud.region !== data.region);

      // remove fog from the region
      this._weatherEventMap.get(data.region)?.set(EWeatherEventType.Fog, void 0);
    });

    this._bus.on(EWorldWeatherEventName.Storm, (data: { cyclone: ICyclone, region: IRegion }) => {
      // add storm to the region
      const stormMap = this._weatherEventMap.get(data.region) || new Map();

      // get numbner of clouds in the region
      const cloudCount = this._cloudList.filter(cloud => cloud.region === data.region).length;
      // get returning water from clouds
      const cloudWater = cloudCount * CLOUD_WATHER_COST;

      // random duration from 15 seconds till 5 minutes
      const eventDurion = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      stormMap.set(EWeatherEventType.Storm, new Storm(data.region, data.cyclone, this._bus, eventDurion, cloudWater));
      this._weatherEventMap.set(data.region, stormMap);

      // remove clouds from the region (they still be drawn because of rain animation, but will not affect sun)
      this._cloudList = this._cloudList.filter(cloud => cloud.region !== data.region);

      // remove fog from the region
      this._weatherEventMap.get(data.region)?.set(EWeatherEventType.Fog, void 0);
    });


    this._bus.on(EWorldWeatherEventName.Fog, (data: { region: IRegion }) => {
      // add fog to the region
      const fogMap = this._weatherEventMap.get(data.region) || new Map();

      // random duration from 15 seconds till 5 minutes
      const eventDurion = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;

      fogMap.set(EWeatherEventType.Fog, new Fog(data.region, this._bus, eventDurion));
      this._weatherEventMap.set(data.region, fogMap);
    });
  }

  public get sun(): ISun {
    return this._sun;
  }

  public get map(): IMap {
    return this._map;
  }

  public get cycloneList(): ICyclone[] {
    return this._cycloneList;
  }

  public get cloudList(): ICloud[] {
    return this._cloudList;
  }

  public get bus(): IWorldEventBus {
    return this._bus;
  }

  public update(tick: TTimerTick): void {
    // update sun
    this._sun.update(tick);

    // update map
    this._map.regionList.forEach(region => region.update(tick, this));

    // update cyclones
    this._cycloneList.forEach(cyclone => cyclone.update(tick, this));

    // update clouds
    this._cloudList.forEach(cloud => cloud.сyclone?.update(tick, this));
  }
}

// Class of rain
class Rain implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Rain;
  protected _region: IRegion;
  protected _cyclone: ICyclone;

  constructor(region: IRegion, cyclone: ICyclone, bus: IWorldEventBus, eventDurion: number, cloudWater: number) {
    this._region = region;
    this._cyclone = cyclone;

    setTimeout(() => {
      bus.emit(EWorldWeatherEventName.WeatherEventEnd, { event: this });
      // return water to the region
      this._region.waterLevel += cloudWater;
    }
      , eventDurion);
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone {
    return this._cyclone;
  }
}

// Class of fog
class Fog implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Fog;
  protected _region: IRegion;

  constructor(region: IRegion, bus: IWorldEventBus, duration: number) {
    this._region = region;

    setTimeout(() => {
      bus.emit(EWorldWeatherEventName.WeatherEventEnd, { event: this });
    }
      , duration);
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone | undefined {
    return void 0;
  }
}

// Class of snow
class Snow implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Snow;
  protected _region: IRegion;
  protected _cyclone: ICyclone;

  constructor(region: IRegion, cyclone: ICyclone, bus: IWorldEventBus, eventDurion: number, cloudWater: number) {
    this._region = region;
    this._cyclone = cyclone;

    setTimeout(() => {
      bus.emit(EWorldWeatherEventName.WeatherEventEnd, { event: this });
      // return water to the region
      this._region.waterLevel += cloudWater;
    }, eventDurion);
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone {
    return this._cyclone;
  }
}


// Class of drought
class Drought implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Drought;
  protected _region: IRegion;

  constructor(region: IRegion) {
    this._region = region;
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone | undefined {
    return void 0;
  }
}

// Class of the storm
class Storm implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Storm;
  protected _region: IRegion;
  protected _cyclone: ICyclone;

  constructor(region: IRegion, cyclone: ICyclone, bus: IWorldEventBus, eventDurion: number, cloudWater: number) {
    this._region = region;
    this._cyclone = cyclone;

    setTimeout(() => {
      bus.emit(EWorldWeatherEventName.WeatherEventEnd, { event: this });
      // return water to the region
      this._region.waterLevel += cloudWater;
    }
      , eventDurion);
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone {
    return this._cyclone;
  }
}

// Class of wind
class Wind implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Wind;
  protected _region: IRegion;
  protected _cyclone: ICyclone;

  constructor(region: IRegion, cyclone: ICyclone) {
    this._region = region;
    this._cyclone = cyclone;
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone {
    return this._cyclone;
  }
}

// Class of blizzard
class Blizzard implements IWeatherEvent {
  protected _type: EWeatherEventType = EWeatherEventType.Blizzard;
  protected _region: IRegion;
  protected _cyclone: ICyclone;

  constructor(region: IRegion, cyclone: ICyclone, bus: IWorldEventBus, eventDurion: number, cloudWater: number) {
    this._region = region;
    this._cyclone = cyclone;

    setTimeout(() => {
      bus.emit(EWorldWeatherEventName.WeatherEventEnd, { event: this });
      // return water to the region
      this._region.waterLevel += cloudWater;
    }
      , eventDurion);
  }

  public get type(): EWeatherEventType {
    return this._type;
  }

  public get region(): IRegion {
    return this._region;
  }

  public get cyclone(): ICyclone {
    return this._cyclone;
  }
}

// Class of the world timer
class WorldTimer {
  protected _tick: TTimerTick = {
    worldTime: 0
  };
  protected _weatherEngine: IWeatherEngine;

  constructor(weatherEngine: IWeatherEngine) {
    this._weatherEngine = weatherEngine;
  }

  public get tick(): TTimerTick {
    return this._tick;
  }

  public update() {
    // update tick
    this._tick.worldTime++;

    // if day ends then reset world time
    if (this._tick.worldTime > WORLD_24H_TIME) {
      this._tick.worldTime = 0;
    }

    // update weather engine
    this._weatherEngine.update(this._tick);
  }
}

// Class of the world
class World {
  protected _weatherEngine: IWeatherEngine;
  protected _timer: WorldTimer;

  constructor(weatherEngine: IWeatherEngine, timer: WorldTimer) {
    this._weatherEngine = weatherEngine;
    this._timer = timer;
  }

  public get weatherEngine(): IWeatherEngine {
    return this._weatherEngine;
  }

  public get timer(): WorldTimer {
    return this._timer;
  }

  public update() {
    // update timer
    this._timer.update();
  }

  public start() {
    setInterval(() => {
      this.update();
    }, 1000);
  }
}
