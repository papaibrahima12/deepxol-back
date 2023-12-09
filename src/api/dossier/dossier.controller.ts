import { Controller, Body, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {DossierService} from './dossier.service';
import {diskStorage} from 'multer'
import { Dossier } from '../entities/dossier/dossier';
import { AuthGuard } from 'src/user-auth/auth.guard';


@Controller('api')
export class DossierController {
    constructor(private readonly dossierService: DossierService) {}

  @UseGuards(AuthGuard)
  @Post('addDossier')
  @UseInterceptors(FileInterceptor('electro', {
    storage: diskStorage({
      destination: './files/electrocardiogrammes',
      filename: (_req, electro, cb ) => {
        const today = new Date();
        const random = Math.floor(Math.random() * (99999));
        const year = today.getFullYear();
        let dossierNumber = 'D-'+year+'-'+random
        const fileNameSplit = electro.originalname.split(".")
        const fileExt = fileNameSplit[fileNameSplit.length - 1]
        electro.originalname = `${dossierNumber}.${fileExt}`
        cb(null, `${dossierNumber}.${fileExt}`)
      }
    })
  }))
  async create(@Body() payload: any, @Res() res, @UploadedFile() electro) {
    try {
      if (electro) {
          let { originalname } = electro;
          payload.electro = originalname;
          let fileNameSplit = originalname.split(".")
          if(payload.diagnostic == "OUI"){
            payload.dossierNumber = '1-'+fileNameSplit[0]
          }else
            payload.dossierNumber = '0-'+ fileNameSplit[0]
      } else {
        const today = new Date();
        const random = Math.floor(Math.random() * (99999));
        const year = today.getFullYear();
        payload.dossierNumber = 'D-' + year + '-' + random
        payload.electro = 'default_file.xml';
      }
      const dossier = await this.dossierService.create(payload);
      return res.status(HttpStatus.CREATED).json(dossier);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get('dossiers')
  async findAll() {
    return await this.dossierService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('dossiers/statistics')
  async getStatistic(@Res() res) {
    const payload = await this.dossierService.getStatistic();
    return res.status(HttpStatus.CREATED).json(payload);
  }

  @UseGuards(AuthGuard)
  @Get('dossier/:id')
  async findOne(@Res() response, @Param('id') id: string) {
    try {
      const existingStudent = await this.dossierService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Folder found successfully', existingStudent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard)
  @Get('dossier/number/:number')
  findDossier(@Param('number') number: string) {
    return this.dossierService.findDossierNumber(number);
  }

  @UseGuards(AuthGuard)
  @Put('dossier/:id')
  async update(@Res() response, @Param('id') id:string, @Body() updateDossierDto: Dossier) {
    try {
      const existingStudent = await this.dossierService.update(id, updateDossierDto);
      console.log(existingStudent);
      return response.status(HttpStatus.OK).json({
        message: 'Folder has been successfully updated',
        existingStudent,});
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('dossier/:id')
  async remove(@Res() response,@Param('id') id: string) {
    try {
      const deletedStudent = await this.dossierService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Folder deleted successfully',
        deletedStudent,});
    }catch (err){
      return response.status(err.status).json(err.response);
    }
  }
}
