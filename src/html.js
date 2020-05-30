import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}

          <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.css"
          />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}

        <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.js"></script>
      </body>
    </html>
  )
}

/*
docsearch({
  // Your apiKey and indexName will be given to you once
  // we create your config
  apiKey: 'd6a6cb105575bf5b8cfd20527df1f1e9',
  indexName: 'Searchy',
  appId: 'C10X0EPYME', // Should be only included if you are running DocSearch on your own.
  // Replace inputSelector with a CSS selector
  // matching your search input
  inputSelector: '#search-placeholder',
  // Set debug to true to inspect the dropdown
  debug: true,
});
 */

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
