const dmd = require('dmd/helpers/ddata')

exports.link = function(longname, options) {
  return options.fn(_link(longname, options))
}

/**
 * e.g. namepaths `module:Something` or type expression `Array.<module:Something>`
 * @static
 * @param {string} - namepath or type expression
 * @param {object} - the handlebars helper options object
 */
function _link(input, options) {
  if (typeof input !== 'string') return null

  var linked, matches, namepath
  var output = {}

  /*
  test input for
  1. A type expression containing a namepath, e.g. Array.<module:Something>
  2. a namepath referencing an `id`
  3. a namepath referencing a `longname`
  */
  if ((matches = input.match(/.*?<(.*?)>/))) {
    namepath = matches[1]
  } else {
    namepath = input
  }

  options.hash = { id: namepath }
  linked = dmd._identifier(options)
  if (!linked) {
    options.hash = { longname: namepath }
    linked = dmd._identifier(options)
  }
  if (!linked) {
    output = { name: input, url: null }
  } else {
    output.name = input.replace(namepath, linked.name)
    if (dmd.isExternal.call(linked)) {
      if (linked.description) {
        output.url = 'external#' + dmd.anchorName.call(linked, options)
      } else {
        if (linked.see && linked.see.length) {
          var firstLink = dmd.arseLink(linked.see[0])[0]
          output.url = firstLink ? firstLink.url : linked.see[0]
        } else {
          output.url = null
        }
      }
    } else {
      const pre = linked.scope === 'global' ? linked.kind : ''
      output.url = pre + '#' + dmd.anchorName.call(linked, options)
    }
  }
  return output
}
