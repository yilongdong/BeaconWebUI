// export interface SearchRangeOption {
//     label: string;
//     value: string | number;
//     children?: SearchRangeOption[]
// }

export interface ProjectInfo {
  readonly id: string | number
  name: string
  path?: string
  author?: string
  translation_unit_ids?: Array<string>
}

export interface TranslationUnitInfo {
  readonly _id: string | number
  path?: string
  inclusion_ids?: Array<string>
  class_ids?: Array<string>
}

export interface CXXMethod {
  name: string
  access: string
}

export interface CXXField {
  name: string
  type: string
  access: string
}

export interface CXXBase {
  name: string
  type: string
  access: string
  is_virtual: boolean
}

export interface CXXClassInfo {
  readonly _id: string | number
  name: string
  methods?: Array<CXXMethod>
  fields?: Array<CXXField>
  bases?: Array<CXXBase>
}

export interface CXXInclusionInfo {
  readonly _id: string | number
  path: string
  location: {
    lineno: number
    column: number
    path: string
  }
}

export interface GraphInfo<NodeType, EdgeType> {
  nodes: Array<NodeType>
  edges: Array<EdgeType>
}
