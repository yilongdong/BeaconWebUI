export type TypeRawData = {
  name: string
}
export type ParamRawData = {
  name: string
  type: TypeRawData
}
export type MethodRawData = {
  name: string
  params?: ParamRawData[]
  access: string
  fullname: string
  returnType: TypeRawData
}
export type FieldRawData = {
  name: string
  type: TypeRawData
  access: string
}
export type BaseRawData = {
  type: TypeRawData
  isVirtual: boolean
}
export type RelationRawData = {
  from: string
  to: string
}
export type ClassRawData = {
  name: string
  fields?: FieldRawData[]
  methods?: MethodRawData[]
  bases?: BaseRawData[]
  relations?: RelationRawData[]
  namespace: string
  isStruct: boolean
}
export type ClassUMLNodeFieldData = {
  name: string
  type: string
  access: string
  default?: string
}
export type ClassUMLNodeMethodParamData = {
  name: string
  type: string
}
export type ClassUMLNodeMethodData = {
  name: string
  parameters?: ClassUMLNodeMethodParamData[]
  access: string
}
export type ClassUMLNodeData = {
  key: string
  name: string
  fields?: ClassUMLNodeFieldData[]
  methods?: ClassUMLNodeMethodData[]
}

export type ClassUMLLinkData = {
  from: string
  to: string
  relationship: string
}
