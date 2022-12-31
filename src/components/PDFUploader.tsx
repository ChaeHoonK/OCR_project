import type { NextPage } from "next";
import type { Transaction, Batch } from "../types/types";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import RowSpacer from "../components/RowSpacer";
import Account from "../components/Account";
import { createExcelWithNaverOCR } from "../library/parseOCR";
import { sheetJSONtoBatch } from "../library/excel";
import { fetch, Body } from "@tauri-apps/api/http";

type Base64String = string;

const myURL = process.cwd();


const PDFUploader = () => {
  const [data, setData]: [any, any] = useState(null);
  const [response, setResponse]: [Batch | null, any] = useState(null);
  const [totalBuy, setTotalBuy] = useState(0);
  const [log, setLog] = useState('')

  function Log(log: string) {
    setLog(log +`\n log`)
  }

  function calculateTotalBuy() {
    if (!response) return 0;

    let sum = 0;

    response.releases.forEach((release: Transaction) => {
      sum += release.quantity * 1000;
    });
    return sum / 1000;
  }

  async function postExcelData(buffer: Base64String) {
    // const res = await fetch(url, {
    //   method: "POST",
    //   body: buffer,
    // });
    Log("postExcelData Exec")
    var data = {
      images: [
        {
          format: "pdf",
          name: "medium",
          data: buffer,
        },
      ],
      lang: "ko",
      requestId: "string",
      resultType: "string",
      timestamp: 1666000770,
      version: "V1",
    };

    var config: any = {
      method: "POST",
      url: "https://e12jmcc18h.apigw.ntruss.com/custom/v1/18663/af20371580e216df3ed4b5cecde7d99a097764d29425c34551bd4f3d6d577bd6/general",
      headers: {
        "X-OCR-SECRET": "ZEN3UW9meWR2WVRPQ0JyT3NRQkxqanluamViVGlqa2Q=",
        "Content-Type": "application/json",
      },
      body: {
        type: "Json",
        payload: data,
      },
    };

    await fetch(
      "https://e12jmcc18h.apigw.ntruss.com/custom/v1/18663/af20371580e216df3ed4b5cecde7d99a097764d29425c34551bd4f3d6d577bd6/general",
      config
    )
      .then(async function (response: any) {
        console.log(response.data.images[0].fields);
        const ws_json = await createExcelWithNaverOCR(response.data);
        const res = sheetJSONtoBatch(ws_json);
        setResponse(res);
      })
      .catch(function (error: Error) {
        console.log(error);
      });

    // res.json().then((body) => {
    //   setResponse(JSON.parse(`${body.body}`));
    // });
  }

  async function postExcelDataTest(buffer: Base64String) {
    Log("postExcelTestData Exec")
    const pdf_json: string = require("../static/pdf2.json");

    const ws_json = await createExcelWithNaverOCR(pdf_json);
    console.log(ws_json);

    const res = sheetJSONtoBatch(ws_json);
    setResponse(res);
  }

  return (
    <div>
      <Box>
        <Button
          onClick={() => {
            var buffer: Base64String = Buffer.from(data.result).toString(
              "base64"
            );
            postExcelData(buffer);
          }}
          disabled={data ? false : true}
        >
          REST API Request
        </Button>

        <Button
          onClick={async () => {
            //  const res = await fetch('https://tdrtoaak6ymofqtrpgqmbyi6ke0aavdu.lambda-url.us-east-2.on.aws/')
            //  res.json().then((body)=> {
            //   alert(body.hi)
            //  })
          }}
        >
          Log
        </Button>

        <button
          onClick={() => {
            var buffer: string = Buffer.from(data.result).toString("base64");
            postExcelDataTest(buffer);
          }}
          disabled={data ? false : true}
        >
          Test API Requeest
        </button>

        <button
          id="button"
          onClick={() => {
            // navigator.clipboard.writeText(
            //   Buffer.from(data.result).toString("base64")
            // );
          }}
        >
          copy data to clipboard
        </button>
      </Box>

      <RowSpacer />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const reader = new FileReader();
          setData(reader);

          const file: any = e.target.files;
          if (file[0]) {
            reader.readAsArrayBuffer(file[0]);
          }
        }}
      />
      <Button>
        <a href="/out.xlsb" download>
          download excel
        </a>
      </Button>
      <p>{log}</p>

      {response ? (
        <>
          <Button
            onClick={() => {
              console.log(response);
            }}
          >
            Show response
          </Button>
          {/* <p>합계 {calculateTotalBuy()}</p> */}
          <Account batch={response} />
        </>
      ) : (
        <p> 먼저 파일을 업로드해주세요</p>
      )}
    </div>
  );
};

export default PDFUploader;

//const loadStatusElement = useRef<HTMLParagraphElement>(null);

//<p ref={loadStatusElement}>load pdf file</p>

// reader.addEventListener('loadend',(e)=>{
//     if (loadStatusElement.current) {
//       loadStatusElement.current.innerText = loadStatusElement.current.innerText + "\n loaded"
//     }

//     )
// reader.addEventListener('load', (e)=> {
//               if (loadStatusElement.current) {
//                 loadStatusElement.current.innerText = loadStatusElement.current.innerText + "\n load start"
//               }
//             })
