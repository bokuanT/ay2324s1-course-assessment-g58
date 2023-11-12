import { LANGUAGE, DIFFICULTY } from "./LanguageEnum";

export const question10 = {
    title: "Fibonacci Number",
    description:
`The Fibonacci numbers, commonly denoted F(n) form a sequence, called the
Fibonacci sequence, such that each number is the sum of the two preceding
ones, starting from 0 and 1. That is,
F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.
Given n, calculate F(n).

Example 1:
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
Example 2:
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
Example 3:
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.

Constraints:
- 0 <= n <= 30
`,
    difficulty: DIFFICULTY.EASY,
    category: "Recursion, Algorithms",
    templates: [
        {
            language: LANGUAGE.PYTHON,
            starterCode:
`class LRUCache:
    def __init__(self, capacity):
        pass

    def deleteNode(self, p):
        pass

    def addNode(self, newnode):
        pass

    def get(self, key):
        pass

    def put(self, key, value):
        pass

# Example usage:
# cache = LRUCache(capacity)
# value = cache.get(key)
# cache.put(key, value)
`
            , driverCode:
`import sys

# Assuming LRUCache class is defined above

lRUCache = LRUCache(2)
operations = ["put", "put", "get", "put", "get", "put", "get", "get", "get"]
parameters = [[1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
expected_outputs = [None, None, 1, None, -1, None, -1, 3, 4]

for i, operation in enumerate(operations):
    if operation == "put":
        lRUCache.put(parameters[i][0], parameters[i][1])
    elif operation == "get":
        result = lRUCache.get(parameters[i][0])
        if result != expected_outputs[i]:
            print(f"AssertionError: Test {i+1}: Expected {expected_outputs[i]}, but got {result}", file=sys.stderr)
`
        }, {
            language: LANGUAGE.JAVA,
            starterCode:
`class Solution {
    public int fib(int n) {
        return 0;
    }
}
`
            , driverCode:
`public class Main {
    public static void main(String[] args) {
        int[][] testcases = {{2, 1}, {3, 2}, {4, 3}};
        Solution solution = new Solution();

        for (int i = 0; i < testcases.length; i++) {
            int input = testcases[i][0];
            int expected = testcases[i][1];
            int actual = solution.fib(input);

            if (actual != expected) {
                System.err.println("AssertionError: Test " + (i + 1) + ": Expected " + expected + ", but got " + actual);
            }
        }
    }
}
`
        }, {
            language: LANGUAGE.JAVASCRIPT,
            starterCode:
`/**
* @param {number} n
* @return {number}
*/
var fib = function(n) {
    return 0;
};
`
            , driverCode:
`// Assuming the fib function is defined above

const testcases = [
    {input: 2, expected: 1},
    {input: 3, expected: 2},
    {input: 4, expected: 3}
];

testcases.forEach((test, index) => {
    const actual = fib(test.input);
    
    if (actual !== test.expected) {
        console.error(\`AssertionError: Test \${index + 1}: Expected \${test.expected}, but got \${actual}\`);
    }
});
`
        },
        {
            language: LANGUAGE.CPP,
            starterCode:
`class Solution {
public:
    int fib(int n) {
        return 0;
    }
};
`
            , driverCode:
`#include <iostream>
#include <vector>
using namespace std;

// Assuming the Solution class is defined above

int main() {
    vector<pair<int, int>> testcases = {{2, 1}, {3, 2}, {4, 3}};
    Solution solution;

    for (int i = 0; i < testcases.size(); i++) {
        int input = testcases[i].first;
        int expected = testcases[i].second;
        int actual = solution.fib(input);

        if (actual != expected) {
            cerr << "AssertionError: Test " << (i + 1) << ": Expected " << expected << ", but got " << actual << endl;
        }
    }
    return 0;
}
`
        },
        {
            language: LANGUAGE.C,
            starterCode:
`int fib(int n) {
    return 0;
}
`
            , driverCode:
`#include <stdio.h>

// Assuming the fib function is defined above

int main() {
    int testcases[][2] = {{2, 1}, {3, 2}, {4, 3}};

    for (int i = 0; i < sizeof(testcases) / sizeof(testcases[0]); i++) {
        int input = testcases[i][0];
        int expected = testcases[i][1];
        int actual = fib(input);

        if (actual != expected) {
            fprintf(stderr, "AssertionError: Test %d: Expected %d, but got %d\n", i + 1, expected, actual);
        }
    }

    return 0;
}
`
        }
    ],
    functions: [],
    calls: [],
};
