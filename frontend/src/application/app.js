import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import * as components from '../components';

// main stylesheet
import '../styles/index.scss';

// external global js
import 'bootstrap/dist/js/bootstrap.bundle';

// Via https://github.com/pwellever
const parseProps = data => Object.entries(data).reduce((result, [key, value]) => {
  if (value.toLowerCase() === 'true') {
    value = true;
  } else if (value.toLowerCase() === 'false') {
    value = false;
  } else if (value.toLowerCase() === 'null') {
    value = null;
  } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
    // Parse numeric value
    value = parseFloat(value);
  } else if (
    (value[0] === '[' && value.slice(-1) === ']') || (value[0] === '{' && value.slice(-1) === '}')
  ) {
    // Parse JSON strings
    value = JSON.parse(value);
  }

  result[key] = value;
  return result;
}, {});

// This method of using portals instead of calling ReactDOM.render on individual components
// ensures that all components are mounted under a single React tree, and are therefore able
// to share context.

const getPortalComponent = domEl => {
  // The element's "data-component" attribute is used to determine which component to render.
  // All other "data-*" attributes are passed as props.
  const { component: componentName, ...rest } = domEl.dataset;
  const Component = components[componentName];
  if (!Component) {
    console.error(`Component "${componentName}" not found.`);
    return null;
  }
  const props = parseProps(rest);
  domEl.innerHTML = '';
  return createPortal(<Component {...props} />, domEl);
};

const pageComponents = Array.from(document.querySelectorAll('[data-component]')).map(getPortalComponent);

const { ErrorBoundary } = components;

const AppRoot = () => (
  <ErrorBoundary>
        {pageComponents}
  </ErrorBoundary>
);

ReactDOM.render(<AppRoot />, document.getElementById('react-root'));
