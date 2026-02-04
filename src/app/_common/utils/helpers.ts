import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";

export module Helpers {
    export function isNull(value: any): boolean {
        return value == null || value == undefined || typeof value === 'undefined';
    }

    export function isNullOrZero(value: any): boolean {
        return value == null || value == undefined || typeof value === 'undefined' || value == 0 || value == "0";
    }

    export function isNullEmptyOrWhiteSpace(texto: string): boolean {
        if (isNull(texto)) {
          return true;
        }
        return texto == '' || texto == ' ';
      }

      export function isString(value): boolean {
        return typeof value === 'string' || value instanceof String;
      }
    
      export function isNumber(value): boolean {
        return typeof value === 'number' && isFinite(value);
      }

      export function isBoolean(value): boolean {
        return typeof value === 'boolean';
      }
    
      export function isDate(value): boolean {
        return value instanceof Date;
      }
    
      export function isZero(value): boolean {
        return (value === 0);
      }

      export function convertToDS(model: any): DataSource {
        let dataSource = new DataSource({
          store: model,
          paginate: true,
          pageSize: 10
        });
    
        return dataSource
      }

      export function convertToDataSource(model: any, idName: string = 'id'): DataSource {
        let dataSource = new DataSource({
          store: new ArrayStore({
            key: idName,
            data: model,
          }),
          paginate: true,
          pageSize: 10
        });
    
        return dataSource
      }
}