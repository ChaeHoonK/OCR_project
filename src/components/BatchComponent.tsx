import type { Product, Batch, Transaction } from "../types/types";
import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Row from "./Row";
import RowSpacer from "./RowSpacer";
import clients from "../public/client_code.json";
import { Matcher } from "../library/matcher";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchTextField from "./SearchTextField";



/**
 * @param product_list - product list for current context
 * @param Batch
 * @param index - for delete listing element
 * @param onRemove - delete current batch param is index
 */
const BatchComponent = ({
  product_list,
  batch,
  index,
  onRemove,
  calculateTotalAccountQuantity
}: {
  product_list: Product[];
  batch: Batch;
  index: any;
  onRemove: any;
  calculateTotalAccountQuantity : any
}) => {
  const matcher = new Matcher(clients);
  const [client, setClient] = useState("왔쏘 홍성점");
  const [rowList, setRowList] = useState<Transaction[]>(batch.releases);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  function calculateTotalQuantity() {
    let number = 0;
    batch.releases.forEach((transaction) => {
      number += transaction.quantity * 1000;
    });
    batch.totalQuantity = number/1000;
    setTotalQuantity(number/1000);
    calculateTotalAccountQuantity()
  }

  const addRow = () => {
    const tmp = [...rowList];
    tmp.push({
      product: { id: "", name: "" },
      price: 0,
      quantity: 0,
      box: 0,
      client: { id: "14", name: "왔쏘 홍성점" },
    });
    batch.releases = tmp;
    setRowList(tmp);
  };

  const handleChangeClient = (
    event: React.ChangeEvent<HTMLInputElement>,
    new_value?: any
  ) => {
    let name = "";
    if (new_value) {
      name = new_value;
    } else {
      name = event.target.value;
    }
    matcher.setClientName(name);
    setClient(name);
  };

  if (batch.client) {
    batch.client.name = client;
    batch.client.id = matcher.findIdByName(client);
  }

  const deleteItem = (index: number) => {
    rowList.splice(index, 1);
    setRowList([...rowList]);
    calculateTotalQuantity();
  };

  return (
    <Box
      sx={{
        border: "1px solid red",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <RowSpacer />

      <SearchTextField list={clients.data} handler={handleChangeClient} />

      {rowList.map((row: Transaction, key) => (
        <Box key={key} sx={{ border: "1px solid yellow" }}>
          <RowSpacer />
          <Row
            product_list={product_list}
            row={row}
            matcher={matcher}
            client={client}
            id={key}
            onRemove={deleteItem}
            calculateTotalQuantity = {calculateTotalQuantity}
          />
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <button onClick={addRow}>add</button>
        <Box sx={{ border: "1px solid yellow" }}>
          <Typography variant="h4">Summary</Typography>
          <Typography variant="body2" gutterBottom>
            총 발주량 : {totalQuantity}
            
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            onRemove(index);
          }}
        >
          <p> delete Batch </p>
          <HighlightOffIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BatchComponent;

{
  /* <Box>
        <TextField
          id="outlined-select-currency"
          select
          label="거래처"
          value={client}
          onChange={handleChangeClient}
          helperText="Please select your currency"
        >
          {clients.data.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
      </Box> */
}
