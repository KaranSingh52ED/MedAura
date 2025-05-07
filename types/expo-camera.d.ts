declare module 'expo-camera' {
  import * as React from 'react';
  
  export interface CameraProps {
    type?: any;
    flashMode?: any;
    autoFocus?: any;
    zoom?: number;
    whiteBalance?: any;
    ratio?: string;
    pictureSize?: string;
    style?: any;
    onCameraReady?: () => void;
    onMountError?: (error: any) => void;
    onFacesDetected?: (options: { faces: any[] }) => void;
  }

  export class Camera extends React.Component<CameraProps> {
    takePictureAsync(options?: any): Promise<{ uri: string; width: number; height: number; }>;
    pausePreview(): void;
    resumePreview(): void;
  }

  export const Constants: {
    Type: {
      front: any;
      back: any;
    };
    FlashMode: {
      on: any;
      off: any;
      auto: any;
      torch: any;
    };
    AutoFocus: {
      on: any;
      off: any;
    };
    WhiteBalance: {
      auto: any;
      sunny: any;
      cloudy: any;
      shadow: any;
      fluorescent: any;
      incandescent: any;
    };
  };

  export function requestCameraPermissionsAsync(): Promise<{ status: string }>;
} 