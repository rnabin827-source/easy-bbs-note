import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: bigint;
    title: string;
    content: string;
    subject: string;
    year: Year;
}
export enum Year {
    y1 = "y1",
    y2 = "y2",
    y3 = "y3"
}
export interface backendInterface {
    addNote(title: string, subject: string, year: string, content: string): Promise<Note>;
    getNotes(year: string | null): Promise<Array<Note>>;
}
