import { Document } from "mongoose";

export interface Purchase extends Document {
    readonly type: string,
    readonly receipt: string,
    readonly validateData: any,
    readonly purchaseData: any,
}
