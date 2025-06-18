import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService ) => ({
            uri: `${configService.get<string>('MONGO_URI')}/${configService.get<string>('MONGO_DB_NAME')}`,
        }),
        inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})


export class DatabaseModule {}