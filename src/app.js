import i18next from 'i18next';
import * as yup from 'yup';
import makeRequest from './requester';
import view from './view';
import rssFeedParser from './rss-feed-parser';
import updateFeeds from './rss-updater';
import ru from '../locales/ru';

import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';

const getFormValidationSchema = (feeds) => (
  yup.object().shape({
    url: yup
      .string()
      .url()
      .notOneOf(feeds.map((f) => f.url)),
  })
);

const app = () => {
  const state = {
    updated: '',
    showedPostsIds: [],
    feed: [],
    items: [],
    form: {
      valid: false,
      status: '',
    },
    fields: {
      url: {
        value: '',
        error: null,
      },
    },
    error: null,
  };

  i18next.init({
    lng: 'ru',
    resources: { ru },
  }).then((translator) => {
    yup.setLocale({
      mixed: {
        notOneOf: 'form.errors.rssAlreadyExists',
      },
      string: {
        url: 'form.errors.inputValidUrl',
      },
    });

    const watchedState = view(state, translator);
    const rssForm = document.querySelector('.js-rss-form');
    const formControl = document.querySelector('.js-form-control');
    formControl.addEventListener('input', (e) => {
      watchedState.fields.url.value = e.target.value;
    });
    rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const {
        fields: {
          url: {
            value,
          },
        },
      } = watchedState;
      watchedState.form.status = 'validating';
      getFormValidationSchema(watchedState.feed).validate({ url: value })
        .then((res) => {
          makeRequest(res.url).then((resp) => {
            if (resp.data === '') {
              throw Error('app.rssError');
            }
            const parsedFeed = rssFeedParser(resp.data);
            watchedState.feed.push({ url: res.url, ...parsedFeed.feed });
            watchedState.items.push(...parsedFeed.items);
            watchedState.form.status = 'succeeded';
            state.showedPostsIds.push(...parsedFeed.items.map((i) => i.id));
            watchedState.fields.url = {
              value: '',
              error: null,
            };
          }).catch((err) => {
            state.error = err.message;
            watchedState.form.status = 'failed';
          });
        })
        .catch((error) => {
          state.fields.url = {
            error: error.message,
            value,
          };
          watchedState.form.status = 'invalid';
        });
    });

    updateFeeds(watchedState);
  });
};

export default app;
