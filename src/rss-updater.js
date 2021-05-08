import differenceWith from 'lodash/differenceWith';
import makeRequest from './requester';
import rssFeedParser from './rss-feed-parser';

const syncTime = 5 * 1000;

const getNewPosts = (newPosts, currentPosts) => differenceWith(
  newPosts, currentPosts, (newPost, currentPost) => newPost.id === currentPost.id,
);

const updateFeeds = (state) => {
  state.feed.forEach((feed) => {
    state.updated = 'start';
    makeRequest(feed.url)
      .then((resp) => {
        const parsedFeed = rssFeedParser(resp.data);
        const newPosts = getNewPosts(parsedFeed.items, state.items);
        state.items.push(...newPosts);
        state.updated = 'success';
        state.showedPostsIds.push(...newPosts.map((i) => i.id));
      })
      .catch((err) => {
        state.error = {
          message: 'app.errors.feedHasntBeenUpdated',
          params: {
            origError: err.message,
            feedName: feed.name,
          },
        };
        state.updated = 'error';
      });
  });
  state.updateTracking = '';
  setTimeout(updateFeeds, syncTime, state);
};

export default updateFeeds;
