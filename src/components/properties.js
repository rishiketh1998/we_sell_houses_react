import React, {useEffect, useState} from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Sorting from "./sorting";
import Filter from "./filter";
import Property from "./property";
import AddPropertyContainer from "./user/addPropertyContainer";
import { withRouter } from "react-router-dom"
import Pagination from 'react-bootstrap/Pagination'
import LinearProgress from '@material-ui/core/LinearProgress';
import Error from "./response/error";
import NoResults from "./response/noResults";

/**
 * @description: makes a call to the api (depending on the url either agent properties or all). Once the
 * data is received it displays the calls the property component to display each property.
 * @param props [initialUrl:on mount url, setUrl:function to set updated url, updateUrl: url that can be updated]
 * @returns {JSX.Element}
 * @constructor
 */
const Properties = (props) => {
    const [ propertiesData, setPropertiesData ] = useState('')
    const [ loading, setLoading ] = useState(true)
    const [ updateOnAdd, setUpdateOnAdd ] = useState(false)
    const [ page, setPageNo ] = useState(1)
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    const [ displayNoProperties, setDisplayNoProperties] = useState(false)
    const userProperties = props.initialUrl.indexOf('/api/v1/users/') !== -1
    /**
     * @description: each time url is updated useEffect is called to retrieve data from the updated url.
     * If not data are found it displays an alert or else if an error occurs while making the request it displays the
     * error message / modal
     */
    useEffect(() => {
      setLoading(true)
      const getProperties = async () => {
          try {
              const {data} = await axios.get(props.updateUrl)
              setPropertiesData(data.Result)
              setLoading(false)
              setErrorData({})
              if(data.Result === 'No Data Found') setDisplayNoProperties(true)
              else setDisplayNoProperties(false)
          } catch (err) {
              setShowErrModal(true)
              setErrorData(err.response)
          }
      }
      if(!props.error) getProperties()
    },[props, updateOnAdd])
    const properties = propertiesData.data
    /**
     * @description: updates the url in order to fetch data from next page, provided next page exists
     */
    const handleNext = () => {
        setPageNo(prevState => prevState + 1)
        let url = propertiesData.nextPage
        const index = url.indexOf('api')
        url = url.slice(index - 1,url.length)
        props.setUrl(url)
    }
    /**
     * @description: updates the url in order to fetch data from prev page, provided prev page exists
     */
    const handlePrev = () => {
        setPageNo(prevState => prevState - 1)
        let url = propertiesData.previousPage
        const index = url.indexOf('api')
        url = url.slice(index - 1,url.length)
        props.setUrl(url)
    }
    return (
        <div className="row m-3">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <div className="col-xl-3   border">
                {
                    userProperties &&
                    <Paper className="mx-xl-3 my-3 border border-4" elevation={4} square>
                        <AddPropertyContainer update={updateOnAdd} setUpdate={setUpdateOnAdd}/>
                    </Paper>
                }
                <Paper className="mx-xl-3 my-3 border border-4" elevation={4} square>
                    <Sorting setUrl={props.setUrl} url={props.initialUrl} />
                </Paper>
                <Paper className="mx-xl-3 my-3 border border-4" elevation={4} square>
                    <Filter setUrl={props.setUrl} url={props.initialUrl} />
                </Paper>
            </div>
            <div className="col-xl-9  border">
                <NoResults display={displayNoProperties} header="Properties"/>
                {loading || !properties ? <LinearProgress /> : properties.map( property => {
                    return (
                        (!userProperties ? property.publish : true) && <Property property={property} history={props.history} key={property._id}
                                            showUser={userProperties} update={updateOnAdd} setUpdate={setUpdateOnAdd}/>
                    )
                })}
                <div className="row mx-3 my-2 d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First disabled={page === 1} onClick={handlePrev}/>
                            <Pagination.Item active>
                                {page}
                            </Pagination.Item>
                        <Pagination.Last disabled={!propertiesData.nextPage}
                                         onClick={handleNext} />
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Properties)