import {useState} from 'react'

const useFormHook = initialState => {
    const [state,setState] = useState(initialState)
    const handleChange =  (e) => {
        setState({...state,[e.target.name]: e.target.value})
    }
    const handleReset = () => {
        setState(initialState)
    }
    return  [state,handleChange,handleReset]
}

export default useFormHook;