import { Document } from "mongoose";

export interface Purchase extends Document {
    readonly productId: string,
    readonly bundleId: string,
    readonly type: string,
    readonly price: number,
    readonly createTime: number,
    readonly updateTime: number
}
