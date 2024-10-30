import { GetActiveFilters } from "@repo/filters/GetActiveFilters";
import { ApplyFilters } from "@repo/filters/ApplyFilters";
import { CalculateFeatureStats } from "./CalculateFeatureStats";

export function ProcessDataset(dataset, filters, ModelData) {
  var active_filters = GetActiveFilters(filters);
  var filteredData = ApplyFilters(dataset, active_filters);

  var datasetStats = CalculateFeatureStats(ModelData.model_attributes, dataset);
  var filteredStats = CalculateFeatureStats(
    ModelData.model_attributes,
    filteredData
  );

  return {
    active_filters: active_filters,
    filteredData: filteredData,
    datasetStats: datasetStats,
    filteredStats: filteredStats,
  };
}
