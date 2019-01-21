import { Document } from "mongoose";

export interface UserStats extends Document {
    readonly timestamp: number,
    readonly server: string,
    readonly namespace: string,
    readonly module: string,
    readonly userId: string,
    readonly uuid: string,
    readonly clientIp: string,
    readonly operationName: string,
    readonly fieldName: string,
    readonly other: string,
}
