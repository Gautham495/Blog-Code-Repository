import {instance} from './Api';

export const addResourceFromMelli = async melliSearchData => {
  const melliData = {
    index: 'movies',
    data: melliSearchData?.movieData,
  };

  try {
    await instance.post(`/mellisearch/add-document`, melliData);
  } catch (error) {
    console.log(error);
  }
};

export const searchResourcesFromMelli = async melliSearchData => {
  try {
    const melliData = {
      index: 'movies',
      search: melliSearchData?.search,
    };

    const res = await instance.post(`/mellisearch/search`, melliData);

    return res.data.hits;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const deleteResourceFromMelli = async melliSearchData => {
  const melliData = {
    index: 'movies',
    id: melliSearchData?.movieId,
  };

  try {
    await instance.post(`/mellisearch/delete-document`, melliData);
  } catch (error) {}
};
