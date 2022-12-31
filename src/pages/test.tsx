import type { NextPage } from "next";
import type { Transaction, Batch, Product } from "../types/types";
import { useState, useEffect } from "react";
import PDFUploader from "../components/PDFUploader";

import Account from "../components/Account";

const sample_batch : Batch = require("../static/sample_batch.json")


/**
 *
 * @param props {}
 * @returns
 */
const Test: NextPage = () => {

  return (
    <>
    <PDFUploader/>
    </>
  );
};

export default Test;


// {
//   releases: [
//     {
//       product: {id : "03", name : "소시지"},
//       client: {id : "03", name : "소시지"},
//       price: 16000,
//       quantity: 184.76,
//       box: 21
//     },
//     {
//       product: {id : "04", name : "맛있는고"},
//       client: {id : "03", name : "소시지"},
//       price: 13000,
//       quantity: 122.92,
//       box: 21
//     },
//   ],
//   client: { id: '주식회사 선우 프레시', name: '4' }
// }