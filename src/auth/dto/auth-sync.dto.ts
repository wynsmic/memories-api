import { IsString } from 'class-validator';

export class AuthSyncDto {
  @IsString()
  sub!: string; // providerUserId (ex: 'google-oauth2|abc123')

  @IsString()
  email!: string;

  @IsString()
  firstname!: string;

  @IsString()
  lastname!: string;

  @IsString()
  phone!: string;
}
