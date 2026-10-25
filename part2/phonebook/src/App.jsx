import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({filter, handleFilterChange}) => {
    return <div>
        filter shown with: <input value={filter} onChange={handleFilterChange}/>
    </div>
}

/* 添加新联系人的表单组件 */
const PersonForm = ({
  onSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => {handleDelete(person.id, person.name)}}>delete</button>
    </p>
  )
}

/* {persons} can get only persons from props */
const ListNames = ({persons, handleDelete}) => {
    return <div>
        {persons.map(person => (
            <Person key={person.id} person={person} handleDelete={handleDelete} />
        ))}
    </div>
}

// for errorMessage

const Notification = ({message, isError}) => {
  if (message==null){
    return null
  }

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }
  return (
    <div style={notificationStyle}>{message}</div>
  )
}

const App = () => {
  /*
  // for testing program
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  */

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // for showing message
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)    


  /* load data from json */
  useEffect(() => {
    /*console.log('effect')*/
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        setMessage('Failed to load phonebook')
        setIsError(true)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }, [])

  const handleDeleteOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))

          // green notification
          setMessage(`Deleted ${name}`)
          setIsError(false)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }).catch(error => {
          //alert(`'${name}' was already removed from server`)
          setMessage(`Information of '${name}' has already been removed from server`)
          setIsError(true)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const addPerson = (e) => {
    e.preventDefault()

    const personObject = {
        name: newName,
        number: newNumber,
    }

    /* check the newName if it exists in persons */
    const isExist = persons.find(
        p => p.name.toLowerCase() === newName.trim().toLowerCase() 
    )

    if (isExist){
        //alert(`${newName} is already added to phonebook, replace the old number with a new one?`)
        const confirmUpdate = window.confirm(`${isExist.name} is already added to phonebook, replace the old number with a new one?`)

        if (confirmUpdate){
          // new person
          const updatedPerson = {...isExist, number: newNumber}
          
          personService
            .update(isExist.id, updatedPerson)
            .then(returnedPerson => {
              //
              setPersons(persons.map(p => p.id !== isExist.id ? p : returnedPerson))
              setNewName('')
              setNewNumber('')

              // green notification
              setMessage(`Updated ${returnedPerson.name}`)
              setIsError(false)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            }).catch(error => {
              // 废弃处理方案
              //alert('The person has already been removed from phonebook')
              // 如果后端json文件里已经没这个人了，就得把前端数组里的也删掉
              //setPersons(persons.filter(p=>p.id !== isExist.id))

              // error processing
              setMessage(`Information of ${isExist.name} has already been removed from server`)
              setIsError(true)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(p=>p.id !== isExist.id))
            })


        }
        return 
    }

    /* add data to db.json */
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        // green notification
        setMessage(`Added ${returnedPerson.name}`)
        setIsError(false)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        // 
        setMessage(`Failed to add ${newName}`)
        setIsError(true)
        setTimeout(() => {
        setMessage(null)
        }, 5000)
      })
  }

  /* for handling newName */
  const handleNameChange = (e) => {
    console.log(e.target.value)
    setNewName(e.target.value)
  }

  /* for handling newNumber */
  const handleNumberChange = (e) => {
    console.log(e.target.value)
    setNewNumber(e.target.value)
  }

  /* for handling filter */
  const handleFilterChange = (e) => {
    console.log(e.target.value)
    setFilter(e.target.value)
  }

  const ShowAllNames = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ListNames persons={ShowAllNames} handleDelete={handleDeleteOf} />
    </div>
  )
}

export default App