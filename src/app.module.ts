import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LocationModule } from './location/location.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    LocationModule,
  ],
})
export class AppModule {}

function getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('database.host'),
    port: parseInt(configService.get('database.port'),10),
    database: configService.get('database.databaseName'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],    
    logging: true,
    ssl: {
      rejectUnauthorized: false,
      // rejectUnauthorized: true,
      // ca: fs.readFileSync('./ca.pem'),
    },
  };
}
