// Ambient node-yolog definition file.
// This file is pretty much just a interface for the node.js module 'node-yolog' (the lib used for logging).

declare module 'node-yolog' {

  export function setObjectMaxDepth(value: number);
  export function setFunctionName(state: boolean);
  export function setColor(tag: string, color: string);
  export function set(value: boolean, ...args: any[]);
  export function get(tag: string): boolean;
  
  export function trace(...args: any[]);
  export function debug(format: string, ...args: any[]);
  export function error(format: string, ...args: any[]);
  export function warning(format: string, ...args: any[]);
  export function info(format: string, ...args: any[]);
  export function todo(format: string, ...args: any[]);
}
