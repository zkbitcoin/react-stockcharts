/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/merge.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import d3 from "d3";
import setter from "lodash.set"

import calculator from "./slidingWindow";
import identity from "./identity";
import zipper from "./zipper";

import { isDefined, isNotDefined } from "../../utils/utils";

// applies an algorithm to an array, merging the result back into
// the source array using the given merge function.
export default function() {

	var algorithm = calculator(),
		mergePath = [],
		clean = identity;

	function merge(datum, indicator) {
		if (isDefined(indicator) && isDefined(clean(indicator))) {
			return setter(datum, mergePath, indicator);
		}
		return datum;
	};

	function mergeCompute(data) {
		var zip = zipper()
			.combine(merge);

		return zip(data, algorithm(data));
	};

	mergeCompute.algorithm = function(x) {
		if (!arguments.length) {
			return algorithm;
		}
		algorithm = x;
		return mergeCompute;
	};

	mergeCompute.merge = function(x) {
		if (!arguments.length) {
			return merge;
		}
		merge = x;
		return mergeCompute;
	};

	mergeCompute.clean = function(x) {
		if (!arguments.length) {
			return clean;
		}
		clean = x;
		return mergeCompute;
	};

	mergeCompute.mergePath = function(x) {
		if (!arguments.length) {
			return mergePath;
		}
		mergePath = x;
		return mergeCompute;
	};

	return mergeCompute;
}