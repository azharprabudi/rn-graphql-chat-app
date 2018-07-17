import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Form, Item, Label, Input, Button, Spinner } from "native-base";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";

import { setCurrentUser } from "../actions/auth.actions";
import LOGIN_MUTATION from "../graphql/login.mutation";
import SIGNUP_MUTATION from "../graphql/signup.mutation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 18
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginVertical: 6,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12
  },
  switchAction: {
    paddingHorizontal: 4,
    color: "blue"
  },
  submit: {
    marginTop: 12,
    backgroundColor: "#3700B3"
  }
});

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

class Signin extends Component {
  static navigationOptions = {
    title: "Chatty",
    headerLeft: null
  };

  constructor(props) {
    super(props);

    if (props.auth && props.auth.jwt) {
      props.navigation.goBack();
    }

    this.state = {
      view: "login"
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.switchView = this.switchView.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.jwt) {
      nextProps.navigation.goBack();
    }
  }

  login() {
    const { email, password } = this.state;

    this.setState({
      loading: true
    });

    this.props
      .login({ email, password })
      .then(({ data: { login: user } }) => {
        this.props.dispatch(setCurrentUser(user));
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [
            { text: "OK", onPress: () => console.log("OK pressed") }, // eslint-disable-line no-console
            {
              text: "Forgot password",
              onPress: () => console.log("Forgot Pressed"),
              style: "cancel"
            } // eslint-disable-line no-console
          ]
        );
      });
  }

  signup() {
    this.setState({
      loading: true
    });
    const { email, password } = this.state;
    this.props
      .signup({ email, password })
      .then(({ data: { signup: user } }) => {
        this.props.dispatch(setCurrentUser(user));
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.view)} error`,
          error.message,
          [{ text: "OK", onPress: () => console.log("OK pressed") }] // eslint-disable-line no-console
        );
      });
  }

  switchView() {
    this.setState({
      view: this.state.view === "signup" ? "login" : "signup"
    });
  }

  render() {
    const { view } = this.state;

    return (
      <View style={styles.container}>
        <Item floatingLabel>
          <Label>Username</Label>
          <Input
            onChangeText={email =>
              this.setState({
                ...this.state,
                email
              })
            }
            returnKeyType={"next"}
          />
        </Item>
        <Item floatingLabel>
          <Label>Password</Label>
          <Input
            onChangeText={password =>
              this.setState({
                ...this.state,
                password
              })
            }
            secureTextEntry
            returnKeyType={"done"}
            onSubmitEditing={this[view]}
          />
        </Item>
        <Button
          onPress={this[view]}
          style={styles.submit}
          disabled={this.state.loading || !!this.props.auth.jwt}
          block
        >
          {this.state.loading ? (
            <Spinner color={"white"} />
          ) : (
            <Text style={{ color: "white" }}>
              {view === "signup" ? "Daftar" : "Masuk"}
            </Text>
          )}
        </Button>
        <View style={styles.switchContainer}>
          <Text>
            {view === "signup"
              ? "Sudah memiliki akun"
              : "Tidak memiliki akun ?"}
          </Text>
          <TouchableOpacity onPress={this.switchView}>
            <Text style={styles.switchAction}>
              {view === "login" ? "Daftar" : "Masuk"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
Signin.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func
  }),
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    jwt: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired
};

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: user =>
      mutate({
        variables: { user }
      })
  })
});

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: user =>
      mutate({
        variables: { user }
      })
  })
});

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  login,
  signup,
  connect(mapStateToProps)
)(Signin);
