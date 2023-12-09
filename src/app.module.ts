import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user-auth/user-auth.module';
import { DossierController } from './api/dossier/dossier.controller';
import { DossierService } from './api/dossier/dossier.service';
import { DossierModule } from './api/dossier/dossier.module';
import { FileUploadService } from './api/shared/file/file.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserAuthModule,
    DossierModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
