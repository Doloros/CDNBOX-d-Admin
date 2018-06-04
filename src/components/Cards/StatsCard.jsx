import React from "react";
import { Grid } from "material-ui";

import IconButton from "material-ui/IconButton";
import ZoomIn from "material-ui-icons/ZoomIn";
import ZoomOut from "material-ui-icons/ZoomOut";

import { RegularCard, Table, ItemGrid } from "../../components";
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography
} from "material-ui";

import Button from "material-ui/Button";
import Fade from "material-ui/transitions/Fade";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";

import Spinner from "react-spinkit";

import PropTypes from "prop-types";

import statsCardStyle from "../../variables/styles/statsCardStyle";

const loaderStyle = {
  position: "absolute",
  right: "20%"
};

const cardStyle = {
  justifyContent: "space-between"
};

class StatsCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateToggleStat = this.updateToggleStat.bind(this);
    this.state = {
      open: false,
      query: "idle",
      toggleStat: false
    };
  }

  updateToggleStat = () => {
    this.setState({ toggleStat: !this.state.toggleStat });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  handleAccept = () => {
    this.setState(
      {
        query: "progress"
      },
      () => {
        this.timer = setTimeout(() => {
          this.props.onClickProp();
          this.setState(
            {
              query: "success"
            },
            () => {
              this.timer2 = setTimeout(
                () => this.setState({ open: false, query: "idle" }),
                2000
              );
            }
          );
        }, 2000);
      }
    );
  };

  timer = undefined;
  timer2 = undefined;

  render() {
    const {
      classes,
      title,
      description,
      statLink,
      small,
      statText,
      statIconColor,
      iconColor,
      onClickProp,
      rootName,
      customStyle,
      statBox,
      release,
      releaseStyle
    } = this.props;
    const props = this.props;
    const { query } = this.state;
    let buttonStat =
      statBox === undefined ? (
        ""
      ) : (
        //<Button onClick={this.updateToggleStat}>Show</Button>
        <IconButton aria-label="Delete">
          {this.state.toggleStat ? (
            <ZoomOut onClick={this.updateToggleStat} />
          ) : (
            <ZoomIn onClick={this.updateToggleStat} />
          )}
        </IconButton>
      );
    let showStats =
      statBox !== undefined && this.state.toggleStat ? (
        <Table
          tableHeaderColor="primary"
          tableHead={[
            "Name",
            "BW",
            "BwT",
            "Perf",
            "Score",
            "Bu.",
            "Penal",
            "HTTP",
            "DNS"
          ]}
          tableData={
            statBox !== undefined
              ? statBox.map(box => {
                  return [
                    box.name,
                    box.bw === "undefined"
                      ? "NA"
                      : Math.ceil(box.bw).toString(),
                    box.trendbw === "undefined"
                      ? "NA"
                      : Math.ceil(box.trendbw).toString(),
                    box.perftime === "undefined"
                      ? "NA"
                      : Math.ceil(box.perftime).toString(),
                    box.score === "undefined"
                      ? "NA"
                      : Math.ceil(box.score).toString(),
                    "0",
                    box.penal === "NaN" ? "-" : Math.ceil(box.penal).toString(),
                    box.ishttp === "undefined"
                      ? "NA"
                      : box.ishttp
                        ? "yes"
                        : "no",
                    box.isns === "undefined" ? "NA" : box.isns ? "yes" : "no"
                  ];
                })
              : []
          }
        />
      ) : (
        ""
      );

    let showStatIcon =
      props.statIcon === undefined ? (
        ""
      ) : (
        <CardActions className={classes.cardActions} style={cardStyle}>
          <div className={classes.cardStats}>
            <props.statIcon
              className={
                classes.cardStatsIcon +
                " " +
                classes[statIconColor + "CardStatsIcon"]
              }
            />{" "}
            {statLink !== undefined ? (
              <a href={statLink.href} className={classes.cardStatsLink}>
                {statLink.text}
              </a>
            ) : statText !== undefined ? (
              statText
            ) : null}
          </div>
          <div>{buttonStat}</div>
        </CardActions>
      );

    return (
      <Card className={classes.card}>
        <CardHeader
          onClick={onClickProp !== undefined ? this.handleClickOpen : null}
          style={customStyle}
          classes={{
            root: classes.cardHeader + " " + classes[iconColor + "CardHeader"],
            avatar: classes.cardAvatar
          }}
          avatar={<props.icon className={classes.cardIcon} />}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.cardCategory}>
            {title}
          </Typography>
          <Typography
            variant="headline"
            component="h2"
            className={classes.cardTitle}
          >
            {description}{" "}
            {small !== undefined ? (
              <small className={classes.cardTitleSmall}>{small}</small>
            ) : null}{" "}
          </Typography>
          <Typography
            component="p"
            className={classes.cardCategory}
            style={releaseStyle}
          >
            version : {release}
          </Typography>
        </CardContent>
        {showStatIcon}
        {showStats}{" "}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Edit CDNBOX-d application"}
          </DialogTitle>
          <DialogContent>
            <Fade
              in={query === "progress"}
              style={{
                transitionDelay: query === "progress" ? "800ms" : "0ms"
              }}
              unmountOnExit
            >
              <Spinner
                name="chasing-dots"
                color="steelblue"
                style={loaderStyle}
              />
            </Fade>

            <DialogContentText id="alert-dialog-description">
              {query === "success"
                ? title + " is now updated !"
                : query === "progress"
                  ? "Updating and restarting..."
                  : "You are going to update " +
                    title +
                    " configuration from your Root CDNBOX-d Node (" +
                    rootName +
                    ")"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              disabled={query !== "idle"}
            >
              Disagree
            </Button>
            <Button
              onClick={
                query === "success" ? this.handleClose : this.handleAccept
              }
              color="primary"
              disabled={query === "progress"}
              autoFocus
            >
              {query === "success" ? "Close" : "Agree"}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

StatsCard.defaultProps = {
  iconColor: "purple",
  statIconColor: "gray"
};

StatsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.func.isRequired,
  iconColor: PropTypes.oneOf(["orange", "green", "red", "blue", "purple"]),
  title: PropTypes.node,
  description: PropTypes.node,
  small: PropTypes.node,
  statIcon: PropTypes.func,
  statIconColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  statLink: PropTypes.object,
  statText: PropTypes.node
};

export default withStyles(statsCardStyle)(StatsCard);
