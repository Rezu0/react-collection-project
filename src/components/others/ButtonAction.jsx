import { IconButton, Tooltip } from "@mui/joy";
import { Grid } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React from "react";

function ButtonAction ({ data }) {
  return (
    <>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
        >
          <Tooltip title="Edit" variant="soft" color="warning">
            <IconButton
              variant="plain"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid
          item
          xs={6}
        >
          <Tooltip title="Delete" variant="soft" color="danger">
            <IconButton
              variant="plain"
              color="danger"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

export default ButtonAction;