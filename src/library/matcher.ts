import { Batch, Product, Transaction } from "../types/types";

export interface Matcher {
    data : object[],
    products : Product[] | null 
    client_name : string | null
}

export type MyClient = {
    key : string,
    value : string,
    등심? : number,
    부채? : number,
    토시? : number,
    갈비? : number
}



export class Matcher {
    constructor(data : any) {
        this.data = data.data; 
        this.products = null;
        this.client_name = null;
    }
    setClientName(client_name :string):void{
        this.client_name = client_name
    }

    findValueByName(name : string)  {        
        const match = this.data.find((e : any)=>{
            return e.value == name;
        })
        return match;
    }

    findIdByName(name : string) {
        const result :any = this.findValueByName(name);

        return result?.key ?? 0;
    }

    findPriceByNameAndType(name: string, type : string) : number {
        const match : any= this.findValueByName(name)

        switch(type) {
            case "척아이롤":
                return match?.등심 ?? 0;
            case "부채살":
                return match?.부채 ?? 0;
            case "토시살":
                return match?.토시 ?? 0;
            case "갈비살":
                return match?.갈비 ?? 0;
            default :
                return 0;
                
        }
     }

    parseProduct(productName : string) : string {
        return productName.split(' ')[1]
    }

    findPriceByTransaction(transaction : Transaction) : number {
        return this.findPriceByNameAndType(transaction.client.name, this.parseProduct(transaction.product.name))
    }

    productListByBatch(batch : Batch) {
        const products : Product[] = batch.releases.map((transaction : Transaction) => {
            return transaction.product;
        })
        this.products = products;
        return this.products;
    }

}

