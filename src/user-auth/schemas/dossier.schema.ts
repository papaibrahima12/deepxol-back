import { Document, Schema } from "mongoose";
import { Dossier } from "src/api/entities/dossier/dossier";

export type DossierDocument = Dossier & Document

export const DossierSchema = new Schema<Dossier>({
    dossierNumber: String,
    fullName: String,
    phone: String,
    pathologie: String,
    address: String,
    electro: String,
    diagnostic: {
        type: String,
        default: "NON"
    },
    comment: String,
    gender: String,
    race: String,
    antecedant: [String],
    implantationOlder: String,
    fibrilationLoad: String,
    age: String,
    insuffisanceCardiaque: String,
    tach_arter: {
        type: String,
        default: "NON"
    },
    tach_arter_value:String,
    chads_vasc:String,
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
    timestamps: true },
)

