import * as React from "react";
import * as _ from "lodash";
import {Modal, ButtonToolbar, Button, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import {
    SearchBox,
    Hits,
    HitsStats,
    HitsProps,
    RefinementListFilter,
    Pagination,
    ResetFilters,
    MenuFilter,
    SelectedFilters,
    HierarchicalMenuFilter,
    NumericRefinementListFilter,
    SortingSelector,
    SearchkitComponent,
    SearchkitProvider,
    SearchkitManager,
    NoHits,
    InitialLoader,
    ViewSwitcherToggle,
    ViewSwitcherHits
} from "searchkit";


import "./styles/index.scss";
import "searchkit/theming/theme.scss";
import "../flag-icon-css-master/css/flag-icon.min.css";
import "font-awesome/css/font-awesome.min.css"
import {FontAwesome} from 'react-fontawesome'
import {DateRangeFilter} from "./DateRangeFilter"
import {CrimeDateRange} from "./CrimeDateRange"



const PracticeHitsListItem = (props)=> {
    const {bemBlocks, result} = props
    let url = result._source.newUrl
    const source:any = _.extend({}, result._source, result.highlight)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <div className={bemBlocks.item("details")}>
                <a href={url} target="_blank"><h2 className={bemBlocks.item("Title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
                <h3 className={bemBlocks.item("subtitle")}>{source.newUrl}</h3>
                <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.textContent}}></div>
                <PracticeHit result={result}/>
            </div>
        </div>
    )
}
//This is used to display the search results on a map, using the DataMap component
const PracticeHitsMap = (props)=> {
    return (
        <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>

        </div>
    )
}

//
//className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}
const InitialLoaderComponent = (props) => {
    return (
        <div>
            loading please wait...
        </div>
    )
}

//This component is used to display an individual hit as a modal window.
class PracticeHit extends React.Component<any, any> {
    constructor(props){
        super(props);
        this.state = {show: false};
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal() {
        this.setState({show: true});
    }

    hideModal() {
        this.setState({show: false});
    }

    render() {

        return (
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.showModal}>
                    More info
                </Button>

                <Modal
                    show={this.state.show}
                    onHide={this.hideModal}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">{this.props.result._source.Title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><b>URL: </b><a href={this.props.result._source.newUrl}>{this.props.result._source.newUrl}</a></p>
                        <p><b>Title: </b>{this.props.result._source.title.toString().replace(/_/g," ")}</p>
                        <p><b>Description: </b>{this.props.result._source.textContent}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
}

export class CrimeSearch extends React.Component<any, any> {

    searchkit:SearchkitManager

    constructor() {
        super()
        this.searchkit = new SearchkitManager("/dial100Search")
        this.searchkit.translateFunction = (key)=> {
            return {"pagination.next":"Next Page"}[key]
        }
    }


    render(){
        return (
            <div className="page">
                <div className="page__search-section">
                    <div className="page__search-section__search-area">
                        <SearchkitProvider searchkit={this.searchkit}>
                            <div>
                                <div className="sk-layout sk-layout__size-l">
                                    <div className="sk-layout__top-bar sk-top-bar">
                                        <div className="sk-top-bar__content">
                                            <div className="my-logo"></div>
                                            <SearchBox translations={{"searchbox.placeholder":"Crime Search"}} queryFields={["title","textContent"]}
                                                       queryOptions={{"minimum_should_match":"80%"}} autofocus={true} searchOnChange={true}   />
                                        </div>
                                    </div>
                                    <div className="sk-layout__body">
                                        <div className="sk-layout__filters">
                                            <RefinementListFilter id="site" title="Site" field="site" operator="OR" size={7}/>
                                            {/*<DateRangeFilter id="year" field="created_at" title="News Date" min={(new Date().getFullYear()-1)}*/}
                                            {/*max={new Date().getFullYear()+1}*/}
                                            {/*interval="year"*/}
                                            {/*showHistogram={true} />*/}
                                            <div className="sk-panel filter--daterange">

                                                <div className="sk-panel__header">Date Range</div>
                                                <div className="sk-panel__content">

                                            <CrimeDateRange
                                                searchkit={this.searchkit}
                                                field="created_at"
                                                id="date"
                                                title="Date Range"
                                                showClearDates
                                            />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="sk-layout__results sk-results-list">
                                            <div className="sk-results-list__action-bar sk-action-bar">
                                                <div className="sk-action-bar__info">
                                                    <HitsStats translations={{"hitstats.results_found":"{hitCount} results found"}}/>
                                                    <ViewSwitcherToggle/>

                                                </div>
                                                <div className="sk-action-bar__filters">
                                                    <SelectedFilters/>
                                                    <ResetFilters/>
                                                </div>
                                            </div>
                                            <ViewSwitcherHits
                                                hitsPerPage={20} highlightFields={["title","textContent"]}
                                                sourceFilter={["title","textContent","newUrl"]}
                                                hitComponents = {[
                                                    {key:"list", title:"List", itemComponent:PracticeHitsListItem, defaultOption:true},
									{key:"map", title:"Map", listComponent:PracticeHitsMap}
								  ]}
                                                scrollTo="body"
                                            />
                                            <NoHits suggestionsField={"title"}/>
                                            <InitialLoader component={InitialLoaderComponent}/>
                                            <Pagination showNumbers={true}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </SearchkitProvider>
                    </div>
                </div>

            </div>
        )}
}
