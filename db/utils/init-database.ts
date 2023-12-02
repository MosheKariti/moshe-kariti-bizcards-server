import mongoose from "mongoose";

export type Role = {
    name: string;
}
export type Name = {
    first: string;
    middle: string
    last: string;
}
export type Address = {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number
}