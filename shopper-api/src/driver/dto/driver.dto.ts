export class DriverDto {
  name: string;
  description: string;
  vehicle: string;
  value: number;
  min_distance: number;
  review: {
    rating: number;
    comment: string;
  };
}
