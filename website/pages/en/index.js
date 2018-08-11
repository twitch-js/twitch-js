/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const siteConfig = require(process.cwd() + '/siteConfig.js')

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    )
  }
}

Button.defaultProps = {
  target: '_self',
}

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
)

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
)

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || ''
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="#try">Try It Out</Button>
            <Button href={docUrl('examples-node.html', language)}>
              Node Example
            </Button>
            <Button href={docUrl('examples-browser.html', language)}>
              Browser Example
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
)

const FeatureCallout = props => (
  <div
    className="wrapper productShowcaseSection paddingBottom"
    style={{ textAlign: 'center' }}
  >
    <h2>Features</h2>
    <ul style={{ textAlign: 'center', listStyle: 'none', padding: 0 }}>
      <li>
        Aligns with official{' '}
        <a href="https://dev.twitch.tv/docs/irc/">Twitch IRC documentation</a>
      </li>
      <li>Forward-compatible, minimally-assertive architecture </li>
      <li>Supports Node environments </li>
      <li>Supports Browsers </li>
      <li>Connect to multiple channels </li>
      <li>Chat commands </li>
      <li>Rate limiter</li>
    </ul>
  </div>
)

class TryOut extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <h2 id="try">Try it out</h2>
        <ol>
          <li>
            Use{' '}
            <a
              href="https://twitchapps.com/tmi"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://twitchapps.com/tmi
            </a>{' '}
            to generate a token with <code>chat_login</code> scope.
          </li>
          <li>
            Replace <code>TWITCH_TOKEN</code> with the generated token, and
            <code>TWITCH_USERNAME</code> with your Twitch username.
          </li>
          <li>
            Click <strong>run</strong>.
          </li>
        </ol>
        <div id="my-embed" />
      </div>
    )
  }
}

class Index extends React.Component {
  render() {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <FeatureCallout />
          <TryOut />
        </div>
      </div>
    )
  }
}

module.exports = Index
