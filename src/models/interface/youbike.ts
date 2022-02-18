export interface IYoubikeListResponse {
  StationUID: string;
  StationID: string;
  AuthorityID: string;
  StationName: IStationName;
  StationPosition: IStationPosition;
  StationAddress: IStationAddres;
  BikesCapacity: number;
  ServiceType: number;
  SrcUpdateTime: string;
  UpdateTime: string;
  AvailableRentBikes?: number;
  AvailableReturnBikes?: number;
  distance?: number;
}

export interface IYoubikeStatus {
  StationUID: string;
  StationID: string;
  ServiceStatus: number;
  ServiceType: number;
  AvailableRentBikes: number;
  AvailableReturnBikes: number;
  SrcUpdateTime: string;
  UpdateTime: string;
}

export interface IStationAddres {
  Zh_tw: string;
  En: string;
}

export interface IStationPosition {
  PositionLon: number;
  PositionLat: number;
  GeoHash: string;
}

export interface IStationName {
  Zh_tw: string;
  En: string;
}
