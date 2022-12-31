import type { NextPage } from 'next'
import type { Transaction, Batch } from '../types/types'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef } from 'react'
import PDFUploader from '../components/PDFUploader'
import SearchTextField from '../components/SearchTextField'

const sample_list = {
  "data": [
    { "key": "46", "value": "주식회사 삼성굿미트" },
    { "key": "45", "value": "주식회사 에이티미트" },
    {
      "key": "44",
      "value": "야호숯불구이",
      "부채": 15500,
      "토시": 17500,
      "갈비": 23000
    },
    { "key": "43", "value": "소노휴 양평" },
    { "key": "42", "value": "(주)소노인터내셔널 삼성지점" },
    { "key": "40", "value": "천지축산(주)" },
    { "key": "39", "value": "(주)혜성프로비젼" },
    { "key": "38", "value": "더프라임(용인점)" },
    { "key": "37", "value": "낙원갈비 산남점" },

    ]
  }

const Home: NextPage = () => {
  return (
    <>
    <PDFUploader/>

    </>
  )
}

export default Home
