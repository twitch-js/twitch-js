require('any-observable/register')('symbol-observable')

const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const jsdoc2md = require('jsdoc-to-markdown')
const groupBy = require('lodash/groupBy')

const Listr = require('listr')

// Paths and files.
const inputFile = 'src/**/*.js'
const outputDir = './docs/reference'
const partials = fs.readdirSync(`${__dirname}/partials`)

// Create docs directory.
mkdirp.sync(path.resolve(__dirname, '../../', outputDir))

const titleMap = {
  class: 'Classes',
  constructor: 'Constructors',
  mixin: 'Mixins',
  member: 'Members',
  namespace: 'Objects',
  enum: 'Enums',
  constant: 'Constants',
  function: 'Functions',
  event: 'Events',
  typedef: 'Type Definitions',
  external: 'External',
  interface: 'Interfaces',
}

const createTemplate = ({ kind, title, sidebarLabel }) => `---
id: ${kind}
title: ${title}
sidebar_label: ${sidebarLabel}
---

{{>global-index-kinds kind="${kind}" ~}}

{{#identifiers kind="${kind}" scope="global"}}
{{>docs~}}
{{/identifiers}}
`

// Get template data.
const templateData = jsdoc2md.getTemplateDataSync({
  files: inputFile,
})

// Group template data by kind.
const templateDataByKind = groupBy(templateData, 'kind')

const tasks = new Listr(
  // Create a documentation file for each kind.
  Object.keys(templateDataByKind).map(kind => {
    const title = titleMap[kind]

    const template = createTemplate({
      kind,
      title,
      sidebarLabel: titleMap[kind],
    })

    return {
      title: `Generating docs for ${title.toLowerCase()}`,
      task: (ctx, task) => {
        const output = jsdoc2md.renderSync({
          data: templateData,
          template: template,
          'no-gfm': true,
          separators: true,
          partial: partials.map(partial => `${__dirname}/partials/${partial}`),
          helper: `${__dirname}/helpers.js`,
        })
        fs.writeFileSync(path.resolve(outputDir, `${kind}.md`), output)
        task.title = `Generated docs for ${title.toLowerCase()}`
      },
    }
  }),
)

tasks.run()
