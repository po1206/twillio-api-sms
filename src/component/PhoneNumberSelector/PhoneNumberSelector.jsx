import Select from "react-select"
import { useEffect, useState } from "react"
import "./PhoneNumberSelector.css"
import { getTwilioPhoneNumbers } from "../../core/getTwilioPhoneNumbers"
import { useAuthentication } from "../../context/AuthenticationProvider"

// TODO: Currently, this mask is limited to country code +1; we need a mask for all country codes
const maskPhoneNumber = v => {
  let result = v.substr(0, 2)
  result += " " + v.substr(2, 3)
  result += " " + v.substr(5, 3)
  result += " " + v.substr(8)
  return result
}

export const PhoneNumberSelector = ({ onError = () => {}, onPhoneNumberChange = () => {} }) => {
  const [loading, setLoading] = useState(true)
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [isError, setError] = useState(false)
  const [authentication] = useAuthentication()

  const handleOnChange = event => {
    onPhoneNumberChange(event.value)
  }

  useEffect(() => {
    getTwilioPhoneNumbers(authentication)
      .then(pn => {
        setPhoneNumbers(pn)
        setLoading(false)
      })
      .catch(err => {
        setError(true)
        onError(err)
        setLoading(false)
      })
  }, [authentication, setPhoneNumbers, setLoading, setError, onError])

  const phoneNumberOptions = phoneNumbers.map(v => ({
    value: v,
    label: maskPhoneNumber(v),
  }))

  const placeHolderText = isError
    ? "Error loading phone number"
    : loading
      ? "Loading phone numbers..."
      : "Select (or type) a phone number..."
  return (
    <Select placeholder={placeHolderText} isLoading={loading} options={phoneNumberOptions} onChange={handleOnChange} />
  )
}
