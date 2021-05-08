import axios from 'axios';

const corsProxy = 'https://api.allorigins.win/raw?url=';

const makeRequest = (url) => axios.get(`${corsProxy}${url}`);

export default makeRequest;
