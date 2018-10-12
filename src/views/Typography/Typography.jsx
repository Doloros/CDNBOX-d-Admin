import React from "react";
import { withStyles } from "material-ui";
import JSONInput from "react-json-editor-ajrm";
import darktheme from "react-json-editor-ajrm";

import ConsoleContainer from "../../containers/App/ConsoleContainer";

import { Subscribe } from "unstated";
import { Update, Check, AddAlert } from "material-ui-icons";

import { Button, Snackbar, RegularCard } from "../../components";
import { Grid } from "material-ui";
import { StatsCard, ItemGrid } from "../../components";

const style = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  }
};

const divStyle = {
  cursor: "pointer"
};
class Typography extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tl: false,
      tc: false,
      tr: false,
      bl: false,
      bc: false,
      br: false
    };
  }
  showNotification(place) {
    var x = [];
    x[place] = true;
    this.setState(x);
    setTimeout(
      function() {
        x[place] = false;
        this.setState(x);
      }.bind(this),
      6000
    );
  }
  render() {
    return (
      <Subscribe to={[ConsoleContainer]}>
        {CC => (
          <RegularCard
            headerColor={
              JSON.stringify(CC.state.newJson) !== JSON.stringify(CC.state.json)
                ? "orange"
                : "blue"
            }
            cardTitle={"CDNBOX-d Edit Config"}
            cardSubtitle={"Live json editing"}
            content={
              <div>
                <div>
                  <Grid container>
                    <Subscribe to={[ConsoleContainer]}>
                      {CC =>
                        CC.state.boxConfig.map((cdnbox, i) => {
                          return (
                            <ItemGrid key={i} xs={12} sm={6} md={2}>
                              <StatsCard
                                icon={
                                  cdnbox.name === CC.state.rootName
                                    ? JSON.stringify(CC.state.newJson) !==
                                      JSON.stringify(cdnbox.json)
                                      ? Update
                                      : Check
                                    : JSON.stringify(CC.state.json) !==
                                      JSON.stringify(cdnbox.json)
                                      ? Update
                                      : Check
                                }
                                iconColor={
                                  cdnbox.name === CC.state.rootName
                                    ? JSON.stringify(CC.state.newJson) !==
                                      JSON.stringify(cdnbox.json)
                                      ? "orange"
                                      : "green"
                                    : JSON.stringify(CC.state.json) !==
                                      JSON.stringify(cdnbox.json)
                                      ? "orange"
                                      : "green"
                                }
                                title={cdnbox.name}
                                description="ok"
                                small="MB"
                                statIcon={Update}
                                statText="Just Updated"
                                rootName={CC.state.rootName}
                                onClickProp={
                                  JSON.stringify(CC.state.json) !==
                                  JSON.stringify(cdnbox.json)
                                    ? () => {
                                        CC.uploadConfig(cdnbox);
                                      }
                                    : () => {
                                        console.log("nothing to do");
                                      }
                                }
                                customStyle={
                                  JSON.stringify(CC.state.json) !==
                                  JSON.stringify(cdnbox.json)
                                    ? divStyle
                                    : {}
                                }
                              />
                            </ItemGrid>
                          );
                        })
                      }
                    </Subscribe>
                  </Grid>
                </div>
                <div>
                  <Grid container justify="center">
                    <ItemGrid xs={12} sm={12} md={2}>
                      <Subscribe to={[ConsoleContainer]}>
                        {CC => (
                          <Button
                            fullWidth
                            color="success"
                            onClick={() => {
                              CC.uploadRootConfig();
                              this.showNotification("tr");
                            }}
                          >
                            Upload To {CC.state.rootName}
                          </Button>
                        )}
                      </Subscribe>
                      <Snackbar
                        place="tr"
                        color="success"
                        icon={AddAlert}
                        message="Configuration Saved"
                        open={this.state.tr}
                        closeNotification={() => this.setState({ tr: false })}
                        close
                      />
                    </ItemGrid>
                  </Grid>
                </div>

                <Grid container justify="center">
                  <Subscribe to={[ConsoleContainer]}>
                    {CC => (
                      <JSONInput
                        id="a_unique_id"
                        placeholder={CC.state.newJson}
                        colors={darktheme}
                        width="850px"
                        onChange={CC.saveConfig}
                      />
                    )}
                  </Subscribe>
                </Grid>
              </div>
            }
          />
        )}
      </Subscribe>
    );
  }
}
export default withStyles(style)(Typography);
