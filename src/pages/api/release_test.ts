// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Transaction,Batch } from '../../types/types'

import { addToExcel } from '../../library/excel'

type Data = {
  body: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
const batches : Batch[] = JSON.parse(req.body)

const ws_json = addToExcel(batches);

console.log(ws_json);

res.status(200).send({body : "success"})
}
