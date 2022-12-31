import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import ColSpacer from "./ColSpacer";
import type { Product, Transaction } from "../types/types";
import { Dispatch, useState } from "react";
import { Matcher } from "../library/matcher";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RowSpacer from "./RowSpacer";

/**
 * @param product_list - product list for current context
 * @param row
 * @param matcher - match and parse transaction and batch
 * @param client - name of current client
 * @param onRemove - remove current row param is index
 * @param id - for deleting from list
 */
const Row = ({
  product_list,
  row,
  matcher,
  client,
  onRemove,
  id,
  calculateTotalQuantity,
}: {
  product_list: Product[];
  row: Transaction;
  matcher: Matcher;
  client: string;
  onRemove: any;
  id: any;
  calculateTotalQuantity : any,
}) => {
  row.client = { name: client, id: matcher.findIdByName(client) };
  const [product, setProduct] = useState("");
  const handleChangeProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmp = event.target.value;
    row.product.name = tmp;
    row.product.id =
      product_list.find((e: any) => {
        return e.name == tmp;
      })?.id ?? "";
    const price = matcher.findPriceByNameAndType(
      client,
      matcher.parseProduct(tmp)
    );
    setPrice(price);
    setProduct(tmp);
  };

  const [price, setPrice] = useState(row.price);
  const [quantity, setQuantity] = useState(row.quantity);
  const [box, setBox] = useState(row.box);

  const handleChangePrice = (event: any) => {
    const tmp = event.target.value;
    row.price = tmp;
    setPrice(tmp);
  };
  const handleChangeQuantity = (event: any) => {
    const tmp = event.target.value;
    row.quantity = Number(tmp);
    setQuantity(tmp);
    calculateTotalQuantity();
  };
  const handleChangeBox = (event: any) => {
    const tmp = event.target.value;
    row.box = tmp;
    setBox(tmp);
  };

  return (
    <Box
      sx={{
        border: "1px solid pink",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <TextField
        id="outlined-select-currency"
        select
        label="상품"
        value={product}
        onChange={handleChangeProduct}
        helperText="상품을 선택해주세요"
      >
        {product_list.map((option: Product) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      <RowSpacer />

      <TextField
        required
        sx={{ flex: 1 }}
        id="outlined-required"
        label="가격"
        type="number"
        value={price}
        onChange={handleChangePrice}
      />

      <RowSpacer />

      <Box sx={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <TextField
          required
          id="outlined-required"
          label="수량(kg)"
          type="number"
          onChange={handleChangeQuantity}
          sx={{ flex: 1 }}
        />

        <TextField
          required
          id="outlined-required"
          label="박스(box)"
          type="number"
          size="medium"
          onChange={handleChangeBox}
          sx={{ flex: 1 }}
        />
      </Box>

      <Button
        onClick={() => {
          onRemove(id);
        }}
        startIcon={<HighlightOffIcon />}
      >
        delete
      </Button>
    </Box>
  );
};

export default Row;
