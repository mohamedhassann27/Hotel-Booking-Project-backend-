type TCreateBooking= {
    checkIn: Date;
    checkOut: Date;
    roomsNumber: number;
    guestsNumber: number;
}

type TBooking= TCreateBooking & {
    _id: string;
    customer: string;
    hotel: string;
    room: string;
    pricePerNight: number;
}

export type {TCreateBooking, TBooking}