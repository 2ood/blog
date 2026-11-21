// Single source of truth for how a post's Notion Status maps to what the site shows.
//
//   Not started  -> hidden everywhere
//   In progress  -> listed as "Upcoming", not clickable, article 404s
//   Published    -> listed + readable
//   Confidential -> listed + readable behind a passcode
//   ...and any readable post written within NEW_POST_DAYS gets the "recent" badge.

const NEW_POST_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

export function plainText(richText) {
  return (richText || []).map((t) => t.plain_text).join('');
}

export function getPostMeta(post, now = new Date()) {
  const props = post.properties;
  const status = props.Status?.status?.name;
  const written = props.Written?.date?.start || null;

  const isConfidential = status === 'Confidential';
  const isPublished = status === 'Published' || isConfidential;
  const isUpcoming = status === 'In progress';
  const age = written ? now - new Date(written) : NaN;

  return {
    slug: plainText(props.Slug?.rich_text),
    title: props.Title?.title || [],
    titleText: plainText(props.Title?.title),
    summary: plainText(props.Summary?.rich_text),
    written,
    isConfidential,
    isPublished,
    isUpcoming,
    isListed: isPublished || isUpcoming,
    isNew: isPublished && age >= 0 && age <= NEW_POST_DAYS * DAY_MS,
  };
}
