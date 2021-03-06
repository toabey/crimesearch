import {
    FilterBasedAccessor,
    ObjectState,
    RangeQuery,
    BoolMust,
    CardinalityMetric,
    FilterBucket,
    State
} from "searchkit"

import { DateHistogramBucket } from "./DateHistogramBucket"

import {get, maxBy} from "lodash"

export class DateRangeAccessor extends FilterBasedAccessor<State<any>> {

    options:any


    constructor(key, options){
        super(key, options.id)
        this.options = options

        this.state = new ObjectState({})
    }


    buildSharedQuery(query) {
        if (this.state.hasValue()) {
            let val = this.state.getValue()
            let rangeFilter = RangeQuery(this.options.field,{
                format:"yyyy||yyyy",
                lte:val.max , // first date of year
                gte:val.min , // last date of year

            })
            let selectedFilter = {
                name:this.translate(this.options.title),
                value:`${val.min} - ${val.max}`,
                id:this.options.id,
                remove:()=> {
                    this.state = this.state.clear()
                }
            }

            return query
                .addFilter(this.key, rangeFilter)
                .addSelectedFilter(selectedFilter)

        }

        return query
    }

    getBuckets(){
        return this.getAggregations(
            [this.key, this.key, "buckets"], []
        )
    }

    isDisabled() {
        if (this.options.loadHistogram) {
            const maxValue = get(maxBy(this.getBuckets(), "doc_count"), "doc_count", 0)
            return maxValue === 0
        } else {
            return this.getAggregations([this.key, this.key, "value"], 0) === 0
        }
    }

    getInterval(){
        if (this.options.interval) {
            return this.options.interval
        }
        return "year"
    }

    buildOwnQuery(query) {
        let otherFilters = query.getFiltersWithoutKeys(this.key)
        let filters = BoolMust([
            otherFilters,
            RangeQuery(this.options.field,{
                format:"yyyy||yyyy",
                lte:this.options.max , // first date of year
                gte:this.options.min , // last date of year

            })
        ])

        let metric

        if (this.options.loadHistogram) {
            metric = DateHistogramBucket(this.key, this.options.field, {
                "interval":this.getInterval(),
                "min_doc_count":0,
                "extended_bounds":{
                    "min":this.options.min,
                    "max":this.options.max
                }
            })
        } else {
            metric = CardinalityMetric(this.key, this.options.field)
        }

        return query.setAggs(FilterBucket(
            this.key,
            filters,
            metric
        ))
    }
}