import { Document } from "mongoose";

export interface Receipt extends Document {
    readonly type: string,
    readonly receipt: string,
    readonly userId: string,
    readonly validateData: string,
    readonly purchaseData: string,
}
