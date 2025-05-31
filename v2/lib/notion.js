import { Client } from '@notionhq/client';
import { cache } from 'react';

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
});

export async function getDatabase() {
  const results = [];
  let hasMore = true;
  let cursor;

  while (hasMore) {
    // eslint-disable-next-line no-await-in-loop
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 100,
      start_cursor: cursor,
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
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
}

export const getPage = cache(async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

export const getPageFromSlug = cache(async (slug) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  if (response?.results?.length) {
    return response?.results?.[0];
  }
  return null;
});

export const getBlocks = cache(async (blockID) => {
  const blockId = blockID.replaceAll('-', '');

  const { results } = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

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
      prev.quote.rich_text.push(...curr.paragraph.rich_text);
    }

    // ✔️ 그 외 일반 블록
    else {
      merged.push(curr);
    }
  }

  return merged;
});

// lib/notion.js

export async function getAdjacentArticles(currentSlug) {
  const slugNum = parseInt(currentSlug, 10);
  if (Number.isNaN(slugNum)) return { prev: null, next: null };

  const prevPage = await getPageFromSlug(String(slugNum - 1));
  const nextPage = await getPageFromSlug(String(slugNum + 1));

  return {
    prev: prevPage
      ? {
        title: prevPage.properties.Title?.title?.[0]?.plain_text || `Article ${slugNum - 1}`,
        slug: String(slugNum - 1),
      }
      : null,
    next: nextPage
      ? {
        title: nextPage.properties.Title?.title?.[0]?.plain_text || `Article ${slugNum + 1}`,
        slug: String(slugNum + 1),
      }
      : null,
  };
}

export async function getPaginatedPosts(pageNumber, pageSize) {
  const allPosts = await getDatabase(); // 이미 정렬된 상태라면 OK
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

  console.log(response.results);

  return response.results.map((page) => ({
    id: page.id,
    name: page.properties.name?.rich_text?.[0]?.plain_text || 'Anonymous',
    content: page.properties.content?.rich_text?.[0]?.plain_text || '',
    createdAt: page.created_time,
  }));
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
        rich_text: [{ text: { content: name } }],
      },
      content: {
        rich_text: [{ text: { content } }],
      },
    },
  });
}
