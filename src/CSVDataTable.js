import React, { useState } from "react";
import "./CSVDataTable.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { saveAs } from "file-saver";
import { SaveAlt, FilterList, Update } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  fileInput: {
    marginBottom: theme.spacing(2),
  },
  filterInput: {
    marginRight: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  exportButton: {
    marginLeft: theme.spacing(2),
    backgroundColor: "green",
    color: "white",
    "&:hover": {
      backgroundColor: "darkgreen",
    },
  },
  updateButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: "yellow",
    color: "black",
    "&:hover": {
      backgroundColor: "lightyellow",
    },
  },
}));

const CSVDataTable = () => {
  const classes = useStyles();
  const [csvData, setCSVData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);

  const parseCSV = (csv) => {
    const lines = csv.split("\n");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      data.push(row);
    }

    setCSVData(data);
    setFilteredData(data);
  };

  const handleImport = () => {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csv = e.target.result;
        parseCSV(csv);
      };

      reader.readAsText(file);
    }
  };

  const filterData = () => {
    const input = userInput.toLowerCase();

    const filtered = csvData.filter((item) => {
      const itemPart = item[0] ? item[0].toLowerCase() : "";
      const itemAltPart = item[1] ? item[1].toLowerCase() : "";

      return itemPart.includes(input) || itemAltPart.includes(input);
    });

    setFilteredData(filtered);
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "exported_data.csv");
  };

  const handleOpenUpdateDialog = (rowData) => {
    setDialogData(rowData);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const updateStock = (updatedData) => {
    // Update the LocA_Stock and LocB_Stock values in the main table
    const updatedCSVData = csvData.map((item) => {
      const matchedItem = updatedData.find(
        (updatedItem) =>
          updatedItem[0] === item[0] &&
          updatedItem[1] === item[1] &&
          updatedItem[4] === item[4]
      );

      if (matchedItem) {
        item[8] = matchedItem[8]; // Update LocA_Stock
        item[10] = matchedItem[10]; // Update LocB_Stock
      }

      return item;
    });

    setCSVData(updatedCSVData);
    setFilteredData(updatedCSVData);
    handleCloseUpdateDialog();
  };

  return (
    <div className={classes.root}>
      <h1>CSV Data Table</h1>

      <Input
        type="file"
        className={classes.fileInput}
        id="csvFileInput"
        accept=".csv"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleImport}
        startIcon={<SaveAlt />}
      >
        Import
      </Button>
      <Button
        variant="contained"
        className={classes.exportButton}
        onClick={exportCSV}
        disabled={filteredData.length === 0}
      >
        Export CSV
      </Button>
      <br />
      <br />
      <label htmlFor="userInput">User Input:</label>
      <TextField
        type="text"
        id="userInput"
        variant="outlined"
        className={classes.filterInput}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={filterData}
        startIcon={<FilterList />}
      >
        Filter
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={`${classes.button} ${classes.updateButton}`}
        onClick={() => handleOpenUpdateDialog(filteredData)}
        startIcon={<Update />}
      >
        Update Inventory
      </Button>
      <br />
      <br />

      <TableContainer>
        <Table id="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Part</TableCell>
              <TableCell>Alt_Part</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Engine</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>LocA</TableCell>
              <TableCell>LocA_Stock</TableCell>
              <TableCell>LocB</TableCell>
              <TableCell>LocB_Stock</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((rowData, index) => (
              <TableRow key={index}>
                {rowData.map((cellData, cellIndex) => (
                  <TableCell key={cellIndex}>{cellData}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Inventory</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Part</TableCell>
                  <TableCell>Alt_Part</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>LocA_Stock</TableCell>
                  <TableCell>LocB_Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dialogData.map((rowData, index) => (
                  <TableRow key={index}>
                    <TableCell>{rowData[0]}</TableCell>
                    <TableCell>{rowData[1]}</TableCell>
                    <TableCell>{rowData[4]}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={rowData[8]}
                        onChange={(e) => {
                          const updatedData = [...dialogData];
                          updatedData[index][8] = e.target.value;
                          setDialogData(updatedData);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={rowData[10]}
                        onChange={(e) => {
                          const updatedData = [...dialogData];
                          updatedData[index][10] = e.target.value;
                          setDialogData(updatedData);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Close
          </Button>
          <Button
            onClick={() => updateStock(dialogData)}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CSVDataTable;
