import type mongoose from "mongoose"

type TCreateHotel={
    name: string,
    description: string,
    address: string,
    location: string,
    images?: string[],
    manager?: mongoose.Types.ObjectId,
}

type THotel= TCreateHotel & {
    owner: mongoose.Types.ObjectId,
    rating: number,
    reviewCount: number,
    status: string
}

export type { TCreateHotel, THotel }