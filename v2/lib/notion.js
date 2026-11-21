import { Client } from '@notionhq/client';
import { cache } from 'react';
import { getPostMeta, plainText } from './postMeta';

export const revalidate = 3600; // revalidate the data at most every hour

const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Returns a random integer between the specified values, inclusive.
 * The value is no lower than `min`, and is less than or equal to `max`.
 *
 * @param {number} minimum - The smallest integer value that can be returned, inclusive.
 * @param {number} maximum - The largest integer value that can be returned, inclusive.
 * @returns {number} - A random integer between `min` and `max`, inclusive.
 */
function getRandomInt(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  // Use the platform fetch instead of the SDK's bundled node-fetch,
  // which calls the deprecated url.parse() (DEP0169).
  fetch: (...args) => fetch(...args),
});

export const getDatabase = cache(async () => {
  const results = [];
  let hasMore = true;
  let cursor;

  while (hasMore) {
    // eslint-disable-next-line no-await-in-loop
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 100,
      start_cursor: cursor,
      sorts: [
        {
          property: 'Written',
          direction: 'descending',
        },
      ],
    });

    results.push(...response.results);
    hasMore = response.has_more;
    cursor = response.next_cursor;
  }

  return results;
});

export const getPage = cache(async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

export const getPageFromSlug = cache(async (slug) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    }
  });
  if (response?.results?.length) {
    return response?.results?.[0];
  }
  return null;
});

// Returns { page, meta } only for posts that may be read (Published / Confidential).
export const getReadablePost = cache(async (slug) => {
  if (typeof slug !== 'string' || !slug) return null;
  const page = await getPageFromSlug(slug);
  if (!page) return null;
  const meta = getPostMeta(page);
  return meta.isPublished ? { page, meta } : null;
});

const LINE_BREAK = {
  type: 'text',
  text: { content: '\n', link: null },
  annotations: { color: 'default' },
  plain_text: '\n',
  href: null,
};

export const getBlocks = cache(async (blockID) => {
  const blockId = blockID.replaceAll('-', '');

  const results = [];
  let cursor;
  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  // 재귀적으로 모든 자식 블록 가져오기
  const childBlocks = await Promise.all(results.map(async (block) => {
    if (block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  }));

  // 병합된 최종 블록 리스트
  const merged = [];

  for (let i = 0; i < childBlocks.length; i++) {
    const curr = childBlocks[i];
    const prev = merged[merged.length - 1];

    // ✔️ bulleted list 병합
    if (curr.type === 'bulleted_list_item') {
      if (prev?.type === 'bulleted_list') {
        prev.bulleted_list.children.push(curr);
      } else {
        merged.push({
          id: getRandomInt(10 ** 99, 10 ** 100).toString(),
          type: 'bulleted_list',
          bulleted_list: { children: [curr] },
        });
      }
    }

    // ✔️ numbered list 병합
    else if (curr.type === 'numbered_list_item') {
      if (prev?.type === 'numbered_list') {
        prev.numbered_list.children.push(curr);
      } else {
        merged.push({
          id: getRandomInt(10 ** 99, 10 ** 100).toString(),
          type: 'numbered_list',
          numbered_list: { children: [curr] },
        });
      }
    }

    // ✔️ quote + 다음 paragraph 병합
    else if (
      curr.type === 'paragraph'
      && prev?.type === 'quote'
      && curr.paragraph?.rich_text?.length > 0
    ) {
      // Line break between the merged paragraphs; rendered via white-space: pre-line.
      prev.quote.rich_text.push(LINE_BREAK, ...curr.paragraph.rich_text);
    }

    // ✔️ 그 외 일반 블록
    else {
      merged.push(curr);
    }
  }

  return merged;
});

// Prev = the next-older readable post, Next = the next-newer one (by Written date).
export async function getAdjacentArticles(currentSlug) {
  const readable = (await getDatabase()).map((p) => getPostMeta(p)).filter((m) => m.isPublished);
  const index = readable.findIndex((m) => m.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };

  const toNav = (m) => (m ? { title: m.titleText, slug: m.slug } : null);
  return {
    prev: toNav(readable[index + 1]),
    next: toNav(readable[index - 1]),
  };
}

export async function getPaginatedPosts(pageNumber, pageSize) {
  const allPosts = (await getDatabase()).filter((p) => getPostMeta(p).isListed);
  const start = (pageNumber - 1) * pageSize;
  const paginated = allPosts.slice(start, start + pageSize);

  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);

  return {
    posts: paginated,
    totalPages,
  };
}

export async function getComments(slug) {
  const databaseId = process.env.NOTION_DATABASE_COMMENTS_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'slug',
      rich_text: {
        equals: slug,
      },
    },
    sorts: [
      {
        property: 'created_at',
        direction: 'ascending',
      },
    ],
  });

  return response.results.map((page) => ({
    id: page.id,
    name: plainText(page.properties.name?.rich_text) || 'Anonymous',
    content: plainText(page.properties.content?.rich_text),
    createdAt: page.created_time,
  }));
}

// Notion caps each rich_text item at 2000 characters.
function toRichText(str) {
  const chunks = str.match(/[\s\S]{1,2000}/g) || [];
  return chunks.map((content) => ({ text: { content } }));
}

export async function postComment({ slug, name, content }) {
  const databaseId = process.env.NOTION_DATABASE_COMMENTS_ID;

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      slug: {
        title: [{ text: { content: slug } }],
      },
      name: {
        rich_text: toRichText(name),
      },
      content: {
        rich_text: toRichText(content),
      },
    },
  });
}

export const checkPasscodeFromSlug = cache(async (slug, passcodeChallenge) => {
  const databaseId = process.env.NOTION_DATABASE_PASSCODES_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          title: {
            equals: slug,
          },
        },
        {
          property: 'Passcode',
          rich_text: {
            equals: passcodeChallenge,
          },
        },
      ],
    }
  });

  return response?.results.length > 0;
});
