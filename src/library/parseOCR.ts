import path from "path";
import getConfig from "next/config";
import type { Product } from "../types/types";
import { readBinaryFile, BaseDirectory, writeBinaryFile, createDir,exists } from '@tauri-apps/api/fs';
// Read the image file in the `$RESOURCEDIR/avatar.png` path


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

export async function createExcelWithNaverOCR(input: string) {
  var XLSX = require("xlsx");
  var product_code = require("../public/product_code.json").data;


  const product_map : Map<Product["id"], Product["name"]> = new Map();
  product_code.map((e: any) => {
    //Get value(ID code of product) by (name of product)
    product_map.set(prettifyString(e.value), e.key);
  });
  const aoa = parseNaverOcrResponseToAOA(JSON.stringify(input));


  var sum : any = 0;


  const json_aoa = aoa.map((array: string[]) => {
    const json = listToJson(array, product_map);
    sum += json["공급가"];
    return json;
  });

  json_aoa[0]["거래일(예:2018-01-01)"] = new Date().toISOString().slice(0, 10);
  json_aoa[0]["거래금액"] = sum;

  const contents = await readBinaryFile('MyTauri/out.xlsb', { dir: BaseDirectory.AppData });

  const workbook = XLSX.read(contents.buffer, {type: "buffer"});


  const worksheet = XLSX.utils.json_to_sheet(json_aoa, { header: colNames });

  XLSX.utils.book_append_sheet(workbook, worksheet, "입고");
  workbook.Sheets["입고"] = worksheet;

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsb" });

  const folderName = '명세서/'
  const bool = await exists(folderName,{ dir: BaseDirectory.Desktop})

  if (!bool) {
    await createDir(folderName, { dir: BaseDirectory.Desktop, recursive: true });
  }

  let date : Date|string = new Date()
  date = date.toISOString().slice(0,10)
  var count = 0
  var fileName = `명세서 ${date} - ${count}.xlsb`
  var bool2 = await exists(folderName+fileName,{ dir: BaseDirectory.Desktop})



  while (bool2) {
    count ++;
    fileName = `명세서 ${date} - ${count}.xlsb`
    bool2 = await exists(folderName+fileName,{ dir: BaseDirectory.Desktop})
  }

  await writeBinaryFile(folderName+fileName,buf, { dir: BaseDirectory.Desktop} )


  return XLSX.utils.sheet_to_json(worksheet);
}

/**
 * 
 * @param input string
 * @returns 쓸데 없는 데이터 다 없앤 어레이(리스트)
 */
export function parseNaverOcrResponseToAOA(input: string) {

  console.log('parseNaverOcrResponseToAOA Triggered')

  const {
    images: [{ fields }],
  } = JSON.parse(input);

  console.log(fields)

  var start_index = fields.findIndex((e: any) => e.inferText == "부가세");
  //var end_index = fields.findIndex(e => e.inferText == '합계')
  var end_index;
  if ((end_index = fields.findIndex((e: any) => e.inferText == "합계")) != -1) {
  } else if (
    (end_index = fields.findIndex((e: any) => e.inferText == "합계:")) != -1
  ) {
  } else if (
    (end_index = fields.findIndex((e: any) => e.inferText == "합계 : ")) != -1
  ){}else if (
    (end_index = fields.findIndex((e: any) => e.inferText == "합계: ")) != -1
  ){}else if (
    (end_index = fields.findIndex((e: any) => e.inferText == "합계 :")) != -1
  ){} else {
    end_index = -1;
  }
  var sliced = fields.splice(start_index + 1, end_index);
  const final_list: any = [];
  var new_list: any = [];
  for (var i = 0; i < sliced.length; i++) {
    if (sliced[i].inferText == "(실중량)") {
      var s = [...new_list];
      final_list.push(s);
      clearList(new_list);
      continue;
    }
    new_list.push(sliced[i].inferText);
  }
  return final_list;
}

function prettifyString(string: string): string {
  const to_return = string
    .replace(/\./g, " ")
    .replace(/\,/g, " ")
    .replace("(0*0)(L/C)", " ")
    .replace(/\s\s/g, " ");
  return to_return;
}

function nth_words(string: string, number: number) {
  const string_array = string.split(" ");
  var to_return = "";
  for (var i = 0; i < number; i++) {
    to_return = to_return + string_array[i] + " ";
  }
  to_return.trimEnd();
  return to_return;
}

function string_match(array: string[], string: string) {
  const match = array.filter((value) => value.startsWith(string));

  return match;
}

export function listToJson(
  final_list: string[],
  product_map: Map<string, string>
) {
  const to_return: any = {};

  const string_array: string[] = [];
  product_map.forEach((value, key, map) => {
    string_array.push(key);
  });
  var name = prettifyString(final_list[0]);
  to_return["품목명"] = name;
  name = nth_words(name, 3);
  const array = string_match(string_array, name);

  to_return["품목코드"] = product_map.get(array[0]);

  to_return["순번"] = 1;
  to_return["구분"] = 2;
  to_return["거래처명"] = "주식회사 선우 프레시";

  if (final_list[3] == "Box") {
    final_list[2] = final_list[2] + "Box";
    final_list.splice(3, 1);
  }

  to_return["규격"] = final_list[2];
  to_return["수량"] = parseFloat(final_list[3].replace(/\,/g, ""));
  to_return["단가"] = parseFloat(final_list[4].replace(/\,/g, ""));
  to_return["공급가"] = parseFloat(final_list[5].replace(/\,/g, ""));
  to_return["합계금액"] = parseFloat(final_list[5].replace(/\,/g, ""));
  to_return["단위"] = "kg";
  to_return["코드"] = "4";
  to_return["유형"] = "2";

  return to_return;
}

function clearList(list: any[]) {
  while (list.length > 0) {
    list.pop();
  }
}
