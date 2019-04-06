import React from 'react';
import Component from './Component';
import { iterator } from 'lazy-iters';
import { range } from '../util/util';
import './UrlLoader.css';

class UrlLoader extends Component {
  state = {
    urls: [],
    isLoaded: false
  };

  componentDidMount() {
    // Try to load from localStorage
    const previousUrls = localStorage.urls;
    if (previousUrls !== undefined) {
      const parsedUrls = JSON.parse(previousUrls);
      if (parsedUrls instanceof Array) {
        // Set the state to them

        if (parsedUrls.length > 0) {
          this.updateState({ urls: parsedUrls, isLoaded: false });
        } else {
          this.updateState({ urls: parsedUrls });
        }
      }
    }
  }

  onChangeInput(i) {
    return event => {
      const { value } = event.target;
      // console.log(`Update ${i}: ${value}`);
      const { urls } = this.state;
      const newUrls = iterator(range(0, urls.length))
        .map(j => (j === i ? value : urls[j]))
        .collect();
      // console.log(newUrls);
      this.updateState({ urls: newUrls });
      localStorage.urls = JSON.stringify(newUrls.filter(s => s.length > 0));
    };
  }

  onAddUrl = () => {
    const { urls } = this.state;
    this.updateState({ urls: [...urls, ''] });
  };

  onLoad = () => {
    this.updateState({ isLoaded: true });
  };

  render() {
    const { isLoaded, urls } = this.state;
    if (isLoaded) {
      const { Component = () => <div />, componentProps = {} } = this.props;
      return (
        <Component
          {...componentProps}
          urls={iterator(urls)
            .filter(s => s.length > 0)
            .collect()}
        />
      );
    } else {
      const textBoxes = iterator(range(0, urls.length))
        .map(i => (
          <div key={i}>
            <input
              type="text"
              placeholder="Source URL"
              onChange={this.onChangeInput(i)}
              value={urls[i]}
            />
          </div>
        ))
        .collect();
      return (
        <div className="UrlLoader">
          <div className="url-fields">{textBoxes}</div>
          <div className="url-controls">
            <button onClick={this.onAddUrl}>Add URL</button>
            <button onClick={this.onLoad}>Load</button>
          </div>
        </div>
      );
    }
  }
}

export default UrlLoader;
