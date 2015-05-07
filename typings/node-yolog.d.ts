
declare module 'node-yolog' {
  export function setObjectMaxDepth(value: number);
  export function setFunctionName(state: boolean);
  export function setColor(tag: string, color: string);
  export function set(value: boolean, args: any);
  export function get(tag: string): boolean;
  
  export function trace(...args: any[]);
  export function debug(format: string, ...args: any[]);
  export function error(format: string, ...args: any[]);
  export function warning(format: string, ...args: any[]);
  export function info(format: string, ...args: any[]);
  export function todo(format: string, ...args: any[]);
  
  export interface Yolog {
    setObjectMaxDepth(value: number);
    setFunctionName(state: boolean);
    setColor(tag: string, color: string);
    set(value: boolean, ...args: any[]);
    get(tag: string): boolean;
    
    trace(args: any);
    debug(format: string, ...args: any[]);
    error(format: string, ...args: any[]);
    warning(format: string, ...args: any[]);
    info(format: string, ...args: any[]);
    todo(format: string, ...args: any[]);
  }  
}
