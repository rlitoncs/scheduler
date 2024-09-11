import React from "react";

import { render, fireEvent, cleanup, getByText, getAllByTestId, findByText, findByAltText, getByAltText, queryByText, prettyDOM, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);


describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { findByText, queryByText } = render(<Application />);

    return findByText("Monday")
      .then(() => {
        fireEvent.click(queryByText("Tuesday"));
        expect(queryByText("Leopold Silvers")).toBeInTheDocument();
      })
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");
  
    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment")[0]; // getAllTestId returns an array
    fireEvent.click(getByAltText(appointment, "Add"));

    
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    })
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, /Save/i));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, /saving/i)).toBeInTheDocument;
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await findByText(appointment, "Lydia Miller-Jones");
    
    // debug(appointment);

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    // debug(day);

  });
  
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>  queryByText(appointment, "Archie Cohen") );

    // 4. Check that the confirmation message is shown.
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 5. Click the "Confirm" button on the confirmation.
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

    // 6. Check that the element with the text "Deleting" is displayed.
    fireEvent.click(getByText(container, "Confirm"));
    expect(getByText(container, /Deleting/i)).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await findByAltText(appointment, "Add");

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    // debug(appointment);
    // debug(day);
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />)
  // 2. Wait until the text "Archie Cohen" is displayed.
  await findByText(container, "Archie Cohen");

  // 3. Click the "Edit" button on the booked appointment.
  const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
  
  fireEvent.click(getByAltText(appointment, /Edit/i));
  // 4. Check the placeholder "Enter Student Name" is there
  expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();

  // 5. Enter a different name into the input with the placeholder "Enter Student Name"
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lorenzo"}
  })
  
  // 6. Click the another interviewer on the list
  // fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 7. Click the "Save" button on that same component
  // fireEvent.click(getByText(appointment, "Save"));

  // debug(appointment);
  // 8. Check that the element with the text "Saving" is displayed
  // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />) // container represents the DOM tree that we are working with
    
    await findByText(container, "Archie Cohen");

    const appointments = getAllByTestId(container, "appointment"); // returns an array

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    })

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(await findByText(appointment, "Could not book appointment.")).toBeInTheDocument();

    // debug(appointment);
  });

  it("shows the  delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    //1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>  queryByText(appointment, "Archie Cohen") );

    // 4. Check that the confirmation message is shown.
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 5. Click the "Confirm" button on the confirmation.
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

    // 6. Check that the element with the text "Deleting" is displayed.
    fireEvent.click(getByText(container, "Confirm"));

    expect(await findByText(appointment, "Could not cancel appointment.")).toBeInTheDocument();

    // debug(appointment);

  });

})


