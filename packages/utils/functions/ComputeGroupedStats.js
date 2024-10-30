export function ComputeGroupedStats(filteredData, feature, sort = true) {
  var grouped_data = groupByKey(filteredData, feature);
  var counts = get_group_counts(grouped_data, sort);

  if (sort) {
    counts.sort((a, b) => a.length - b.length); //changes original array
    counts.reverse(); //changes to descending
  }
  return counts;
}

function groupByKey(data, key) {
  //returns object with keys for each unique feature with an array of the entries with that key
  //   {
  //  "key1":[{"item"},{"item2"}],
  //  "key2":[{"item"},{"item2"},{"item3"}]
  //   }
  return Object.groupBy(
    data,
    ({ [key]: string_title }) => string_title //[feature] converts variable 'feature' passed in to string
  );
}

function get_group_counts(input_data) {
  //input: groups of raw habit entries organized by chosen attribute
  //output: one object per group that contains a count of the entries that were in the group

  //returns object with keys for each unique feature with an array of the entries with that key
  //   { "name": "key1", "length": 2,
  //     "name": "key2", "length": 3,
  //   }

  var session_counts = [];
  for (var [key, value] of Object.entries(input_data)) {
    var entry = { length: input_data[key].length, name: key };
    session_counts.push(entry);
  }

  return session_counts;
}
