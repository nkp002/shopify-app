import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { StaticRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Example from './example';
import Dashboard from './dashboard';

import { Heading, Page } from "@shopify/polaris";

/*const Index = () => (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
  </Page>
);

export default Index;
*/

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
  #demo {
    height: 100%;
  }
`;

class Demo extends Component {
  render() {
    return (
      <Router>
        <GlobalStyle />

        <Switch>
          <Route path={`/`} exact={true}>
            <Example />
          </Route>

          <Route path={`/dashboard`}>
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Demo;