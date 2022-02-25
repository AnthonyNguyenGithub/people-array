import { useEffect, useState } from "react";
import axios from "axios";
import XMLParser from "react-xml-parser";
import styled from "styled-components";
import "./App.css";

function App() {
  const [people, setPeople] = useState([]);

  // Get API data for both JSON and XML
  const getData = async () => {
    // Get data from JSON API
    const jsonPromise = new Promise((resolve, reject) => {
      axios
        .get("./api.json", {
          "Content-Type": "application/json;",
        })
        .then((data) => {
          const result = data.data.person;
          setTimeout(resolve, 5000, result);
        });
    });

    // Get data from XML API
    const xmlPromise = new Promise((resolve, reject) => {
      axios
        .get("./api.xml", {
          "Content-Type": "application/xml;",
        })
        .then((data) => {
          let newArray = [];

          // Parse the XML data
          let result = new XMLParser().parseFromString(data.data);
          result = result.children;

          // Loop through each person and add them to the newArray
          result.forEach((item) => {
            let tempObject = {};
            // Set the properties of each person object
            item.children.forEach((property) => {
              // Make the id value a number instead of a string
              if (property.name === "id") {
                property.value = parseInt(property.value);
              }

              tempObject[property.name] = property.value;
            });

            newArray.push(tempObject);
          });

          setTimeout(resolve, 10000, newArray);
        });
    });

    // Wait for both API calls to finish
    Promise.all([jsonPromise, xmlPromise]).then((data) => {
      // Combine the two arrays into 1
      const combinedData = [...data[0], ...data[1]];

      // Sort by id
      combinedData.sort((a, b) => {
        return a.id - b.id;
      });

      console.log("Combined data", combinedData);
      setPeople(combinedData);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <People>
        {people?.length
          ? people.map((person) => {
              return (
                <Person key={person.id}>
                  <p>Id: {person.id}</p>
                  <p>First Name: {person.firstName}</p>
                  <p>Last Name {person.lastName}</p>
                </Person>
              );
            })
          : null}
      </People>
    </Container>
  );
}

export default App;

const Container = styled.div`
  padding: 100px 70px;
`;

const People = styled.div`
  display: flex;
`;

const Person = styled.div`
  flex: 1;
  padding: 30px;
  margin: 0px 20px;
  font-size: 18px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);

  p {
    margin-top: 0px;
    margin-bottom: 10px;
  }

  p:last-of-type {
    margin-bottom: 0px;
  }
`;
