// Implement the function `twoSum(nums, target)` that takes an array of integers and a target integer,
// and returns an array of the two indices whose values add up to the target. You may assume exactly
// one solution exists and you may not use the same element twice. Return the indices in ascending order.

function twoSum(nums, target) {
  for (let i = 0; nums.length - 1; i++) {
    let res;
    const pendingAmount = target - nums[i];

    if (!target && !nums[i]) {
      let secondValue;
      nums.find((num, index) => {
        if (num === 0 && index !== i) secondValue = index;
      });

      return res = [i, secondValue];
    }

    if (!nums.find((num) => num == pendingAmount)) continue;

    if (target / pendingAmount === 2 && pendingAmount != nums[i + 1]) continue;

    nums.find((number, index) => {
      if (number === pendingAmount) res = [i, index];
    });

    console.log("debug res ->", res);
    return res;
  }
}

const testCases = [
  {
    id: 1,
    input: {
      nums: [2, 7, 11, 15],
      target: 9,
    },
  },
  {
    id: 2,
    input: {
      nums: [3, 2, 4],
      target: 6,
    },
  },
  {
    id: 3,
    input: {
      nums: [3, 3],
      target: 6,
    },
  },
  {
    id: 4,
    input: {
      nums: [1, 2, 3, 4, 5],
      target: 9,
    },
  },
  {
    id: 5,
    input: {
      nums: [0, 4, 3, 0],
      target: 0,
    },
  },
  {
    id: 6,
    input: {
      nums: [-1, -2, -3, -4, -5],
      target: -8,
    },
  },
  {
    id: 7,
    input: {
      nums: [1, 5, 2, 11],
      target: 7,
    },
  },
  {
    id: 8,
    input: {
      nums: [10, 20, 30, 40],
      target: 70,
    },
  },
  {
    id: 9,
    input: {
      nums: [100, 200, 300],
      target: 400,
    },
  },
  {
    id: 10,
    input: {
      nums: [1, 1, 1, 1, 2],
      target: 3,
    },
  },
];

testCases.forEach((item) => {
  twoSum(item.input.nums, item.input.target);
});
