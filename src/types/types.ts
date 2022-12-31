/**
 * @type client : {id: string, name: string}
 * @type product : {id: string, name: string}
 * @type price : number
 * @type quantity : number
 * @type box : number
 */
export interface Transaction {
    product : Product,
    price : number,
    quantity : number,
    box : number
    client : Client,
}
/**
 * 상대방
 * @type : {id : string, name : string}
 */
export interface Client {
    id : string,
    name : string
}

/**
 * @type {{id : string, name : name}}
 */
export interface Product {
    id : string,
    name : string
}
/** 
 * @property client Client | null
 * @property releases Transaction[]
 * @property date {string}
 **/ 
export interface Batch {
    client : Client | null,
    releases : Transaction[],
    date? : string,
    totalQuantity?:number,
} 