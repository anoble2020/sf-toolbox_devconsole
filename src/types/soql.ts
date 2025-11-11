export interface SObjectInfo {
  name: string
  label: string
  labelPlural: string
  custom: boolean
  keyPrefix?: string
  queryable: boolean
  searchable: boolean
  retrieveable: boolean
  createable: boolean
  updateable: boolean
  deletable: boolean
  undeletable: boolean
  mergeable: boolean
  replicateable: boolean
  triggerable: boolean
  deprecatedAndHidden: boolean
  activateable: boolean
  layoutable: boolean
  customSetting: boolean
  compactLayoutable: boolean
  recordTypeInfos?: RecordTypeInfo[]
  urls: {
    sobject: string
    describe: string
    rowTemplate: string
  }
}

export interface RecordTypeInfo {
  name: string
  recordTypeId: string
  available: boolean
  defaultRecordTypeMapping: boolean
  master: boolean
}

export interface FieldInfo {
  name: string
  label: string
  type: string
  unique: boolean
  nillable: boolean
  caseSensitive: boolean
  externalId: boolean
  idLookup: boolean
  createable: boolean
  updateable: boolean
  sortable: boolean
  filterable: boolean
  groupable: boolean
  custom: boolean
  calculated: boolean
  cascadeDelete?: boolean
  restrictedPicklist: boolean
  nameField: boolean
  autoNumber: boolean
  byteLength: number
  digits?: number
  displayLocationInDecimal: boolean
  encrypted: boolean
  htmlFormatted: boolean
  dependentPicklist: boolean
  deprecatedAndHidden: boolean
  displayFormat?: string
  inlineHelpText?: string
  mask?: string
  maskType?: string
  picklistValues?: PicklistValue[]
  referenceTo?: string[]
  relationshipName?: string
  relationshipOrder?: number
  restrictedDelete: boolean
  writeRequiresMasterRead: boolean
  defaultValue?: any
  defaultValueFormula?: string
  defaultedOnCreate: boolean
  dependentPicklistValues?: DependentPicklistValue[]
  extraTypeInfo?: string
  isHighScaleNumber: boolean
  isHtmlFormatted: boolean
  isNameField: boolean
  isSortable: boolean
  isUnique: boolean
  isWriteRequiresMasterRead: boolean
  length: number
  precision: number
  scale: number
  soapType: string
  toLabel?: string
  validFor?: string
  valueType?: string
}

export interface PicklistValue {
  active: boolean
  defaultValue: boolean
  label: string
  validFor?: string
  value: string
}

export interface DependentPicklistValue {
  controllingField: string
  value: string
  validFor: string
}

export interface SObjectDescribe {
  name: string
  label: string
  labelPlural: string
  custom: boolean
  keyPrefix?: string
  queryable: boolean
  searchable: boolean
  retrieveable: boolean
  createable: boolean
  updateable: boolean
  deletable: boolean
  undeletable: boolean
  mergeable: boolean
  replicateable: boolean
  triggerable: boolean
  deprecatedAndHidden: boolean
  activateable: boolean
  layoutable: boolean
  customSetting: boolean
  compactLayoutable: boolean
  recordTypeInfos?: RecordTypeInfo[]
  fields: FieldInfo[]
  urls: {
    sobject: string
    describe: string
    rowTemplate: string
  }
}

export interface QueryContext {
  position: number
  line: number
  column: number
  currentWord: string
  context: 'SELECT' | 'FROM' | 'WHERE' | 'ORDER_BY' | 'GROUP_BY' | 'HAVING' | 'UNKNOWN'
  sobject?: string
  relationshipPath?: string[]
}

export interface CompletionItem {
  label: string
  value: string
  type: 'field' | 'sobject' | 'relationship'
  description?: string
  insertText?: string
  sortText?: string
  referencedSObject?: string
}
