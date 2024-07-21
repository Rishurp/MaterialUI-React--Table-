import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Slider, TextField, MenuItem, Checkbox } from "@mui/material";
import axios from "axios";
// import dayjs from "dayjs";

import moment from "moment";
// Custom column filter for date range
const DateRangeFilter = ({ column }) => {
  const [value, setValue] = useState([null, null]);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        type="date"
        value={value[0] || ""}
        onChange={(e) => {
          const date = e.target.value;
          setValue([date, value[1]]);
          column.setFilterValue([date, value[1]]);
        }}
      />
      <TextField
        type="date"
        value={value[1] || ""}
        onChange={(e) => {
          const date = e.target.value;
          setValue([value[0], date]);
          column.setFilterValue([value[0], date]);
        }}
      />
    </Box>
  );
};

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1721635200000&signature=6j_hKr3nJbx0nyTM-mHLQDqs7FG_9do0Eqy12WrAmqE&downloadName=sample-data.json"
      );
      console.log(response.data);
      let data = response.data;
      let newData = response.data.map((item) => {
        return {
          ...item,
          createdAt: moment(item.createdAt).format("LL"),
          updatedAt: moment(item.updatedAt).format("LL"),
        };
      });
      setData(newData );
    };
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnFilter: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableColumnFilter: true,
        filterFn: "fuzzy",
      },
      {
        accessorKey: "category",
        header: "Category",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "price",
        header: "Price",
        filterVariant: "range",
        Filter: ({ column }) => (
          <Slider
            value={column.getFilterValue() ?? [0, 1000]}
            onChange={(_, value) => column.setFilterValue(value)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY"),
        Filter: DateRangeFilter,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY"),
        Filter: DateRangeFilter,
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnOrdering
      enableGrouping
      enableColumnResizing
      enableGlobalFilter
      enablePagination
      initialState={{ pageSize: 10 }}
    />
  );
};

export default Table;
