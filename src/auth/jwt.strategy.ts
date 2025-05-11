import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
//import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private configService: ConfigService) {
    const pem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Ma77M/HAttvnjWs0uec
y7r5gjWMrCQl/2HbYoxISUu4l/pikeMVpDqbEpG1Fm3JMpqrCWr4i4WDH/lOUhMU
4ONn9gxGMvj2R5zWnegfh74oN7Y6F7twPGmfypFbOO0mxafixy9Ms3av7ACWRdKn
kCi8NYKHWdh103EMAS6KtDiz6XLvmcEfdglNpTvHxeS5/kicdRMSMKndAy9BLLfo
0iroqa4GgUK7Yq6R6ZqTVH53lxvcxe1l9BY8w/CZwR/PsmK+XCNOHQ4rO3Q+xSrK
wbw0+kf0Sb0UhynFSCNgJ1aqF2INfU+7GhObmxhoywbKJHiK6ex0FSIbbxqHFNT3
AQIDAQAB
-----END PUBLIC KEY-----`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: pem,
      issuer: configService.get<string>('AUTH0_ISSUER') || '',
      algorithms: ['RS256'],
      /*secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('AUTH0_ISSUER')}.well-known/jwks.json`,
      }),*/
    });
    this.logger.log('JwtStrategy constructor');
    this.logger.log('Issuer:', configService.get<string>('AUTH0_ISSUER'));
  }

  validate(payload: {
    sub: string;
    email: string;
    aud: string | string[];
    iss: string;
  }) {
    const aud = payload.aud;
    const expected = this.configService.get<string>('AUTH0_AUDIENCE');

    const audienceOk = Array.isArray(aud)
      ? expected && aud.includes(expected)
      : aud === expected;

    this.logger.log(
      'Audience from config:',
      this.configService.get('AUTH0_AUDIENCE'),
    );
    this.logger.log('Audience from token:', aud);
    this.logger.log('Issuer from token:', payload.iss);
    this.logger.log(
      'Issuer from config:',
      this.configService.get('AUTH0_ISSUER'),
    );

    if (!audienceOk) {
      throw new UnauthorizedException('Audience mismatch');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
