import axios from 'axios'
//const baseUrl = 'http://localhost:3001/api/persons'
// we use app.use(express.static('dist')) in index.js and build app in render.com
// 前后端被打包放在同个地址，可以不用指明端口进行访问了
const baseUrl = '/api/persons'     

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { getAll, create, update, remove }