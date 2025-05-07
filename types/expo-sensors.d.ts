declare module 'expo-sensors' {
  export interface GyroscopeData {
    x: number;
    y: number;
    z: number;
  }

  export interface AccelerometerData {
    x: number;
    y: number;
    z: number;
  }

  export interface DeviceMotionData {
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    accelerationIncludingGravity: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      alpha: number;
      beta: number;
      gamma: number;
    };
    rotationRate: {
      alpha: number;
      beta: number;
      gamma: number;
    };
    orientation: number;
  }

  export interface SensorSubscription {
    remove: () => void;
  }

  export const Gyroscope: {
    addListener: (listener: (data: GyroscopeData) => void) => SensorSubscription;
    removeAllListeners: () => void;
    setUpdateInterval: (interval: number) => void;
  };

  export const Accelerometer: {
    addListener: (listener: (data: AccelerometerData) => void) => SensorSubscription;
    removeAllListeners: () => void;
    setUpdateInterval: (interval: number) => void;
  };

  export const DeviceMotion: {
    addListener: (listener: (data: DeviceMotionData) => void) => SensorSubscription;
    removeAllListeners: () => void;
    setUpdateInterval: (interval: number) => void;
  };
} 