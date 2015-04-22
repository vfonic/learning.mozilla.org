var _  = require('underscore');
var React = require('react');

var routes = require('./routes.jsx');

// This isn't actually called in node, it's stringified and plopped in
// a script tag in the page header. It's basically an extremely simple
// stand-in for Modernizr, but if it becomes more complex we should think
// about actually migrating to that library.
//
// Modernizr code borrowed:
//
// * cors (needed to reach teach-api)
function featureDetect() {
  var safeMode = /[?&]safemode=on/i.test(window.location.search);
  var cors = 'XMLHttpRequest' in window &&
             'withCredentials' in new XMLHttpRequest();

  if (!safeMode && cors) {
    document.documentElement.setAttribute('class', '');
    window.ENABLE_JS = true;
  } else {
    window.ENABLE_JS = false;
  }
}

function generateWithPageHTML(url, options, pageHTML) {
  options = _.defaults(options || {}, {
    meta: {}
  });

  // Make sure any changes to this file are reflected in
  // index.html too.
  var content = (
    <html className="no-js">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {Object.keys(options.meta).map(function(name, i) {
          return <meta key={i} name={name} content={options.meta[name]}/>;
        })}
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,700,600italic,700italic,800,800italic"/>
        <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css"/>
        <link href="https://mozorg.cdn.mozilla.net/media/css/tabzilla-min.css" rel="stylesheet" />
        <link rel="stylesheet" href={'/' + exports.CSS_FILENAME}/>
        <script dangerouslySetInnerHTML={{
          __html: "(" + featureDetect.toString() + ")();"
        }}></script>
        <title>{options.title}</title>
      </head>
      <body>
        <div className="no-js-warning">
          Please <a href="https://browser-update.org/update.html">update your browser</a> or
          enable JavaScript to access this website's full functionality.
        </div>
        <a href="https://www.mozilla.org/" id="tabzilla" className="teach-tabzilla">mozilla</a>
        <div id="page-holder" dangerouslySetInnerHTML={{
          __html: pageHTML
        }}></div>
        <script src="/commons.bundle.js"></script>
        <script src="/app.bundle.js"></script>
        <script src="https://mozorg.cdn.mozilla.net/tabzilla/tabzilla.js"></script>
      </body>
    </html>
  );

  return '<!DOCTYPE html>' + React.renderToStaticMarkup(content);
}

function generate(url, options, cb) {
  routes.generateStatic(url, function(html, metadata) {
    cb(generateWithPageHTML(url, _.extend({
      title: metadata.title
    }, options), html));
  });
};

exports.generate = generate;
exports.CSS_FILENAME = "styles.css";
exports.URLS = routes.URLS;
