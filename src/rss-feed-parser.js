import _ from 'lodash';

export default (data) => {
  const domparser = new DOMParser();
  const feedId = _.uniqueId();
  const xmlDoc = domparser.parseFromString(data, 'application/xml');
  const channel = xmlDoc.querySelector('channel');
  const posts = xmlDoc.querySelector('channel').querySelectorAll('item');
  return {
    feed: {
      id: feedId,
      name: channel.querySelector('title').textContent,
      description: channel.querySelector('description').textContent,
    },
    items: Array.from(posts).map((item) => {
      const title = item.querySelector('title').textContent;
      const url = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      return {
        id: `${title}:${url}`, name: title, url, feedId, description,
      };
    }),
  };
};