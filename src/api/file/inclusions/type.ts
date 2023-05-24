export type InclusionData = {
  name: string
  children?: InclusionData[]
}

export type InclusionRawLinkData = {
  path: string
  inclusions?: { path: string }[]
}
