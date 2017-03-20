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
    ViewSwitcherHits,
    MultiMatchQuery
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
    const source:any = _.extend({}, result._source, result.highlight)
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
            <div className={bemBlocks.item("details")}>
                <h2 className={bemBlocks.item("Title")} dangerouslySetInnerHTML={{__html:source.CaseNo}}></h2>
                <h3 className={bemBlocks.item("subtitle")}>{source.CrimeTime} </h3>
                <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.CrimeType +" <b>AT</b> "+ source.Address +" <b>IN</b> " +source.PoliceName+" STATION" + " <br/><b>Details:</b> "+source.CrimeDetails}}></div>
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
                        <p><b>CaseNo: </b>{this.props.result._source.CaseNo}</p>
                        <p><b>Crime Type: </b>{this.props.result._source.CrimeType}</p>
                        <p><b>Details: </b>{this.props.result._source.CrimeDetails}</p>
                        <p><b>Crime Time: </b>{this.props.result._source.CrimeTime}</p>
                        <p><b>Address: </b>{this.props.result._source.Address}</p>
                        <p><b>District: </b>{this.props.result._source.District}</p>
                        <p><b>Police Station: </b>{this.props.result._source.PoliceName}</p>
                        <p><b>Day of Week: </b>{this.props.result._source.DayofWeek}</p>

                        <p><b>Beat: </b>{this.props.result._source.PSBeatBoundary}</p>
                        <p><b>Market: </b>{this.props.result._source.MarketLocation}</p>
                        <p><b>Railway Station: </b>{this.props.result._source.RailwayStation}</p>
                        <p><b>Bar: </b>{this.props.result._source.BarLocation}</p>
                        <p><b>Institute: </b>{this.props.result._source.InstituteLocation}</p>
                        <p><b>Mandir: </b>{this.props.result._source.MandirLocation}</p>
                        <p><b>Masjid: </b>{this.props.result._source.MasjidLocation}</p>
                        <p><b>Church: </b>{this.props.result._source.ChurchLocation}</p>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        )
    }
}

export class CrimeCallSearch extends React.Component<any, any> {

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
                                            <SearchBox translations={{"searchbox.placeholder":"Crime Search"}} queryBuilder={MultiMatchQuery}
                                                       queryFields={["CaseNo","Address","CrimeDetails","PoliceName","CrimeType"]}
                                                       queryOptions={{"minimum_should_match":"85%","analyzer":"my_search_analyzer","fuzziness":"AUTO"}}  autofocus={true} searchOnChange={true}   />
                                        </div>
                                    </div>
                                    <div className="sk-layout__body">
                                        <div className="sk-layout__filters">


                                            {/*<DateRangeFilter id="year" field="created_at" title="News Date" min={(new Date().getFullYear()-1)}*/}
                                            {/*max={new Date().getFullYear()+1}*/}
                                            {/*interval="year"*/}
                                            {/*showHistogram={true} />*/}
                                            <div className="sk-panel filter--daterange">

                                                <div className="sk-panel__header">Date Range</div>
                                                <div className="sk-panel__content">

                                                    <CrimeDateRange
                                                        searchkit={this.searchkit}
                                                        field="CrimeTime"
                                                        id="date"
                                                        title="Date Range"
                                                        showClearDates
                                                    />
                                                </div>
                                            </div>


                                            <RefinementListFilter id="crimetype" title="Crime Type" field="CrimeType" operator="OR" size={7}/>
                                            <RefinementListFilter id="district" title="District" field="District" operator="OR" size={7}/>
                                            <RefinementListFilter id="policestation" title="Police Station" field="PoliceName.raw" operator="OR" size={7}/>
                                            <RefinementListFilter id="timeinterval" title="Time Interval" field="TimeInterval" operator="OR" size={7}/>
                                            <RefinementListFilter id="dayofweek" title="Day of Week" field="DayofWeek" operator="OR" size={7}/>
                                            <RefinementListFilter id="psbeatboundary" title="Beat Boundary" field="PSBeatBoundary" operator="OR" size={7}/>

                                            <RefinementListFilter id="marketlocation" title="Market Location" field="MarketLocation" operator="OR" size={7}/>
                                            <RefinementListFilter id="railwaystation" title="Railway Station" field="RailwayStation" operator="OR" size={7}/>
                                            <RefinementListFilter id="barlocation" title="Bar Location" field="BarLocation" operator="OR" size={7}/>
                                            <RefinementListFilter id="institutelocation" title="Institute Location" field="InstituteLocation" operator="OR" size={7}/>


                                            <RefinementListFilter id="masjidlocation" title="Masjid Location" field="MasjidLocation" operator="OR" size={7}/>
                                            <RefinementListFilter id="churchlocation" title="Church Location" field="ChurchLocation" operator="OR" size={7}/>
                                            <RefinementListFilter id="mandirlocation" title="Mandir Location" field="MandirLocation" operator="OR" size={7}/>
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
                                                hitsPerPage={10} highlightFields={["Address","CrimeDetails","PoliceName","CaseNo","CrimeType"]}
                                                sourceFilter={["Address","CrimeDetails","PoliceName","CrimeType","CaseNo","CrimeTime",
                                                "District","DayofWeek","PSBeatBoundary","MarketLocation","RailwayStation","BarLocation",
                                                "InstituteLocation","MandirLocation","MasjidLocation","ChurchLocation"]}
                                                hitComponents = {[
                                                    {key:"list", title:"List", itemComponent:PracticeHitsListItem, defaultOption:true},
									{key:"map", title:"Map", listComponent:PracticeHitsMap}
								  ]}
                                                scrollTo="body"
                                            />
                                            <NoHits suggestionsField={"CrimeDetails"}/>
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
