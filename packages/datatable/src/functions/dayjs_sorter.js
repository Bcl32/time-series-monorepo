import dayjs from "dayjs";

//custom sorting logic columns using datetime values
// the default datetime sorter for react-query-table does not deal with strings well
// for example: 9:40 is greater than 13:30
//using this function removes that issue
export const dayjs_sorter = (rowA, rowB, _columnId) => {
  return dayjs(rowA.original[_columnId]) > dayjs(rowB.original[_columnId])
    ? 1
    : dayjs(rowA.original[_columnId]) < dayjs(rowB.original[_columnId])
      ? -1
      : 0;
};
