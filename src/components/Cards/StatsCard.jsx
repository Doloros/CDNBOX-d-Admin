import React from "react";
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography
} from "material-ui";

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Spinner from 'react-spinkit';

import PropTypes from "prop-types";

import statsCardStyle from "../../variables/styles/statsCardStyle";

const loaderStyle = {
  position: "absolute",
  right: "20%"
}

class StatsCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: false,
      query: 'idle'
    }
  }

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
    this.setState({
      query: 'progress',
    },() => {
    this.timer = setTimeout(() => {
      this.props.onClickProp();
        this.setState({
          query: 'success',
        },
      () => {
        this.timer2 = setTimeout(() => this.setState({ open: false, query: "idle" }),2000)
      }
      );
        
      },2000);
    });
  };
 
    timer = undefined;
    timer2 = undefined;
      
  render(){
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
      customStyle
    } = this.props;
    const props = this.props;
    const { query } = this.state;


    
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
            ) : null}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
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
        </CardActions>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Edit CDNBOX-d application"}</DialogTitle>
          <DialogContent>
          <Fade
              in={query === 'progress'}
              style={{
                transitionDelay: query === 'progress' ? '800ms' : '0ms',
              }}
              unmountOnExit
            >
          <Spinner  name="chasing-dots" color="steelblue" style={loaderStyle} /> 
          </Fade>
        
           <DialogContentText id="alert-dialog-description">
              {query === "success" ? title + " is now updated !" :
               (query === "progress" ? "Updating and restarting..." : "You are going to update " + title + " configuration from your Root CDNBOX-d Node (" + rootName + ")")
               }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            
            <Button onClick={this.handleClose} color="primary" disabled={query !== "idle"}>
              Disagree
            </Button>
            <Button onClick={query === "success" ? this.handleClose : this.handleAccept} color="primary" disabled={query === "progress"} autoFocus>
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
  statIcon: PropTypes.func.isRequired,
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
