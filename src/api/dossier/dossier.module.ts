import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DossierController } from './dossier.controller';
import { DossierService } from './dossier.service';
import { DossierSchema } from 'src/user-auth/schemas/dossier.schema';
import { FileUploadService } from '../shared/file/file.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Dossier', schema: DossierSchema }]),
      ],
      controllers: [DossierController],
      providers: [DossierService, FileUploadService, JwtService],
})
export class DossierModule {}
