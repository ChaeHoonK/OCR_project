import type { Transaction, Batch, Product } from "../types/types";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import BatchComponent from "../components/BatchComponent";
import RowSpacer from "../components/RowSpacer";
import ColSpacer from "./ColSpacer";
import Card from "@mui/material/Card";
import { Button, Modal } from "@mui/material";


// Batch List 지우는 과정에서 자잘한 버그들이 있음 추후에 수정해야함


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Account = ({ batch }: { batch: Batch }) => {

  const [batchList, setBatchList] = useState<Batch[]>([]);
  const [totalAccountQuantity, setTotalAccountQuantity] = useState<number>(0);

  function calculateTotalAccountQuantity() {
    let number = 0;
    batchList.forEach((batch) => {
      if (batch.totalQuantity) number += batch.totalQuantity * 1000;
    });
    setTotalAccountQuantity(number / 1000);
  }

  const products: Product[] = batch.releases.map((transaction: Transaction) => {
    return transaction.product;
  });



  const addBatch = () => {
    const tmp = [...batchList];
    tmp.push({ client: { id: "14", name: "왔쏘 홍성점" }, releases: [] });
    setBatchList(tmp);
  };

  const handleDeleteBatch = (index: number) => {
    batchList.splice(index, 1);
    setBatchList([...batchList]);
    calculateTotalAccountQuantity();
  };

  //Modal Setting
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid blue",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {batchList.map((batch: Batch, key) => (
        <Card key={key} sx={{ flex: 1, minWidth: 400 }}>
          <BatchComponent
            product_list={products}
            batch={batch}
            index={key}
            onRemove={handleDeleteBatch}
            calculateTotalAccountQuantity={calculateTotalAccountQuantity}
          />
        </Card>
      ))}

      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        //hideBackdrop
        open={open}
        onClose={(e, reason) => {
          handleClose()
          console.log(e)
          console.log(reason)
        }}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <button onClick={addBatch}>Add Batch</button>
            <button onClick={() => console.log(batchList)}>Current</button>
            <button onClick={() => console.log(products)}>Sample array</button>
            <button
              onClick={async () => {
                const res = await fetch(
                  "http://localhost:3000/api/release_test",
                  {
                    method: "POST",
                    body: JSON.stringify(batchList),
                  }
                );
                res.json().then((body) => console.log(body));
                window.open("http://localhost:3000/out_release.xlsb");
              }}
            >
              API Requeest
            </button>
            <p>전체 : {totalAccountQuantity}</p>
          </Box>
          <Button onClick={handleClose}>창 닫기</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Account;
