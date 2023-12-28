import { useState, useEffect } from "react";
import personService from "./services/persons";

const Numbers = ({ persons, filter, setPersons, setErrorMessage }) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toUpperCase().includes(filter.toUpperCase())
        )
        .map((person) => (
          <Number
            setError={setErrorMessage}
            persons={persons}
            key={person.name}
            person={person}
            setPersons={setPersons}
          />
        ))}
    </>
  );
};

const Number = ({ person, persons, setPersons, setError }) => {
  return (
    <>
      <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td>
          <button
            onClick={() => {
              personService.deletePerson(person.id).catch((error) => {
                setError(
                  `Information of ${person.name} has already been removed from the server`
                );
                setTimeout(() => {
                  setErrorMessage(null);
                }, 5000);
              });
              setPersons(
                persons.filter((storedPerson) => person.id !== storedPerson.id)
              );
            }}
          >
            delete
          </button>
        </td>
      </tr>
    </>
  );
};

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const AddedMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};
// { name: 'Arto Hellas', number: '040-123456', id: 1 },
// { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
// { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
// { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [addedMessage, setAddedMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("data loaded");
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const handleSearchbar = (event) => {
    setSearchPhrase(event.target.value);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };
  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      let newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };
      setPersons(persons.concat(newPerson));
      personService.create(newPerson).then((person) => {
        setAddedMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setAddedMessage(null);
        }, 5000);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <AddedMessage message={addedMessage} />
      <ErrorMessage message={errorMessage} />

      <div>
        filter shown with{" "}
        <input value={searchPhrase} onChange={handleSearchbar} />
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
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

      <h2>Numbers</h2>
      <table>
        <tbody>
          <Numbers
            setErrorMessage={setErrorMessage}
            persons={persons}
            filter={searchPhrase}
            setPersons={setPersons}
          />
        </tbody>
      </table>
    </div>
  );
};

export default App;
