import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Select from "react-select"
import { Button, Container, Input, Label, Row } from 'reactstrap'
import axios from 'axios'

function App() {

  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryList, setCountryList] = useState([])

  const [selectedCity, setSelectedCity] = useState(null)
  const [cityList, setCityList] = useState([])

  const [countryName, setCountryName] = useState("")
  const [cityName, setCityName] = useState("")

  useEffect(() => {
    getCountryList()
  }, [])

  const getCountryList = () => {
    axios.get("http://localhost:3000/countries").then(res => {
      setCountryList(res.data)
    })
  }

  const handleChangeCountry = (country) => {

    console.log(country);

    setSelectedCountry(country)
    axios.get(`http://localhost:3000/cities?country_id=${country.id}`)
      .then(res => {
        setCityList(res.data)
      })
  }

  const createCountry = () => {

    if (!countryName) {
      alert("Name is required")
      return
    }

    const existCountry = countryList.find(x => x.name.toLowerCase() === countryName.toLowerCase())

    if (existCountry) {
      alert("This country exist on database")
      return
    }

    axios.post("http://localhost:3000/countries", {
      name: countryName
    }).then(res => {
      console.log(res);
      setCountryName("")
      setCountryList(prevState => [...prevState, res.data])
    })
  }

  const createCity = () => {
    axios.post("http://localhost:3000/cities", {
      name: cityName,
      country_id: selectedCountry.id
    }).then(res => {
      console.log(res.data);
      setCityList(prevState => [...prevState, res.data])
      setCityName("")
    })
  }

  return (
    <Container className='my-5'>
      <Row>
        <div className="col-8 col-md-4 mb-4">
          <Input
            type='text'
            value={countryName}
            onChange={e => setCountryName(e.target.value)}
          />
        </div>
        <div className="col-3">
          <Button
            onClick={createCountry}
          >
            Add country
          </Button>
        </div>
      </Row>
      <Row>
        <div className="col-md-4 mb-4">
          <Label>Countries</Label>
          <Select
            isClearable
            value={selectedCountry}
            options={countryList}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            onChange={country => handleChangeCountry(country)}
          />
        </div>
        {
          selectedCountry && (
            <div className='col-8 col-md-4'>
              <Label>New City</Label>
              <Input
                type='text'
                value={cityName}
                placeholder='Enter city name'
                onChange={e => setCityName(e.target.value)}
              />
              <Button
                onClick={createCity}
              >
                Add
              </Button>
            </div>
          )
        }
        <div className="col-md-4 mb-4">
          <Label>Cities</Label>
          <Select
            isClearable
            value={selectedCity}
            options={cityList}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            onChange={obj => setSelectedCity(obj)}
          />
        </div>
      </Row>
    </Container>
  )
}

export default App