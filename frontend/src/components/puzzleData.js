// src/data/puzzleData.js

// Original list from your code
const ORIGINAL_SOLVABLE_NUMBERS = [
  "114735", "115748", "121354", "124864", "126248",
  "126844", "127832", "142555", "142863", "145155",
  "145525", "152288", "159224", "159343", "162736",
  "165824", "175435", "181188", "195232", "196848",
  "325648", "369497", "462864", "481295", "528848",
];

// Cleaned list extracted from your 'ADDITIONAL_SOLVABLE_NUMBERS_50' data
const ADDITIONAL_CLEANED_NUMBERS = [
  
  "786244", 
  "827344",
  "853216",
  "853412",
  "862152",
  "873124",
  "875113",
  "893122",
  "895111",
  "915244"
];

// Combine the lists
const combinedList = [
    ...ORIGINAL_SOLVABLE_NUMBERS,...ADDITIONAL_CLEANED_NUMBERS
];

// Ensure uniqueness and sort the combined list
const uniqueSortedNumbers = Array.from(new Set(combinedList)).sort();

// Export the final list
export const ALL_SOLVABLE_NUMBERS = uniqueSortedNumbers;

// Optional: Log the count to verify
console.log(`Loaded ${ALL_SOLVABLE_NUMBERS.length} unique solvable numbers into puzzleData.js`);