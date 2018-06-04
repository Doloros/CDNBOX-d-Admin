import { Container } from "unstated";
import ConsoleConfig from "../../config.json";

export default class ConsoleContainer extends Container {
  constructor(props) {
    super(props);

    this.state = {
      // Données provenant de config/config.json
      clientName: ConsoleConfig.clientName,
      loading: false,

      rootHostname: ConsoleConfig.rootHostname,
      rootName: ConsoleConfig.rootName,
      rootProto: ConsoleConfig.rootProto,
      escape: ConsoleConfig.escape,

      pathState: ConsoleConfig.pathState,
      pathConfig: ConsoleConfig.pathConfig,
      auth: ConsoleConfig.auth,

      //config
      json: {},
      newJson: {},
      boxConfig: [],
      // states
      refresh: false,
      cdnNames: [],
      cdnBPs: [],
      releases: [],
      dataChart: { data: { labels: [], series: [] } },

      boxStatesNS: [],
      cdnboxesHTTP: [],
      cdnboxesNoNS: [],
      onLoad: false,
      interval: 5000,
      activeMenu: "Dashboard",
      rootConfig: []
    };

    this.getContent = this.getContent.bind(this);
    this.updateAllStates = this.updateAllStates.bind(this);
    this.updateRefresh = this.updateRefresh.bind(this);
    this.uploadRootConfig = this.uploadRootConfig.bind(this);
    this.uploadConfig = this.uploadConfig.bind(this);
    this.saveConfig = this.saveConfig.bind(this);
    this.acceptAlert = this.acceptAlert.bind(this);
    this.init = this.init.bind(this);
    this.initConfig = this.initConfig.bind(this);
    this.init();
    this.initConfig();
  }

  setRootConfig(body) {
    this.setState({ rootConfig: body });
  }

  startShortPolling(f) {
    this.interval = setInterval(f, this.state.interval);
  }

  updateAllStates() {
    let arrPromise = [];
    let httpBox = [];
    let path = this.state.pathState;
    arrPromise = this.state.cdnboxesHTTP.map(cdnbox => {
      httpBox.push(cdnbox);

      let url =
        cdnbox.local.proto === undefined ? "https:" : cdnbox.local.proto;
      url += "//" + cdnbox.local.hostname + path;
      return this.getContent(url, cdnbox.local.hostname, path, true);
    });
    Promise.all(arrPromise).then(values => {
      let process = values;
      let cdnNames = [];
      let cdnBPs = [];

      Object.keys(values).forEach(function(key) {
        var internalName = values[key].name;
        var context = values[key].cdnboxes;
        Object.keys(context).forEach(function(key2) {
          if (context[key2].name === internalName) {
            process[key].local = context[key2];
            cdnNames.push(internalName);
            cdnBPs.push(Math.ceil(context[key2].trendbw));
          }
        });
      });
      let dataChart = {
        labels: cdnNames,
        series: [cdnBPs]
      };
      this.setState({
        boxStatesNS: process,
        cdnNames: cdnNames,
        cdnBPs: cdnBPs,
        dataChart: dataChart,
        cdnboxesHTTP: process
      });
    });
  }

  initConfig(error = null, response = null, body = null) {
    console.log("Init Config");
    if (body) {
      var start = new Date().getTime();
      var end = start;
      while (end < start + 2000) {
        end = new Date().getTime();
      }
    }

    let boxStatesNS = [];
    let cdnboxesHTTP = [];
    let cdnboxesNoNS = [];

    let url =
      this.state.rootProto +
      "://" +
      this.state.rootHostname +
      this.state.pathConfig;

    this.getContent(
      url,
      this.state.rootHostname,
      this.state.pathConfig,
      true
    ).then(data => {
      for (let i = 0; i < data.cdnboxes.length; i++) {
        if (this.state.escape.indexOf(data.cdnboxes[i].name) === -1) {
          if (data.cdnboxes[i].isns) boxStatesNS.push(data.cdnboxes[i]);
          else cdnboxesNoNS.push(data.cdnboxes[i]);

          if (data.cdnboxes[i].isns && data.cdnboxes[i].ishttp)
            cdnboxesHTTP.push(data.cdnboxes[i]);
        }
      }
      let arrPromise = [];
      let httpBox = [];
      arrPromise = boxStatesNS.map(cdnbox => {
        httpBox.push(cdnbox);
        let url = cdnbox.proto === undefined ? "https:" : cdnbox.proto;
        url += "//" + cdnbox.hostname + this.state.pathConfig;
        return this.getContent(
          url,
          cdnbox.hostname,
          this.state.pathConfig,
          true
        );
      });

      Promise.all(arrPromise).then(values => {
        let configs = [];
        let proto = "";

        for (let i = 0; i < boxStatesNS.length; i++) {
          proto =
            boxStatesNS[i].proto === undefined
              ? "https:"
              : boxStatesNS[i].proto;
          configs.push({
            name: boxStatesNS[i].name,
            proto: proto,
            hostname: boxStatesNS[i].hostname,
            json: values[i]
          });
        }
        this.setState({
          boxConfig: configs,
          json: data,
          newJson: data
        });
      });
    });
  }

