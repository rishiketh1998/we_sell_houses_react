import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header  from "./components/navbar/header";
import { Switch, Route, Redirect } from "react-router-dom";
import Properties from "./components/properties";
import { UserContext } from "./contexts/userContext";
import UserProperties from "./components/user/userProperties";
import axios from "axios"
import Error from "./components/response/error";
import ZooplaProperties from "./components/zoopla/zooplaProperties";

/**
 * @description: Main (Parent) Component for the Application. Calls rest of the components provided conditions are met.
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
  const [ user, setUser ] = useState(null)
  const api = '/api/v1/login'
  const initialPropertyUrl = "/api/v1/properties?page=1&limit=5"
  const [ propertiesUrl, setPropertiesUrl] = useState(initialPropertyUrl)
  const [ errorData, setErrorData ] = useState({})
  const [ showErrModal, setShowErrModal ] = useState(false)
  const [ error, setError ] = useState(false)
  /**
     * @description: checks whether the user is logged in each time the page is refreshed and if the user is logged
     * in, it stores the user data that is retrieved from the api in user context. If an error occurs during the server
     * call, it updates the error modal to be displayed
     */
  useEffect(() => {
    const checkLogin = async () => {
        try {
            const { data } = await axios.get(api, { withCredentials: true })
            setUser(data.Data)
            setError(false)
            setErrorData({})
        } catch (err) {
            if(err.response.status !== 401) {
                setShowErrModal(true)
                setError(true)
                setErrorData(err.response)
            }
        }
    }
    checkLogin()
  },[])
  return (
        <div className="App">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <UserContext.Provider value={{user, setUser}}>
               <Header />
               <Switch>
                   <Route path="/" exact><Redirect to="/properties"/></Route>
                   <Route path="/properties" exact
                    render={
                        () => <Properties initialUrl={initialPropertyUrl}
                                          setUrl={setPropertiesUrl}
                                          updateUrl={propertiesUrl}
                                          error={error}
                        />
                    } />
                   {user && <Route path="/user/properties" exact component={UserProperties}/>}
                   <Route path="/zoopla/Properties" exact component={ZooplaProperties}/>
                   <Route path="*" ><Redirect to="/properties"/></Route>
               </Switch>
            </UserContext.Provider>
        </div>
  );
}

export default App;
