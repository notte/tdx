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
}

interface IStationAddres {
  Zh_tw: string;
  En: string;
}

interface IStationPosition {
  PositionLon: number;
  PositionLat: number;
  GeoHash: string;
}

interface IStationName {
  Zh_tw: string;
  En: string;
}
