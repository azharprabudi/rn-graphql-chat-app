import { AppRegistry } from "react-native";
import App from "./src/app";

AppRegistry.registerComponent("chatty", () => App);
AppRegistry.runApplication("chatty", {
  initialProps: {},
  rootTag: document.getElementById("react-app")
});
