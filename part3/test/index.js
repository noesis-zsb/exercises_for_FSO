// 定义notes
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const http = require('http')

// Express创建web
const express = require('express')
const app = express()

// 使用Express的json-parser
app.use(express.json())

// 定义路径和事件处理函数
app.get('/', (request, response) => {
    response.send('<h1>hello word</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

// 定义REST风格的接口, 处理查询的get请求
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if(note) {
        response.json(note)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

// 提交数据
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}
app.post('/api/notes', (request, response) => {
    const body = request.body
    
    if (!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
