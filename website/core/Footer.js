/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + (language ? language + '/' : '') + doc
  }

  render() {
    // const currentYear = new Date().getFullYear()
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('getting-started.html')}>Getting Started</a>
            <a href={this.docUrl('examples-node.html')}>Examples</a>
            <a href={this.docUrl('classes.html', this.props.language)}>API</a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://github.com/twitch-apis/twitch-js/issues"
              target="_blank"
              rel="noreferrer noopener"
            >
              Issues
            </a>
            <a
              href="https://github.com/twitch-apis/twitch-js/pulls"
              target="_blank"
              rel="noreferrer noopener"
            >
              Pull Requests
            </a>
            <a
              href="https://gitter.im/twitch-apis/twitch-js"
              target="_blank"
              rel="noreferrer noopener"
            >
              Gitter Chat
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/twitch-apis/twitch-js">GitHub</a>
            <a href="https://www.npmjs.com/package/twitch-js">NPM</a>
            <a href="https://codecov.io/gh/twitch-apis/twitch-js/branch/next">
              Codecov
            </a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/twitch-apis/twitch-js/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <div className="wrapper">
          <section className="copyright">{this.props.config.copyright}</section>
          <section className="copyright no-affiliation">
            TwitchJS is not affiliated, associated, authorized, endorsed by, or
            in any way officially connected with{' '}
            <a href="https://www.twitch.tv/">Twitch</a>, or any of its
            subsidiaries or its affiliates. The name "Twitch" as well as related
            names, marks, emblems and images are registered trademarks of{' '}
            <a href="https://www.twitch.tv/">Twitch</a>.
          </section>
        </div>
      </footer>
    )
  }
}

module.exports = Footer
