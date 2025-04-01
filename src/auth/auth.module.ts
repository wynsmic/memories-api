import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Si tu utilises des variables d'environnement
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard], // Tu peux exporter le guard si tu veux l'utiliser ailleurs
})
export class AuthModule {}
