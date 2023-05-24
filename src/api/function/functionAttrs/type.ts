export type FunctionAttrs = {
  functionName: string
  lineOfCode: number
  cyclo: number
  tokenCount: number
  parameterCount: number
}

export type FileCYCLOInfo = {
  CYCLOInfo: FunctionAttrs[]
  filename: string
  path: string
}

export type TableDataItem = {
  CYCLOInfo: FunctionAttrs
  filename: string
  path: string
}
