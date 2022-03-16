export interface IOtherPointList {
  name: string;
  latitude: number;
  longitude: number;
  address: string | undefined;
  opentime?: string;
  phone?: string;
}

export interface IGetFoodResponse {
  RestaurantID: string;
  RestaurantName: string;
  Description: string;
  Address: string;
  OpenTime: string;
  Picture: IPicture;
  Position: IPosition;
  ParkingInfo: string;
  City: string;
  SrcUpdateTime: string;
  UpdateTime: string;
}

export interface IGetSightseeResponse {
  ScenicSpotID: string;
  ScenicSpotName: string;
  DescriptionDetail: string;
  Phone: string;
  ZipCode: string;
  OpenTime: string;
  Picture: IPicture;
  Position: IPosition;
  Class1: string;
  Level: string;
  ParkingPosition: null;
  City: string;
  SrcUpdateTime: string;
  UpdateTime: string;
  Address: string;
}

export interface IGetPartyResponse {
  ActivityID: string;
  ActivityName: string;
  Description: string;
  Location: string;
  Address: string;
  Organizer: string;
  StartTime: string;
  EndTime: string;
  Cycle: string;
  WebsiteUrl: string;
  Picture: IPicture;
  Position: IPosition;
  Class1: string;
  Class2: string;
  City: string;
  SrcUpdateTime: string;
  UpdateTime: string;
}

export interface IGetRoomResponse {
  HotelID: string;
  HotelName: string;
  Description: string;
  Address: string;
  ZipCode: string;
  Phone: string;
  Fax: string;
  WebsiteUrl: string;
  Picture: IPicture;
  Position: IPosition;
  Class: string;
  Spec: string;
  ServiceInfo: string;
  ParkingInfo: string;
  City: string;
  SrcUpdateTime: string;
  UpdateTime: string;
}

interface IPicture {
  PictureUrl1: string;
  PictureDescription1: string;
  PictureUrl2: string;
  PictureDescription2: string;
  PictureUrl3: string;
}

interface IPicture {
  PictureUrl1: string;
  PictureDescription1: string;
  PictureUrl2: string;
  PictureDescription2: string;
  PictureUrl3: string;
  PictureDescription3: string;
}

interface IPicture {
  PictureUrl1: string;
  PictureDescription1: string;
}

interface IPosition {
  PositionLon: number;
  PositionLat: number;
  GeoHash: string;
}
