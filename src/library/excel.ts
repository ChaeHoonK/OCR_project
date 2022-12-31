import path from "path";
import getConfig from "next/config";
import type { Transaction, Batch } from "../types/types";
import { writeBinaryFile, BaseDirectory, exists } from '@tauri-apps/api/fs';

const colNames = [
  "순번",
  "거래일(예:2018-01-01)",
  "구분",
  "코드",
  "거래처명",
  "유형",
  "적요",
  "결제 장부",
  "거래금액",
  "품목코드",
  "품목명",
  "규격",
  "단위",
  "수량",
  "단가",
  "공급가",
  "부가세",
  "합계금액",
  "창고코드",
  "창고명",
  "비고",
  "프로젝트(범 주)",
  "은행코드",
  "카드코드",
];

 export  const addToExcel = async (batches: Batch[]) => {
  var XLSX = require("xlsx");
  //var fs = require("fs");
  
  const { serverRuntimeConfig } = getConfig();
  const input_dir = path.join(
    serverRuntimeConfig.PROJECT_ROOT,
    "./public/out.xls"
  );
  const output_dir = path.join(
    serverRuntimeConfig.PROJECT_ROOT,
    "./public/out_release.xlsb"
  );
  

  const json_array = batches.map((batch: Batch) => {
     return toJSONArray(batch);
  });

  const final_array = flatten(json_array)

  const workbook = XLSX.readFile(input_dir);


  console.log(workbook.SheetNames)

  const worksheet = XLSX.utils.json_to_sheet(final_array, { header: colNames });

  XLSX.utils.book_append_sheet(workbook, worksheet, "출고");

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsb" });
  //fs.writeFileSync(output_dir, buf);
  await writeBinaryFile('test/out2.xlsb',buf, { dir: BaseDirectory.Desktop} )

  return XLSX.utils.sheet_to_json(worksheet);
};

export const toJSONArray = (batch: Batch) => {
  
  var sum = 0;
  var count = 1;
  const to_return = batch.releases.map((release : any) => {
    const to_add: any = toFullRow(release);
    sum += to_add["공급가"];
    to_add["순번"] = count;
    count++;
    return to_add;
  })

  to_return.at(0)["거래일(예:2018-01-01)"] = new Date().toISOString().slice(0, 10);
  to_return.at(0)["거래금액"] = sum;

  return to_return;
};

export const toFullRow = (release: Transaction): string => {
  const to_return: any = {};
  to_return["코드"] = release.client.id;
  to_return["거래처명"] = release.client.name;
  to_return["규격"] = release.box + " box";
  to_return["수량"] = release.quantity;
  to_return["단가"] = release.price;
  to_return["공급가"] = release.price * release.quantity;
  to_return["품목코드"] = release.product.id;
  to_return["품목명"] = release.product.name;
  to_return["합계금액"] = to_return["공급가"];
  to_return["단위"] = "kg";
  to_return["구분"] = "1";
  to_return["유형"] = "2";
  return (to_return);
};

function flatten(arr : any) {
  return [].concat(...arr);
}

export const sheetJSONtoBatch = (ws_json : any) => {
  const transactions = ws_json.map((row : any)=> {
    return sheetJSONtoTransaction(row)
  });
  const batch : Batch = {releases : transactions, client : {id : ws_json[0]['거래처명'], name : ws_json[0]['코드']}}
  return batch;
}

export const sheetJSONtoTransaction = (row_json : any):Transaction => {
  const transaction : Transaction = 
  {product : {id : row_json['품목코드'],
   name : row_json['품목명']},
   client : {id : '', name : ''}, 
   price : row_json['단가'],
   quantity : row_json['수량'],
   box : extractNumFrom(row_json['규격']) }
   row_json['']

  return transaction
}

export function extractNumFrom(string : string):number {
  
  var num = "'foofo21".match(/\d+/g);

  if (num == null)
    return 0;

  return Number(num[0]);
}