  saveConfig(data) {
    this.setState({ newJson: data.updated_src });
  }

  init() {
    console.log("Init");
    let boxStatesNS = [];
    let cdnboxesHTTP = [];
    let cdnboxesNoNS = [];

    let url =
      this.state.rootProto +
      "://" +
      this.state.rootHostname +
      this.state.pathState;

    this.getContent(
      url,
      this.state.rootHostname,
      this.state.pathState,
      true
    ).then(data => {
      for (let i = 0; i < data.cdnboxes.length; i++) {
        if (this.state.escape.indexOf(data.cdnboxes[i].name) === -1) {
          if (data.cdnboxes[i].isns) boxStatesNS.push(data.cdnboxes[i]);
          else cdnboxesNoNS.push(data.cdnboxes[i]);

          if (data.cdnboxes[i].isns && data.cdnboxes[i].ishttp)
            cdnboxesHTTP.push(data.cdnboxes[i]);
        }
      }

      // get ALL Statements
      let arrPromise = [];
      let httpBox = [];
      arrPromise = cdnboxesHTTP.map(cdnbox => {
        httpBox.push(cdnbox);
        let url = cdnbox.proto === undefined ? "https:" : cdnbox.proto;
        url += "//" + cdnbox.hostname + this.state.pathState;
        return this.getContent(
          url,
          cdnbox.hostname,
          this.state.pathState,
          true
        );
      });

      Promise.all(arrPromise).then(values => {
        let process = values;
        let cdnNames = [];
        let cdnBPs = [];
        let releases = [];

        Object.keys(values).forEach(function(key) {
          var internalName = values[key].name;
          var context = values[key].cdnboxes;
          if (releases.indexOf(parseInt(values[key].release, 10)) === -1)
            releases.push(parseInt(values[key].release, 10));

          Object.keys(context).forEach(function(key2) {
            if (context[key2].name === internalName) {
              process[key].local = context[key2];
              cdnNames.push(internalName);
              cdnBPs.push(Math.ceil(context[key2].trendbw));
            }
          });
        });
        let dataChart = {
          labels: cdnNames,
          series: [cdnBPs]
        };
        this.setState({
          boxStatesNS: process,
          cdnNames: cdnNames,
          cdnBPs: cdnBPs,
          dataChart: dataChart,
          cdnboxesHTTP: process,
          releases: releases.sort()
        });
      });
    });
  }

  uploadRootConfig() {
    console.log("Upload Root Config");
    var request = require("request");

    let url =
      this.state.rootProto + "://" + this.state.rootHostname + "/cdn/config";

    request(
      {
        url: url,
        method: "PUT",
        headers: {
          Authorization: this.state.auth,
          "content-type": "application/json"
        },
        json: this.state.newJson
      },
      this.initConfig
    );
  }

  uploadConfig(cdnbox) {
    console.log("Upload Config : " + cdnbox.name);
    var request = require("request");

    let url = cdnbox.proto === undefined ? "https:" : cdnbox.proto;
    url += "//" + cdnbox.hostname + this.state.pathConfig;
    console.log(url);
    console.log(this.state.json);

    request(
      {
        url: url,
        method: "PUT",
        headers: {
          Authorization: this.state.auth,
          "content-type": "application/json"
        },
        json: this.state.json
      },
      this.initConfig
    );
  }

  acceptAlert() {
    var start = new Date().getTime();
    var end = start;
    while (end < start + 10000) {
      end = new Date().getTime();
    }
    return true;
  }

  stopShortPolling() {
    clearInterval(this.interval);
  }

  updateRefresh() {
    var refresh = !this.state.refresh;
    this.setState({ refresh: refresh });
    if (refresh) this.startShortPolling(this.updateAllStates);
    else this.stopShortPolling();
  }

  getContent = function(url, host, path, auth_required = false) {
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = url.startsWith("https") ? require("https") : require("http");
      let auth = ConsoleConfig.auth;
      let options = {
        host: host,
        path: path
      };

      if (auth_required) {
        options = {
          host: host,
          path: path,
          headers: {
            Authorization: auth
          }
        };
      }

      const request = lib.get(options, response => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(
            new Error(
              "Failed to load page, status code: " + response.statusCode
            )
          );
        }
        // temporary data holder
        const body = [];
        response.setEncoding("utf8");
        // on every content chunk, push it to the data array
        response.on("data", chunk => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on("end", () => resolve(JSON.parse(body.join(""))));
      });
      // handle connection errors of the request
      request.on("error", err => reject(err));
    });
  };
}
