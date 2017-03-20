import { AggsContainer } from "searchkit"

import {assign} from "lodash"


export function DateHistogramBucket(key, field, options={}, ...childAggs){
    return AggsContainer(key, {date_histogram:assign({field}, options)}, childAggs)
}
