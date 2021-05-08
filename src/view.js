import last from 'lodash/last';
import onChange from 'on-change';

const createFeedItem = (item) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  const header = document.createElement('h3');
  header.textContent = item.name;
  const description = document.createElement('p');
  description.textContent = item.description;
  li.append(header, description);
  return li;
};

const addFeed = (feed) => {
  const feedElement = createFeedItem(feed);
  const feeds = document.querySelector('.js-feeds');
  if (feeds.children.length === 0) {
    const header = document.createElement('h2');
    header.innerHTML = 'Фиды';
    const list = document.createElement('ul');
    list.classList.add('list-group', 'mb-5');
    list.appendChild(feedElement);
    feeds.append(header);
    feeds.append(list);
    return;
  }
  const list = feeds.querySelector('.list-group');
  list.appendChild(feedElement);
};

const createPostItem = (postItem) => {
  const feedItemContentHtml = `
      <a target="_blank" class="font-weight-bold" href="${postItem.url}">${postItem.name}</a>
      <button type="button" class="btn btn-primary btn-sm">Просмотр</button>
  `.trim();
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  li.innerHTML = feedItemContentHtml;
  // li.querySelector('.post-preview').addEventListener('click', showModal(feedItem));
  // li.querySelector('a').addEventListener('click', (e) => markLinkAsRead(e.target));
  return li;
};

const addPosts = (posts) => {
  const itemsElements = posts.map(createPostItem);
  const rssPosts = document.querySelector('.js-posts');
  if (rssPosts.children.length === 0) {
    const header = document.createElement('h2');
    const list = document.createElement('ul');
    header.innerHTML = 'Посты';
    list.classList.add('list-group');
    rssPosts.append(header);
    rssPosts.append(list);
    list.append(...itemsElements);
    return;
  }
  rssPosts.querySelector('.list-group').append(...itemsElements);
};

const clearFormFeedback = (isClearInput = false) => {
  const feedback = document.querySelector('#form-feedback');
  feedback.classList.remove(...feedback.classList);
  feedback.classList.add('feedback');
  feedback.textContent = '';
  const input = document.querySelector('.js-rss-form').querySelector('input');
  input.classList.remove('is-invalid', 'is-valid');
  if (isClearInput) {
    input.value = '';
  }
};

const setLockSubmitFormButton = (isDisabled) => {
  const submitButton = document.querySelector('.js-rss-form').querySelector('button');
  return isDisabled
    ? submitButton.setAttribute('disabled', true)
    : submitButton.removeAttribute('disabled');
};

const renderSuccessFormFeedback = (message, translator) => {
  const feedback = document.querySelector('#form-feedback');
  feedback.classList.add('text-success');
  feedback.textContent = translator(message);
  document.querySelector('.js-form-control').classList.add('is-valid');
};

const renderFailedFormFeedback = (message, translator) => {
  const feedback = document.querySelector('#form-feedback');
  feedback.classList.add('text-danger');
  document.querySelector('.js-form-control').classList.remove('is-valid');
  feedback.textContent = translator(message);
};

const renderFormErrors = (fields, translator) => {
  const input = document.querySelector('.js-form-control');
  const feedback = document.querySelector('#form-feedback');

  const field = fields.url;
  if (field.error === null) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    clearFormFeedback();
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    feedback.classList.add('text-danger');
    feedback.textContent = translator(field.error);
  }
};

export default (state, translator) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status': {
      switch (value) {
        case 'validating': {
          setLockSubmitFormButton(true);
          break;
        }
        case 'invalid': {
          setLockSubmitFormButton(false);
          clearFormFeedback();
          renderFormErrors(state.fields, translator);
          break;
        }
        case 'succeeded': {
          setLockSubmitFormButton(false);
          clearFormFeedback(true);
          addPosts(state.items);
          addFeed(last(state.feed));
          renderSuccessFormFeedback('app.rssAdded', translator);
          break;
        }
        case 'failed': {
          setLockSubmitFormButton(false);
          renderFailedFormFeedback(state.error, translator);
          break;
        }
        default: {
          break;
        }
      }
      break;
    }
    default: {
      break;
    }
  }
});
