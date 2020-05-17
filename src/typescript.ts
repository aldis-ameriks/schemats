/**
 * Generate typescript interface from table schema
 * Created by xiamx on 2016-08-10.
 */

import * as _ from 'lodash'

import { TableDefinition } from './schemaInterfaces'
import Options from './options'

function nameIsReservedKeyword (name: string): boolean {
    const reservedKeywords = [
        'string',
        'number',
        'package'
    ]
    return reservedKeywords.indexOf(name) !== -1
}

function normalizeName (name: string, options: Options): string {
    if (nameIsReservedKeyword(name)) {
        return name + '_'
    } else {
        return name
    }
}

export function generateTableInterface (tableNameRaw: string, tableDefinition: TableDefinition, options: Options) {
    const tableName = options.transformTypeName(tableNameRaw)
    let members = ''
    Object.keys(tableDefinition).map(c => options.transformColumnName(c)).forEach((columnName) => {
        let nullable = tableDefinition[columnName].nullable ? '?' : ''
        members += `${columnName}${nullable}: ${tableName}Fields.${normalizeName(columnName, options)};\n`
    })

    return `
        export interface ${normalizeName(tableName, options)} {
        ${members}
        }
    `
}

export function generateEnumType (enumObject: any, options: Options) {
    let enumString = ''
    for (let enumNameRaw in enumObject) {
        const enumName = options.transformTypeName(enumNameRaw)
        enumString += `export enum ${enumName} {\n`
        enumString += enumObject[enumNameRaw].map((v: string) => `  ${v} = '${v}'`).join(',\n')
        enumString += '\n};\n'
    }
    return enumString
}

export function generateTableTypes (tableNameRaw: string, tableDefinition: TableDefinition, options: Options) {
    const tableName = options.transformTypeName(tableNameRaw)
    let fields = ''
    Object.keys(tableDefinition).forEach((columnNameRaw) => {
        let type = tableDefinition[columnNameRaw].tsType
        const columnName = options.transformColumnName(columnNameRaw)
        fields += `export type ${normalizeName(columnName, options)} = ${type};\n`
    })

    return `
        export namespace ${tableName}Fields {
        ${fields}
        }
    `
}
