import React from "react";
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "material-ui";

import PropTypes from "prop-types";

import tableStyle from "../../variables/styles/tableStyle";

const bwStyleAlert = {
  background: "#e53935",
  fontSize: "11px"
};

const bwStyleOK = {
  background: "#66bb6a",
  fontSize: "11px"
};

const heightStyle = {
  height: "30px"
};

const fontSizeTable = {
  fontSize: "11px"
};

function CustomTable({ ...props }) {
  const { classes, tableHead, tableData, tableHeaderColor } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} style={heightStyle}>
                {prop.map((prop, key) => {
                  return (
                    <TableCell
                      className={classes.tableCell}
                      key={key}
                      style={
                        key === 1 || key === 2
                          ? parseInt(prop, 10) > 150
                            ? bwStyleAlert
                            : bwStyleOK
                          : fontSizeTable
                      }
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(tableStyle)(CustomTable);
