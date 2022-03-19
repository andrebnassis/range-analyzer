export interface IRange {
    from: number | undefined,
    to: number | undefined
}

export interface IRangeIdentity extends IRange {
    id: string
}