import React from 'react';
import { Field, useFormik } from 'formik';
import "./styles.css";


const SignupForm = () => {
  // Notice that we have to initialize ALL of fields with values. These
  // could come from props, but since we don't want to prefill this form,
  // we just use an empty string. If you don't do this, React will yell
  // at you.
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      orgEmail: '',
      pswd: '',
      prefEmail: '',
      phoneNumber: '',
      housing: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values));
      fetch('localhost:8080/register', {
        method: 'POST',
        body: JSON.stringify(values)
      }).then(function (response) {
        // TODO: Df do we do here?
        return response.json();
      })
      // TODO: fetch to express app
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.lastName}
      />
      <label htmlFor="univEmail">University Email</label>
      <input
        id="univEmail"
        name="univEmail"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.univEmail}
      />
      <label htmlFor="pswd">Create Password</label>
      <input
        id="pswd"
        name="pswd"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.pswd}
      />
      <label htmlFor="prefEmail">Preferred Email Address</label>
      <input
        id="prefEmail"
        name="prefEmail"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.prefEmail}
      />
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.phoneNumber}
      />
      <label htmlFor="housing">Housing</label>
      <select
        htmlFor="dropdown"
        name="housing"
        value={formik.values.housing}
        onChange={formik.handleChange}
        onBlur={formik.onBlur}>
        <option value="" label="Select an option" />
        <option value="provider" label="I am offering housing" />
        <option value="receiver" label="I am in need of housing" />
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;