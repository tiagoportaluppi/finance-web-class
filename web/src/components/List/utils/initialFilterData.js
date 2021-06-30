const initialFilterData = ({ query, queryParams }) => {
  if (!queryParams) return {};

  const newFilterData = {};
  Object.keys(queryParams).forEach((key) => {
    newFilterData[key] = query[key];
  });

  return newFilterData;
};

export default initialFilterData;
