import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getPosts } from '../data/posts'
import { profile } from '../data/site'

export const GET: APIRoute = async (context) => {
  const posts = await getPosts()

  return rss({
    title: `${profile.name} — blog`,
    description: `Notes on backend engineering by ${profile.name}.`,
    site: context.site!,
    // Applied by browsers only; feed readers ignore it and parse the RSS.
    stylesheet: '/rss-styles.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  })
}
