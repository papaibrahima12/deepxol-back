import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DossierDocument } from 'src/user-auth/schemas/dossier.schema';
import { Dossier } from '../entities/dossier/dossier';

@Injectable()
export class DossierService {
    constructor(
        @InjectModel('Dossier')
        private readonly dossierModel: Model<DossierDocument>,
      ){}
      
      async create(payload: any): Promise<DossierDocument>{
          const newDossier = new this.dossierModel(payload);
          newDossier.isActive = true;
          return await newDossier.save();
      }
      
      async update(id: string, updateDossierDto: Dossier):Promise<DossierDocument> {
        const existDossier = await this.dossierModel.findByIdAndUpdate(id, updateDossierDto, { new: true });
        console.log(existDossier);
        if (!existDossier) {
          throw new NotFoundException(`Dossier #${id} not found`);
        }
        return existDossier;
      }
    
    
      async findAll(): Promise<DossierDocument[]> {
        
        return this.dossierModel.find({isActive: true}).exec()
      }
    
      async getStatistic(): Promise<any>{
        const dossiers = await this.dossierModel
          .find({ isActive: true })
          .exec();
          const countFibrillation = await this.dossierModel.count({ diagnostic: 'OUI' });
          const countNotFibrillation = await this.dossierModel.count({ diagnostic: 'NON' });
          let total = countFibrillation + countNotFibrillation
          return { total: total, fibrillation: countFibrillation, notFibrillation: countNotFibrillation }
      }
    
      async findOne(id: string) :Promise<DossierDocument> {
        const existDossier = await this.dossierModel.findById(id).exec();
        if (!existDossier) {
          throw new NotFoundException(`Dossier #${id} not found`);
        }
        return existDossier;
      }
    
    
      async findDossierNumber(number: string) {
        return this.dossierModel.findOne({dossierNumber: number});
      }
    
     async remove(id: string):Promise<DossierDocument> {
        const deletedDossier = this.dossierModel.findByIdAndRemove(id);
       if (!deletedDossier) {
         throw new NotFoundException(`Dossier #${id} not found`);
       }
       return deletedDossier;
      }
}
