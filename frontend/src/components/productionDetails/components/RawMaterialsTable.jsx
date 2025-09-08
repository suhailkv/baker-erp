import React from "react";
import { Typography, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";

const RawMaterialsTable = ({ rawMaterials }) => (
  <>
    <Typography variant="subtitle1">Raw Materials Used</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Material</TableCell>
          <TableCell>Used Qty</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rawMaterials?.map((rm) => (
          <TableRow key={rm.id}>
            <TableCell>{rm.RawMaterial?.ExpenseNameMaster.expense_name || rm.name}</TableCell>
            <TableCell>{rm?.usedQty ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
);

export default RawMaterialsTable;
