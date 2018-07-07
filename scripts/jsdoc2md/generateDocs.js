const fs = require('fs')
const path = require('path')

const jsdoc2md = require('jsdoc-to-markdown')
const groupBy = require('lodash/groupBy')

// Paths and files.
const inputFile = 'src/**/*.js'
const outputDir = './docs/api'
const partials = fs.readdirSync(`${__dirname}/partials`)

const titleMap = {
  class: 'Classes',
  mixin: 'Mixins',
  member: 'Members',
  namespace: 'Objects',
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

{{>main-index~}}
{{>all-docs~}}
`

// Get template data.
const templateData = jsdoc2md.getTemplateDataSync({
  files: inputFile,
})

// Group template data by kind.
const templateDataByKind = groupBy(templateData, 'kind')

// Create a documentation file for each kind.
Object.entries(templateDataByKind).forEach(([kind, kindTemplateData]) => {
  const template = createTemplate({
    kind,
    title: titleMap[kind],
    sidebarLabel: titleMap[kind],
  })
  console.log(`Rendering ${kind}`)

  const names = kindTemplateData.map(data => data.name)
  const members = templateData.filter(data => names.includes(data.memberof))

  const output = jsdoc2md.renderSync({
    data: [...kindTemplateData, ...members],
    template: template,
    'no-gfm': true,
    separators: true,
    partial: partials,
  })
  fs.writeFileSync(path.resolve(outputDir, `${kind}.md`), output)
})
