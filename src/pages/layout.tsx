import React from "react";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box bgcolor="green" display="flex" height="100vh" width="100vw">
      <Box bgcolor="red" flex={{ xs: 1, sm: 2 }} />
      <Box
        bgcolor="yellow"
        display="flex"
        flex={1}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Box bgcolor="blue" flex={{ xs: 1, sm: 6 }} />
        <Box bgcolor="purple" flex={{ xs: 11, sm: 6 }} />
      </Box>
    </Box>
  );
}