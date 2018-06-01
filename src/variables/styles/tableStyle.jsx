// ##############################
// // // Table styles
// #############################

import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont
} from "../../variables/styles";

const tableStyle = theme => ({
  warningTableHeader: {
    color: warningColor
  },
  primaryTableHeader: {
    color: primaryColor
  },
  dangerTableHeader: {
    color: dangerColor
  },
  successTableHeader: {
    color: successColor
  },
  infoTableHeader: {
    color: infoColor
  },
  roseTableHeader: {
    color: roseColor
  },
  grayTableHeader: {
    color: grayColor
  },
  table: {
    marginBottom: "0",
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "transparent",
    borderSpacing: "0",
    borderCollapse: "collapse"
  },
  tableHeadCell: {
    color: "inherit",
    ...defaultFont,
    fontSize: "13px"
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.2",
    padding: "1px 0px 1px 3px",
    verticalAlign: "middle"
  },
  tableResponsive: {
    width: "100%",
    marginTop: "5px",
    overflowX: "auto",
    borderTop: "1px solid #eeeeee"
  }
});

export default tableStyle;
