export interface IResponseData {
  type: string;
  features: IFeatur[];
}

export interface IFeatur {
  type: string;
  geometry: IGeometry;
  properties: IProperti;
}

export interface IProperti {
  COUNTYID: string;
  COUNTYCODE: string;
  COUNTYNAME: string;
  COUNTYENG: string;
}

export interface IGeometry {
  type: string;
  coordinates: number[][][];
}
