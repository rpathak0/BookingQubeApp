import React, {createContext, Component} from 'react';
import { async_keys, getData } from '../api/UserPreference';
import {User} from './../utils/user';


export const LoginContext = createContext();

class LoginContextProvider extends Component {
  state = {
    isLogin: new User().isLogin(),
    type: new User().usertype(),
  };

  setLogin = isLogin => {
    // new User().setLogin(isLogin);
    this.setState({isLogin: isLogin});
  };

  setType = type => {
    // new User().setType(type);
    this.setState({type: type});
  };

  componentDidMount() {
    this.initialSetup();
  }

  initialSetup = async () => {
    const type = await getData(async_keys.userInfo);
    type && this.setState({type: type});
  };

  render() {
    return (
      <LoginContext.Provider
        value={{
          ...this.state,
          setLogin: this.setLogin,
          setType: this.setType,
        }}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}

export default LoginContextProvider;

export const useLoginContext = () => React.useContext(LoginContext);

export const LoginConsumer = LoginContext.Consumer;
