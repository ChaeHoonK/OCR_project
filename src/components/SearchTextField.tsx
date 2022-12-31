import { Box, TextField, MenuItem, Menu, Autocomplete } from "@mui/material";
import { useState } from "react";

const SearchTextField = ({ list, handler }: { list: any[], handler?:any }) => {
  const [text, setText] = useState("왔쏘 홍성점");

  function handleChangeText(e: any, new_value: any) {
    setText(new_value);
    handler(e, new_value);
  }

  return (
    <Box display="flex" flexDirection="column">
      {" "}
      <Box />
      <Autocomplete
        id="combo-box-demo"
        options={list.map((element) => element.value)}
        autoSelect  = {true}
        autoComplete = {true}
        sx={{ width: 300 }}
        value={text }
        onChange={handleChangeText}
        renderInput={(params) => <TextField {...params} label="거래처" helperText="거래처를 입력해주세요" />}
      />
    </Box>
  );
};

export default SearchTextField;
