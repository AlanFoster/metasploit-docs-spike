import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { WikiLayout } from '../WikiLayout'

function WikiTemplate({ data: { mdx } }: any) {
  return (
    <WikiLayout>
      <h2>{mdx.frontmatter.title}</h2>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </WikiLayout>
  )
}

export const wikiQuery = graphql`
  query WikiQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
        root
      }
      body
    }
  }
`
export default WikiTemplate
