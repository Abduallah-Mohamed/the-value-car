import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  mileage: number;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id) // obj is the original report entity
  @Expose()
  userId: number;
}
