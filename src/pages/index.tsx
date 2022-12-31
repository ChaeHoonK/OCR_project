import type { NextPage } from 'next'
import type { Transaction, Batch } from '../types/types'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef } from 'react'
import PDFUploader from '../components/PDFUploader'
//import { appDataDir } from '@tauri-apps/api/path';
// Check if the `$APPDATA/avatar.png` file exists
import { appDataDir } from '@tauri-apps/api/path';
import { writeBinaryFile, BaseDirectory,createDir,exists } from '@tauri-apps/api/fs';



const Home: NextPage = () => {
  
  return (
    <>
      <PDFUploader/>
      <button onClick={async()=>{
        // const appDataDirPath = await appDataDir();
        // console.log(appDataDirPath)
        const bool = await exists('MyTauri', { dir: BaseDirectory.AppData})
        if (!bool) {
          await createDir('MyTauri', { dir: BaseDirectory.AppData, recursive: true });
        }
        
        

      }}>init</button>
    </>
  )
}

export default Home
