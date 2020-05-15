import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { RootLayout as Layout } from '../Layout'

function PageTemplate({ data: { mdx } }: any) {
  return (
    <Layout>
      <h2>{mdx.frontmatter.title}</h2>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
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
export default PageTemplate
