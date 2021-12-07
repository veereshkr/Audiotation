import React from 'react';
import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-114233784-1');


const withTracker = (WrappedComponent, options = {}) => {

  const trackPage = page => {
    GoogleAnalytics.set({
      page,
      ...options,
    });
    GoogleAnalytics.pageview(page);
  };

  const HOC = class extends React.Component {
    componentDidMount(props) {
      const page = props.location.pathname;
      trackPage(page);
    }

    componentWillReceiveProps(nextProps,props) {
      const currentPage = props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render(props) {
      console.log(props);
      return <WrappedComponent {...props} />;
    }
  };

  return HOC;
};

export default withTracker;
