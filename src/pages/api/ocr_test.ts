// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { createExcelWithNaverOCR } from "../../library/parseOCR";
import {sheetJSONtoBatch} from "../../library/excel"

type Data = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const pdf_json: string = require("../../static/pdf2.json");

  const ws_json = createExcelWithNaverOCR(JSON.stringify(pdf_json));

  const body = JSON.stringify(sheetJSONtoBatch(ws_json))

  res.status(200).send({ body: body });
}
