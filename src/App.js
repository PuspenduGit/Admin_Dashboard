import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./App.css";
import { Typography } from "@mui/material";

import Pagination from "./components/Pagination";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentpageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState({
    mode: false,
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [selected, setSelected] = useState([]);

  const deleteRow = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    setFilteredData(
      newData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const editRow = (id) => {
    if (editing.mode) {
      data.forEach((item) => {
        if (item.id === editing.id) {
          item.name = editing.name;
          item.email = editing.email;
          item.role = editing.role;
        }
      });
      setEditing({
        mode: false,
        id: "",
        name: "",
        email: "",
        role: "",
      });
    } else {
      const newData = data.find((item) => item.id === id);
      setEditing({
        mode: true,
        id: newData.id,
        name: newData.name,
        email: newData.email,
        role: newData.role,
      });
    }
  };

  const handleSelect = (id) => {
    setEditing({
      mode: false,
      id: "",
      name: "",
      email: "",
      role: "",
    });

    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSearch = () => {
    setFilteredData(
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getData = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setData(data);
      setFilteredData(data);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    getData();
  },[]);

  useEffect(() => {
    setCurrentPageData(filteredData.slice((page - 1) * limit, page * limit));
    setSelected([]);
  }, [filteredData, searchQuery, data, page, limit]);

  return (
    <div className="container">
      <div className="header">
        <TextField
          id="outlined-basic"
          label="Enter Value..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch();
            setPage(1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              setPage(1);
            }
          }}
        />
        <Tooltip title="Clear All">
          <button
            className="btn"
            disabled={filteredData.length === 0}
            onClick={() => {
              setData([]);
              setFilteredData([]);
            }}>
            <DeleteOutlineOutlinedIcon className="deleteIcon" />
          </button>
        </Tooltip>
      </div>
      <div className="dashboard">
        <Box sx={{ flexGrow: 1 }} className="">
          <Grid container spacing={0}>
            <Grid item xs={12} className="details">
              <Paper className="detailsitems">
                <div className="parent">
                  <Checkbox
                    className="checkbox"
                    checked={
                      selected.length === currentpageData.length &&
                      selected.length !== 0
                    }
                    onChange={() => {
                      if (selected.length === currentpageData.length) {
                        setSelected([]);
                      } else {
                        setSelected(currentpageData.map((item) => item.id));
                      }
                    }}
                  />
                  <Typography className="text">Name</Typography>
                  <Typography className="text">Email</Typography>
                  <Typography className="text">Role</Typography>
                  <Typography className="text">Actions</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} className="data">
              {currentpageData.map((item, index) => {
                return (
                  <Paper key={index} className="detailsitems">
                    <div className="parent">
                      <Checkbox
                        className="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => {
                          handleSelect(item.id);
                        }}
                      />
                      <input
                        disabled={!(editing.mode && editing.id === item.id)}
                        onChange={(e) => {
                          setEditing((prev) => {
                            return {
                              ...prev,
                              name: e.target.value,
                            };
                          });
                        }}
                        className="item-text"
                        value={
                          editing.mode && editing.id === item.id
                            ? editing.name
                            : item.name
                        }
                      />
                      <input
                        disabled={!(editing.mode && editing.id === item.id)}
                        onChange={(e) => {
                          setEditing((prev) => {
                            return {
                              ...prev,
                              email: e.target.value,
                            };
                          });
                        }}
                        className="item-text"
                        value={
                          editing.mode && editing.id === item.id
                            ? editing.email
                            : item.email
                        }
                      />
                      <input
                        disabled={!(editing.mode && editing.id === item.id)}
                        onChange={(e) => {
                          setEditing((prev) => {
                            return {
                              ...prev,
                              role: e.target.value,
                            };
                          });
                        }}
                        className="item-text"
                        value={
                          editing.mode && editing.id === item.id
                            ? editing.role
                            : item.role
                        }
                      />
                      <button className="action-btn">
                        <Tooltip
                          title={
                            editing.mode && editing.id === item.id
                              ? "Save"
                              : "Edit"
                          }>
                          <button
                            className="edit-btn"
                            onClick={() => editRow(item.id)}>
                            {editing.mode && editing.id === item.id ? (
                              <SaveOutlinedIcon className="saveIcon" />
                            ) : (
                              <EditNoteOutlinedIcon className="editIcon" />
                            )}
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            className="delete-btn"
                            onClick={() => deleteRow(item.id)}>
                            <DeleteOutlineOutlinedIcon
                              id="delete-act-btn"
                              className="deleteIcon"
                            />
                          </button>
                        </Tooltip>
                      </button>
                    </div>
                  </Paper>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </div>
      <section className="footer">
        <div className="footer-content">
          <span className="text-xs">
            {selected.length} of {filteredData.length} Row(s) Selected
          </span>
          <button
            className="select-btn"
            disabled={selected.length === 0}
            onClick={() => {
              const newData = data.filter(
                (item) => !selected.includes(item.id)
              );
              setData(newData);
              setFilteredData(
                newData.filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.role
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
              );
              setSelected([]);
            }}>
            Delete selected
            <DeleteOutlineOutlinedIcon
              className="deleteIcon"
              id="delete-selected-btn"
            />
          </button>
        </div>
        <Pagination
          className=""
          page={page}
          end={Math.ceil(filteredData.length / limit)}
          setPage={setPage}
        />
      </section>
    </div>
  );
};

export default App;
